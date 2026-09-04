-- =====================================================================
-- Run this AFTER schema.sql, as a superuser (e.g. postgres).
-- Creates the low-privilege role your Node app connects as.
-- This role must NOT be a superuser and must NOT have BYPASSRLS —
-- that's what makes the Row-Level Security in schema.sql actually bind.
-- =====================================================================

CREATE ROLE campusfix_app WITH LOGIN PASSWORD 'Singh@2005';

GRANT USAGE ON SCHEMA public TO campusfix_app;

GRANT SELECT ON departments, issue_categories TO campusfix_app;
GRANT SELECT, INSERT, UPDATE ON students TO campusfix_app;
GRANT SELECT ON staff, officials TO campusfix_app;
GRANT SELECT, UPDATE ON complaints TO campusfix_app;
GRANT SELECT ON complaint_owner TO campusfix_app;             -- RLS still restricts which rows are visible
GRANT SELECT, INSERT ON complaint_images TO campusfix_app;
GRANT SELECT, UPDATE ON complaint_status_log TO campusfix_app;
GRANT SELECT, INSERT, UPDATE ON ai_moderation_results TO campusfix_app;
GRANT SELECT, INSERT ON student_warnings TO campusfix_app;
GRANT SELECT, UPDATE ON misconduct_reports TO campusfix_app;

GRANT SELECT ON v_department_complaints TO campusfix_app;
GRANT SELECT ON v_student_complaints TO campusfix_app;
GRANT SELECT ON v_department_performance TO campusfix_app;
GRANT SELECT ON v_overall_stats TO campusfix_app;

-- app never inserts into complaint_owner directly; only this
-- SECURITY DEFINER function (owned by the superuser) can.
GRANT EXECUTE ON FUNCTION create_complaint(UUID, UUID, TEXT, VARCHAR) TO campusfix_app;
