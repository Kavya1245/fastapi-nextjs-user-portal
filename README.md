# 🚀 Enterprise User Management System

A secure, full-stack User Management System built with a strict MVC architecture, Object-Oriented Programming (OOP), and enterprise-grade standards.

## ✨ Features

- **Strict MVC Architecture:** Clear separation of Models, Views, Controllers, and Services.
- **OOP Backend:** Business logic encapsulated in classes (`UserService`, `AuthService`, `RedisService`).
- **Database Migrations:** Uses Alembic for versioned database schema changes. No raw SQL.
- **Centralized Validations:** Shared `validations.json` used by both Frontend (React) and Backend (Pydantic) to ensure rules are never out of sync.
- **Strict Validations:** First Name (1-20 alphabets), Last Name (1-15 alphabets), complex passwords.
- **Input Sanitization:** Numbers and symbols are instantly stripped from name fields in the UI.
- **Password Strength Meter:** Visual progress bar indicating password complexity.
- **Email Normalization:** Emails are automatically converted to lowercase to prevent duplicates.
- **Security:** JWT auth, Bcrypt hashing, secure UUID primary keys, generic "Forgot Password" responses.
- **UX/UI:** Professional SVG icons, responsive design, and confirmation dialogs for destructive actions (Delete/Logout).
- **Caching:** Redis implemented via the Cache-Aside pattern.
- **100% Test Coverage (3-Tier Strategy):**
  - **Unit Tests:** Pure logic tested with 100% mocked data (no real DB).
  - **Feature Tests:** UI flows tested with mocked API responses.
  - **Integration Tests:** API routes tested with mocked services.

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Axios, Jest
- **Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic V2, python-jose, bcrypt
- **Database & Cache:** PostgreSQL, Redis

## Getting Started

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder with `DATABASE_URL`, `REDIS_URL`, and `SECRET_KEY`.

```bash
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 🧪 Running Tests

**Backend:** `cd backend && pytest -v`
**Frontend:** `cd frontend && npm test -- --watchAll=false`
