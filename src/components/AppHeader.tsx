'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import type { useAuth } from '@/components/AuthProvider';

interface AuthContextType {
  user: { email?: string; user_metadata?: { name?: string } } | null;
  session: { user?: { email?: string; user_metadata?: { name?: string } } } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

function AppHeader() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { getUnreadCount, settings } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authContext, setAuthContext] = useState<AuthContextType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';
  const unreadCount = getUnreadCount();

  // Try to get auth context
  useEffect(() => {
    try {
      // Dynamic import to avoid breaking if AuthProvider isn't available
      const getAuth = async () => {
        try {
          const { useAuth } = await import('@/components/AuthProvider');
          const auth = useAuth?.() as AuthContextType | undefined;
          if (auth) {
            setAuthContext(auth);
          }
        } catch {
          // AuthProvider not available, use null auth
        }
      };
      getAuth();
    } catch {
      // Silent fail - auth is optional
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get page title from pathname
  const getPageTitle = (): string => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/pipeline': 'Pipeline',
      '/schedule': 'Schedule',
      '/contacts': 'Contacts',
      '/estimates': 'Estimates',
      '/invoices': 'Invoices',
      '/automations': 'Automations',
      '/messages': 'Messages',
      '/notifications': 'Notifications',
      '/activity': 'Activity',
      '/settings': 'Settings',
      '/advisor': 'Growth Advisor',
      '/setup': 'Setup',
    };

    return pathMap[pathname] || 'Dashboard';
  };

  // Get user display name
  const getUserDisplayName = (): string => {
    if (authContext?.user?.user_metadata?.name) {
      return authContext.user.user_metadata.name;
    }
    if (authContext?.session?.user?.user_metadata?.name) {
      return authContext.session.user.user_metadata.name;
    }
    return settings?.companyName || 'User';
  };

  // Get user email
  const getUserEmail = (): string => {
    if (authContext?.user?.email) {
      return authContext.user.email;
    }
    if (authContext?.session?.user?.email) {
      return authContext.session.user.email;
    }
    return settings?.companyEmail || 'user@example.com';
  };

  // Get user initials for avatar
  const getUserInitials = (): string => {
    const name = getUserDisplayName();
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Open command bar
  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-bar'));
  };

  // Open quick add modal
  const handleQuickAdd = () => {
    window.dispatchEvent(new CustomEvent('open-quick-add'));
  };

  // Handle sign out
  const handleSignOut = async () => {
    if (authContext?.signOut) {
      try {
        await authContext.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    setDropdownOpen(false);
  };

  return (
    <header
      className={`hidden lg:flex sticky top-0 z-40 h-14 lg:h-16 border-b transition-colors duration-200 items-center px-4 lg:px-6 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex-1 flex items-center gap-6">
        {/* Page Title */}
        <div className="hidden lg:block">
          <h1
            className={`text-lg font-semibold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {getPageTitle()}
          </h1>
        </div>

        {/* Search Bar */}
        <button
          onClick={handleSearchClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            isDark
              ? 'bg-slate-700 border-slate-600 hover:border-slate-500 text-slate-400'
              : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-500'
          } hover:${isDark ? 'bg-slate-600' : 'bg-slate-150'}`}
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search...</span>
          <span className="text-xs ml-auto">⌘K</span>
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:shadow-md ${
            isDark
              ? 'bg-[#27AE60] hover:bg-emerald-500 text-white'
              : 'bg-[#27AE60] hover:bg-emerald-500 text-white'
          }`}
          title="Quick add"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <button
          className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
            isDark
              ? 'hover:bg-slate-700 text-slate-300'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
              isDark
                ? 'hover:bg-slate-700'
                : 'hover:bg-slate-100'
            }`}
            title="User menu"
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${
                isDark
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                  : 'bg-gradient-to-br from-[#27AE60] to-[#229954] text-white'
              }`}
            >
              {getUserInitials()}
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              } ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border transition-all duration-200 ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* User Info */}
              <div
                className={`px-4 py-3 border-b ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {getUserDisplayName()}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {getUserEmail()}
                </p>
              </div>

              {/* Sign Out Option */}
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
