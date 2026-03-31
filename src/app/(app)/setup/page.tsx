'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import {
  ChevronLeft, ChevronRight, Building2, Users, Zap, FileText, Trophy,
  CheckCircle2, ArrowRight, AlertCircle, Trash2, Plus, Mail, Phone, MapPin,
  TrendingUp, Clock, Star, Sparkles,
} from 'lucide-react';

type StepName = 'company' | 'contact' | 'deal' | 'estimate' | 'automation' | 'ready';

interface FormErrors {
  [key: string]: string;
}

interface SetupContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'customer' | 'lead';
}

interface SetupDeal {
  id: string;
  contactId: string;
  title: string;
  value: number;
  stage: string;
}

const INDUSTRIES = [
  'plumbing', 'hvac', 'electrical', 'landscaping',
  'cleaning', 'roofing', 'general_contracting', 'other'
];

const INDUSTRY_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  hvac: 'HVAC',
  electrical: 'Electrical',
  landscaping: 'Landscaping',
  cleaning: 'Cleaning',
  roofing: 'Roofing',
  general_contracting: 'General Contracting',
  other: 'Other',
};

const CANADIAN_PROVINCES = [
  { id: 'ON', label: 'Ontario', taxRate: 0.13 },
  { id: 'QC', label: 'Quebec', taxRate: 0.15 },
  { id: 'BC', label: 'British Columbia', taxRate: 0.12 },
  { id: 'AB', label: 'Alberta', taxRate: 0.05 },
  { id: 'MB', label: 'Manitoba', taxRate: 0.12 },
  { id: 'SK', label: 'Saskatchewan', taxRate: 0.11 },
  { id: 'NS', label: 'Nova Scotia', taxRate: 0.15 },
  { id: 'NB', label: 'New Brunswick', taxRate: 0.15 },
  { id: 'NL', label: 'Newfoundland & Labrador', taxRate: 0.15 },
  { id: 'PE', label: 'Prince Edward Island', taxRate: 0.15 },
];

const AUTOMATION_PLAYBOOKS = [
  {
    id: 'speed-to-lead',
    name: 'Speed to Lead',
    description: 'Auto-respond to new leads within 60 seconds',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'estimate-follow-up',
    name: 'Estimate Follow-Up',
    description: 'Nudge contacts 48 hours after estimate sent',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'review-machine',
    name: 'Review Machine',
    description: 'Request review after job is marked complete',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
  },
];

const EXAMPLE_CONTACT: SetupContact = {
  id: 'example',
  name: 'John Smith',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St, Toronto, ON',
  type: 'lead',
};

export default function SetupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { settings, updateSettings, addContact, addDeal, setSetupCompleted } = useStore();
  const isDark = theme === 'dark';

  const [step, setStep] = useState<StepName>('company');
  const [errors, setErrors] = useState<FormErrors>({});
  const [mounted, setMounted] = useState(false);
  const [celebrationShow, setCelebrationShow] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  // Company step
  const [companyName, setCompanyName] = useState(settings.companyName || '');
  const [phone, setPhone] = useState(settings.companyPhone || '');
  const [email, setEmail] = useState(settings.companyEmail || '');
  const [address, setAddress] = useState(settings.companyAddress || '');
  const [industry, setIndustry] = useState(settings.industry || 'plumbing');
  const [province, setProvince] = useState('ON');

  // Contact step
  const [showingExample, setShowingExample] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactType, setContactType] = useState<'customer' | 'lead'>('lead');
  const [contacts, setContacts] = useState<SetupContact[]>([]);
  const [currentContact, setCurrentContact] = useState<SetupContact | null>(null);

  // Deal step
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [dealStage, setDealStage] = useState('New Lead');
  const [deals, setDeals] = useState<SetupDeal[]>([]);

  // Automation step
  const [activeAutomations, setActiveAutomations] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Validation
  const validateCompanyStep = (): boolean => {
    const newErrors: FormErrors = {};
    if (!companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (email && !email.includes('@')) newErrors.email = 'Valid email required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactStep = (): boolean => {
    const newErrors: FormErrors = {};
    if (!contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    if (contactEmail && !contactEmail.includes('@')) newErrors.contactEmail = 'Valid email required';
    if (!contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDealStep = (): boolean => {
    const newErrors: FormErrors = {};
    if (!dealTitle.trim()) newErrors.dealTitle = 'Deal title is required';
    if (!dealValue.trim()) newErrors.dealValue = 'Deal value is required';
    if (dealValue && isNaN(parseFloat(dealValue))) newErrors.dealValue = 'Must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Confetti animation
  const triggerConfetti = () => {
    setCelebrationShow(true);
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      // Simple confetti effect using CSS animation
    }
    setTimeout(() => setCelebrationShow(false), 2000);
  };

  const handleAddContact = () => {
    if (validateContactStep()) {
      const newContact: SetupContact = {
        id: Date.now().toString(),
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        address: contactAddress,
        type: contactType,
      };
      setContacts([...contacts, newContact]);
      setCurrentContact(newContact);
      addContact({
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
        address: newContact.address,
        type: newContact.type,
        source: 'referral',
        notes: '',
      });
      triggerConfetti();
      // Clear form
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactAddress('');
      setContactType('lead');
      setErrors({});
    }
  };

  const handleAddDeal = () => {
    if (validateDealStep()) {
      if (!currentContact) {
        setErrors({ general: 'Please add a contact first' });
        return;
      }
      const newDeal: SetupDeal = {
        id: Date.now().toString(),
        contactId: currentContact.id,
        title: dealTitle,
        value: parseFloat(dealValue),
        stage: dealStage,
      };
      setDeals([...deals, newDeal]);
      addDeal({
        contactId: newDeal.contactId,
        title: newDeal.title,
        value: newDeal.value,
        stage: newDeal.stage as 'new_lead' | 'contacted' | 'estimate_scheduled' | 'estimate_sent' | 'booked' | 'in_progress' | 'completed' | 'invoiced',
        source: 'referral',
        assignedTo: '',
        notes: '',
      });
      triggerConfetti();
      setErrors({});
    }
  };

  const handleNext = () => {
    switch (step) {
      case 'company':
        if (validateCompanyStep()) {
          updateSettings({
            companyName,
            companyPhone: phone,
            companyEmail: email,
            companyAddress: address,
            industry,
            companyProvince: province,
          });
          setStep('contact');
        }
        break;
      case 'contact':
        if (contacts.length === 0) {
          setErrors({ general: 'Please add at least one contact' });
        } else {
          setStep('deal');
        }
        break;
      case 'deal':
        if (deals.length === 0) {
          setErrors({ general: 'Please add at least one deal' });
        } else {
          setStep('estimate');
        }
        break;
      case 'estimate':
        setStep('automation');
        break;
      case 'automation':
        updateSettings({
          companyName,
          companyPhone: phone,
          companyEmail: email,
          companyAddress: address,
          industry,
          companyProvince: province,
        });
        setStep('ready');
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    const steps: StepName[] = ['company', 'contact', 'deal', 'estimate', 'automation', 'ready'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleLaunch = () => {
    updateSettings({
      companyName,
      companyPhone: phone,
      companyEmail: email,
      companyAddress: address,
      industry,
      companyProvince: province,
    });
    localStorage.setItem('growth-os-onboarded', 'true');
    setSetupCompleted(true);
    router.push('/dashboard');
  };

  // Step indicator
  const steps: { name: StepName; label: string }[] = [
    { name: 'company', label: 'Company' },
    { name: 'contact', label: 'Contact' },
    { name: 'deal', label: 'Deal' },
    { name: 'estimate', label: 'Estimate' },
    { name: 'automation', label: 'Automation' },
    { name: 'ready', label: 'Ready' },
  ];

  const currentStepIndex = steps.findIndex(s => s.name === step);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gradient-to-br from-slate-950 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-200 ${isDark ? 'border-slate-800 bg-slate-900/80 backdrop-blur' : 'border-slate-200 bg-white/80 backdrop-blur'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-3xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Let's get your business set up in under 5 minutes
            </h1>
          </div>
          <p className={`text-sm mt-1 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            We'll walk you through 6 quick steps to supercharge your growth
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`transition-colors duration-200 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s.name} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 flex-shrink-0 ${
                    i < currentStepIndex
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                      : i === currentStepIndex
                        ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white ring-4 ring-green-200 dark:ring-green-900'
                        : isDark
                          ? 'bg-slate-700 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {i < currentStepIndex ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all duration-300 ${
                      i < currentStepIndex
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : isDark
                          ? 'bg-slate-700'
                          : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className={`text-sm font-medium transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].label}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-2xl shadow-xl transition-all duration-300 ${isDark ? 'bg-slate-800/90 backdrop-blur border border-slate-700' : 'bg-white shadow-lg border border-slate-100'} p-8 sm:p-12`}>
          {/* Step 1: Company Info */}
          {step === 'company' && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-green-500" />
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tell us about your business
                </h2>
              </div>
              <p className={`mb-8 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                We'll customize GrowthOS to match your industry and region
              </p>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company-name" className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g., Smith Plumbing"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.companyName
                          ? 'border-red-500 focus:ring-red-500'
                          : isDark
                            ? 'border-slate-600 focus:ring-green-500'
                            : 'border-slate-300 focus:ring-green-500'
                      } ${isDark ? 'bg-slate-700/50 text-white' : 'bg-slate-50'} focus:outline-none focus:ring-2`}
                    />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <label htmlFor="industry" className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-slate-300 bg-slate-50'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>
                          {INDUSTRY_LABELS[ind]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="province" className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="province"
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-slate-300 bg-slate-50'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  >
                    {CANADIAN_PROVINCES.map(prov => (
                      <option key={prov.id} value={prov.id}>
                        {prov.label}
                      </option>
                    ))}
                  </select>
                  <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Tax rates will be automatically applied based on your province
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="info@yourbusiness.com"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : isDark
                            ? 'border-slate-600 focus:ring-green-500'
                            : 'border-slate-300 focus:ring-green-500'
                      } ${isDark ? 'bg-slate-700/50 text-white' : 'bg-slate-50'} focus:outline-none focus:ring-2`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Business Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : isDark
                            ? 'border-slate-600 focus:ring-green-500'
                            : 'border-slate-300 focus:ring-green-500'
                      } ${isDark ? 'bg-slate-700/50 text-white' : 'bg-slate-50'} focus:outline-none focus:ring-2`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Business Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="123 Main St, Toronto, ON"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-slate-300 bg-slate-50'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add First Contact */}
          {step === 'contact' && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-blue-500" />
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Add your first contact
                </h2>
              </div>
              <p className={`mb-8 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                This could be a lead, customer, or prospect you're interested in
              </p>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.general}
                </div>
              )}

              {/* Example preview */}
              {showingExample && (
                <div className={`mb-8 p-6 rounded-lg border-2 transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/30' : 'border-blue-200 bg-blue-50'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-blue-600'}`}>
                    Example contact
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Name</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{EXAMPLE_CONTACT.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Phone</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{EXAMPLE_CONTACT.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Email</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{EXAMPLE_CONTACT.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contacts added */}
              {contacts.length > 0 && (
                <div className="mb-8 space-y-3">
                  <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Contacts added ({contacts.length})
                  </p>
                  {contacts.map(contact => (
                    <div
                      key={contact.id}
                      className={`p-4 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-green-200 bg-green-50'}`}
                    >
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact.name}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{contact.email}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add contact form */}
              <div className={`border-t ${isDark ? 'border-slate-600 pt-8' : 'border-slate-200 pt-8'}`}>
                <h3 className={`text-sm font-bold mb-5 uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {contacts.length > 0 ? 'Add another contact' : 'Enter contact details'}
                </h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="John Smith"
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          errors.contactName
                            ? 'border-red-500'
                            : isDark
                              ? 'border-slate-600 bg-slate-700/50 text-white'
                              : 'border-slate-300 bg-slate-50'
                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          errors.contactEmail
                            ? 'border-red-500'
                            : isDark
                              ? 'border-slate-600 bg-slate-700/50 text-white'
                              : 'border-slate-300 bg-slate-50'
                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          errors.contactPhone
                            ? 'border-red-500'
                            : isDark
                              ? 'border-slate-600 bg-slate-700/50 text-white'
                              : 'border-slate-300 bg-slate-50'
                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-type" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contact-type"
                        value={contactType}
                        onChange={e => setContactType(e.target.value as 'customer' | 'lead')}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-slate-300 bg-slate-50'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      >
                        <option value="lead">Lead</option>
                        <option value="customer">Customer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-address" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Address
                    </label>
                    <input
                      id="contact-address"
                      type="text"
                      value={contactAddress}
                      onChange={e => setContactAddress(e.target.value)}
                      placeholder="123 Main St, Toronto, ON"
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-slate-300 bg-slate-50'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                  </div>

                  <button
                    onClick={handleAddContact}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    Add Contact
                  </button>
                </div>
              </div>

              {contacts.length > 0 && (
                <p className={`text-xs mt-6 text-center ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  You can add more contacts later from the dashboard
                </p>
              )}
            </div>
          )}

          {/* Step 3: Create First Deal */}
          {step === 'deal' && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Create your first deal
                </h2>
              </div>
              <p className={`mb-8 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                This deal will be linked to {currentContact?.name} and will show in your pipeline
              </p>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.general}
                </div>
              )}

              {/* Contact reference */}
              {currentContact && (
                <div className={`mb-8 p-5 rounded-lg border-2 transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/30' : 'border-purple-200 bg-purple-50'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-slate-400' : 'text-purple-600'}`}>
                    This deal is for
                  </p>
                  <p className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentContact.name}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{currentContact.email}</p>
                </div>
              )}

              {/* Pipeline preview */}
              <div className={`mb-8 p-6 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/20' : 'border-slate-200 bg-slate-50'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Your pipeline will look like this
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {['New Lead', 'Contacted', 'Estimate Sent', 'Booked', 'In Progress', 'Completed'].map((stage, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 rounded-lg whitespace-nowrap font-medium transition-all ${
                        stage === dealStage
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-105'
                          : isDark
                            ? 'bg-slate-600 text-slate-300'
                            : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {stage}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deal form */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="deal-title" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Deal Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="deal-title"
                    type="text"
                    value={dealTitle}
                    onChange={e => setDealTitle(e.target.value)}
                    placeholder="e.g., Kitchen Plumbing Overhaul"
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      errors.dealTitle
                        ? 'border-red-500'
                        : isDark
                          ? 'border-slate-600 bg-slate-700/50 text-white'
                          : 'border-slate-300 bg-slate-50'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.dealTitle && <p className="text-red-500 text-sm mt-1">{errors.dealTitle}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="deal-value" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Deal Value <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>$</span>
                      <input
                        id="deal-value"
                        type="number"
                        value={dealValue}
                        onChange={e => setDealValue(e.target.value)}
                        placeholder="5,000"
                        className={`flex-1 px-4 py-3 rounded-lg border transition-colors duration-200 ${
                          errors.dealValue
                            ? 'border-red-500'
                            : isDark
                              ? 'border-slate-600 bg-slate-700/50 text-white'
                              : 'border-slate-300 bg-slate-50'
                        } focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                    </div>
                    {errors.dealValue && <p className="text-red-500 text-sm mt-1">{errors.dealValue}</p>}
                  </div>
                  <div>
                    <label htmlFor="deal-stage" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Stage
                    </label>
                    <select
                      id="deal-stage"
                      value={dealStage}
                      onChange={e => setDealStage(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-slate-300 bg-slate-50'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                      <option>New Lead</option>
                      <option>Contacted</option>
                      <option>Estimate Scheduled</option>
                      <option>Estimate Sent</option>
                      <option>Booked</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddDeal}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Create Deal
                </button>
              </div>

              {/* Celebration animation */}
              {celebrationShow && (
                <div
                  ref={confettiRef}
                  className="fixed inset-0 pointer-events-none"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Estimate Preview */}
          {step === 'estimate' && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-orange-500" />
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Your first estimate
                </h2>
              </div>
              <p className={`mb-8 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Send professional estimates in 30 seconds. Here's what it looks like:
              </p>

              {/* Estimate preview */}
              <div className={`mb-8 rounded-lg border transition-colors duration-200 overflow-hidden ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-300 bg-white shadow-md'}`}>
                <div className={`p-8 ${isDark ? 'bg-slate-800' : 'bg-white border-b border-slate-200'}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {companyName || 'Your Company'}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        ESTIMATE
                      </p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        #001
                      </p>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className={`mb-8 p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Estimate for
                    </p>
                    <h4 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currentContact?.name || 'Customer Name'}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {currentContact?.email}
                    </p>
                  </div>

                  {/* Deal details */}
                  <div className="mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                          <th className={`text-left text-xs font-semibold uppercase tracking-wide pb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Description
                          </th>
                          <th className={`text-right text-xs font-semibold uppercase tracking-wide pb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={`border-b ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                          <td className={`py-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {dealTitle || 'Service Description'}
                          </td>
                          <td className={`text-right py-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ${parseFloat(dealValue) || 5000}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <div className="flex justify-between mb-3">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Subtotal</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ${parseFloat(dealValue) || 5000}
                      </span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Tax (13%)</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ${(parseFloat(dealValue) * 0.13 || 5000 * 0.13).toFixed(2)}
                      </span>
                    </div>
                    <div className={`flex justify-between pt-3 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                      <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Total</span>
                      <span className={`text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`}>
                        ${(parseFloat(dealValue) * 1.13 || 5000 * 1.13).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={`p-6 ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                  <p className={`text-sm text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Thank you for your business. Please reply to confirm or ask any questions.
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${isDark ? 'border-green-900/50 bg-green-900/10' : 'border-green-200 bg-green-50'}`}>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                  <span className="font-semibold">Lightning-fast estimates:</span> In GrowthOS, you can create professional estimates like this one in 30 seconds. Add line items, apply taxes based on your province, and send with one click. Customers get a beautiful email they can sign digitally.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Automation */}
          {step === 'automation' && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8 text-yellow-500" />
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Turn on Autopilot
                </h2>
              </div>
              <p className={`mb-8 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Activate our 3 most impactful automations to grow faster
              </p>

              <div className="space-y-4">
                {AUTOMATION_PLAYBOOKS.map(playbook => {
                  const IconComponent = playbook.icon;
                  const isActive = activeAutomations.includes(playbook.id);
                  return (
                    <button
                      key={playbook.id}
                      onClick={() => {
                        setActiveAutomations(
                          isActive
                            ? activeAutomations.filter(id => id !== playbook.id)
                            : [...activeAutomations, playbook.id]
                        );
                      }}
                      className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                        isActive
                          ? `border-green-500 ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`
                          : `border-slate-300 dark:border-slate-600 ${isDark ? 'bg-slate-700/30' : 'bg-white'} hover:border-slate-400 dark:hover:border-slate-500`
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${isActive ? 'bg-gradient-to-br from-green-500 to-emerald-600' : isDark ? 'bg-slate-600' : 'bg-slate-100'}`}>
                          <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg mb-1 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {playbook.name}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {playbook.description}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isActive
                            ? 'border-green-500 bg-green-500'
                            : isDark
                              ? 'border-slate-500'
                              : 'border-slate-400'
                        }`}>
                          {isActive && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={`mt-8 p-6 rounded-lg border ${isDark ? 'border-slate-600 bg-slate-700/20' : 'border-slate-200 bg-slate-50'}`}>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="font-semibold">Pro tip:</span> These automations will save you hours every month. You can customize them anytime from the settings panel.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Ready */}
          {step === 'ready' && (
            <div className="text-center animate-fadeIn">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-xl`}>
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className={`text-4xl font-bold mb-4 transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Holy shit, you're ready!
              </h2>
              <p className={`text-lg mb-8 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                You've set up your GrowthOS in under 5 minutes. Now let's start growing.
              </p>

              {/* Summary */}
              <div className="grid sm:grid-cols-3 gap-4 mb-12">
                <div className={`p-5 rounded-lg border-2 transition-colors ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {contacts.length}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {contacts.length === 1 ? 'Contact' : 'Contacts'}
                  </p>
                </div>
                <div className={`p-5 rounded-lg border-2 transition-colors ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {deals.length}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {deals.length === 1 ? 'Deal' : 'Deals'}
                  </p>
                </div>
                <div className={`p-5 rounded-lg border-2 transition-colors ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeAutomations.length}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Automations Active
                  </p>
                </div>
              </div>

              {/* Next steps */}
              <div className="space-y-3 mb-12 text-left max-w-2xl mx-auto">
                <div className={`p-5 rounded-lg border transition-colors ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    View your pipeline
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    See all your deals in one visual board and move them through stages
                  </p>
                </div>
                <div className={`p-5 rounded-lg border transition-colors ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Send your first estimate
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Create and send a professional estimate to {currentContact?.name} in 30 seconds
                  </p>
                </div>
                <div className={`p-5 rounded-lg border transition-colors ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Watch your automations work
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Your speed-to-lead automation is already sending responses to new inquiries
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className={`flex gap-4 mt-12 pt-8 border-t transition-colors duration-200 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={handleBack}
              disabled={step === 'company'}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                step === 'company'
                  ? `opacity-50 cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'}`
                  : isDark
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {step === 'ready' ? (
              <button
                onClick={handleLaunch}
                className="ml-auto flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all hover:shadow-xl shadow-lg shadow-green-500/30"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="ml-auto flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all hover:shadow-xl shadow-lg shadow-green-500/30"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
