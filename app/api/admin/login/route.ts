import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { makeToken, adminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = String(body.password || "");
    const expected = process.env.ADMIN_PASSWORD || "debre-admin-2024";

    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    const ok = a.length === b.length && timingSafeEqual(a, b);

    if (!ok) {
      // Small delay to slow down brute force attempts.
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(adminCookie.name, makeToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: adminCookie.maxAge,
      secure: process.env.NODE_ENV === "production"
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
