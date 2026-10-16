// Client-safe constants (no node imports) for client components.
export const STATUS_VALUES = [
  "pending",
  "picked-up",
  "in-transit",
  "at-hub",
  "delivered",
  "cancelled"
] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending pickup",
  "picked-up": "Picked up",
  "in-transit": "In transit",
  "at-hub": "At hub",
  delivered: "Delivered",
  cancelled: "Cancelled"
};
