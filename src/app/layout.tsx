import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/top-bar";

// Superfamille Archivo — utilisée du corps aux titres display (via graisse + largeur en CSS)
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Données, prix alignés, métadonnées — chiffres tabulaires
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuvora — Le moteur des produits digitaux",
  description:
    "Nuvora est un annuaire intelligent de produits digitaux francophones : ebooks, formations, templates et logiciels. On aide à découvrir, on redirige vers l'achat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${archivo.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <TopBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
