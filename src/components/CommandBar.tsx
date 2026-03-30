'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import {
  Search,
  User,
  Briefcase,
  FileText,
  Receipt,
  ArrowRight,
  Command,
} from 'lucide-react';

type SearchResult = {
  id: string;
  type: 'contact' | 'deal' | 'estimate' | 'invoice';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path: string;
};

export function CommandBar() {
  const router = useRouter();
  const { contacts, deals, estimates, invoices } = useStore();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

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

  // Search logic
  const searchResults = useCallback(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search contacts (limit 5)
    const contactMatches = contacts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.email.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        type: 'contact' as const,
        title: c.name,
        subtitle: c.email,
        icon: <User className="w-4 h-4" />,
        path: `/contacts/${c.id}`,
      }));

    // Search deals (limit 5)
    const dealMatches = deals
      .filter(
        (d) =>
          d.title.toLowerCase().includes(lowerQuery) ||
          contacts.find((c) => c.id === d.contactId)?.name.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        type: 'deal' as const,
        title: d.title,
        subtitle: `$${d.value.toLocaleString()}`,
        icon: <Briefcase className="w-4 h-4" />,
        path: `/deals/${d.id}`,
      }));

    // Search estimates (limit 5)
    const estimateMatches = estimates
      .filter(
        (e) =>
          e.number.toLowerCase().includes(lowerQuery) ||
          e.customerName.toLowerCase().includes(lowerQuery) ||
          e.service.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        type: 'estimate' as const,
        title: e.number,
        subtitle: `${e.customerName} - ${e.status}`,
        icon: <FileText className="w-4 h-4" />,
        path: `/estimates/${e.id}`,
      }));

    // Search invoices (limit 5)
    const invoiceMatches = invoices
      .filter(
        (i) =>
          i.number.toLowerCase().includes(lowerQuery) ||
          i.customerName.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map((i) => ({
        id: i.id,
        type: 'invoice' as const,
        title: i.number,
        subtitle: `${i.customerName} - $${i.total.toLocaleString()}`,
        icon: <Receipt className="w-4 h-4" />,
        path: `/invoices/${i.id}`,
      }));

    allResults.push(...contactMatches, ...dealMatches, ...estimateMatches, ...invoiceMatches);
    return allResults;
  }, [query, contacts, deals, estimates, invoices]);

  useEffect(() => {
    const newResults = searchResults();
    setResults(newResults);
    setSelectedIndex(0);
  }, [query, searchResults]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(results.length, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    router.push(result.path);
  };

  const groupedResults = {
    contacts: results.filter((r) => r.type === 'contact'),
    deals: results.filter((r) => r.type === 'deal'),
    estimates: results.filter((r) => r.type === 'estimate'),
    invoices: results.filter((r) => r.type === 'invoice'),
  };

  const groupLabels: Record<string, string> = {
    contacts: 'Contacts',
    deals: 'Deals',
    estimates: 'Estimates',
    invoices: 'Invoices',
  };

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
          <div className="absolute inset-x-0 top-0 pt-16 sm:pt-20 pointer-events-none flex justify-center px-2 sm:px-0">
            <div
              ref={containerRef}
              className={`pointer-events-auto w-full sm:max-w-xl rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${
                isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'
              }`}
            >
              {/* Search input */}
              <div
                className={`p-4 border-b ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Search
                    className={`w-5 h-5 flex-shrink-0 ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search contacts, deals, invoices..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 bg-transparent outline-none text-sm placeholder-slate-500 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                      isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    ESC
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className={`max-h-96 overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                {results.length === 0 && query ? (
                  <div
                    className={`p-8 text-center ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No results found for "{query}"</p>
                  </div>
                ) : results.length === 0 ? (
                  <div
                    className={`p-8 text-center ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start typing to search...</p>
                  </div>
                ) : (
                  Object.entries(groupedResults).map(([groupKey, groupItems]) =>
                    groupItems.length > 0 ? (
                      <div key={groupKey}>
                        <div
                          className={`px-3 py-2 text-xs font-semibold ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          } uppercase tracking-wider`}
                        >
                          {groupLabels[groupKey]}
                        </div>
                        {groupItems.map((result) => {
                          const globalIndex = results.indexOf(result);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={result.id}
                              onClick={() => handleSelect(result)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full px-3 py-3 flex items-center gap-3 transition-colors text-left ${
                                isSelected
                                  ? isDark
                                    ? 'bg-slate-700'
                                    : 'bg-slate-100'
                                  : isDark
                                    ? 'hover:bg-slate-800'
                                    : 'hover:bg-slate-50'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  result.type === 'contact'
                                    ? isDark
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-blue-100 text-blue-600'
                                    : result.type === 'deal'
                                      ? isDark
                                        ? 'bg-emerald-900/30 text-emerald-400'
                                        : 'bg-emerald-100 text-emerald-600'
                                      : result.type === 'estimate'
                                        ? isDark
                                          ? 'bg-amber-900/30 text-amber-400'
                                          : 'bg-amber-100 text-amber-600'
                                        : isDark
                                          ? 'bg-purple-900/30 text-purple-400'
                                          : 'bg-purple-100 text-purple-600'
                                }`}
                              >
                                {result.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium truncate ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                  }`}
                                >
                                  {result.title}
                                </p>
                                <p
                                  className={`text-xs truncate ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                  }`}
                                >
                                  {result.subtitle}
                                </p>
                              </div>
                              <ArrowRight
                                className={`w-4 h-4 flex-shrink-0 transition-opacity ${
                                  isSelected
                                    ? isDark
                                      ? 'opacity-100 text-slate-300'
                                      : 'opacity-100 text-slate-600'
                                    : 'opacity-0'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    ) : null
                  )
                )}
              </div>

              {/* Footer - keyboard hints */}
              {results.length > 0 && (
                <div
                  className={`hidden sm:flex px-4 py-3 text-xs border-t items-center justify-between ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span>
                      <kbd
                        className={`px-2 py-1 rounded border text-xs ${
                          isDark
                            ? 'border-slate-600 bg-slate-700 text-slate-300'
                            : 'border-slate-300 bg-slate-100 text-slate-600'
                        }`}
                      >
                        ↑↓
                      </kbd>
                      <span className="ml-1">Navigate</span>
                    </span>
                    <span>
                      <kbd
                        className={`px-2 py-1 rounded border text-xs ${
                          isDark
                            ? 'border-slate-600 bg-slate-700 text-slate-300'
                            : 'border-slate-300 bg-slate-100 text-slate-600'
                        }`}
                      >
                        ↵
                      </kbd>
                      <span className="ml-1">Select</span>
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trigger button - typically placed in header */}
      <button
        onClick={() => setIsOpen(true)}
        className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
        }`}
        title="Press ⌘K or Ctrl+K"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search</span>
        <span className={`hidden md:inline ml-auto text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <Command className="w-3 h-3 inline mr-1" />K
        </span>
      </button>
    </>
  );
}
