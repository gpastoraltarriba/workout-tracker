from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.v1.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.workout import Workout, Exercise, WorkoutSet
from app.schemas.stats import StatsOut, PersonalRecord

router = APIRouter()


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()
    workout_ids = [w.id for w in workouts]

    total_sets = 0
    total_volume = 0.0

    if workout_ids:
        sets_query = (
            db.query(WorkoutSet)
            .join(Exercise)
            .filter(Exercise.workout_id.in_(workout_ids))
            .all()
        )
        total_sets = len(sets_query)
        total_volume = sum((s.weight_kg or 0) * (s.reps or 1) for s in sets_query)

    return StatsOut(
        total_workouts=len(workouts),
        total_sets=total_sets,
        total_volume_kg=round(total_volume, 1),
        workouts_this_week=0,  # TODO: filter by current week
        weekly_volume=[],
        personal_records=[],
    )
