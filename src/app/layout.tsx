import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Sans-serif douce et moderne — casse normale, très lisible
const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Données, prix, métadonnées ponctuelles
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nuvora — Trouvez les meilleurs produits digitaux",
  description:
    "Nuvora est le moteur de découverte des produits digitaux : ebooks, formations, templates et logiciels. On vous aide à trouver, on redirige vers l'achat.",
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
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-bg text-fg font-sans">
        {children}
      </body>
    </html>
  );
}
