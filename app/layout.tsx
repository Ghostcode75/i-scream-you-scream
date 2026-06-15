import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://icescream.cedarcitywebdesign.com";

export const metadata: Metadata = {
  title: "I Scream, You Scream - Request the Ice Cream Truck",
  description: "Ring the bell and the Ice Cream Man heads to your street. Cedar City & surrounding areas.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "I Scream, You Scream - Request the Ice Cream Truck",
    description: "Ring the bell and the Ice Cream Man heads to your street. Cedar City & surrounding areas.",
    url: appUrl,
    siteName: "I Scream, You Scream",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "I Scream, You Scream - Ice Cream Truck Request App",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "I Scream, You Scream - Request the Ice Cream Truck",
    description: "Ring the bell and the Ice Cream Man heads to your street.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
