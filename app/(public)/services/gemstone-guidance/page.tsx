import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import GemstoneGuidanceClient from "./GemstoneGuidanceClient";

export const metadata: Metadata = buildMetadata({
  title:       "Gemstone Guidance - Right Gemstone for Your Horoscope | Vastu Arya",
  description: "Personalised gemstone recommendation by Dr. PPS Tomar based on your birth chart. Wear the right gemstone for health, wealth and success.",
  path:        "/services/gemstone-guidance",

});

export default function Page() {
  return (
    <>
      <GemstoneGuidanceClient />
    </>
  );
}
