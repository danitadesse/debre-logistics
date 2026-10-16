"use client";

import { useState } from "react";

export default function ContactForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries()))
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Could not send message");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="notice">
        Message received. The dispatch desk will reply within one business day.
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="full">
          <label htmlFor="company">Company (optional)</label>
          <input id="company" name="company" />
        </div>
        <div className="full">
          <label htmlFor="body">Message</label>
          <textarea id="body" name="body" required />
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn" style={{ marginTop: "20px" }} disabled={busy}>
        {busy ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
