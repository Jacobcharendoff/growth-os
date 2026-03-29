'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { Activity as ActivityType } from '@/types';
import { Phone, Mail, Calendar, FileText, Zap, DollarSign } from 'lucide-react';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  call: <Phone className="w-5 h-5 text-blue-500" />,
  email: <Mail className="w-5 h-5 text-purple-500" />,
  meeting: <Calendar className="w-5 h-5 text-amber-500" />,
  note: <FileText className="w-5 h-5 text-slate-500" />,
  estimate: <Zap className="w-5 h-5 text-yellow-500" />,
  payment: <DollarSign className="w-5 h-5 text-emerald-500" />,
};

export default function ActivityPage() {
  const { activities, deals, contacts, initializeSeedData } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  const sortedActivities = [...activities].sort((a, b) => b.createdAt - a.createdAt);

  const getContactName = (contactId?: string) => {
    if (!contactId) return 'Unknown';
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.name || 'Unknown';
  };

  const getDealTitle = (dealId?: string) => {
    if (!dealId) return '';
    const deal = deals.find((d) => d.id === dealId);
    return deal?.title || '';
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Activity</h1>
        <p className="text-slate-600 mt-1">
          {activities.length} total activities
        </p>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8 max-w-3xl">
          {sortedActivities.length > 0 ? (
            <div className="space-y-6">
              {sortedActivities.map((activity, index) => {
                const dealTitle = getDealTitle(activity.dealId);
                const contactName = getContactName(
                  activity.contactId || deals.find((d) => d.id === activity.dealId)?.contactId
                );

                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline line */}
                    {index !== sortedActivities.length - 1 && (
                      <div className="absolute left-[19px] top-[48px] bottom-[-24px] w-0.5 bg-slate-200 dark:bg-slate-700" />
                    )}

                    {/* Activity item */}
                    <div className="flex gap-6">
                      {/* Icon circle */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0 relative z-10">
                        {ACTIVITY_ICONS[activity.type] || <FileText className="w-5 h-5" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-slate-900 capitalize">
                                {activity.type}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                {activity.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {contactName && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                {contactName}
                              </span>
                            )}
                            {dealTitle && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                                {dealTitle}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 mt-3">
                            {new Date(activity.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500 text-center">
                No activities yet. Get started by adding deals and contacts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
