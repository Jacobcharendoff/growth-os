'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Contact, LeadSource } from '@/types';

interface AddDealFormProps {
  contacts: Contact[];
  onClose: () => void;
}

const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'existing_customer', label: 'Existing Customer' },
  { value: 'reactivation', label: 'Reactivation' },
  { value: 'cross_sell', label: 'Cross-Sell' },
  { value: 'referral', label: 'Referral' },
  { value: 'review', label: 'Review' },
  { value: 'neighborhood', label: 'Neighborhood' },
  { value: 'google_lsa', label: 'Google LSA' },
  { value: 'seo', label: 'SEO' },
  { value: 'gbp', label: 'Google Business' },
];

export function AddDealForm({ contacts, onClose }: AddDealFormProps) {
  const [formData, setFormData] = useState({
    contactId: contacts[0]?.id || '',
    title: '',
    value: '',
    source: 'referral' as LeadSource,
    assignedTo: 'Team',
    notes: '',
    scheduledDate: '',
  });

  const { addDeal, addActivity } = useStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.contactId || !formData.title || !formData.value) {
      alert('Please fill in all required fields');
      return;
    }

    addDeal({
      contactId: formData.contactId,
      title: formData.title,
      value: parseInt(formData.value),
      stage: 'new_lead',
      source: formData.source,
      assignedTo: formData.assignedTo,
      notes: formData.notes,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).getTime() : undefined,
    });

    // Get the newly created deal (last one added)
    // We'll log this activity after a brief delay to ensure the deal is added
    setTimeout(() => {
      addActivity({
        contactId: formData.contactId,
        type: 'note',
        description: `Created new job: ${formData.title}`,
      });
    }, 0);

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Contact *
        </label>
        <select
          value={formData.contactId}
          onChange={(e) =>
            setFormData({ ...formData, contactId: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Job Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="e.g., Water Heater Replacement"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Value ($) *
        </label>
        <input
          type="number"
          value={formData.value}
          onChange={(e) =>
            setFormData({ ...formData, value: e.target.value })
          }
          placeholder="1000"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Lead Source
        </label>
        <select
          value={formData.source}
          onChange={(e) =>
            setFormData({
              ...formData,
              source: e.target.value as LeadSource,
            })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LEAD_SOURCES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Assigned To
        </label>
        <select
          value={formData.assignedTo}
          onChange={(e) =>
            setFormData({ ...formData, assignedTo: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Team">Team</option>
          <option value="Marcus">Marcus</option>
          <option value="James">James</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Scheduled Date
        </label>
        <input
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) =>
            setFormData({ ...formData, scheduledDate: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          placeholder="Add any notes about this job..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Job
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
