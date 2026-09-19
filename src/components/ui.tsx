"use client";

import { clsx } from "clsx";
import Link from "next/link";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { Compass, Loader2 } from "lucide-react";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return clsx(parts);
}

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "subtle";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

export type ButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-sm shadow-indigo-600/20 border border-transparent",
  secondary:
    "bg-accent-soft text-accent hover:opacity-90 border border-transparent",
  outline:
    "border border-border bg-card hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground/80 hover:text-foreground",
  subtle:
    "bg-muted text-foreground hover:bg-border border border-transparent",
  danger: "bg-rose-600 text-white hover:bg-rose-500 border border-transparent",
};

const buttonSizes: Record<string, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-[15px] rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", loading, icon, children, disabled, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cx(
          "inline-flex items-center justify-center font-medium transition-all duration-150 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "card-surface rounded-2xl shadow-sm shadow-black/[0.03] dark:shadow-black/20",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
        </div>
        {subtitle ? (
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/55">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "zinc",
  className,
}: {
  children: ReactNode;
  tone?: "zinc" | "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet";
  className?: string;
}) {
  const tones: Record<string, string> = {
    zinc: "bg-muted text-foreground/70",
    indigo: "bg-accent-soft text-accent",
    emerald: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
    amber: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
    rose: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
    sky: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
    violet: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function LevelDots({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cx(
            "h-1.5 w-4 rounded-full transition-colors",
            i < level
              ? level <= 2
                ? "bg-amber-400"
                : level <= 3
                  ? "bg-indigo-400"
                  : "bg-emerald-400"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "accent",
  className,
}: {
  value: number;
  tone?: "accent" | "emerald" | "rose" | "amber" | "sky";
  className?: string;
}) {
  const tones = {
    accent: "bg-indigo-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
  };
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className={cx("h-full rounded-full", tones[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </div>
  );
}

export function Logo({
  size = "md",
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const box = size === "lg" ? "h-10 w-10 rounded-2xl" : size === "sm" ? "h-7 w-7 rounded-lg" : "h-8.5 w-8.5 rounded-xl";
  const text = size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <Link href={href} className="group flex items-center gap-2.5">
      <span className="relative inline-flex">
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.22, 1], opacity: [0.5, 0.14, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/60 to-violet-500/60 blur-[7px]"
        />
        <span
          className={cx(
            "relative inline-flex items-center justify-center bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-inset ring-white/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            box
          )}
        >
          <Compass className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2.3} />
        </span>
      </span>
      <span className={cx("font-semibold tracking-tight", text)}>
        EduPath
        <span className="bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent"> AI</span>
      </span>
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cx("h-5 w-5 animate-spin", className)} />;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      {icon}
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 max-w-sm text-[13px] text-foreground/55">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
      <span className="h-px w-6 bg-border" />
      {children}
    </div>
  );
}