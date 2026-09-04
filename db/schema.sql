-- =====================================================================
-- CampusFix — PostgreSQL schema
-- Design goals:
--   1. Students authenticate with their existing admission number.
--   2. Complaints are FULLY ANONYMOUS to staff/officials — no table
--      that staff/officials can query ever contains a student_id.
--   3. The only link between a complaint and a student lives in
--      complaint_owner, which is locked down with Row-Level Security
--      and can only be written through a SECURITY DEFINER function.
--   4. The single deliberate exception: after a student's 3rd AI-
--      flagged warning, a misconduct_reports row is generated
--      automatically and DOES carry the student's identity to an HOD.
--      That's the only place anonymity is intentionally broken.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gives us gen_random_uuid()

-- ---------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------
CREATE TYPE complaint_status   AS ENUM ('submitted','under_review','in_progress','resolved','rejected');
CREATE TYPE staff_designation  AS ENUM ('staff','hod');
CREATE TYPE image_stage        AS ENUM ('initial','in_progress','resolved');
CREATE TYPE uploader_role      AS ENUM ('student','staff');
CREATE TYPE ai_verdict         AS ENUM ('pending','clean','flagged_spam','flagged_abusive','flagged_fake','rejected');
CREATE TYPE misconduct_status  AS ENUM ('pending_review','action_taken','dismissed');

-- ---------------------------------------------------------------------
-- CORE REFERENCE TABLES
-- ---------------------------------------------------------------------
CREATE TABLE departments (
    department_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL UNIQUE,     -- e.g. 'Electrical & HVAC', 'IT / Computers', 'Civil & Furniture'
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE issue_categories (
    category_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id   UUID NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT,
    name            VARCHAR(150) NOT NULL,             -- e.g. 'AC not cooling', 'Projector not turning on'
    UNIQUE (department_id, name)
);

-- ---------------------------------------------------------------------
-- PEOPLE
-- ---------------------------------------------------------------------
CREATE TABLE students (
    student_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_number VARCHAR(50) NOT NULL UNIQUE,      -- login credential, issued by college
    password_hash    TEXT NOT NULL,
    name             VARCHAR(150),                     -- kept ONLY for the misconduct-escalation path (see misconduct_reports).
                                                         -- Never selected in any staff/official-facing view or query.
    email            VARCHAR(150),
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE staff (
    staff_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id    UUID NOT NULL REFERENCES departments(department_id),
    name             VARCHAR(150) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    password_hash    TEXT NOT NULL,
    designation      staff_designation NOT NULL DEFAULT 'staff',
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE officials (
    official_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(150) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    password_hash    TEXT NOT NULL,
    title            VARCHAR(100),                     -- e.g. 'Dean of Student Affairs'
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- COMPLAINTS — deliberately has NO student-identifying column
-- ---------------------------------------------------------------------
CREATE TABLE complaints (
    complaint_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id        UUID NOT NULL REFERENCES issue_categories(category_id),
    department_id      UUID NOT NULL REFERENCES departments(department_id),  -- denormalized for fast staff filtering
    description        TEXT NOT NULL,
    location            VARCHAR(200),                  -- e.g. 'Block C, Room 204'
    status              complaint_status NOT NULL DEFAULT 'submitted',
    ai_verdict          ai_verdict NOT NULL DEFAULT 'pending',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    first_response_at   TIMESTAMPTZ,                   -- set the moment status first leaves 'submitted'
    resolved_at         TIMESTAMPTZ
);

-- THE only table that maps a complaint back to a student.
CREATE TABLE complaint_owner (
    complaint_id     UUID PRIMARY KEY REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    student_id       UUID NOT NULL REFERENCES students(student_id)
);

CREATE TABLE complaint_images (
    image_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id         UUID NOT NULL REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    image_url            TEXT NOT NULL,                -- store the object-storage URL, not the binary
    stage                image_stage NOT NULL,
    uploaded_by_role     uploader_role NOT NULL,
    uploaded_by_staff_id UUID REFERENCES staff(staff_id),   -- null when uploaded by the student
    uploaded_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE complaint_status_log (
    log_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id         UUID NOT NULL REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    old_status           complaint_status,
    new_status           complaint_status NOT NULL,
    changed_by_staff_id  UUID REFERENCES staff(staff_id),
    note                 TEXT,
    changed_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- AI MODERATION
-- ---------------------------------------------------------------------
CREATE TABLE ai_moderation_results (
    moderation_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id     UUID NOT NULL UNIQUE REFERENCES complaints(complaint_id) ON DELETE CASCADE,
    spam_score       NUMERIC(4,3),      -- 0.000 - 1.000
    abuse_score      NUMERIC(4,3),
    fake_score       NUMERIC(4,3),      -- e.g. photo doesn't match described issue
    verdict          ai_verdict NOT NULL,
    flagged_reasons  TEXT[],
    model_version    VARCHAR(50),
    evaluated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE student_warnings (
    warning_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID NOT NULL REFERENCES students(student_id),
    complaint_id     UUID REFERENCES complaints(complaint_id),
    reason           TEXT NOT NULL,
    warning_number   INT NOT NULL,       -- 1, 2, 3... per student, set by the app/function
    issued_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-generated on the 3rd warning. This is the ONE intentional break
-- in anonymity — the HOD needs to know who to act on.
CREATE TABLE misconduct_reports (
    report_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id        UUID NOT NULL REFERENCES students(student_id),
    warning_count     INT NOT NULL,
    sent_to_hod_id    UUID REFERENCES staff(staff_id),
    status            misconduct_status NOT NULL DEFAULT 'pending_review',
    generated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at       TIMESTAMPTZ,
    hod_action_notes  TEXT
);

-- ---------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------
CREATE INDEX idx_complaints_department_status ON complaints(department_id, status);
CREATE INDEX idx_complaints_category          ON complaints(category_id);
CREATE INDEX idx_complaint_owner_student       ON complaint_owner(student_id);
CREATE INDEX idx_status_log_complaint          ON complaint_status_log(complaint_id);
CREATE INDEX idx_warnings_student              ON student_warnings(student_id);
CREATE INDEX idx_images_complaint              ON complaint_images(complaint_id);

-- ---------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------

-- keep updated_at fresh
CREATE OR REPLACE FUNCTION trg_set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER complaints_set_updated_at
BEFORE UPDATE ON complaints
FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- log every status change + stamp first_response_at / resolved_at automatically
CREATE OR REPLACE FUNCTION trg_log_status_change() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO complaint_status_log(complaint_id, old_status, new_status)
        VALUES (NEW.complaint_id, OLD.status, NEW.status);

        IF OLD.status = 'submitted' AND NEW.first_response_at IS NULL THEN
            NEW.first_response_at = now();
        END IF;
        IF NEW.status = 'resolved' AND NEW.resolved_at IS NULL THEN
            NEW.resolved_at = now();
        END IF;
    END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER complaints_log_status
BEFORE UPDATE ON complaints
FOR EACH ROW EXECUTE FUNCTION trg_log_status_change();

-- on the 3rd warning, auto-generate the misconduct report and route to an HOD
CREATE OR REPLACE FUNCTION trg_check_warning_threshold() RETURNS TRIGGER AS $$
DECLARE
    v_hod UUID;
BEGIN
    IF NEW.warning_number >= 3 THEN
        SELECT s.staff_id INTO v_hod
        FROM staff s
        JOIN complaints c ON c.department_id = s.department_id
        WHERE c.complaint_id = NEW.complaint_id AND s.designation = 'hod'
        LIMIT 1;

        INSERT INTO misconduct_reports(student_id, warning_count, sent_to_hod_id)
        VALUES (NEW.student_id, NEW.warning_number, v_hod);
    END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER warnings_check_threshold
AFTER INSERT ON student_warnings
FOR EACH ROW EXECUTE FUNCTION trg_check_warning_threshold();

-- ---------------------------------------------------------------------
-- THE ONLY WRITE PATH INTO complaint_owner
-- App code should never INSERT into complaint_owner directly — always
-- call this function, so the mapping table has exactly one entry point.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_complaint(
    p_student_id   UUID,
    p_category_id  UUID,
    p_description  TEXT,
    p_location     VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_complaint_id UUID;
    v_dept_id      UUID;
BEGIN
    SELECT department_id INTO v_dept_id FROM issue_categories WHERE category_id = p_category_id;

    INSERT INTO complaints(category_id, department_id, description, location)
    VALUES (p_category_id, v_dept_id, p_description, p_location)
    RETURNING complaint_id INTO v_complaint_id;

    INSERT INTO complaint_owner(complaint_id, student_id)
    VALUES (v_complaint_id, p_student_id);

    RETURN v_complaint_id;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- ROW-LEVEL SECURITY
-- The app connects to Postgres as a normal (non-superuser, non-BYPASSRLS)
-- role. After verifying a student's JWT, the app runs:
--     SET LOCAL app.current_student_id = '<student_uuid>';
-- for that transaction only. RLS policies below use that value.
-- ---------------------------------------------------------------------
ALTER TABLE complaint_owner ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_owner FORCE ROW LEVEL SECURITY;   -- even the table owner is bound by this

CREATE POLICY student_sees_own_mapping ON complaint_owner
FOR SELECT
USING (student_id = current_setting('app.current_student_id', true)::uuid);
-- Note: no INSERT/UPDATE/DELETE policy is defined for the app role,
-- so direct writes are rejected — create_complaint() (SECURITY DEFINER)
-- is the only way rows get in.

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE students FORCE ROW LEVEL SECURITY;

CREATE POLICY student_sees_own_row ON students
FOR SELECT
USING (student_id = current_setting('app.current_student_id', true)::uuid);
-- staff/official DB sessions never set app.current_student_id, so this
-- policy evaluates to false for them — they get zero rows from `students`.

-- ---------------------------------------------------------------------
-- VIEWS
-- ---------------------------------------------------------------------

-- Staff: filter by their own department_id in the application query
-- (WHERE department_id = :staff_department_id). Never joined to
-- complaint_owner, so it structurally cannot leak identity.
CREATE VIEW v_department_complaints AS
SELECT c.complaint_id, c.category_id, ic.name AS category_name, c.department_id,
       c.description, c.location, c.status, c.ai_verdict,
       c.created_at, c.updated_at, c.first_response_at, c.resolved_at
FROM complaints c
JOIN issue_categories ic ON ic.category_id = c.category_id;

-- Student: their own complaints only. RLS on complaint_owner does the
-- filtering automatically once app.current_student_id is set.
CREATE VIEW v_student_complaints AS
SELECT co.student_id, c.complaint_id, ic.name AS category_name, d.name AS department_name,
       c.description, c.location, c.status,
       c.created_at, c.updated_at, c.first_response_at, c.resolved_at,
       ROUND(EXTRACT(EPOCH FROM (c.first_response_at - c.created_at))/3600.0, 2) AS response_hours,
       ROUND(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/3600.0, 2)      AS resolution_hours
FROM complaints c
JOIN complaint_owner co ON co.complaint_id = c.complaint_id
JOIN issue_categories ic ON ic.category_id = c.category_id
JOIN departments d ON d.department_id = c.department_id;

-- Officials: department-wise performance, no identity anywhere.
CREATE VIEW v_department_performance AS
SELECT d.department_id, d.name,
       COUNT(c.complaint_id) AS total_complaints,
       COUNT(*) FILTER (WHERE c.status = 'resolved') AS resolved_count,
       ROUND(AVG(EXTRACT(EPOCH FROM (c.first_response_at - c.created_at))/3600.0)::numeric, 2) AS avg_response_hours,
       ROUND(AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/3600.0)::numeric, 2)      AS avg_resolution_hours
FROM departments d
LEFT JOIN complaints c ON c.department_id = d.department_id
GROUP BY d.department_id, d.name;

CREATE VIEW v_overall_stats AS
SELECT COUNT(*) AS total_complaints,
       COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
       COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
       COUNT(*) FILTER (WHERE status IN ('submitted','under_review')) AS pending,
       ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600.0)::numeric, 2) AS avg_resolution_hours
FROM complaints;
