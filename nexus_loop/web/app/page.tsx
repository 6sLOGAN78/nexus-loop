"use client";

import dynamic from "next/dynamic";

// The desk's initial selection is read from location.hash and every render
// depends on client-fetched report state -- there's nothing meaningful to
// server-render, and doing so would risk a hydration mismatch against the
// hash-derived selection. Rendered client-only, same as the original static
// page (which only ever ran after the browser loaded it).
const Desk = dynamic(() => import("@/components/Desk").then((m) => m.Desk), { ssr: false });

export default function Page() {
  return <Desk />;
}
