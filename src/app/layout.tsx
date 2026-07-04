import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Débat de Cotonou & Congrès OJEMAO 2026",
  description: "Site officiel des événements OJEMAO 2026 à Cotonou, Bénin. Débat de Cotonou (25 Juillet) et Congrès & Colloque d'Afrique de l'Ouest (26 au 28 Juillet).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
