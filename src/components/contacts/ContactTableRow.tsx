'use client';

import { Contact } from '@/types';
import { LeadSourceBadge } from '@/components/LeadSourceBadge';
import { Edit2, Trash2 } from 'lucide-react';

interface ContactTableRowProps {
  contact: Contact;
  isDark: boolean;
  isSelected: boolean;
  dealCount: number;
  onToggleSelect: (id: string) => void;
  onOpenDetailView: (contact: Contact) => void;
  onOpenEditModal: (contact: Contact) => void;
  onOpenDeleteConfirm: (contact: Contact) => void;
}

export function ContactTableRow({
  contact,
  isDark,
  isSelected,
  dealCount,
  onToggleSelect,
  onOpenDetailView,
  onOpenEditModal,
  onOpenDeleteConfirm,
}: ContactTableRowProps) {
  return (
    <tr
      className={`border-b transition-colors ${
        isSelected
          ? isDark
            ? 'bg-emerald-900/20 hover:bg-emerald-900/30'
            : 'bg-emerald-50/60 hover:bg-emerald-100/60'
          : isDark
            ? 'border-slate-700 hover:bg-slate-800'
            : 'border-slate-200 hover:bg-slate-50'
      }`}
    >
      <td className={`px-3 sm:px-4 py-4 text-center`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(contact.id)}
          className="w-4 h-4 rounded cursor-pointer"
          aria-label={`Select ${contact.name}`}
        />
      </td>
      <td
        className={`px-3 sm:px-6 py-4 cursor-pointer`}
        onClick={() => onOpenDetailView(contact)}
      >
        <div>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {contact.name}
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {contact.address}
          </p>
        </div>
      </td>
      <td className={`px-3 sm:px-6 py-4 hidden sm:table-cell`}>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            contact.type === 'customer'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          {contact.type === 'customer' ? 'Customer' : 'Lead'}
        </span>
      </td>
      <td className={`px-3 sm:px-6 py-4 hidden sm:table-cell`}>
        <LeadSourceBadge source={contact.source} />
      </td>
      <td className={`px-3 sm:px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {contact.email}
      </td>
      <td className={`px-3 sm:px-6 py-4 text-right`}>
        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {dealCount}
        </span>
      </td>
      <td className={`px-3 sm:px-6 py-4 text-right`}>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onOpenEditModal(contact)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenDeleteConfirm(contact)}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-red-900 text-red-400 hover:text-red-200'
                : 'hover:bg-red-100 text-red-600 hover:text-red-900'
            }`}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
