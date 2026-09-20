import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { JourneyProvider } from "@/lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "EduPath AI analyzes what you already know, builds a personalized learning journey toward your target career, and continuously adapts it as you learn.";

export const metadata: Metadata = {
  metadataBase: new URL("https://edupath-ai.vercel.app"),
  title: {
    default: "EduPath AI — Your learning path should adapt to you.",
    template: "%s · EduPath AI",
  },
  description,
  applicationName: "EduPath AI",
  category: "EdTech",
  creator: "EduPath AI",
  keywords: [
    "personalized learning",
    "AI education",
    "career roadmap",
    "skill gap analysis",
    "adaptive learning",
    "learning path",
  ],
  openGraph: {
    type: "website",
    title: "EduPath AI — Your learning path should adapt to you.",
    description,
    url: "https://edupath-ai.vercel.app",
    siteName: "EduPath AI",
    locale: "en_US",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduPath AI — personalized, adaptive learning journeys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduPath AI — Your learning path should adapt to you.",
    description,
    images: ["/brand/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        <ThemeProvider>
          <JourneyProvider>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </JourneyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}