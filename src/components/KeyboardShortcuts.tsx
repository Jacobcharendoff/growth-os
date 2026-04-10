'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { X } from 'lucide-react';

type Shortcut = {
  keys: string[];
  description: string;
  action?: () => void;
  section: 'Navigation' | 'Actions' | 'General';
};

export function KeyboardShortcuts() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gKeyPressedRef = useRef(false);
  const gTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = theme === 'dark';

  const shortcuts: Shortcut[] = [
    {
      keys: ['⌘K', 'Ctrl+K'],
      description: 'Search',
      section: 'General',
    },
    {
      keys: ['?'],
      description: 'Show keyboard shortcuts',
      section: 'General',
    },
    {
      keys: ['Esc'],
      description: 'Close modal',
      section: 'General',
    },
    {
      keys: ['N'],
      description: 'New contact',
      section: 'Actions',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-quick-add'));
        setIsOpen(false);
      },
    },
    {
      keys: ['G', 'D'],
      description: 'Go to Dashboard',
      section: 'Navigation',
      action: () => {
        router.push('/dashboard');
        setIsOpen(false);
      },
    },
    {
      keys: ['G', 'P'],
      description: 'Go to Pipeline',
      section: 'Navigation',
      action: () => {
        router.push('/pipeline');
        setIsOpen(false);
      },
    },
    {
      keys: ['G', 'C'],
      description: 'Go to Contacts',
      section: 'Navigation',
      action: () => {
        router.push('/contacts');
        setIsOpen(false);
      },
    },
    {
      keys: ['G', 'E'],
      description: 'Go to Estimates',
      section: 'Navigation',
      action: () => {
        router.push('/estimates');
        setIsOpen(false);
      },
    },
    {
      keys: ['G', 'I'],
      description: 'Go to Invoices',
      section: 'Navigation',
      action: () => {
        router.push('/invoices');
        setIsOpen(false);
      },
    },
    {
      keys: ['G', 'S'],
      description: 'Go to Settings',
      section: 'Navigation',
      action: () => {
        router.push('/settings');
        setIsOpen(false);
      },
    },
    {
      keys: ['G', 'R'],
      description: 'Go to Reports',
      section: 'Navigation',
      action: () => {
        router.push('/reports');
        setIsOpen(false);
      },
    },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true';

      // Question mark - open shortcuts modal
      if (e.key === '?' && !isTyping) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Esc - close modal
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      // Only handle other shortcuts if modal is not open and not typing
      if (isOpen || isTyping) {
        return;
      }

      // N - New contact
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-quick-add'));
        return;
      }

      // G-based navigation shortcuts
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        gKeyPressedRef.current = true;

        // Clear any existing timeout
        if (gTimeoutRef.current) {
          clearTimeout(gTimeoutRef.current);
        }

        // Set timeout to reset G key after 2 seconds
        gTimeoutRef.current = setTimeout(() => {
          gKeyPressedRef.current = false;
        }, 2000);
        return;
      }

      // If G was pressed, handle the second key
      if (gKeyPressedRef.current && !isTyping) {
        gKeyPressedRef.current = false;
        if (gTimeoutRef.current) {
          clearTimeout(gTimeoutRef.current);
        }

        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'p':
            e.preventDefault();
            router.push('/pipeline');
            break;
          case 'c':
            e.preventDefault();
            router.push('/contacts');
            break;
          case 'e':
            e.preventDefault();
            router.push('/estimates');
            break;
          case 'i':
            e.preventDefault();
            router.push('/invoices');
            break;
          case 's':
            e.preventDefault();
            router.push('/settings');
            break;
          case 'r':
            e.preventDefault();
            router.push('/reports');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimeoutRef.current) {
        clearTimeout(gTimeoutRef.current);
      }
    };
  }, [isOpen, router]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Group shortcuts by section
  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.section]) {
        acc[shortcut.section] = [];
      }
      acc[shortcut.section].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  const sectionOrder: ('Navigation' | 'Actions' | 'General')[] = ['Navigation', 'Actions', 'General'];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop blur */}
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${
              isDark ? 'bg-black/40' : 'bg-black/20'
            } backdrop-blur-sm`}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="absolute inset-x-0 top-0 pt-16 sm:pt-20 pointer-events-none flex justify-center px-4 sm:px-0">
            <div
              ref={containerRef}
              className={`pointer-events-auto w-full sm:max-w-2xl rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${
                isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'
              }`}
            >
              {/* Header */}
              <div
                className={`px-4 sm:px-6 py-4 border-b flex items-center justify-between ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark
                      ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                      : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div
                className={`max-h-[60vh] overflow-y-auto p-6 space-y-8 ${
                  isDark ? 'bg-slate-900' : 'bg-white'
                }`}
              >
                {sectionOrder.map((section) => (
                  groupedShortcuts[section] && (
                    <div key={section}>
                      <h3
                        className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {section}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {groupedShortcuts[section].map((shortcut, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                              shortcut.action
                                ? isDark
                                  ? 'hover:bg-slate-800'
                                  : 'hover:bg-slate-50'
                                : ''
                            }`}
                            onClick={() => {
                              if (shortcut.action) {
                                shortcut.action();
                              }
                            }}
                          >
                            {/* Key badges */}
                            <div className="flex flex-wrap gap-2">
                              {shortcut.keys.map((key, keyIdx) => (
                                <div key={keyIdx} className="flex items-center gap-1">
                                  <kbd
                                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border-2 transition-colors ${
                                      isDark
                                        ? 'border-slate-600 bg-slate-700 text-slate-100'
                                        : 'border-slate-300 bg-slate-100 text-slate-800'
                                    }`}
                                  >
                                    {key}
                                  </kbd>
                                  {keyIdx < shortcut.keys.length - 1 && (
                                    <span
                                      className={`text-xs mx-0.5 ${
                                        isDark ? 'text-slate-500' : 'text-slate-400'
                                      }`}
                                    >
                                      or
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Description */}
                            <p
                              className={`flex-1 text-sm font-medium ${
                                isDark ? 'text-slate-200' : 'text-slate-700'
                              }`}
                            >
                              {shortcut.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Footer */}
              <div
                className={`px-4 sm:px-6 py-4 border-t text-center text-xs ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                Press <kbd className={`px-2 py-1 rounded border text-xs font-semibold inline-block mx-1 ${
                  isDark
                    ? 'border-slate-600 bg-slate-700 text-slate-200'
                    : 'border-slate-300 bg-slate-100 text-slate-700'
                }`}>Esc</kbd> to close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
