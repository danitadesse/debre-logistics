import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { isValidStatus } from "@/lib/utils";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ shipments });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const status = String(body.status || "");

    if (!id || !isValidStatus(status)) {
      return NextResponse.json(
        { error: "A shipment id and a valid status are required" },
        { status: 400 }
      );
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ shipment });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json(
        { error: "No shipment with that id" },
        { status: 404 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
