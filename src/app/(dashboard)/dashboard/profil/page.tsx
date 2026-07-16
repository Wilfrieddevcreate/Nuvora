import type { Metadata } from "next";
import ProfilClient from "./client";

export const metadata: Metadata = {
  title: "Mon profil — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default function ProfilPage() {
  return <ProfilClient />;
}
