'use client';

import { Loader } from 'lucide-react';
import type { ActivityType, Contact } from '@/types';

interface ActivityFormData {
  type: ActivityType;
  description: string;
  contactId: string;
  dealId: string;
}

interface FormErrors {
  [key: string]: boolean;
}

interface QuickAddActivityFormProps {
  form: ActivityFormData;
  onFormChange: (form: ActivityFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  contacts: Contact[];
  loading: boolean;
  errors: FormErrors;
  isDark: boolean;
}

export function QuickAddActivityForm({
  form,
  onFormChange,
  onSubmit,
  contacts,
  loading,
  errors,
  isDark,
}: QuickAddActivityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Type
        </label>
        <select
          value={form.type}
          onChange={(e) =>
            onFormChange({ ...form, type: e.target.value as ActivityType })
          }
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark
              ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
              : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
          }`}
        >
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
        </select>
      </div>

      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) =>
            onFormChange({ ...form, description: e.target.value })
          }
          placeholder="What happened..."
          rows={3}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 resize-none ${
            errors.description
              ? isDark
                ? 'border-red-500 bg-slate-700 text-white'
                : 'border-red-500 bg-red-50 text-slate-900'
              : isDark
                ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
          }`}
        />
      </div>

      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Contact
        </label>
        <select
          value={form.contactId}
          onChange={(e) =>
            onFormChange({ ...form, contactId: e.target.value })
          }
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark
              ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
              : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
          }`}
        >
          <option value="">Select a contact (optional)</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Deal
        </label>
        <select
          value={form.dealId}
          onChange={(e) =>
            onFormChange({ ...form, dealId: e.target.value })
          }
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark
              ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
              : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
          }`}
        >
          <option value="">Select a deal (optional)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          loading
            ? isDark
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : isDark
              ? 'bg-[#27AE60] hover:bg-emerald-500 text-white'
              : 'bg-[#27AE60] hover:bg-emerald-500 text-white'
        }`}
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? 'Adding...' : 'Add Activity'}
      </button>
    </form>
  );
}
