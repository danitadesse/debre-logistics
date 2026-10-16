"use client";

import { useMemo, useState } from "react";

type Msg = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  body: string;
  createdAt: string;
};

export default function MessagesTable({ messages }: { messages: Msg[] }) {
  const [rows, setRows] = useState(messages);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((m) =>
      [m.name, m.email, m.company || "", m.body]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  async function remove(id: string) {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Delete failed");
      }
      setRows((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <input
        className="admin-search"
        placeholder="Search by name, email or content..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <table className="ship-table">
        <thead>
          <tr>
            <th>From</th>
            <th>Company</th>
            <th>Message</th>
            <th>Sent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>
                <div>{m.name}</div>
                <a className="mono" style={{ fontSize: "12px" }} href={"mailto:" + m.email}>
                  {m.email}
                </a>
              </td>
              <td>{m.company || "-"}</td>
              <td style={{ maxWidth: "360px" }}>
                {m.body.length > 90 && openId !== m.id ? (
                  <>
                    {m.body.slice(0, 90) + "... "}
                    <button
                      type="button"
                      style={{ background: "none", border: "none", padding: 0, color: "var(--accent)", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}
                      onClick={() => setOpenId(m.id)}
                    >
                      Read more
                    </button>
                  </>
                ) : (
                  m.body
                )}
              </td>
              <td className="mono">{m.createdAt}</td>
              <td>
                <button type="button" style={{ padding: "6px 12px", fontSize: "11px" }} className="btn ghost" onClick={() => remove(m.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: "var(--muted)" }}>
                No messages match that search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
