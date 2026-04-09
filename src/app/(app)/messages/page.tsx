'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { MessageSquare, Mail, Bell } from 'lucide-react';

export default function MessagesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 md:p-12">
          {/* Icon cluster */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            SMS &amp; Email Messaging
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-base leading-relaxed">
            Send texts and emails directly from Staybookt. Automated follow-ups, appointment reminders, and review requests — all in one place.
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-800">
            <span>🚀</span>
            Coming Q2 2026
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Powered by Twilio (SMS) and SendGrid (Email).
              We&apos;ll notify you when it&apos;s ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
