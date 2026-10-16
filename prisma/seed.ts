import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Deterministic demo tracking codes so the demo data is easy to show.
const demo = [
  {
    trackingCode: "DBR-A1B2C3",
    senderName: "Hanna Girma",
    senderPhone: "+251 911 234 567",
    receiverName: "Abel Tesfaye",
    receiverPhone: "+251 912 345 678",
    origin: "Adama",
    destination: "Addis Ababa",
    weight: 4.5,
    service: "standard",
    status: "delivered",
    price: 460,
    note: "Documents, handle with care"
  },
  {
    trackingCode: "DBR-D4E5F6",
    senderName: "Mekdes Alemu",
    senderPhone: "+251 913 456 789",
    receiverName: "Solomon Haile",
    receiverPhone: "+251 914 567 890",
    origin: "Addis Ababa",
    destination: "Dire Dawa",
    weight: 12,
    service: "freight",
    status: "in-transit",
    price: 1160,
    note: null
  },
  {
    trackingCode: "DBR-G7H8I9",
    senderName: "Yonas Bekele",
    senderPhone: "+251 915 678 901",
    receiverName: "Liya Getachew",
    receiverPhone: "+251 916 789 012",
    origin: "Adama",
    destination: "Bishoftu",
    weight: 1.2,
    service: "express",
    price: 244,
    status: "picked-up",
    note: "Fragile: glassware"
  },
  {
    trackingCode: "DBR-J0K1L2",
    senderName: "Sara Wolde",
    senderPhone: "+251 917 890 123",
    receiverName: "Dawit Kebede",
    receiverPhone: "+251 918 901 234",
    origin: "Nazret",
    destination: "Hawassa",
    weight: 8,
    service: "standard",
    price: 740,
    status: "pending",
    note: null
  },
  {
    trackingCode: "DBR-M3N4O5",
    senderName: "Tesfaye Assefa",
    senderPhone: "+251 919 012 345",
    receiverName: "Rahel Mengistu",
    receiverPhone: "+251 920 123 456",
    origin: "Addis Ababa",
    destination: "Adama",
    weight: 0.8,
    service: "express",
    price: 196,
    status: "at-hub",
    note: "Hold at hub for pickup"
  }
];

async function main() {
  console.log("Seeding demo shipments...");
  for (const s of demo) {
    await prisma.shipment.upsert({
      where: { trackingCode: s.trackingCode },
      update: {},
      create: s
    });
  }
  console.log("Seeded " + demo.length + " shipments.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
