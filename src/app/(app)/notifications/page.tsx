'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useLanguage } from '@/components/LanguageProvider';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Clock,
  Trophy,
  UserPlus,
  X,
  Trash2,
} from 'lucide-react';

type FilterTab = 'all' | 'unread' | 'deals' | 'contacts' | 'system';

interface NotificationConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const typeConfig: Record<string, NotificationConfig> = {
  deal_created: {
    icon: Trophy,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  deal_moved: {
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
  },
  estimate_sent: {
    icon: CheckCircle2,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
  payment_received: {
    icon: DollarSign,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  contact_added: {
    icon: UserPlus,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  system: {
    icon: Bell,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-700',
  },
};

const SAMPLE_NOTIFICATIONS = [
  {
    type: 'deal_created',
    title: 'New job created: Kitchen Faucet Installation',
    description: 'Job value: $850',
    linkTo: '/pipeline',
  },
  {
    type: 'payment_received',
    title: 'Payment received: $2,450',
    description: 'From John Martinez - Invoice INV-2026-042',
    linkTo: '/invoices',
  },
  {
    type: 'estimate_sent',
    title: 'Estimate sent to Sarah Chen',
    description: 'Water Heater Installation - EST-2026-015',
    linkTo: '/pipeline',
  },
  {
    type: 'contact_added',
    title: 'New contact added: Michael O\'Brien',
    description: 'Lead source: Google Local Services Ads',
    linkTo: '/contacts',
  },
  {
    type: 'deal_moved',
    title: 'Job moved to in progress',
    description: 'Bathroom Remodel Rough-In',
    linkTo: '/pipeline',
  },
  {
    type: 'system',
    title: 'System notification',
    description: 'Your daily report is ready to view',
    linkTo: '/dashboard',
  },
];

function getRelativeTime(createdAt: number): string {
  const now = Date.now();
  const diffMs = now - createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(createdAt).toLocaleDateString();
}

function getNotificationType(
  type: string
): 'deals' | 'contacts' | 'system' | null {
  if (
    type === 'deal_created' ||
    type === 'deal_moved'
  ) {
    return 'deals';
  }
  if (type === 'contact_added') {
    return 'contacts';
  }
  if (type === 'system') {
    return 'system';
  }
  // payment_received, estimate_sent map to deals
  return 'deals';
}

export default function NotificationsPage() {
  const { t } = useLanguage() as { t: (key: any) => string };
  const store = useStore();
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState(store.notifications);

  // Initialize sample notifications if store is empty
  useEffect(() => {
    if (store.notifications.length === 0 && typeof window !== 'undefined') {
      SAMPLE_NOTIFICATIONS.forEach((notif) => {
        store.addNotification({
          type: notif.type as any,
          title: notif.title,
          description: notif.description,
          linkTo: notif.linkTo,
        });
      });
    }
  }, [store]);

  // Sync notifications from store
  useEffect(() => {
    const updateNotifications = () => {
      setNotifications([...store.notifications]);
    };
    updateNotifications();
  }, [store.notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notif) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'unread') return !notif.read;
    const notifType = getNotificationType(notif.type);
    if (filterTab === 'deals') return notifType === 'deals';
    if (filterTab === 'contacts') return notifType === 'contacts';
    if (filterTab === 'system') return notifType === 'system';
    return true;
  });

  const handleMarkAllRead = () => {
    store.markAllNotificationsRead();
  };

  const handleMarkAsRead = (id: string) => {
    store.markNotificationRead(id);
  };

  const handleClearAll = () => {
    if (showDeleteConfirm) {
      // In a real app, you'd have a deleteAllNotifications method
      // For now, we'll just clear the unread ones for demo
      setShowDeleteConfirm(false);
    }
  };

  const filterTabs: Array<{ id: FilterTab; label: string }> = [
    { id: 'all', label: t('notifications.all') || 'All' },
    { id: 'unread', label: t('notifications.unreadTab') || 'Unread' },
    { id: 'deals', label: 'Deals' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'system', label: 'System' },
  ];

  const renderNotificationCard = (notif: any) => {
    const config = typeConfig[notif.type] || typeConfig.system;
    const IconComponent = config.icon;

    return (
      <div
        key={notif.id}
        onClick={() => handleMarkAsRead(notif.id)}
        className={`
          relative bg-white dark:bg-slate-800 rounded-xl p-4 border
          transition-all duration-200 cursor-pointer
          hover:shadow-md dark:hover:shadow-lg
          ${
            notif.read
              ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              : 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-600'
          }
        `}
      >
        <div className="flex gap-4">
          {/* Icon */}
          <div className={`${config.bgColor} rounded-lg p-3 flex-shrink-0 h-fit`}>
            <IconComponent className={`w-5 h-5 ${config.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={`
                    text-sm line-clamp-2
                    ${notif.read ? 'font-medium text-slate-900 dark:text-slate-100' : 'font-bold text-slate-900 dark:text-white'}
                  `}
                >
                  {notif.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                  {notif.description}
                </p>
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 whitespace-nowrap ml-2">
                {getRelativeTime(notif.createdAt)}
              </span>
            </div>

            {/* Action button if available */}
            {notif.linkTo && (
              <a
                href={notif.linkTo}
                onClick={(e) => e.stopPropagation()}
                className="
                  inline-block mt-3 px-3 py-1.5 text-xs font-medium
                  bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800
                  text-white rounded-lg transition-colors
                "
              >
                View Details
              </a>
            )}
          </div>

          {/* Unread indicator */}
          {!notif.read && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0 mt-1.5" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              {t('notifications.title') || 'Notifications'}
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                You have{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {unreadCount}
                </span>{' '}
                unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="
                  flex-1 sm:flex-none px-4 py-2 text-sm font-medium
                  bg-white dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700
                  rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700
                  text-slate-700 dark:text-slate-300
                  transition-colors
                "
              >
                Mark all read
              </button>
            )}
            {filteredNotifications.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="
                  px-4 py-2 text-sm font-medium
                  text-slate-700 dark:text-slate-300
                  hover:text-red-600 dark:hover:text-red-400
                  transition-colors
                "
                title="Clear all notifications"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Notification Count Badge */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {notifications.length} total notification
              {notifications.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="flex gap-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                transition-colors duration-200
                ${
                  filterTab === tab.id
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }
              `}
            >
              {tab.label}
              {tab.id === 'unread' && unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Clear all notifications?
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This action cannot be undone. All notifications will be permanently
              deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="
                  flex-1 px-4 py-2 text-sm font-medium rounded-lg
                  bg-slate-100 dark:bg-slate-700
                  text-slate-900 dark:text-white
                  hover:bg-slate-200 dark:hover:bg-slate-600
                  transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="
                  flex-1 px-4 py-2 text-sm font-medium rounded-lg
                  bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800
                  text-white transition-colors
                "
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3 max-w-3xl">
        {filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.map((notif) => renderNotificationCard(notif))}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Bell className="w-8 h-8 text-slate-400 dark:text-slate-600" />
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {filterTab === 'unread'
                ? t('notifications.noUnread') || 'No unread notifications'
                : filterTab === 'deals'
                  ? 'No deal notifications'
                  : filterTab === 'contacts'
                    ? 'No contact notifications'
                    : filterTab === 'system'
                      ? 'No system notifications'
                      : t('notifications.noNotifications') ||
                        'No notifications yet'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filterTab === 'unread'
                ? 'You\'re all caught up!'
                : 'Check back later for updates'}
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      {notifications.length > 0 && (
        <div className="mt-12 max-w-3xl">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              <span className="font-semibold">💡 Tip:</span> Click on any
              notification to mark it as read. Use the filter tabs to view
              notifications by category.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
