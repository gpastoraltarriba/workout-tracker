from pydantic import BaseModel


class WeeklyVolume(BaseModel):
    week: str       # e.g. "2025-W20"
    total_kg: float
    total_sets: int


class PersonalRecord(BaseModel):
    exercise_name: str
    max_weight_kg: float
    achieved_at: str


class StatsOut(BaseModel):
    total_workouts: int
    total_sets: int
    total_volume_kg: float
    workouts_this_week: int
    weekly_volume: list[WeeklyVolume]
    personal_records: list[PersonalRecord]
