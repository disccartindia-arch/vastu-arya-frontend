import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import NumerologyAnalysisClient from "./NumerologyAnalysisClient";

export const metadata: Metadata = buildMetadata({
  title:       "Numerology Analysis - Name and Date of Birth Numerology | Vastu Arya",
  description: "Get a detailed numerology analysis of your name and date of birth by Dr. PPS Tomar. Discover your life path, destiny number and lucky numbers.",
  path:        "/services/numerology-analysis",

});

export default function Page() {
  return (
    <>
      <NumerologyAnalysisClient />
    </>
  );
}
