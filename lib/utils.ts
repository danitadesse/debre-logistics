import { randomBytes } from "crypto";

export const STATUS_VALUES = [
  "pending",
  "picked-up",
  "in-transit",
  "at-hub",
  "delivered",
  "cancelled"
] as const;

export type Status = (typeof STATUS_VALUES)[number];

export function isValidStatus(value: string): value is Status {
  return (STATUS_VALUES as readonly string[]).includes(value);
}

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending pickup",
  "picked-up": "Picked up",
  "in-transit": "In transit",
  "at-hub": "At hub",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

// Tracking code format: DBR-XXXXXX (6 hex chars)
export function makeTrackingCode(): string {
  return "DBR-" + randomBytes(3).toString("hex").toUpperCase();
}

// Same pricing model as the live calculator on /book.
export function priceQuote(weightKg: number, service: string): number {
  const w = Math.max(0, weightKg || 0);
  if (service === "express") return 100 + w * 120;
  if (service === "freight") return 500 + w * 55;
  return 100 + w * 80; // standard
}

// Defensive: older dev.db rows may have null price.
export function formatETB(amount: number | null | undefined): string {
  const n = Number(amount);
  const safe = Number.isFinite(n) ? n : 0;
  return "ETB " + Math.round(safe).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

export const SERVICE_OPTIONS = ["standard", "express", "freight"] as const;

export function isService(value: string): boolean {
  return (SERVICE_OPTIONS as readonly string[]).includes(value);
}
