"use client";

import { useRouter } from "next/navigation";

export default function TrackForm({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const code = String(data.get("code") || "").trim();
    if (code) router.push("/track?code=" + encodeURIComponent(code));
  }

  return (
    <form className="track-box" onSubmit={submit}>
      <input
        name="code"
        defaultValue={defaultValue}
        placeholder="Enter tracking code, e.g. DBR-A1B2C3"
        className="mono"
        aria-label="Tracking code"
      />
      <button type="submit" className="btn">Track</button>
    </form>
  );
}
