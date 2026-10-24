import React from "react";

export function LoadingSkeleton({ className = "h-24 w-full" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/60 ${className}`}
    />
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-stone-200/80 dark:bg-stone-800/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-32" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LoadingSkeleton className="h-80 lg:col-span-2" />
        <LoadingSkeleton className="h-80" />
      </div>
    </div>
  );
}
