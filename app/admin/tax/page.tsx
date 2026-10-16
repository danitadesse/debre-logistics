import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { byMonth, etb, VAT_RATE, price, isBillable } from "@/lib/reports";

export const metadata = { title: "Tax report | DB Logistics" };
export const dynamic = "force-dynamic";

export default async function TaxPage() {
  if (!(await isAdmin())) redirect("/admin?expired=1");

  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "asc" }
  });
  const billable = shipments.filter(isBillable);
  const months = byMonth(shipments);

  const grossTotal = billable.reduce((sum, s) => sum + price(s), 0);
  const vatTotal = grossTotal * VAT_RATE;
  const netTotal = grossTotal - vatTotal;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="container section">
      <div className="section-head no-print">
        <h2>Tax report</h2>
        <span className="count">VAT is calculated at 15% (Ethiopian standard rate)</span>
      </div>

      <div className="tax-report">
        <div className="wb-head">
          <div>
            <span className="mono" style={{ color: "var(--accent)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Debre Logistics plc
            </span>
            <h3 style={{ margin: "4px 0 0" }}>VAT and revenue report</h3>
          </div>
          <span className="mono" style={{ color: "var(--muted)", fontSize: "13px" }}>
            Generated {today}
          </span>
        </div>

        <table className="ship-table tax-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Shipments</th>
              <th>Gross revenue</th>
              <th>Output VAT (15%)</th>
              <th>Net revenue</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => {
              const vat = m.gross * VAT_RATE;
              return (
                <tr key={m.key}>
                  <td>{m.label}</td>
                  <td className="mono">{m.shipments}</td>
                  <td className="mono">{etb(m.gross)}</td>
                  <td className="mono">{etb(vat)}</td>
                  <td className="mono">{etb(m.gross - vat)}</td>
                </tr>
              );
            })}
            {months.length === 0 && (
              <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No shipments yet.</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ fontWeight: 700 }}>Total</td>
              <td className="mono" style={{ fontWeight: 700 }}>{billable.length}</td>
              <td className="mono" style={{ fontWeight: 700 }}>{etb(grossTotal)}</td>
              <td className="mono" style={{ fontWeight: 700 }}>{etb(vatTotal)}</td>
              <td className="mono" style={{ fontWeight: 700 }}>{etb(netTotal)}</td>
            </tr>
          </tfoot>
        </table>

        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "16px" }}>
          Gross revenue counts all non-cancelled bookings. Output VAT is the
          VAT Debre Logistics charges customers and remits to the Ethiopian
          Revenues and Customs Authority. Net revenue is what remains after
          VAT. This report is generated from live shipment data.
        </p>

        <div className="print-actions no-print">
          <PrintButton label="Print tax report" />
        </div>
      </div>
    </div>
  );
}
