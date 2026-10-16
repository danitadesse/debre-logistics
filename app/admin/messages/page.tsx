import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import MessagesTable from "./MessagesTable";

export const metadata = { title: "Messages | DB Logistics" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  if (!(await isAdmin())) redirect("/admin?expired=1");

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Contact messages</h2>
        <span className="count">{messages.length} total</span>
      </div>
      {messages.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          No messages yet. Messages sent from the public contact form
          appear here.
        </p>
      ) : (
        <MessagesTable
          messages={messages.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            company: m.company,
            body: m.body,
            createdAt: m.createdAt.toISOString().slice(0, 10)
          }))}
        />
      )}
    </div>
  );
}
