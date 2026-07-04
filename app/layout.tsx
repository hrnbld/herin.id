import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://herin.id"),
  title: "Herin Yudha Pratama — Full-Stack Engineer & Systems Architect",
  description:
    "I design and build ERP, WhatsApp commerce, and AI automation for companies in Indonesia — from database to production. Based in Bandung.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  openGraph: {
    title: "Herin Yudha Pratama",
    description:
      "Full-Stack Engineer & Systems Architect — ERP, WhatsApp commerce, and AI automation for companies in Indonesia.",
    url: "https://herin.id",
    siteName: "herin.id",
    locale: "en_US",
    type: "website",
    images: [{ url: "/herin.jpg", width: 400, height: 400 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-canvas text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
