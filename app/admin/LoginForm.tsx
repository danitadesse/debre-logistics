"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.get("password") })
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Login failed");
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required autoFocus />
      {error && <p className="error-text" style={{ marginTop: "10px" }}>{error}</p>}
      <button type="submit" className="btn" style={{ marginTop: "16px" }} disabled={busy}>
        {busy ? "Checking..." : "Sign in"}
      </button>
    </form>
  );
}
