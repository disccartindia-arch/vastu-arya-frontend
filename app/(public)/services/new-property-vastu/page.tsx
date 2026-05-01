import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import NewPropertyVastuClient from "./NewPropertyVastuClient";

export const metadata: Metadata = buildMetadata({
  title:       "New Property Vastu - Vastu for New Home or Plot | Dr. PPS Tomar",
  description: "Get expert Vastu advice before buying or building your new property. Dr. PPS Tomar helps you choose a Vastu-compliant plot, flat or house.",
  path:        "/services/new-property-vastu",

});

export default function Page() {
  return (
    <>
      <NewPropertyVastuClient />
    </>
  );
}
