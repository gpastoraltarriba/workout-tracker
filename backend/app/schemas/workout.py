from datetime import datetime
from pydantic import BaseModel


class SetCreate(BaseModel):
    set_number: int
    reps: int | None = None
    weight_kg: float | None = None
    duration_seconds: int | None = None


class SetOut(SetCreate):
    model_config = {"from_attributes": True}
    id: int


class ExerciseCreate(BaseModel):
    name: str
    order: int = 0
    sets: list[SetCreate] = []


class ExerciseOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    name: str
    order: int
    sets: list[SetOut]


class WorkoutCreate(BaseModel):
    title: str
    notes: str | None = None
    duration_minutes: int | None = None
    started_at: datetime
    exercises: list[ExerciseCreate] = []


class WorkoutOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    title: str
    started_at: datetime
    duration_minutes: int | None
    created_at: datetime


class WorkoutDetail(WorkoutOut):
    notes: str | None
    exercises: list[ExerciseOut]
