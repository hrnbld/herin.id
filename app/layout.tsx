import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://herin.id"),
  title: "Herin Yudha Pratama — Full-Stack Engineer & Systems Architect",
  description:
    "Merancang dan membangun ERP, WhatsApp commerce, dan automasi AI untuk bisnis di Indonesia — dari database sampai production. Berbasis di Bandung.",
  openGraph: {
    title: "Herin Yudha Pratama",
    description:
      "Full-Stack Engineer & Systems Architect — ERP, WhatsApp commerce, dan automasi AI untuk bisnis di Indonesia.",
    url: "https://herin.id",
    siteName: "herin.id",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
