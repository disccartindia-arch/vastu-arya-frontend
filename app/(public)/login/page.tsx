import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import LoginClient from "./LoginClient";

export const metadata: Metadata = buildMetadata({
  title: "Login | Vastu Arya",
  description: "",
  path: "/login",
  noIndex: true,
});

export const dynamic = "force-dynamic";

// useSearchParams() inside LoginClient (for ?redirect=…) must be
// wrapped in <Suspense> when the page is prerendered — this satisfies
// Next 14's App Router requirement without needing a full loading UI.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
