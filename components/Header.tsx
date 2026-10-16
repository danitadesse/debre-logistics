"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
  { href: "/track", label: "Track" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link href="/" className="brand">
          DB<span className="accent">.</span>Logistics
        </Link>

        <nav className="nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Exactly one toggle, visible on both desktop and mobile. */}
        <div className="nav-actions">
          <ThemeToggle />
          <button
            type="button"
            className="menu-btn"
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
          >
            {open ? "x" : "="}
          </button>
        </div>
      </div>
      <div className="container">
        <div className={"mobile-nav" + (open ? " open" : "")}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
