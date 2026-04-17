"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between pb-4 border-b border-white/5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex justify-between py-4 border-b border-white/5 last:border-0">
          <div className="flex gap-3">
             <Skeleton className="h-8 w-8 rounded-lg" />
             <Skeleton className="h-4 w-32 mt-2" />
          </div>
          <Skeleton className="h-4 w-24 mt-2" />
          <Skeleton className="h-4 w-20 mt-2" />
          <Skeleton className="h-4 w-16 mt-2" />
        </div>
      ))}
    </div>
  );
}
