import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { byMonth, byService, etb, price, isBillable, isCollected } from "@/lib/reports";

export const metadata = { title: "Finance | Debre Logistics" };
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  if (!(await isAdmin())) redirect("/admin?expired=1");

  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "asc" }
  });

  const billable = shipments.filter(isBillable);
  const gross = billable.reduce((sum, s) => sum + price(s), 0);
  const collected = shipments.filter(isCollected).reduce((sum, s) => sum + price(s), 0);
  const outstanding = gross - collected;
  const cancelledValue = shipments
    .filter((s) => !isBillable(s))
    .reduce((sum, s) => sum + price(s), 0);
  const avg = billable.length ? gross / billable.length : 0;

  const months = byMonth(shipments);
  const services = byService(shipments);
  const totalServiceRevenue = services.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Finance overview</h2>
        <span className="count">Booked revenue, collections and service mix</span>
      </div>

      <div className="stat-row">
        <div className="stat-cell">
          <span className="n">{etb(gross)}</span>
          <span className="l">Gross booked</span>
        </div>
        <div className="stat-cell">
          <span className="n">{etb(collected)}</span>
          <span className="l">Collected (delivered)</span>
        </div>
        <div className="stat-cell">
          <span className="n">{etb(outstanding)}</span>
          <span className="l">Outstanding</span>
        </div>
        <div className="stat-cell">
          <span className="n">{etb(cancelledValue)}</span>
          <span className="l">Cancelled value</span>
        </div>
        <div className="stat-cell">
          <span className="n">{etb(avg)}</span>
          <span className="l">Avg shipment</span>
        </div>
        <div className="stat-cell">
          <span className="n">{billable.length}</span>
          <span className="l">Billable shipments</span>
        </div>
      </div>

      <h3>Monthly breakdown</h3>
      <table className="ship-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Shipments</th>
            <th>Gross revenue</th>
            <th>Collected</th>
            <th>Outstanding</th>
            <th>Cancelled value</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m.key}>
              <td>{m.label}</td>
              <td className="mono">{m.shipments}</td>
              <td className="mono">{etb(m.gross)}</td>
              <td className="mono">{etb(m.collected)}</td>
              <td className="mono">{etb(m.gross - m.collected)}</td>
              <td className="mono">{etb(m.cancelled)}</td>
            </tr>
          ))}
          {months.length === 0 && (
            <tr><td colSpan={6} style={{ color: "var(--muted)" }}>No shipments yet.</td></tr>
          )}
        </tbody>
      </table>

      <h3 style={{ marginTop: "40px" }}>Revenue by service</h3>
      <table className="ship-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Shipments</th>
            <th>Revenue</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {services.map((r) => (
            <tr key={r.service}>
              <td style={{ textTransform: "capitalize" }}>{r.service}</td>
              <td className="mono">{r.count}</td>
              <td className="mono">{etb(r.revenue)}</td>
              <td>
                <span className="share-bar">
                  <span
                    className="share-fill"
                    style={{
                      width:
                        (totalServiceRevenue
                          ? Math.round((r.revenue / totalServiceRevenue) * 100)
                          : 0) + "%"
                    }}
                  />
                </span>
                <span className="mono">
                  {totalServiceRevenue
                    ? Math.round((r.revenue / totalServiceRevenue) * 100)
                    : 0}
                  %
                </span>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr><td colSpan={4} style={{ color: "var(--muted)" }}>No billable shipments yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
