import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 p-8 text-center dark:border-stone-700">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
        {title}
      </h4>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-xl bg-agri-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-agri-800 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
