# CampusFix backend

Node.js + Express + raw `pg` (no ORM). See project root for the full
plan; this is the runnable skeleton.

## 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally (or a remote instance)

## 2. Create the database
```bash
createdb campusfix
```

## 3. Install dependencies
```bash
npm install
```

## 4. Set up environment variables
```bash
cp .env.example .env
```
Then edit `.env`:
- `DATABASE_URL` - fill in the real password once you've created the app role (step 6)
- `JWT_SECRET` - generate one:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

## 5. Load the schema (as a superuser, e.g. your local `postgres` user)
```bash
psql -U postgres -d campusfix -f db/schema.sql
```

## 6. Create the app's DB role and grant it access
Open `db/grants.sql`, change the placeholder password, then:
```bash
psql -U postgres -d campusfix -f db/grants.sql
```
Copy that same password into `DATABASE_URL` in `.env`.

**Important:** the app must connect as `campusfix_app`, never as `postgres`
or any superuser - superusers bypass Row-Level Security automatically,
which would silently break the anonymity guarantees in the schema.

## 7. Seed some departments and categories
```sql
INSERT INTO departments (name) VALUES
  ('Electrical & HVAC'), ('IT / Computers'), ('Civil & Furniture'), ('Plumbing & Washrooms');

INSERT INTO issue_categories (department_id, name)
SELECT department_id, 'AC not cooling' FROM departments WHERE name = 'Electrical & HVAC';
-- repeat per category
```

## 8. Create a test student, staff, and official
Hash a password first (use `bcryptjs` which avoids native build steps):
```bash
node -e "console.log(require('bcryptjs').hashSync('test1234', 12))"
```
The command prints a bcrypt hash you can copy. Then insert rows into `students` / `staff` / `officials` using that hash.

## 9. Run the server
This repo contains a frontend (Vite) and an Express backend. Run them in separate terminals.

Frontend (dev):
```bash
npm run dev
```

Backend (Express):
```bash
# run the Express server directly
node src/server.js

# (optional) use nodemon for auto-reload during development
# npm install -D nodemon
# npx nodemon src/server.js
```

Health check (backend): `GET http://localhost:4000/health`

## 10. Try it (curl examples)
```bash
# student login
curl -X POST http://localhost:4000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"admission_number":"ADM2026001","password":"test1234"}'

# create a complaint (with photo)
curl -X POST http://localhost:4000/api/student/complaints \
  -H "Authorization: Bearer <token>" \
  -F "category_id=<uuid>" \
  -F "description=AC not cooling in Room 204" \
  -F "location=Block C, Room 204" \
  -F "photo=@/path/to/photo.jpg"
```

## Still TODO for a real deployment
- Swap `multer` disk storage for S3/Cloudinary in `src/middleware/upload.js`
- Wire up the actual AI moderation call in `student.controller.js` (currently a TODO comment) - a background queue (BullMQ + Redis) is a good fit so complaint submission doesn't block on the AI call
- Add input validation (e.g. `zod` or `express-validator`) on all POST/PATCH bodies
- Add rate limiting on login routes
- Move `JWT_SECRET` rotation and refresh-token handling if sessions need to outlive 12h
