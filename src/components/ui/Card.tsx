import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-stone-800/80 dark:bg-stone-900/90 dark:text-stone-100 ${className}`}
      {...props}
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
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 border-b border-stone-100 pb-3 dark:border-stone-800">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-agri-50 text-agri-700 dark:bg-agri-950/60 dark:text-agri-300">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-stone-900 truncate dark:text-stone-50">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-stone-500 truncate dark:text-stone-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
