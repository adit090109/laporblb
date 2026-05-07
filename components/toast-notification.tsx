"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({ message, onClose, duration = 2000 }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-success text-success-foreground shadow-lg shadow-success/20 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <CheckCircle2 className="w-4 h-4" />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-1 p-0.5 rounded-full hover:bg-success-foreground/20 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
