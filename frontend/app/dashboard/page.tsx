"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Stats {
  total_workouts: number;
  total_sets: number;
  total_volume_kg: number;
  workouts_this_week: number;
}

interface Workout {
  id: number;
  title: string;
  started_at: string;
  duration_minutes: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    Promise.all([
      api.get("/stats"),
      api.get("/workouts?limit=5"),
    ]).then(([statsRes, workoutsRes]) => {
      setStats(statsRes.data);
      setWorkouts(workoutsRes.data);
    }).catch(() => {
      router.push("/login");
    }).finally(() => setLoading(false));
  }, [router]);

  function logout() {
    localStorage.clear();
    router.push("/login");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#94a3b8" }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px", maxWidth: "900px", margin: "0 auto" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Dashboard</h1>
          <p style={{ color: "#94a3b8", marginTop: "4px" }}>Tu progreso de entrenamiento</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => router.push("/workouts/new")}
            style={{ padding: "10px 20px", background: "#4fffb0", color: "#0f172a", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
          >
            + Nuevo entrenamiento
          </button>
          <button
            onClick={logout}
            style={{ padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: "8px", cursor: "pointer" }}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "Entrenamientos", value: stats?.total_workouts ?? 0, unit: "total" },
          { label: "Esta semana", value: stats?.workouts_this_week ?? 0, unit: "sesiones" },
          { label: "Series totales", value: stats?.total_sets ?? 0, unit: "sets" },
          { label: "Volumen total", value: stats?.total_volume_kg ?? 0, unit: "kg" },
        ].map(card => (
          <div key={card.label} style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", border: "1px solid #334155" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</p>
            <p style={{ fontSize: "2rem", fontWeight: "700", color: "#4fffb0" }}>{card.value}</p>
            <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: "4px" }}>{card.unit}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px", border: "1px solid #334155" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Entrenamientos recientes</h2>
          <button
            onClick={() => router.push("/workouts")}
            style={{ color: "#4fffb0", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Ver todos
          </button>
        </div>

        {workouts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#475569" }}>
            <p style={{ fontSize: "2rem", marginBottom: "8px" }}>🏋️</p>
            <p>No hay entrenamientos aun.</p>
            <button
              onClick={() => router.push("/workouts/new")}
              style={{ marginTop: "16px", padding: "10px 20px", background: "#4fffb0", color: "#0f172a", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
            >
              Crear tu primer entrenamiento
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {workouts.map(w => (
              <div
                key={w.id}
                onClick={() => router.push(`/workouts/${w.id}`)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#0f172a", borderRadius: "8px", cursor: "pointer", border: "1px solid #1e293b" }}
              >
                <div>
                  <p style={{ fontWeight: "500" }}>{w.title}</p>
                  <p style={{ color: "#475569", fontSize: "0.8rem", marginTop: "2px" }}>
                    {new Date(w.started_at).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
                  </p>
                </div>
                {w.duration_minutes && (
                  <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{w.duration_minutes} min</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}