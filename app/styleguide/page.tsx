import type { Metadata } from "next";
import { StyleguideClient } from "@/components/styleguide/StyleguideClient";

export const metadata: Metadata = {
  title: "Design System & Styleguide",
  description:
    "Internal EliavaTech Section 2 Brand Tokens and Section 6 Component Primitives.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleguidePage() {
  return <StyleguideClient />;
}
