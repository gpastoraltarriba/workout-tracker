import time
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.api.v1 import auth, workouts, stats

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def wait_for_db():
    retries = 30
    while retries > 0:
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("✅ Database ready!")
            return
        except Exception as e:
            retries -= 1
            logger.info(f"⏳ Waiting for database... ({retries} retries left)")
            time.sleep(2)
    raise RuntimeError("Could not connect to database after 30 retries")

app = FastAPI(
    title="Workout Tracker API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    wait_for_db()
    # Run migrations automatically
    from alembic.config import Config
    from alembic import command
    alembic_cfg = Config("/app/alembic.ini")
    command.upgrade(alembic_cfg, "head")
    logger.info("✅ Migrations applied!")
app.include_router(auth.router,     prefix="/api/v1/auth",     tags=["auth"])
app.include_router(workouts.router, prefix="/api/v1/workouts", tags=["workouts"])
app.include_router(stats.router,    prefix="/api/v1/stats",    tags=["stats"])

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}