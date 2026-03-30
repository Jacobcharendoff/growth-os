'use client';

import { Contact } from '@/types';

interface ContactMobileCardProps {
  contact: Contact;
  isDark: boolean;
  dealCount: number;
  onOpenDetailView: (contact: Contact) => void;
}

export function ContactMobileCard({
  contact,
  isDark,
  dealCount,
  onOpenDetailView,
}: ContactMobileCardProps) {
  return (
    <div
      onClick={() => onOpenDetailView(contact)}
      className={`p-4 cursor-pointer transition-colors ${
        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {contact.name}
          </p>
          <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {contact.email}
          </p>
          {contact.address && (
            <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {contact.address}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
              contact.type === 'customer'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {contact.type === 'customer' ? 'Customer' : 'Lead'}
          </span>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {dealCount} {dealCount === 1 ? 'deal' : 'deals'}
          </span>
        </div>
      </div>
    </div>
  );
}
