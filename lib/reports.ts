// Server-side report helpers shared by the finance and tax pages.

export type ShipmentLike = {
  status: string;
  service: string;
  price: number | null;
  createdAt: Date;
};

export function price(s: ShipmentLike): number {
  return Number(s.price) || 0;
}

export function isBillable(s: ShipmentLike): boolean {
  return s.status !== "cancelled";
}

export function isCollected(s: ShipmentLike): boolean {
  return s.status === "delivered";
}

export const VAT_RATE = 0.15; // Ethiopian standard VAT rate

export type MonthRow = {
  key: string; // YYYY-MM
  label: string; // MMM YYYY
  shipments: number;
  gross: number;
  collected: number;
  cancelled: number;
};

export function byMonth(shipments: ShipmentLike[]): MonthRow[] {
  const map = new Map<string, MonthRow>();
  for (const s of shipments) {
    const d = new Date(s.createdAt);
    const key = d.toISOString().slice(0, 7);
    if (!map.has(key)) {
      const label =
        d.toLocaleString("en-US", { month: "short" }) + " " + String(d.getFullYear());
      map.set(key, {
        key, label, shipments: 0, gross: 0, collected: 0, cancelled: 0
      });
    }
    const row = map.get(key)!;
    row.shipments += 1;
    if (isBillable(s)) row.gross += price(s);
    else row.cancelled += price(s);
    if (isCollected(s)) row.collected += price(s);
  }
  return [...map.values()].sort((a, b) => (a.key < b.key ? 1 : -1));
}

export type ServiceRow = { service: string; count: number; revenue: number };

export function byService(shipments: ShipmentLike[]): ServiceRow[] {
  const map = new Map<string, ServiceRow>();
  for (const s of shipments) {
    if (!isBillable(s)) continue;
    const row = map.get(s.service) || { service: s.service, count: 0, revenue: 0 };
    row.count += 1;
    row.revenue += price(s);
    map.set(s.service, row);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export function etb(n: number): string {
  return "ETB " + Math.round(n).toLocaleString("en-US");
}
