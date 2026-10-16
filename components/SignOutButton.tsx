"use client";

export default function SignOutButton() {
  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button type="button" className="btn ghost" onClick={signOut}>
      Sign out
    </button>
  );
}
