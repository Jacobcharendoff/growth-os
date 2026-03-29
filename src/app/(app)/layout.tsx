'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { Menu, Zap } from 'lucide-react';

function AppContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <header className={`lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30 transition-colors duration-200 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 -ml-2 rounded-lg ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2C3E50] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Growth<span className={isDark ? 'text-emerald-400' : 'text-[#27AE60]'}>OS</span></span>
            </div>
            <div className="w-9" />
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
  );
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  );
}
