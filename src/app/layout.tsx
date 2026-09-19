import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "EduPath AI — Your learning path should adapt to you.",
  description:
    "EduPath AI analyzes what you already know, builds a personalized learning journey toward your target career, and continuously adapts it as you learn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}>
        <ThemeProvider>
          <JourneyProvider>{children}</JourneyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}