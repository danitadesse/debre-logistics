"use client";

import { useMemo, useState } from "react";
import { STATUS_VALUES, STATUS_LABELS } from "@/lib/statusConstants";

type Row = {
  id: string;
  trackingCode: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  service: string;
  status: string;
  price: number;
  createdAt: string;
};

export default function ShipmentTable({ shipments }: { shipments: Row[] }) {
  const [rows, setRows] = useState(shipments);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.trackingCode, r.senderName, r.receiverName, r.origin, r.destination]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  async function updateStatus(id: string, status: string) {
    setSaving(id);
    try {
      const res = await fetch("/api/admin/shipments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Update failed");
      }
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <input
        className="admin-search"
        placeholder="Search by code, name or city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <table className="ship-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Route</th>
            <th>Sender - Receiver</th>
            <th>Service</th>
            <th>Price</th>
            <th>Booked</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td className="mono">
                <a href={"/track?code=" + r.trackingCode}>{r.trackingCode}</a>
              </td>
              <td>{r.origin} -&gt; {r.destination}</td>
              <td>{r.senderName} to {r.receiverName}</td>
              <td style={{ textTransform: "capitalize" }}>{r.service}</td>
              <td className="mono">{"ETB " + (r.price || 0).toLocaleString("en-US")}</td>
              <td className="mono">{r.createdAt}</td>
              <td>
                <select
                  className="status-select"
                  value={r.status}
                  disabled={saving === r.id}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                >
                  {STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} style={{ color: "var(--muted)" }}>
                No shipments match that search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
