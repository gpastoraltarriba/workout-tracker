from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.workout import WorkoutCreate, WorkoutOut, WorkoutDetail
from app.services.workout_service import get_workouts, get_workout_detail, create_workout, delete_workout

router = APIRouter()


@router.get("", response_model=list[WorkoutOut])
def list_workouts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_workouts(db, current_user.id, skip, limit)


@router.post("", response_model=WorkoutDetail, status_code=status.HTTP_201_CREATED)
def create(
    data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_workout(db, data, current_user.id)


@router.get("/{workout_id}", response_model=WorkoutDetail)
def get_one(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workout = get_workout_detail(db, workout_id, current_user.id)
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout


@router.delete("/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not delete_workout(db, workout_id, current_user.id):
        raise HTTPException(status_code=404, detail="Workout not found")
