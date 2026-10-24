import React from "react";

export type BadgeVariant =
  | "normal"
  | "warning"
  | "critical"
  | "info"
  | "default"
  | "outline"
  | "online"
  | "offline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  let colorStyles = "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300";

  if (variant === "normal" || variant === "online") {
    colorStyles = "bg-emerald-100/90 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60";
  } else if (variant === "warning") {
    colorStyles = "bg-amber-100/90 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60";
  } else if (variant === "critical" || variant === "offline") {
    colorStyles = "bg-rose-100/90 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60";
  } else if (variant === "info") {
    colorStyles = "bg-sky-100/90 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60";
  } else if (variant === "outline") {
    colorStyles = "border border-stone-300 text-stone-700 dark:border-stone-700 dark:text-stone-300 bg-transparent";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium capitalize tracking-tight ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
}
