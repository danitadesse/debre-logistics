import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { STATUS_VALUES, STATUS_LABELS } from "@/lib/utils";
import LoginForm from "./LoginForm";
import ShipmentTable from "./ShipmentTable";

export const metadata = { title: "Dispatch | DB Logistics" };
export const dynamic = "force-dynamic";

type Search = { expired?: string };

export default async function AdminPage({
  searchParams
}: {
  searchParams: Search;
}) {
  const admin = await isAdmin();

  if (!admin) {
    return (
      <div className="container">
        <div className="login-card">
          <h2>Dispatch login</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>
            Staff only. This area manages shipment status for all bookings.
          </p>
          {searchParams.expired === "1" && (
            <div className="notice">
              Session expired or signed out. Sign in again to continue.
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    );
  }

  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" }
  });

  const counts: Record<string, number> = {};
  for (const s of shipments) counts[s.status] = (counts[s.status] || 0) + 1;

  const total = shipments.length;
  const revenue = shipments
    .filter((s) => s.status !== "cancelled")
    .reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Dispatch dashboard</h2>
        <span className="count">{total} shipments</span>
      </div>

      <div className="stat-row">
        <div className="stat-cell">
          <span className="n">{total}</span>
          <span className="l">Total</span>
        </div>
        {STATUS_VALUES.filter((s) => s !== "cancelled").map((s) => (
          <div className="stat-cell" key={s}>
            <span className="n">{counts[s] || 0}</span>
            <span className="l">{STATUS_LABELS[s]}</span>
          </div>
        ))}
        <div className="stat-cell">
          <span className="n">{"ETB " + revenue.toLocaleString("en-US")}</span>
          <span className="l">Booked revenue</span>
        </div>
      </div>

      <ShipmentTable
        shipments={shipments.map((s) => ({
          id: s.id,
          trackingCode: s.trackingCode,
          senderName: s.senderName,
          receiverName: s.receiverName,
          origin: s.origin,
          destination: s.destination,
          service: s.service,
          status: s.status,
          price: Number(s.price) || 0,
          createdAt: s.createdAt.toISOString().slice(0, 10)
        }))}
      />
    </div>
  );
}
