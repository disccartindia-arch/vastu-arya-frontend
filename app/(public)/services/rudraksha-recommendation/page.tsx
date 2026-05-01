import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import RudrakshaRecommendationClient from "./RudrakshaRecommendationClient";

export const metadata: Metadata = buildMetadata({
  title:       "Rudraksha Recommendation - Right Rudraksha for You | Vastu Arya",
  description: "Get a personalised Rudraksha recommendation from Dr. PPS Tomar based on your birth chart and life challenges. Wear the right Rudraksha for maximum benefit.",
  path:        "/services/rudraksha-recommendation",

});

export default function Page() {
  return (
    <>
      <RudrakshaRecommendationClient />
    </>
  );
}
