'use client';

import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  description?: string;
  dismiss?: () => void;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, description?: string) => string;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, description) => {
    const id = Math.random().toString(36).substring(2, 11);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, description }],
    }));

    // Auto-dismiss after 3500ms
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3500);

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export const useToast = () => {
  const store = useToastStore();

  return {
    toast: {
      success: (message: string, description?: string) =>
        store.addToast(message, 'success', description),
      error: (message: string, description?: string) =>
        store.addToast(message, 'error', description),
      info: (message: string, description?: string) =>
        store.addToast(message, 'info', description),
      warning: (message: string, description?: string) =>
        store.addToast(message, 'warning', description),
    },
  };
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  isDark: boolean;
}

function ToastItem({ toast, onDismiss, isDark }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const colorMap = {
    success: {
      bg: isDark ? 'bg-emerald-900/40 border-emerald-700' : 'bg-emerald-50 border-emerald-200',
      text: isDark ? 'text-emerald-200' : 'text-emerald-800',
      icon: 'text-emerald-500',
    },
    error: {
      bg: isDark ? 'bg-red-900/40 border-red-700' : 'bg-red-50 border-red-200',
      text: isDark ? 'text-red-200' : 'text-red-800',
      icon: 'text-red-500',
    },
    info: {
      bg: isDark ? 'bg-blue-900/40 border-blue-700' : 'bg-blue-50 border-blue-200',
      text: isDark ? 'text-blue-200' : 'text-blue-800',
      icon: 'text-blue-500',
    },
    warning: {
      bg: isDark ? 'bg-amber-900/40 border-amber-700' : 'bg-amber-50 border-amber-200',
      text: isDark ? 'text-amber-200' : 'text-amber-800',
      icon: 'text-amber-500',
    },
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = colorMap[toast.type];
  const Icon = icons[toast.type];

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  };

  return (
    <div
      className={`transform transition-all duration-300 ${
        isExiting
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100'
      }`}
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border ${colors.bg} backdrop-blur-sm shadow-lg max-w-sm`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${colors.text}`}>{toast.message}</p>
          {toast.description && (
            <p className={`text-xs mt-1 opacity-75 ${colors.text}`}>{toast.description}</p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors duration-200 ${
            isDark
              ? 'hover:bg-white/10 text-slate-400 hover:text-slate-200'
              : 'hover:bg-black/5 text-gray-400 hover:text-gray-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [isDark, setIsDark] = useState(false);
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Also watch for theme provider changes
  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement;
      setIsDark(html.classList.contains('dark'));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={removeToast} isDark={isDark} />
        </div>
      ))}
    </div>
  );
}
