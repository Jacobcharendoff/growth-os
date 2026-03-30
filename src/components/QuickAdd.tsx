'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/components/Toast';
import { X, Loader } from 'lucide-react';
import type { ContactType, ActivityType, PipelineStage } from '@/types';

type Tab = 'contact' | 'deal' | 'activity';

interface FormErrors {
  [key: string]: boolean;
}

export function QuickAdd() {
  const { addContact, addDeal, addActivity, contacts, settings } = useStore();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('contact');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'lead' as ContactType,
  });

  // Deal form state
  const [dealForm, setDealForm] = useState({
    title: '',
    contactId: '',
    value: '',
    stage: 'new_lead' as PipelineStage,
  });

  // Activity form state
  const [activityForm, setActivityForm] = useState({
    type: 'call' as ActivityType,
    description: '',
    contactId: '',
    dealId: '',
  });

  // Listen for custom event
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-quick-add', handleOpenEvent);
    return () => window.removeEventListener('open-quick-add', handleOpenEvent);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setErrors({});
    // Reset forms
    setContactForm({ name: '', email: '', phone: '', type: 'lead' });
    setDealForm({ title: '', contactId: '', value: '', stage: 'new_lead' });
    setActivityForm({ type: 'call', description: '', contactId: '', dealId: '' });
  };

  const validateContactForm = () => {
    const newErrors: FormErrors = {};
    if (!contactForm.name.trim()) newErrors.name = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDealForm = () => {
    const newErrors: FormErrors = {};
    if (!dealForm.title.trim()) newErrors.title = true;
    if (!dealForm.contactId) newErrors.contactId = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateActivityForm = () => {
    const newErrors: FormErrors = {};
    if (!activityForm.description.trim()) newErrors.description = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContactForm()) return;

    setLoading(true);
    try {
      addContact({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        address: '',
        type: contactForm.type,
        source: 'referral',
        notes: '',
      });
      toast.success('Contact added successfully', `${contactForm.name} has been added to your contacts`);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDealForm()) return;

    setLoading(true);
    try {
      addDeal({
        contactId: dealForm.contactId,
        title: dealForm.title,
        value: parseInt(dealForm.value) || 0,
        stage: dealForm.stage,
        source: 'referral',
        assignedTo: 'Team',
        notes: '',
      });
      toast.success('Deal created successfully', `${dealForm.title} has been added to your pipeline`);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateActivityForm()) return;

    setLoading(true);
    try {
      addActivity({
        type: activityForm.type,
        description: activityForm.description,
        contactId: activityForm.contactId || undefined,
        dealId: activityForm.dealId || undefined,
      });
      toast.success('Activity recorded', `${activityForm.type} has been logged`);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm'
        }`}
      />

      {/* Modal */}
      <div
        ref={containerRef}
        className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl transition-all duration-200 ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200 ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tabs */}
        <div
          className={`flex border-b transition-colors duration-200 ${
            isDark ? 'border-slate-700' : 'border-gray-200'
          }`}
        >
          {(['contact', 'deal', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setErrors({});
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeTab === tab
                  ? `border-[#27AE60] ${isDark ? 'text-emerald-400' : 'text-[#27AE60]'}`
                  : `border-transparent ${
                      isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'
                    }`
              }`}
              style={{
                borderBottom: activeTab === tab ? '2px solid #27AE60' : '2px solid transparent',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Contact Form */}
          {activeTab === 'contact' && (
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    errors.name
                      ? isDark
                        ? 'border-red-500 bg-slate-700 text-white'
                        : 'border-red-500 bg-red-50 text-gray-900'
                      : isDark
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Type
                </label>
                <select
                  value={contactForm.type}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, type: e.target.value as ContactType })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
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
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDark
                      ? 'bg-[#27AE60] hover:bg-emerald-500 text-white'
                      : 'bg-[#27AE60] hover:bg-emerald-500 text-white'
                }`}
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Adding...' : 'Add Contact'}
              </button>
            </form>
          )}

          {/* Deal Form */}
          {activeTab === 'deal' && (
            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  placeholder="Plumbing repair"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    errors.title
                      ? isDark
                        ? 'border-red-500 bg-slate-700 text-white'
                        : 'border-red-500 bg-red-50 text-gray-900'
                      : isDark
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Contact <span className="text-red-500">*</span>
                </label>
                <select
                  value={dealForm.contactId}
                  onChange={(e) => setDealForm({ ...dealForm, contactId: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    errors.contactId
                      ? isDark
                        ? 'border-red-500 bg-slate-700 text-white'
                        : 'border-red-500 bg-red-50 text-gray-900'
                      : isDark
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
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
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Value ($)
                </label>
                <input
                  type="number"
                  value={dealForm.value}
                  onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                  placeholder="2500"
                  min="0"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Stage
                </label>
                <select
                  value={dealForm.stage}
                  onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value as PipelineStage })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                >
                  {settings.pipelineStages.map((s) => (
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
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDark
                      ? 'bg-[#27AE60] hover:bg-emerald-500 text-white'
                      : 'bg-[#27AE60] hover:bg-emerald-500 text-white'
                }`}
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Adding...' : 'Add Deal'}
              </button>
            </form>
          )}

          {/* Activity Form */}
          {activeTab === 'activity' && (
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Type
                </label>
                <select
                  value={activityForm.type}
                  onChange={(e) =>
                    setActivityForm({ ...activityForm, type: e.target.value as ActivityType })
                  }
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
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
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder="What happened..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 resize-none ${
                    errors.description
                      ? isDark
                        ? 'border-red-500 bg-slate-700 text-white'
                        : 'border-red-500 bg-red-50 text-gray-900'
                      : isDark
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Contact
                </label>
                <select
                  value={activityForm.contactId}
                  onChange={(e) => setActivityForm({ ...activityForm, contactId: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
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
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Deal
                </label>
                <select
                  value={activityForm.dealId}
                  onChange={(e) => setActivityForm({ ...activityForm, dealId: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    isDark
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                >
                  <option value="">Select a deal (optional)</option>
                  {/* Deals would need to be fetched, for now using a simple placeholder */}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading
                    ? isDark
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDark
                      ? 'bg-[#27AE60] hover:bg-emerald-500 text-white'
                      : 'bg-[#27AE60] hover:bg-emerald-500 text-white'
                }`}
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Adding...' : 'Add Activity'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
