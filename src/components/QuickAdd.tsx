'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/components/Toast';
import { X } from 'lucide-react';
import type { ContactType, ActivityType, PipelineStage } from '@/types';
import { QuickAddContactForm } from './quick-add/QuickAddContactForm';
import { QuickAddDealForm } from './quick-add/QuickAddDealForm';
import { QuickAddActivityForm } from './quick-add/QuickAddActivityForm';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm'
        }`}
      />

      {/* Modal */}
      <div
        ref={containerRef}
        className={`relative w-full sm:max-w-md rounded-xl shadow-2xl transition-all duration-200 ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors duration-200 ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-700'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title for dialog accessibility */}
        <h2 id="quick-add-title" className="sr-only">Quick Add Modal</h2>

        {/* Tabs */}
        <div
          className={`flex border-b transition-colors duration-200 ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}
          role="tablist"
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
                      isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                    }`
              }`}
              style={{
                borderBottom: activeTab === tab ? '2px solid #27AE60' : '2px solid transparent',
              }}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`tab-panel-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Contact Form */}
          {activeTab === 'contact' && (
            <QuickAddContactForm
              form={contactForm}
              onFormChange={setContactForm}
              onSubmit={handleAddContact}
              loading={loading}
              errors={errors}
              isDark={isDark}
            />
          )}

          {/* Deal Form */}
          {activeTab === 'deal' && (
            <QuickAddDealForm
              form={dealForm}
              onFormChange={setDealForm}
              onSubmit={handleAddDeal}
              contacts={contacts}
              pipelineStages={settings.pipelineStages}
              loading={loading}
              errors={errors}
              isDark={isDark}
            />
          )}

          {/* Activity Form */}
          {activeTab === 'activity' && (
            <QuickAddActivityForm
              form={activityForm}
              onFormChange={setActivityForm}
              onSubmit={handleAddActivity}
              contacts={contacts}
              loading={loading}
              errors={errors}
              isDark={isDark}
            />
          )}
        </div>
      </div>
    </div>
  );
}
