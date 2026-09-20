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
import { Loader2 } from "lucide-react";
import { EduMark } from "@/components/brand";

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
    "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-hover shadow-sm shadow-indigo-600/20 border border-transparent",
  secondary: "bg-accent-soft text-accent hover:bg-accent/15 border border-transparent",
  outline: "border border-border bg-card hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground/80 hover:text-foreground",
  subtle: "bg-muted text-foreground hover:bg-border border border-transparent",
  danger: "bg-danger text-white hover:brightness-110 border border-transparent",
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
          "active:scale-[0.985] active:shadow-none",
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
      className={cx("card-surface rounded-2xl", className)}
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
  icon,
  className,
}: {
  children: ReactNode;
  tone?: "zinc" | "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet";
  icon?: ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    zinc: "bg-muted text-foreground/70",
    indigo: "bg-accent-soft text-accent",
    emerald: "bg-success-soft text-success",
    amber: "bg-warning-soft text-warning",
    rose: "bg-danger-soft text-danger",
    sky: "bg-info-soft text-info",
    violet: "bg-violet-soft text-violet",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {icon ? <span className="shrink-0 [&>svg]:h-3 [&>svg]:w-3">{icon}</span> : null}
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
                ? "bg-warning"
                : level <= 3
                  ? "bg-accent"
                  : "bg-success"
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
    accent: "bg-accent",
    emerald: "bg-success",
    rose: "bg-danger",
    amber: "bg-warning",
    sky: "bg-info",
  };
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cx("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
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
  const mark = size === "lg" ? "lg" : size === "sm" ? "sm" : "md";
  const text = size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <Link href={href} className="group flex items-center gap-2.5">
      <span className="relative inline-flex">
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.2, 1], opacity: [0.55, 0.18, 0.55] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/60 to-violet-500/60 blur-md"
        />
        <EduMark
          size={mark}
          className="shadow-lg shadow-indigo-600/25 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110"
        />
      </span>
      <span className={cx("font-semibold tracking-tight", text)}>
        EduPath
        <span className="bg-gradient-to-r from-accent to-violet-500 bg-clip-text text-transparent">
          {" "}
          AI
        </span>
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