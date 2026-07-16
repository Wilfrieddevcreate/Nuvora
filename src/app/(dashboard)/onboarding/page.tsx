import type { Metadata } from "next";
import { OnboardingFlow } from "./flow";

export const metadata: Metadata = {
  title: "Bienvenue sur Nuvora",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
