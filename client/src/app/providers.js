import { RealTimeProvider } from "@/context/RealTimeContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <RealTimeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </RealTimeProvider>
    </ThemeProvider>
  );
}
