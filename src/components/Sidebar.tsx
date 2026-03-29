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
  Globe,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  const isDark = theme === 'dark';

  const navItems = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/pipeline', label: t('nav.pipeline'), icon: Kanban },
    { href: '/schedule', label: t('nav.schedule'), icon: Calendar },
    { href: '/contacts', label: t('nav.contacts'), icon: Users },
    { href: '/estimates', label: t('nav.estimates'), icon: FileText },
    { href: '/invoices', label: t('nav.invoices'), icon: Receipt },
    { href: '/automations', label: t('nav.autopilot'), icon: Zap },
    { href: '/messages', label: t('nav.messages'), icon: MessageSquare },
    { href: '/notifications', label: t('nav.notifications'), icon: Bell },
    { href: '/activity', label: t('nav.activity'), icon: ActivitySquare },
  ];

  const settingsItem = { href: '/settings', label: t('nav.settings'), icon: Settings };

  // Theme-aware color classes
  const sidebarBg = 'bg-white dark:bg-slate-900';
  const sidebarBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const brandText = isDark ? 'text-white' : 'text-gray-900';
  const brandAccent = isDark ? 'text-blue-400' : 'text-blue-600';
  const brandTm = isDark ? 'text-blue-300' : 'text-blue-500';
  const navText = isDark ? 'text-slate-300' : 'text-gray-600';
  const navHover = isDark ? 'hover:bg-slate-700/50 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900';
  const sectionBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const badgeBg = isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600';
  const footerText = isDark ? 'text-slate-500' : 'text-gray-400';
  const mobileCloseBtn = isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-900';
  const progressBg = isDark ? 'bg-slate-700/50' : 'bg-gray-200';

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className={`px-6 py-6 border-b ${sectionBorder} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Zap className={`w-7 h-7 ${brandAccent}`} />
          <div className="flex flex-col">
            <span className={`font-bold text-lg tracking-tight ${brandText}`}>
              Growth OS
            </span>
            <span className={`text-xs font-medium ${brandTm}`}>™</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className={`lg:hidden p-1 ${mobileCloseBtn}`}>
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
              : isDark
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100 border border-blue-200'
          }`}
        >
          <Rocket className="w-5 h-5" />
          <div className="flex-1">
            <span className="font-semibold text-sm">{t('nav.getStarted')}</span>
            <div className={`w-full ${progressBg} rounded-full h-1.5 mt-1.5`}>
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
              : isDark
                ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-purple-300 hover:from-blue-500/20 hover:to-purple-500/20 border border-purple-500/20'
                : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 text-purple-700 hover:from-blue-100 hover:to-purple-100 border border-purple-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <div className="flex-1">
            <span className="font-semibold text-sm">{t('nav.growthAdvisor')}</span>
            <p className={`text-[11px] mt-0.5 ${pathname === '/advisor' ? 'text-purple-100' : isDark ? 'text-purple-400' : 'text-purple-500'}`}>{t('nav.aiBusinessPartner')}</p>
          </div>
          <div className={`w-2 h-2 rounded-full ${pathname === '/advisor' ? 'bg-emerald-300' : 'bg-emerald-500'} animate-pulse`} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : `${navText} ${navHover}`
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Section - Bottom */}
      <div className={`px-4 py-4 border-t ${sectionBorder} space-y-3`}>
        {/* Language Toggle — Switch style */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2.5">
            <Globe className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              {t('nav.language') || 'Language'}
            </span>
          </div>
          <button
            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
            className={`relative inline-flex items-center h-8 rounded-full px-1 transition-colors ${
              isDark ? 'bg-slate-700' : 'bg-gray-200'
            }`}
            aria-label="Toggle language"
          >
            <span className={`inline-flex items-center justify-center h-6 px-2.5 rounded-full text-xs font-bold transition-all ${
              locale === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDark ? 'text-slate-400' : 'text-gray-500'
            }`}>
              EN
            </span>
            <span className={`inline-flex items-center justify-center h-6 px-2.5 rounded-full text-xs font-bold transition-all ${
              locale === 'fr'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDark ? 'text-slate-400' : 'text-gray-500'
            }`}>
              FR
            </span>
          </button>
        </div>

        {/* Dark Mode Toggle — Switch style */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2.5">
            {isDark ? (
              <Moon className="w-4 h-4 text-slate-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              {isDark ? t('nav.darkMode') : t('nav.lightMode')}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              isDark ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Settings Link */}
        {(() => {
          const Icon = settingsItem.icon;
          const isActive = pathname === settingsItem.href;

          return (
            <Link
              href={settingsItem.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : `${navText} ${navHover}`
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{settingsItem.label}</span>
            </Link>
          );
        })()}
      </div>

      {/* Footer */}
      <div className={`px-6 py-4 border-t ${sectionBorder} text-center`}>
        <p className={`text-xs ${footerText}`}>v2.3.0 Beta</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex w-64 ${sidebarBg} border-r ${sidebarBorder} flex-col h-full shrink-0 transition-colors duration-200`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 ${sidebarBg} border-r ${sidebarBorder} flex flex-col animate-[slideIn_0.2s_ease-out] transition-colors duration-200`}>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
