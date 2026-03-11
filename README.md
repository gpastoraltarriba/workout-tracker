# Workout Tracker SaaS

A full-stack SaaS application to track workouts, exercises, and personal records — built as a portfolio project targeting the Swiss tech market.

**Live demo:** https://workout-tracker-eight-sigma.vercel.app

**API docs:** https://workout-tracker-production-519d.up.railway.app/docs

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Axios
- **Backend:** FastAPI (Python 3.12), SQLAlchemy, Alembic
- **Database:** PostgreSQL 16
- **Auth:** JWT (access + refresh tokens), bcrypt
- **Infrastructure:** Docker, Docker Compose
- **Deploy:** Railway (backend + DB), Vercel (frontend)

## Features

- Register, login, JWT auto-refresh
- Create workouts with multiple exercises and sets
- Automatic volume calculation per workout
- Stats dashboard: total workouts, sets, volume, weekly activity
- REST API fully documented with Swagger UI
- Dockerized and deployed to production

## Run locally

```bash
git clone https://github.com/gpastoraltarriba/workout-tracker.git
cd workout-tracker
docker-compose up
docker-compose exec -e PYTHONPATH=/app backend alembic upgrade head
```

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login, receive JWT tokens |
| GET | `/api/v1/workouts` | List workouts |
| POST | `/api/v1/workouts` | Create workout |
| GET | `/api/v1/workouts/{id}` | Get workout detail |
| DELETE | `/api/v1/workouts/{id}` | Delete workout |
| GET | `/api/v1/stats` | Get user statistics |

## Environment Variables

**Backend**
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ENVIRONMENT=production
ALLOWED_ORIGINS=["https://your-frontend.vercel.app"]
```

**Frontend**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

