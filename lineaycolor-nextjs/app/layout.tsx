import type { Metadata, Viewport } from "next";
import "./globals.css";
import Layout from "@/components/layout/Layout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a1a1a",
};

export const metadata: Metadata = {
  title: "Lineaycolor - Redefining Fashion",
  description: "Minimalist fashion that makes a statement. Discover our curated collection of timeless pieces.",
  keywords: "fashion, minimalist, clothing, sustainable fashion, luxury",
  authors: [{ name: "Lineaycolor" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lineaycolor",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Lineaycolor - Redefining Fashion",
    description: "Minimalist fashion that makes a statement",
    type: "website",
    locale: "en_US",
    siteName: "Lineaycolor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lineaycolor - Redefining Fashion",
    description: "Minimalist fashion that makes a statement",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
