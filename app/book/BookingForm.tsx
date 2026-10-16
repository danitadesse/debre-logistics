"use client";

import { useMemo, useState } from "react";

// Same pricing model as priceQuote() in lib/utils.ts, duplicated here
// because lib/utils imports node:crypto and cannot run in the browser.
function quote(weightKg: number, service: string): number {
  const w = Math.max(0, weightKg || 0);
  if (service === "express") return 100 + w * 120;
  if (service === "freight") return 500 + w * 55;
  return 100 + w * 80;
}

function fmt(amount: number): string {
  return "ETB " + Math.round(amount).toLocaleString("en-US");
}

export default function BookingForm() {
  const [weight, setWeight] = useState("1");
  const [service, setService] = useState("standard");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const live = useMemo(
    () => quote(parseFloat(weight), service),
    [weight, service]
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    const data = new FormData(e.currentTarget);
    const body = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Booking failed (" + res.status + ")");
      setResult(json.trackingCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="waybill">
        <div className="wb-head">
          <div>
            <span className="mono" style={{ color: "var(--accent)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Booking confirmed
            </span>
            <h3 style={{ margin: "4px 0 0" }} className="mono">{result}</h3>
          </div>
        </div>
        <p style={{ margin: 0 }}>
          Save this tracking code. Use it on the track page to follow the
          shipment and print the waybill.
        </p>
        <div className="print-actions" style={{ display: "flex", gap: "12px" }}>
          <a className="btn" href={"/track?code=" + result}>Track it now</a>
          <button type="button" className="btn ghost" onClick={() => setResult(null)}>
            Book another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div>
          <label htmlFor="senderName">Sender name</label>
          <input id="senderName" name="senderName" required />
        </div>
        <div>
          <label htmlFor="senderPhone">Sender phone</label>
          <input id="senderPhone" name="senderPhone" required placeholder="+251 ..." />
        </div>
        <div>
          <label htmlFor="receiverName">Receiver name</label>
          <input id="receiverName" name="receiverName" required />
        </div>
        <div>
          <label htmlFor="receiverPhone">Receiver phone</label>
          <input id="receiverPhone" name="receiverPhone" required placeholder="+251 ..." />
        </div>
        <div>
          <label htmlFor="origin">Origin</label>
          <select id="origin" name="origin" required defaultValue="Adama">
            <option>Adama</option>
            <option>Addis Ababa</option>
            <option>Bishoftu</option>
            <option>Nazret</option>
            <option>Dire Dawa</option>
            <option>Hawassa</option>
            <option>Mekelle</option>
            <option>Bahir Dar</option>
          </select>
        </div>
        <div>
          <label htmlFor="destination">Destination</label>
          <select id="destination" name="destination" required defaultValue="Addis Ababa">
            <option>Adama</option>
            <option>Addis Ababa</option>
            <option>Bishoftu</option>
            <option>Nazret</option>
            <option>Dire Dawa</option>
            <option>Hawassa</option>
            <option>Mekelle</option>
            <option>Bahir Dar</option>
          </select>
        </div>
        <div>
          <label htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            name="weight"
            type="number"
            min="0.1"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="service">Service</label>
          <select
            id="service"
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="standard">Standard (ETB 180/kg)</option>
            <option value="express">Express (ETB 220/kg)</option>
            <option value="freight">Freight (ETB 555/kg, ETB 500 base)</option>
          </select>
        </div>
        <div className="full">
          <label htmlFor="note">Note (optional)</label>
          <input id="note" name="note" placeholder="Fragile, hold at hub, delivery window..." />
        </div>
      </div>

      <div className="quote" style={{ marginTop: "24px" }}>
        <span>
          <span className="q-label">Live quote</span>
        </span>
        <span className="q-amount">{fmt(live)}</span>
        <p className="q-note">
          Calculated as you type. This is the final price; drivers do not
          renegotiate at pickup.
        </p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn" style={{ marginTop: "20px" }} disabled={busy}>
        {busy ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}
