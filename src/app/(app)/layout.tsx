import type { Metadata } from "next";
import { AppShell } from "@/components/shell";

const description =
  "Your adaptive learning journey — track progress, revisit assessments, and see how EduPath AI adapts your roadmap in real time.";

export const metadata: Metadata = {
  title: {
    default: "Console · EduPath AI",
    template: "%s · EduPath AI",
  },
  description,
  robots: { index: false, follow: false },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}