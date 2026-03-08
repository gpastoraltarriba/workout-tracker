"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", { email, password, full_name: fullName });
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      router.push("/dashboard");
    } catch {
      setError("Error al crear la cuenta. El email puede que ya este en uso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "400px" }}>
        <h1 style={{ marginBottom: "8px", fontSize: "1.5rem" }}>Crear cuenta</h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>Empieza a trackear tus entrenamientos</p>

        {error && (
          <div style={{ background: "#450a0a", color: "#fca5a5", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>
              Nombre completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0", fontSize: "1rem", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0", fontSize: "1rem", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#94a3b8" }}>
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0", fontSize: "1rem", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#4fffb0", color: "#0f172a", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
          Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#4fffb0" }}>Inicia sesion</a>
        </p>
      </div>
    </div>
  );
}