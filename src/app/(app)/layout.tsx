import type { Metadata } from "next";
import { AppShell } from "@/components/shell";

export const metadata: Metadata = {
  title: "EduPath AI — Learner Console",
  description: "Your adaptive learning journey.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}