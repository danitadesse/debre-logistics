import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeTrackingCode, priceQuote, isService } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = [
      "senderName", "senderPhone", "receiverName",
      "receiverPhone", "origin", "destination", "weight", "service"
    ];
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: "Missing field: " + field },
          { status: 400 }
        );
      }
    }

    const weight = Number(body.weight);
    if (!Number.isFinite(weight) || weight <= 0 || weight > 20000) {
      return NextResponse.json(
        { error: "Weight must be between 0 and 20000 kg" },
        { status: 400 }
      );
    }

    const service = String(body.service);
    if (!isService(service)) {
      return NextResponse.json({ error: "Unknown service" }, { status: 400 });
    }

    const str = (v: unknown) => String(v).trim().slice(0, 200);

    // Retry a few times in the unlikely case of a code collision.
    let shipment = null;
    for (let i = 0; i < 5 && !shipment; i++) {
      try {
        shipment = await prisma.shipment.create({
          data: {
            trackingCode: makeTrackingCode(),
            senderName: str(body.senderName),
            senderPhone: str(body.senderPhone),
            receiverName: str(body.receiverName),
            receiverPhone: str(body.receiverPhone),
            origin: str(body.origin),
            destination: str(body.destination),
            weight,
            service,
            status: "pending",
            price: priceQuote(weight, service),
            note: body.note ? str(body.note) : null
          }
        });
      } catch (e: any) {
        if (e?.code === "P2002") continue; // duplicate tracking code, retry
        throw e;
      }
    }

    if (!shipment) {
      return NextResponse.json(
        { error: "Could not allocate tracking code, try again" },
        { status: 500 }
      );
    }

    return NextResponse.json({ trackingCode: shipment.trackingCode });
  } catch (err: any) {
    console.error(err);
    // Prisma P2021/P2022: the database is out of sync with the schema.
    // Running prisma db push fixes it without losing data.
    if (err?.code === "P2021" || err?.code === "P2022") {
      return NextResponse.json(
        {
          error:
            "The database is out of date. Run this once in the project folder: npx prisma db push, then try again."
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Booking failed: " + String(err?.message || "unknown error").slice(0, 160) },
      { status: 500 }
    );
  }
}
