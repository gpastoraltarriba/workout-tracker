"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface SetInput {
  set_number: number;
  reps: string;
  weight_kg: string;
}

interface ExerciseInput {
  name: string;
  sets: SetInput[];
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: "", sets: [{ set_number: 1, reps: "", weight_kg: "" }] },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addExercise() {
    setExercises([...exercises, { name: "", sets: [{ set_number: 1, reps: "", weight_kg: "" }] }]);
  }

  function removeExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  function addSet(exIndex: number) {
    const updated = [...exercises];
    updated[exIndex].sets.push({
      set_number: updated[exIndex].sets.length + 1,
      reps: "",
      weight_kg: "",
    });
    setExercises(updated);
  }

  function removeSet(exIndex: number, setIndex: number) {
    const updated = [...exercises];
    updated[exIndex].sets = updated[exIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(updated);
  }

  function updateExerciseName(index: number, name: string) {
    const updated = [...exercises];
    updated[index].name = name;
    setExercises(updated);
  }

  function updateSet(exIndex: number, setIndex: number, field: "reps" | "weight_kg", value: string) {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex][field] = value;
    setExercises(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        title,
        notes: notes || null,
        duration_minutes: duration ? parseInt(duration) : null,
        started_at: new Date().toISOString(),
        exercises: exercises
          .filter(ex => ex.name.trim())
          .map((ex, i) => ({
            name: ex.name,
            order: i,
            sets: ex.sets
              .filter(s => s.reps || s.weight_kg)
              .map(s => ({
                set_number: s.set_number,
                reps: s.reps ? parseInt(s.reps) : null,
                weight_kg: s.weight_kg ? parseFloat(s.weight_kg) : null,
              })),
          })),
      };
      await api.post("/workouts", payload);
      router.push("/dashboard");
    } catch {
      setError("Error al guardar el entrenamiento.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    padding: "8px 12px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#e2e8f0",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
  };

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}
        >
          &larr;
        </button>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Nuevo entrenamiento</h1>
      </div>

      {error && (
        <div style={{ background: "#450a0a", color: "#fca5a5", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155", marginBottom: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>Titulo *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ej: Dia de pierna" style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>Duracion (min)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="60" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>Notas</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opcional" style={inputStyle} />
            </div>
          </div>
        </div>

        {exercises.map((ex, exIndex) => (
          <div key={exIndex} style={{ background: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <input
                type="text"
                value={ex.name}
                onChange={e => updateExerciseName(exIndex, e.target.value)}
                placeholder={`Ejercicio ${exIndex + 1} (ej: Sentadilla)`}
                style={{ ...inputStyle, fontWeight: "600", fontSize: "1rem" }}
              />
              {exercises.length > 1 && (
                <button type="button" onClick={() => removeExercise(exIndex)} style={{ marginLeft: "12px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem", flexShrink: 0 }}>
                  x
                </button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 40px", gap: "8px", marginBottom: "8px" }}>
              <span style={{ color: "#475569", fontSize: "0.75rem", textAlign: "center", paddingTop: "4px" }}>Set</span>
              <span style={{ color: "#475569", fontSize: "0.75rem" }}>Reps</span>
              <span style={{ color: "#475569", fontSize: "0.75rem" }}>Peso (kg)</span>
              <span></span>
            </div>

            {ex.sets.map((set, setIndex) => (
              <div key={setIndex} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 40px", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.875rem", textAlign: "center" }}>{set.set_number}</span>
                <input
                  type="number"
                  value={set.reps}
                  onChange={e => updateSet(exIndex, setIndex, "reps", e.target.value)}
                  placeholder="10"
                  style={inputStyle}
                />
                <input
                  type="number"
                  step="0.5"
                  value={set.weight_kg}
                  onChange={e => updateSet(exIndex, setIndex, "weight_kg", e.target.value)}
                  placeholder="50"
                  style={inputStyle}
                />
                {ex.sets.length > 1 ? (
                  <button type="button" onClick={() => removeSet(exIndex, setIndex)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer" }}>x</button>
                ) : <span></span>}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSet(exIndex)}
              style={{ marginTop: "8px", background: "none", border: "1px dashed #334155", color: "#94a3b8", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem", width: "100%" }}
            >
              + Añadir serie
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addExercise}
          style={{ width: "100%", padding: "14px", background: "none", border: "1px dashed #334155", color: "#94a3b8", borderRadius: "12px", cursor: "pointer", marginBottom: "20px", fontSize: "0.95rem" }}
        >
          + Añadir ejercicio
        </button>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "14px", background: "#4fffb0", color: "#0f172a", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer" }}
        >
          {loading ? "Guardando..." : "Guardar entrenamiento"}
        </button>
      </form>
    </div>
  );
}