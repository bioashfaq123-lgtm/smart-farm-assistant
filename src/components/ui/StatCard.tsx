import React from "react";
import { Badge, BadgeVariant } from "./Badge";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  normalRange?: string;
  statusBadge?: {
    label: string;
    variant: BadgeVariant;
  };
  icon?: React.ReactNode;
  trendText?: string;
  trendPositive?: boolean;
  demoData?: boolean;
}

export function StatCard({
  title,
  value,
  unit,
  normalRange,
  statusBadge,
  icon,
  trendText,
  trendPositive,
  demoData = true,
}: StatCardProps) {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition-all hover:border-agri-400 hover:shadow-md dark:border-stone-800/80 dark:bg-stone-900/90">
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
          {title}
        </span>
        {icon && (
          <span className="text-stone-400 dark:text-stone-500">
            {icon}
          </span>
        )}
      </div>

      {/* Middle row: Big metric & Status badge */}
      <div className="my-3 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">
              {unit}
            </span>
          )}
        </div>
        {statusBadge && (
          <Badge variant={statusBadge.variant}>
            {statusBadge.label}
          </Badge>
        )}
      </div>

      {/* Bottom row: Normal Range or Trend info */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        {normalRange ? (
          <span>Range: {normalRange}</span>
        ) : trendText ? (
          <span
            className={`font-medium ${
              trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {trendText}
          </span>
        ) : (
          <span />
        )}

        {demoData && (
          <span
            title="Sample reading for preview"
            className="text-[10px] font-medium text-amber-600/80 dark:text-amber-400/80"
          >
            • Demo Data
          </span>
        )}
      </div>
    </div>
  );
}
