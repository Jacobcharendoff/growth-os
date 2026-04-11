'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import { useLanguage } from '@/components/LanguageProvider';
import { Activity as ActivityType } from '@/types';
import type { TranslationKey } from '@/i18n/translations';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  Zap,
  DollarSign,
  Search,
  Plus,
  Inbox,
  ChevronDown,
} from 'lucide-react';

type ActivityTypeFilter = 'all' | 'calls_meetings' | 'notes_records';
type DateRangeFilter = 'today' | 'week' | 'month' | 'all';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  call: <Phone className="w-5 h-5 text-blue-500" />,
  email: <Mail className="w-5 h-5 text-purple-500" />,
  meeting: <Calendar className="w-5 h-5 text-amber-500" />,
  note: <FileText className="w-5 h-5 text-slate-500" />,
  estimate: <Zap className="w-5 h-5 text-yellow-500" />,
  payment: <DollarSign className="w-5 h-5 text-emerald-500" />,
};

const ACTIVITY_TYPE_LABELS: Record<ActivityTypeFilter, string> = {
  all: 'All',
  calls_meetings: 'Calls & Meetings',
  notes_records: 'Notes & Records',
};

interface GroupedActivity {
  date: Date;
  dateLabel: string;
  activities: ActivityType[];
}

function getDateLabel(date: Date, today: Date): string {
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterday = new Date(todayOnly);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function ActivityPage() {
  const { activities, deals, contacts, initializeSeedData } = useStore();
  const { t } = useLanguage() as { t: (key: TranslationKey) => string };
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<ActivityTypeFilter>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  const getContactById = (contactId?: string) => {
    if (!contactId) return null;
    return contacts.find((c) => c.id === contactId);
  };

  const getDealById = (dealId?: string) => {
    if (!dealId) return null;
    return deals.find((d) => d.id === dealId);
  };

  const now = new Date();
  const filterStartDate = useMemo(() => {
    const start = new Date(now);
    switch (selectedDateRange) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;
      case 'all':
        start.setFullYear(1970);
        break;
    }
    return start.getTime();
  }, [selectedDateRange]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (selectedType === 'calls_meetings') {
        if (activity.type !== 'call' && activity.type !== 'meeting') {
          return false;
        }
      } else if (selectedType === 'notes_records') {
        if (activity.type !== 'note' && activity.type !== 'email' && activity.type !== 'estimate' && activity.type !== 'payment') {
          return false;
        }
      }

      if (activity.createdAt < filterStartDate) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const descriptionMatch = activity.description.toLowerCase().includes(query);
        const contact = getContactById(
          activity.contactId || getDealById(activity.dealId)?.contactId
        );
        const contactNameMatch = contact?.name.toLowerCase().includes(query);
        const deal = getDealById(activity.dealId);
        const dealTitleMatch = deal?.title.toLowerCase().includes(query);

        if (!descriptionMatch && !contactNameMatch && !dealTitleMatch) {
          return false;
        }
      }

      return true;
    });
  }, [activities, selectedType, selectedDateRange, filterStartDate, searchQuery]);

  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort((a, b) => b.createdAt - a.createdAt);
  }, [filteredActivities]);

  const groupedActivities = useMemo(() => {
    const groups: Record<string, GroupedActivity> = {};

    sortedActivities.forEach((activity) => {
      const date = new Date(activity.createdAt);
      const dateKey = date.toDateString();
      const dateLabel = getDateLabel(date, now);

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date,
          dateLabel,
          activities: [],
        };
      }

      groups[dateKey].activities.push(activity);
    });

    return Object.values(groups);
  }, [sortedActivities]);

  const handleOpenQuickAdd = () => {
    const event = new CustomEvent('open-quick-add');
    window.dispatchEvent(event);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">{t('common.loading' as TranslationKey)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="px-4 sm:px-8 py-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Activity Timeline
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {filteredActivities.length} of {activities.length} activities
            </p>
          </div>
          <button
            onClick={handleOpenQuickAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium text-sm"
          >
            <Plus className="w-5 h-5" />
            Add Activity
          </button>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-8 py-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityTypeFilter[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {ACTIVITY_TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value as DateRangeFilter)}
                className="appearance-none px-4 py-2.5 pr-9 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-medium text-sm cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-400 pointer-events-none" />
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search activities, contacts, deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 font-medium text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {sortedActivities.length > 0 ? (
          <div className="px-4 sm:px-8 py-8">
            <div className="space-y-8 max-w-4xl">
              {groupedActivities.map((group) => (
                <div key={group.date.toDateString()}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {group.dateLabel}
                    </h2>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2">
                      {group.activities.length} activity
                      {group.activities.length !== 1 ? 'ies' : ''}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {group.activities.map((activity, index) => {
                      const contact = getContactById(
                        activity.contactId || getDealById(activity.dealId)?.contactId
                      );
                      const deal = getDealById(activity.dealId);
                      const isLast = index === group.activities.length - 1;

                      return (
                        <div key={activity.id} className="relative">
                          {!isLast && (
                            <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700" />
                          )}

                          <div className="flex gap-3 sm:gap-4 md:gap-4 sm:p-6 group">
                            <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                              {ACTIVITY_ICONS[activity.type] || (
                                <FileText className="w-5 h-5" />
                              )}
                            </div>

                            <div className="flex-1 pt-1.5">
                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="inline-flex items-center gap-2 mb-2">
                                      <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold capitalize">
                                        {activity.type}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                      {activity.description}
                                    </p>
                                  </div>
                                  <div className="text-xs font-medium text-slate-500 dark:text-slate-500 whitespace-nowrap">
                                    {formatRelativeTime(activity.createdAt)}
                                  </div>
                                </div>

                                {(contact || deal) && (
                                  <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                                    {contact && (
                                      <Link
                                        href={`/contacts/${contact.id}`}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                                      >
                                        <span className="truncate">
                                          {contact.name}
                                        </span>
                                      </Link>
                                    )}
                                    {deal && (
                                      <Link
                                        href={`/pipeline/${deal.id}`}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors border border-purple-200 dark:border-purple-800"
                                      >
                                        <span className="truncate">
                                          {deal.title}
                                        </span>
                                      </Link>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm mb-6">
              {searchQuery
                ? 'Try adjusting your search filters or create a new activity'
                : 'No activities yet. Create your first activity to get started'}
            </p>
            <button
              onClick={handleOpenQuickAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-5 h-5" />
              Create Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}