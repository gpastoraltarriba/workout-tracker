Workout Tracker SaaS
A full-stack SaaS application to track workouts, exercises, and personal records — built as a portfolio project targeting the Swiss tech market.
Live demo: workout-tracker-eight-sigma.vercel.app
API docs: workout-tracker-production-519d.up.railway.app/docs

Tech Stack
LayerTechnologyFrontendNext.js 14, TypeScript, AxiosBackendFastAPI (Python 3.12), SQLAlchemy, AlembicDatabasePostgreSQL 16AuthJWT (access + refresh tokens), bcryptInfrastructureDocker, Docker ComposeDeployRailway (backend + DB), Vercel (frontend)CI/CDGitHub Actions

Features

Authentication — Register, login, JWT auto-refresh
Workout logging — Create workouts with multiple exercises and sets
Volume tracking — Automatic calculation of total volume per workout
Stats dashboard — Total workouts, sets, volume and weekly activity
REST API — Fully documented with OpenAPI / Swagger UI
Production ready — Dockerized, deployed, with database migrations


Architecture
workout-tracker/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/v1/           # Route handlers (auth, workouts, stats)
│   │   ├── core/             # Config, database, security
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # Business logic
│   ├── alembic/              # Database migrations
│   └── tests/                # Pytest test suite
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── (auth)/           # Login & register pages
│   │   ├── dashboard/        # Stats overview
│   │   └── workouts/         # Workout CRUD
│   └── lib/
│       └── api.ts            # Axios client with JWT interceptors
└── docker-compose.yml        # Local development stack

Getting Started
Prerequisites

Docker & Docker Compose
Git

Run locally
bashgit clone https://github.com/gpastoraltarriba/workout-tracker.git
cd workout-tracker

# Create environment files
cp backend/.env.example backend/.env   # Edit with your values

# Start all services
docker-compose up

# Run database migrations
docker-compose exec -e PYTHONPATH=/app backend alembic upgrade head
The app will be available at:

Frontend: http://localhost:3000
API docs: http://localhost:8000/docs


API Endpoints
MethodEndpointDescriptionPOST/api/v1/auth/registerCreate accountPOST/api/v1/auth/loginLogin, receive JWT tokensPOST/api/v1/auth/refreshRefresh access tokenGET/api/v1/workoutsList user workoutsPOST/api/v1/workoutsCreate workout with exercisesGET/api/v1/workouts/{id}Get workout detailDELETE/api/v1/workouts/{id}Delete workoutGET/api/v1/statsGet user statistics
Full interactive docs available at /docs.

Environment Variables
Backend
envDATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ENVIRONMENT=production
ALLOWED_ORIGINS=["https://your-frontend.vercel.app"]
Frontend
envNEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1