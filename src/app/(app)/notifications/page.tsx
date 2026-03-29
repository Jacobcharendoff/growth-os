'use client';

import { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, DollarSign, TrendingUp, MessageSquare, Star, Users, Zap, MessageCircle, Eye, EyeOff } from 'lucide-react';

interface Notification {
  id: string;
  type: 'lead' | 'payment' | 'urgent' | 'estimate' | 'reminder' | 'completion' | 'report' | 'overdue' | 'review' | 'team' | 'automation' | 'system';
  title: string;
  description: string;
  timeAgo: string;
  date: 'today' | 'yesterday' | 'earlier';
  read: boolean;
  action?: { label: string; href: string };
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New lead: Sarah Chen submitted a request via your website',
    description: 'Water heater installation needed at residential property',
    timeAgo: '2m ago',
    date: 'today',
    read: false,
    action: { label: 'View Lead', href: '/leads' }
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment received: $1,500 from John Martinez',
    description: 'Invoice INV-2026-003 has been paid in full via credit card',
    timeAgo: '15m ago',
    date: 'today',
    read: false,
    action: { label: 'View Invoice', href: '/invoices/3' }
  },
  {
    id: '3',
    type: 'urgent',
    title: 'URGENT: Emergency call - Burst pipe at 1247 Oak St',
    description: 'Customer reported water damage. Dispatch required immediately.',
    timeAgo: '28m ago',
    date: 'today',
    read: false,
    action: { label: 'Dispatch', href: '/jobs/new' }
  },
  {
    id: '4',
    type: 'estimate',
    title: 'Estimate EST-2026-008 was approved by David Rodriguez',
    description: '$4,200 water heater and installation estimate approved',
    timeAgo: '1h ago',
    date: 'today',
    read: true,
    action: { label: 'Create Invoice', href: '/invoices/new' }
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Reminder: Follow up with Patricia King',
    description: 'Estimate sent 3 days ago. No response yet. Send a follow-up message.',
    timeAgo: '2h ago',
    date: 'today',
    read: true,
    action: { label: 'Send Follow-Up', href: '/contacts/patricia' }
  },
  {
    id: '6',
    type: 'completion',
    title: 'Job completed: Water Heater Replacement for Michael O\'Brien',
    description: 'Job #JOB-2026-847 marked as completed at 4:30 PM',
    timeAgo: '3h ago',
    date: 'today',
    read: true,
    action: { label: 'View Job', href: '/jobs/847' }
  },
  {
    id: '7',
    type: 'report',
    title: 'Weekly report ready: Pipeline grew 12% this week',
    description: 'Your pipeline increased from $18,500 to $20,720 in deals',
    timeAgo: '5h ago',
    date: 'today',
    read: true,
    action: { label: 'View Report', href: '/reports' }
  },
  {
    id: '8',
    type: 'overdue',
    title: 'Invoice INV-2026-005 is now 7 days overdue',
    description: '$3,200 due from Acme Property Management',
    timeAgo: 'Yesterday',
    date: 'yesterday',
    read: true,
    action: { label: 'Send Reminder', href: '/invoices/5' }
  },
  {
    id: '9',
    type: 'review',
    title: 'New 5-star review from John Martinez on Google!',
    description: '"Best plumber in Austin. Highly recommend Growth OS Plumbing!"',
    timeAgo: 'Yesterday',
    date: 'yesterday',
    read: true,
    action: { label: 'View Review', href: '/reviews' }
  },
  {
    id: '10',
    type: 'team',
    title: 'Team: Marcus completed 4 jobs this week (top performer)',
    description: 'Marcus leads the team with the most completed jobs',
    timeAgo: '2d ago',
    date: 'earlier',
    read: true
  },
  {
    id: '11',
    type: 'automation',
    title: 'Automation triggered: Review request sent to 3 customers',
    description: 'Automated review requests sent to recent job completions',
    timeAgo: '2d ago',
    date: 'earlier',
    read: true
  },
  {
    id: '12',
    type: 'system',
    title: 'SMS delivery failed to (555) 890-1234',
    description: 'Invalid phone number detected. Update customer contact info.',
    timeAgo: '3d ago',
    date: 'earlier',
    read: true,
    action: { label: 'Fix Contact', href: '/contacts' }
  }
];

const typeConfig = {
  lead: { icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  payment: { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
  urgent: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  estimate: { icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  reminder: { icon: Bell, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  completion: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
  report: { icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  overdue: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  review: { icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  team: { icon: Users, color: 'text-slate-600', bgColor: 'bg-slate-100' },
  automation: { icon: Zap, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  system: { icon: MessageCircle, color: 'text-slate-600', bgColor: 'bg-slate-100' }
};

export default function NotificationsPage() {
  const [filterTab, setFilterTab] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'lead', label: 'Leads' },
    { id: 'payment', label: 'Payments' },
    { id: 'reminder', label: 'Reminders' },
    { id: 'system', label: 'System' }
  ];

  const filteredNotifications = notifications.filter(notif => {
    if (filterTab === 'all') return true;
    if (filterTab === 'unread') return !notif.read;
    return notif.type === filterTab;
  });

  const groupedNotifications = {
    today: filteredNotifications.filter(n => n.date === 'today'),
    yesterday: filteredNotifications.filter(n => n.date === 'yesterday'),
    earlier: filteredNotifications.filter(n => n.date === 'earlier')
  };

  const renderNotificationCard = (notif: Notification) => {
    const IconComponent = typeConfig[notif.type].icon;

    return (
      <div
        key={notif.id}
        onClick={() => setExpandedId(expandedId === notif.id ? null : notif.id)}
        className={`bg-white dark:bg-slate-800 rounded-lg p-4 border cursor-pointer transition-all ${
          notif.read
            ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-700'
        }`}
      >
        <div className="flex gap-4">
          <div className={`${typeConfig[notif.type].bgColor} rounded-lg p-3 flex-shrink-0`}>
            <IconComponent className={`w-5 h-5 ${typeConfig[notif.type].color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`${notif.read ? 'font-medium' : 'font-bold'} text-slate-900 text-sm line-clamp-2`}>
                {notif.title}
              </h3>
              <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{notif.timeAgo}</span>
            </div>

            {expandedId === notif.id && (
              <>
                <p className="text-sm text-slate-600 mt-2">{notif.description}</p>
                {notif.action && (
                  <a
                    href={notif.action.href}
                    className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {notif.action.label}
                  </a>
                )}
              </>
            )}

            {expandedId !== notif.id && (
              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{notif.description}</p>
            )}
          </div>

          {!notif.read && (
            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium shadow-sm">
              Mark All Read
            </button>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="text-sm text-slate-600">
            You have <span className="font-semibold text-blue-600">{unreadCount} unread</span> notification{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 border-b border-slate-200">
        <div className="flex gap-1 overflow-x-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                filterTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {tab.id === 'unread' && unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-8 max-w-2xl">
        {/* Today */}
        {groupedNotifications.today.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Today</h2>
            <div className="space-y-3">
              {groupedNotifications.today.map(notif => renderNotificationCard(notif))}
            </div>
          </div>
        )}

        {/* Yesterday */}
        {groupedNotifications.yesterday.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Yesterday</h2>
            <div className="space-y-3">
              {groupedNotifications.yesterday.map(notif => renderNotificationCard(notif))}
            </div>
          </div>
        )}

        {/* Earlier */}
        {groupedNotifications.earlier.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Earlier</h2>
            <div className="space-y-3">
              {groupedNotifications.earlier.map(notif => renderNotificationCard(notif))}
            </div>
          </div>
        )}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No notifications</p>
            <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
