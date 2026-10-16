import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, formatETB } from "@/lib/utils";
import PrintButton from "@/components/PrintButton";
import TrackForm from "./TrackForm";

export const metadata = { title: "Track | Debre Logistics" };

type Search = { code?: string };

async function getShipment(code?: string) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  return prisma.shipment.findUnique({ where: { trackingCode: clean } });
}

// Deterministic pseudo-barcode rendered in pure CSS from the code itself.
function Barcode({ code }: { code: string }) {
  const bars = code
    .replace(/[^0-9A-F]/gi, "")
    .split("")
    .map((ch, i) => {
      const w = (parseInt(ch, 16) % 3) + 1;
      const gap = i % 2 === 0 ? 2 : 1;
      return { w, gap };
    });
  return (
    <div className="wb-barcode-wrap">
      <div className="wb-barcode">
        {bars.map((b, i) => (
          <span key={i} style={{ width: b.w + "px", marginRight: b.gap + "px" }} />
        ))}
      </div>
      <div className="wb-code mono">{code}</div>
    </div>
  );
}

export default async function TrackPage({
  searchParams
}: {
  searchParams: Search;
}) {
  const shipment = await getShipment(searchParams.code);
  const notFound = searchParams.code && !shipment;

  return (
    <div className="container section">
      <div className="section-head no-print">
        <h2>Track a shipment</h2>
        <span className="count mono">DBR-XXXXXX</span>
      </div>
      <Suspense>
        <TrackForm defaultValue={searchParams.code || ""} />
      </Suspense>

      {notFound && (
        <p className="error-text" style={{ marginTop: "16px" }}>
          No shipment found for that code. Check the code and try again.
        </p>
      )}

      {shipment && (
        <div className="waybill">
          <div className="wb-head">
            <div>
              <span className="mono" style={{ color: "var(--accent)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Debre Logistics plc | Waybill
              </span>
              <h3 style={{ margin: "4px 0 0" }}>Shipment receipt</h3>
            </div>
            <span className={"badge " + shipment.status}>
              {STATUS_LABELS[shipment.status] || shipment.status}
            </span>
          </div>

          <Barcode code={shipment.trackingCode} />

          <dl className="wb-grid">
            <div>
              <dt>From</dt>
              <dd>{shipment.origin}</dd>
              <dt>Sender</dt>
              <dd>{shipment.senderName}</dd>
              <dt>Sender phone</dt>
              <dd className="mono">{shipment.senderPhone}</dd>
            </div>
            <div>
              <dt>To</dt>
              <dd>{shipment.destination}</dd>
              <dt>Receiver</dt>
              <dd>{shipment.receiverName}</dd>
              <dt>Receiver phone</dt>
              <dd className="mono">{shipment.receiverPhone}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd style={{ textTransform: "capitalize" }}>{shipment.service}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{shipment.weight} kg</dd>
            </div>
            <div>
              <dt>Booked on</dt>
              <dd>{shipment.createdAt.toISOString().slice(0, 10)}</dd>
            </div>
            <div>
              <dt>Waybill note</dt>
              <dd>{shipment.note || "-"}</dd>
            </div>
          </dl>

          <div className="wb-total">
            <span className="q-label">Total charged</span>
            <span className="amt">{formatETB(shipment.price)}</span>
          </div>

          <p className="wb-terms">
            This waybill is proof of booking and receipt of cargo. Debre
            Logistics plc is liable for loss or damage up to the declared
            value of the shipment. Please quote the waybill number in all
            correspondence.
          </p>

          <div className="wb-sigs">
            <div className="sig">Released by (Debre staff)</div>
            <div className="sig">Received by (signature)</div>
            <div className="sig">Received on (date)</div>
          </div>

          <div className="print-actions no-print">
            <PrintButton />
          </div>
        </div>
      )}

      {!shipment && !notFound && (
        <p style={{ marginTop: "20px", color: "var(--muted)" }}>
          Try a demo code from the seed data, for example DBR-A1B2C3.
        </p>
      )}
    </div>
  );
}
