import type { Metadata } from "next";
import "./globals.css";
import Chrome from "@/components/Chrome";

export const metadata: Metadata = {
  title: "Debre Logistics | Freight and courier across Ethiopia",
  description:
    "Debre Logistics moves parcels, documents and freight between Ethiopian cities. Book a shipment, track it live, and manage dispatch from one place."
};

// Runs before paint: applies the saved theme (or system preference)
// so there is no light-to-dark flash on load.
const themeInit = `
(function () {
  try {
    var saved = localStorage.getItem("debre-theme");
    var dark = saved ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
