'use client';

import { Loader } from 'lucide-react';
import type { PipelineStage, Contact } from '@/types';

interface DealFormData {
  title: string;
  contactId: string;
  value: string;
  stage: PipelineStage;
}

interface FormErrors {
  [key: string]: boolean;
}

interface PipelineStageOption {
  id: string;
  name: string;
}

interface QuickAddDealFormProps {
  form: DealFormData;
  onFormChange: (form: DealFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  contacts: Contact[];
  pipelineStages: PipelineStageOption[];
  loading: boolean;
  errors: FormErrors;
  isDark: boolean;
}

export function QuickAddDealForm({
  form,
  onFormChange,
  onSubmit,
  contacts,
  pipelineStages,
  loading,
  errors,
  isDark,
}: QuickAddDealFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onFormChange({ ...form, title: e.target.value })}
          placeholder="Plumbing repair"
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            errors.title
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
          Contact <span className="text-red-500">*</span>
        </label>
        <select
          value={form.contactId}
          onChange={(e) => onFormChange({ ...form, contactId: e.target.value })}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            errors.contactId
              ? isDark
                ? 'border-red-500 bg-slate-700 text-white'
                : 'border-red-500 bg-red-50 text-slate-900'
              : isDark
                ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
          }`}
        >
          <option value="">Select a contact</option>
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
          Value ($)
        </label>
        <input
          type="number"
          value={form.value}
          onChange={(e) => onFormChange({ ...form, value: e.target.value })}
          placeholder="2500"
          min="0"
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
          Stage
        </label>
        <select
          value={form.stage}
          onChange={(e) =>
            onFormChange({ ...form, stage: e.target.value as PipelineStage })
          }
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            isDark
              ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
              : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
          }`}
        >
          {pipelineStages.map((s) => (
            <option key={s.id} value={s.name.toLowerCase().replace(/\s+/g, '_')}>
              {s.name}
            </option>
          ))}
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
        {loading ? 'Adding...' : 'Add Deal'}
      </button>
    </form>
  );
}
