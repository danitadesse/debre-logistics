import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "debre_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.SESSION_SECRET || "dev-secret";
}

export function makeToken(): string {
  const issued = Date.now().toString();
  const sig = createHmac("sha256", secret()).update(issued).digest("hex");
  return issued + "." + sig;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig) return false;
  const expected = createHmac("sha256", secret()).update(issued).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const age = (Date.now() - Number(issued)) / 1000;
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE;
}

export async function isAdmin(): Promise<boolean> {
  const store = cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export const adminCookie = { name: COOKIE_NAME, maxAge: MAX_AGE };
