import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://herin.id"),
  title: "Herin Yudha Pratama — AI Automation & Commerce Systems Builder",
  description:
    "Commercial operator turned AI automation builder: practical apps, dashboards, WhatsApp systems, and agent orchestration for commerce teams. Based in Bandung, working globally.",
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
      "AI automation builder & commercial systems operator — practical apps, dashboards, WhatsApp systems, and agent orchestration for commerce teams.",
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
