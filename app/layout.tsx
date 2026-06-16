import type { Metadata, Viewport } from "next";
import { Fredoka, Inter, Satisfy } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://i-scream-you-scream.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6EC6CE",
};

export const metadata: Metadata = {
  title: "I Scream, You Scream — Request the Ice Cream Truck",
  description:
    "Ring the bell and the Ice Cream Man heads to your street. Cedar City & surrounding areas.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "I Scream, You Scream — Request the Ice Cream Truck",
    description:
      "Ring the bell and the Ice Cream Man heads to your street. Cedar City & surrounding areas.",
    url: appUrl,
    siteName: "I Scream, You Scream",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "I Scream, You Scream — Request the Ice Cream Truck",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "I Scream, You Scream — Request the Ice Cream Truck",
    description: "Ring the bell and the Ice Cream Man heads to your street.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ice Cream Man",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable} ${satisfy.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
