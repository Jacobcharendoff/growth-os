'use client';

import { Loader } from 'lucide-react';
import type { ContactType } from '@/types';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  type: ContactType;
}

interface FormErrors {
  [key: string]: boolean;
}

interface QuickAddContactFormProps {
  form: ContactFormData;
  onFormChange: (form: ContactFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  errors: FormErrors;
  isDark: boolean;
}

export function QuickAddContactForm({
  form,
  onFormChange,
  onSubmit,
  loading,
  errors,
  isDark,
}: QuickAddContactFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onFormChange({ ...form, name: e.target.value })}
          placeholder="John Doe"
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            errors.name
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
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => onFormChange({ ...form, email: e.target.value })}
          placeholder="john@example.com"
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark
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
          Phone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
          placeholder="(555) 123-4567"
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark
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
          Type
        </label>
        <select
          value={form.type}
          onChange={(e) =>
            onFormChange({ ...form, type: e.target.value as ContactType })
          }
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark
              ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
              : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
          }`}
        >
          <option value="lead">Lead</option>
          <option value="customer">Customer</option>
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
        {loading ? 'Adding...' : 'Add Contact'}
      </button>
    </form>
  );
}
