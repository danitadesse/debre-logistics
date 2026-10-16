import { isAdmin } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  return (
    <>
      <header className="admin-topbar no-print">
        <div className="container admin-topbar-inner">
          <span className="brand">
            DB<span className="accent">.</span>Logistics
            <span className="admin-tag mono">Dispatch</span>
          </span>
          {admin ? (
            <>
              <AdminNav />
              <div className="nav-actions">
                <ThemeToggle />
                <SignOutButton />
              </div>
            </>
          ) : (
            <div className="nav-actions">
              <ThemeToggle />
            </div>
          )}
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
