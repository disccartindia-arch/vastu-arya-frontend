import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import VastuCheckClient from "./VastuCheckClient";

export const metadata: Metadata = buildMetadata({
  title:       "Vastu Check - Quick Vastu Audit for Your Space | Vastu Arya",
  description: "Get a quick Vastu check for your home or office by Dr. PPS Tomar. Identify top Vastu defects and get actionable remedies without demolition. Book now.",
  path:        "/services/vastu-check",

});

export default function Page() {
  return (
    <>
      <VastuCheckClient />
    </>
  );
}
