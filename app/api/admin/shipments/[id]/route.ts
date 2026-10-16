import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthed } from "@/lib/auth";
import { isValidStatus } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, location, note } = await req.json().catch(() => ({}));
  if (typeof status !== "string" || !isValidStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const shipment = await prisma.shipment.update({
    where: { id: params.id },
    data: {
      status,
      events: {
        create: {
          status,
          location: typeof location === "string" && location.trim() ? location.trim() : "Dispatch",
          note: typeof note === "string" && note.trim() ? note.trim() : null,
        },
      },
    },
  });
  return NextResponse.json({ ok: true, status: shipment.status });
}

