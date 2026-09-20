import { clsx } from "clsx";

export function EduMark({
  size = "md",
  className,
  tile = true,
  alt = "EduPath mark",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  tile?: boolean;
  alt?: string;
}) {
  const box =
    size === "lg"
      ? "h-10 w-10 rounded-2xl"
      : size === "sm"
        ? "h-7 w-7 rounded-lg"
        : "h-8.5 w-8.5 rounded-xl";
  return (
    <svg
      role="img"
      aria-label={alt}
      viewBox="0 0 48 48"
      className={clsx("h-7 w-7", box, className)}
      fill="none"
    >
      <defs>
        <linearGradient
          id="edupath-g"
          x1="6"
          y1="42"
          x2="42"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {tile ? <rect width="48" height="48" rx="12" fill="url(#edupath-g)" /> : null}
      <g>
        <path
          d="M 13.5 33.5 L 24 22.5 L 34.5 12.5"
          stroke="#ffffff"
          strokeWidth={tile ? 3 : 3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={tile ? 0.65 : 0.55}
        />
        <circle cx="13.5" cy="33.5" r="4.25" fill="#ffffff" />
        <circle cx="24" cy="22.5" r="5.5" fill="#ffffff" />
        <circle cx="34.5" cy="12.5" r="6.75" fill="none" stroke="#ffffff" strokeWidth="2.25" />
        <circle cx="34.5" cy="12.5" r="2.5" fill="#ffffff" />
      </g>
    </svg>
  );
}