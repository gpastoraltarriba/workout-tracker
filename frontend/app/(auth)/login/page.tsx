"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      router.push("/dashboard");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#1e293b",
        padding: "40px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
      }}>
        <h1 style={{ marginBottom: "8px", fontSize: "1.5rem" }}>Workout Tracker</h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>Inicia sesión en tu cuenta</p>

        {error && (
          <div style={{ background: "#450a0a", color: "#fca5a5", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%", padding: "10px 14px", background: "#0f172a",
                border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0",
                fontSize: "1rem", outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%", padding: "10px 14px", background: "#0f172a",
                border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0",
                fontSize: "1rem", outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "12px", background: "#4fffb0",
              color: "#0f172a", border: "none", borderRadius: "8px",
              fontSize: "1rem", fontWeight: "600", cursor: "pointer",
            }}
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
          ¿No tienes cuenta?{" "}
          <a href="/register" style={{ color: "#4fffb0" }}>Regístrate</a>
        </p>
      </div>
    </div>
  );
}