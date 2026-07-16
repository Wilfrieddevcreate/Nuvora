import type { Metadata } from "next";
import CompteClient from "./client";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ComptePage() {
  return <CompteClient />;
}
