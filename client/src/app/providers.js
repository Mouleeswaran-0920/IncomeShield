"use client";

import { RealTimeProvider } from "@/context/RealTimeContext";
import { ToastProvider } from "@/context/ToastContext";

export function Providers({ children }) {
  return (
    <RealTimeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </RealTimeProvider>
  );
}
