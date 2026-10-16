import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const text = String(body.body || "").trim();

    if (!name || !email || !text) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "That email address does not look valid" },
        { status: 400 }
      );
    }

    await prisma.message.create({
      data: {
        name: name.slice(0, 200),
        email: email.slice(0, 200),
        company: body.company ? String(body.company).slice(0, 200) : null,
        body: text.slice(0, 5000)
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }
}
