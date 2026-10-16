"use client";

import { useState } from "react";

// Prints the waybill, then removes itself: one print per page view.
export default function PrintButton({ label }: { label?: string }) {
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        window.print();
        setDone(true);
      }}
    >
      {label || "Print waybill"}
    </button>
  );
}
