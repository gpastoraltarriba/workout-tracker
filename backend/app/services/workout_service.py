from sqlalchemy.orm import Session, selectinload

from app.models.workout import Workout, Exercise, WorkoutSet
from app.schemas.workout import WorkoutCreate


def get_workouts(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> list[Workout]:
    return (
        db.query(Workout)
        .filter(Workout.user_id == user_id)
        .order_by(Workout.started_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_workout_detail(db: Session, workout_id: int, user_id: int) -> Workout | None:
    return (
        db.query(Workout)
        .options(selectinload(Workout.exercises).selectinload(Exercise.sets))
        .filter(Workout.id == workout_id, Workout.user_id == user_id)
        .first()
    )


def create_workout(db: Session, data: WorkoutCreate, user_id: int) -> Workout:
    workout = Workout(
        user_id=user_id,
        title=data.title,
        notes=data.notes,
        duration_minutes=data.duration_minutes,
        started_at=data.started_at,
    )
    db.add(workout)
    db.flush()  # get workout.id without committing

    for ex_data in data.exercises:
        exercise = Exercise(workout_id=workout.id, name=ex_data.name, order=ex_data.order)
        db.add(exercise)
        db.flush()

        for set_data in ex_data.sets:
            db.add(WorkoutSet(exercise_id=exercise.id, **set_data.model_dump()))

    db.commit()
    db.refresh(workout)
    return workout


def delete_workout(db: Session, workout_id: int, user_id: int) -> bool:
    workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == user_id).first()
    if not workout:
        return False
    db.delete(workout)
    db.commit()
    return True
