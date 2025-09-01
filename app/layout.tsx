import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thumbnify - AI-Powered YouTube Thumbnail Generator",
  description: "Create stunning, click-worthy YouTube thumbnails in seconds with our AI-powered generator. Boost your video views and engagement with professional-quality thumbnails.",
  keywords: "YouTube thumbnails, AI thumbnail generator, video thumbnails, YouTube marketing, content creation",
  authors: [{ name: "Thumbnify" }],
  openGraph: {
    title: "Thumbnify - AI-Powered YouTube Thumbnail Generator",
    description: "Create stunning, click-worthy YouTube thumbnails in seconds with our AI-powered generator.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thumbnify - AI-Powered YouTube Thumbnail Generator",
    description: "Create stunning, click-worthy YouTube thumbnails in seconds with our AI-powered generator.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10`}
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
