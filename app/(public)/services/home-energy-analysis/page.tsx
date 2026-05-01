import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import HomeEnergyAnalysisClient from "./HomeEnergyAnalysisClient";

export const metadata: Metadata = buildMetadata({
  title:       "Home Energy Analysis - Vastu for Your Home | Dr. PPS Tomar",
  description: "Detailed home energy analysis using Vastu Shastra principles by Dr. PPS Tomar. Identify and correct energy imbalances for health, harmony and prosperity.",
  path:        "/services/home-energy-analysis",

});

export default function Page() {
  return (
    <>
      <HomeEnergyAnalysisClient />
    </>
  );
}
