"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  User,
  GitFork,
  Map,
  ClipboardCheck,
  TrendingUp,
  Library,
  MessagesSquare,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { useTheme } from "@/components/theme";
import { useJourney } from "@/lib/store";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/gaps", label: "Skill Gaps", icon: GitFork },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/resources", label: "Resources", icon: Library },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const { state } = useJourney();

  const pending = state.plan?.pendingChange;

  const NavLinks = (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
              active
                ? "bg-accent-soft text-accent"
                : "text-foreground/55 hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
            {item.href === "/roadmap" && pending ? (
              <span className="ml-auto h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-400/25" />
            ) : null}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen">
      {pending ? (
        <div className="sticky top-0 z-40 border-b border-amber-500/25 bg-amber-500/10 px-4 py-2 text-center backdrop-blur">
          <Link
            href="/roadmap"
            className="text-[13px] font-medium text-amber-700 dark:text-amber-300 hover:underline"
          >
            Your roadmap has an update waiting for review — view & decide →
          </Link>
        </div>
      ) : null}

      <header className="sticky top-0 z-30 glass">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">{NavLinks}</nav>

          <div className="flex items-center gap-2">
            <Link
              href="/ask"
              className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-[13px] font-medium hover:bg-muted sm:inline-flex"
            >
              <MessagesSquare className="h-4 w-4 text-accent" />
              Ask EduPath
            </Link>
            <button
              onClick={toggle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground/70 hover:bg-muted"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-border px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">{NavLinks}</div>
            <Link
              href="/ask"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-xl bg-accent-soft px-3 py-2 text-[13.5px] font-medium text-accent"
            >
              <MessagesSquare className="h-[18px] w-[18px]" />
              Ask EduPath
            </Link>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}