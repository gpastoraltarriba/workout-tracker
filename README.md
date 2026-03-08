# 💪 Workout Tracker SaaS

A full-stack SaaS application to track workouts, exercises, and personal records.

**Live demo:** [coming soon]  
**API docs:** [coming soon]/docs

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI · Python 3.12 · SQLAlchemy · Alembic |
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Database | PostgreSQL 16 |
| Auth | JWT (access + refresh tokens) |
| Infra | Docker · GitHub Actions |
| Deploy | Railway (backend) · Vercel (frontend) |

## Quick Start

```bash
git clone https://github.com/yourusername/workout-tracker
cd workout-tracker
cp backend/.env.example backend/.env
docker-compose up --build
```

- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed explanation.

## Running Tests

```bash
cd backend
pytest --cov=app tests/
```
