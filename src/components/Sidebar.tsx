'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Users,
  FileText,
  Receipt,
  ActivitySquare,
  Settings,
  Zap,
  MessageSquare,
  Bell,
  Rocket,
  Sparkles,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/pipeline', label: 'Pipeline', icon: Kanban },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/contacts', label: 'Contacts', icon: Users },
    { href: '/estimates', label: 'Estimates', icon: FileText },
    { href: '/invoices', label: 'Invoices', icon: Receipt },
    { href: '/automations', label: 'Autopilot', icon: Zap },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/activity', label: 'Activity', icon: ActivitySquare },
  ];

  const settingsItem = { href: '/settings', label: 'Settings', icon: Settings };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-7 h-7 text-blue-400" />
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg tracking-tight">
              Growth OS
            </span>
            <span className="text-xs text-blue-300 font-medium">™</span>
          </div>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Get Started Banner */}
      <div className="px-4 pt-4">
        <Link
          href="/setup"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            pathname === '/setup'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30'
          }`}
        >
          <Rocket className="w-5 h-5" />
          <div className="flex-1">
            <span className="font-semibold text-sm">Get Started</span>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1.5">
              <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </Link>
      </div>

      {/* Growth Advisor */}
      <div className="px-4 pt-3">
        <Link
          href="/advisor"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            pathname === '/advisor'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-purple-300 hover:from-blue-500/20 hover:to-purple-500/20 border border-purple-500/20'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <div className="flex-1">
            <span className="font-semibold text-sm">Growth Advisor</span>
            <p className={`text-[11px] mt-0.5 ${pathname === '/advisor' ? 'text-purple-100' : 'text-purple-400'}`}>AI Business Partner</p>
          </div>
          <div className={`w-2 h-2 rounded-full ${pathname === '/advisor' ? 'bg-emerald-300' : 'bg-emerald-500'} animate-pulse`} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Section - Bottom */}
      <div className="px-4 py-4 border-t border-slate-700 space-y-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-300 hover:bg-slate-700/50 hover:text-white"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              <span className="font-medium text-sm">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              <span className="font-medium text-sm">Light Mode</span>
            </>
          )}
        </button>

        {/* Settings Link */}
        {(() => {
          const Icon = settingsItem.icon;
          const isActive = pathname === settingsItem.href;

          return (
            <Link
              href={settingsItem.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{settingsItem.label}</span>
            </Link>
          );
        })()}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700 text-center">
        <p className="text-xs text-slate-500">v2.3.0 Beta</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 flex-col h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — slide-out drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 flex flex-col animate-[slideIn_0.2s_ease-out]">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
