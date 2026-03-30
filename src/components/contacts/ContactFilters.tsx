'use client';

import { Search } from 'lucide-react';
import { LeadSource, ContactType } from '@/types';

interface ContactFiltersProps {
  isDark: boolean;
  searchQuery: string;
  filterType: ContactType | 'all';
  filterSource: LeadSource | 'all';
  onSearchChange: (query: string) => void;
  onTypeFilterChange: (type: ContactType | 'all') => void;
  onSourceFilterChange: (source: LeadSource | 'all') => void;
  leadSources: { value: LeadSource; label: string }[];
}

export function ContactFilters({
  isDark,
  searchQuery,
  filterType,
  filterSource,
  onSearchChange,
  onTypeFilterChange,
  onSourceFilterChange,
  leadSources,
}: ContactFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          type="text"
          placeholder="Search by name, email, phone, or address..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTypeFilterChange('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          All Types
        </button>
        <button
          onClick={() => onTypeFilterChange('customer')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'customer'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => onTypeFilterChange('lead')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'lead'
              ? 'bg-blue-600 text-white'
              : isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Leads
        </button>

        <div className="flex-1"></div>

        <select
          value={filterSource}
          onChange={(e) => onSourceFilterChange(e.target.value as LeadSource | 'all')}
          className={`px-3 py-1 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? 'bg-slate-700 text-slate-300 border-slate-600'
              : 'bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          <option value="all">All Sources</option>
          {leadSources.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
