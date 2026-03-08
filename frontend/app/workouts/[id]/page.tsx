"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

interface WorkoutSet {
  id: number;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
}

interface Exercise {
  id: number;
  name: string;
  order: number;
  sets: WorkoutSet[];
}

interface WorkoutDetail {
  id: number;
  title: string;
  notes: string | null;
  started_at: string;
  duration_minutes: number | null;
  exercises: Exercise[];
}

export default function WorkoutDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    api.get(`/workouts/${params.id}`)
      .then(res => setWorkout(res.data))
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleDelete() {
    if (!confirm("Seguro que quieres eliminar este entrenamiento?")) return;
    await api.delete(`/workouts/${params.id}`);
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#94a3b8" }}>Cargando...</p>
      </div>
    );
  }

  if (!workout) return null;

  const totalVolume = workout.exercises.reduce((acc, ex) =>
    acc + ex.sets.reduce((s, set) => s + (set.weight_kg || 0) * (set.reps || 0), 0), 0
  );

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}
          >
            &larr;
          </button>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>{workout.title}</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "2px" }}>
              {new Date(workout.started_at).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          style={{ padding: "8px 16px", background: "none", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem" }}
        >
          Eliminar
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
        {[
          { label: "Ejercicios", value: workout.exercises.length },
          { label: "Series", value: totalSets },
          { label: "Volumen", value: `${totalVolume.toFixed(0)} kg` },
        ].map(stat => (
          <div key={stat.label} style={{ background: "#1e293b", borderRadius: "10px", padding: "16px", border: "1px solid #334155", textAlign: "center" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#4fffb0" }}>{stat.value}</p>
            <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "4px" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {workout.notes && (
        <div style={{ background: "#1e293b", borderRadius: "10px", padding: "16px", border: "1px solid #334155", marginBottom: "20px" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "4px" }}>NOTAS</p>
          <p style={{ color: "#e2e8f0" }}>{workout.notes}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {workout.exercises.map(ex => (
          <div key={ex.id} style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", border: "1px solid #334155" }}>
            <h3 style={{ fontWeight: "600", marginBottom: "16px", fontSize: "1rem" }}>{ex.name}</h3>

            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              {["Set", "Reps", "Peso", "Volumen"].map(h => (
                <span key={h} style={{ color: "#475569", fontSize: "0.75rem", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>

            {ex.sets.map(set => (
              <div key={set.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr", gap: "8px", padding: "8px 0", borderTop: "1px solid #1e293b" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{set.set_number}</span>
                <span style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>{set.reps ?? "-"}</span>
                <span style={{ color: "#e2e8f0", fontSize: "0.875rem" }}>{set.weight_kg ? `${set.weight_kg} kg` : "-"}</span>
                <span style={{ color: "#4fffb0", fontSize: "0.875rem" }}>
                  {set.reps && set.weight_kg ? `${(set.reps * set.weight_kg).toFixed(0)} kg` : "-"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}