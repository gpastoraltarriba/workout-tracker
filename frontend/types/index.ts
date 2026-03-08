export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface WorkoutSet {
  id: number;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
}

export interface Exercise {
  id: number;
  name: string;
  order: number;
  sets: WorkoutSet[];
}

export interface Workout {
  id: number;
  title: string;
  started_at: string;
  duration_minutes: number | null;
  created_at: string;
}

export interface WorkoutDetail extends Workout {
  notes: string | null;
  exercises: Exercise[];
}

export interface Stats {
  total_workouts: number;
  total_sets: number;
  total_volume_kg: number;
  workouts_this_week: number;
  weekly_volume: { week: string; total_kg: number; total_sets: number }[];
  personal_records: { exercise_name: string; max_weight_kg: number; achieved_at: string }[];
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
