'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2, Circle, ChevronRight, Building2, Users, UserPlus,
  Star, Zap, FileText, CreditCard, Calendar, ArrowRight, Sparkles,
  Phone, MapPin, Globe, Camera, Plus, X, Clock, Trophy, Rocket,
  AlertCircle, PartyPopper, TrendingUp, Shield, Heart, Mail,
  MousePointerClick,
} from 'lucide-react';
import { GuidedTour, TOURS } from '@/components/GuidedTour';

// ============================================================
// TYPES
// ============================================================

interface SetupStep {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  icon: React.ReactNode;
  category: 'foundation' | 'growth' | 'autopilot';
  estimatedTime: string;
  isCompleted: boolean;
  fields?: FormField[];
  linkTo?: string;
  linkLabel?: string;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'url' | 'textarea' | 'select' | 'file';
  placeholder: string;
  required: boolean;
  options?: string[];
  hint?: string;
}

// ============================================================
// SETUP STEPS — The guided onboarding flow
// ============================================================

const INITIAL_STEPS: SetupStep[] = [
  {
    id: 'company-profile',
    title: 'Set Up Your Company',
    description: 'Add your business name, phone number, and logo. This info appears on every estimate, invoice, and message your customers see.',
    whyItMatters: 'Customers trust businesses that look professional. A complete profile increases conversion by 23%.',
    icon: <Building2 className="w-6 h-6" />,
    category: 'foundation',
    estimatedTime: '2 min',
    isCompleted: false,
    fields: [
      { id: 'company_name', label: 'Business Name', type: 'text', placeholder: 'e.g., Denver Pro Plumbing', required: true },
      { id: 'phone', label: 'Business Phone', type: 'tel', placeholder: '(555) 123-4567', required: true, hint: 'This is the number customers will call' },
      { id: 'email', label: 'Business Email', type: 'email', placeholder: 'info@denverproplumbing.com', required: true },
      { id: 'address', label: 'Business Address', type: 'text', placeholder: '123 Main St, Denver, CO 80202', required: false },
      { id: 'website', label: 'Website', type: 'url', placeholder: 'https://denverproplumbing.com', required: false },
      { id: 'trade', label: 'Primary Trade', type: 'select', placeholder: 'Select your trade...', required: true, options: ['Plumbing', 'HVAC', 'Electrical', 'Landscaping', 'Cleaning', 'Roofing', 'General Contracting', 'Pest Control', 'Painting', 'Other'] },
    ],
  },
  {
    id: 'service-area',
    title: 'Define Your Service Area',
    description: 'Tell us where you work so we can help you target the right customers and filter leads by location.',
    whyItMatters: 'Knowing your service area helps optimize scheduling and reduces drive time between jobs.',
    icon: <MapPin className="w-6 h-6" />,
    category: 'foundation',
    estimatedTime: '1 min',
    isCompleted: false,
    fields: [
      { id: 'service_zip', label: 'Primary ZIP Code', type: 'text', placeholder: '80202', required: true },
      { id: 'service_radius', label: 'Service Radius', type: 'select', placeholder: 'How far will you travel?', required: true, options: ['10 miles', '15 miles', '25 miles', '50 miles', '75+ miles'] },
      { id: 'service_cities', label: 'Cities You Serve', type: 'text', placeholder: 'e.g., Denver, Aurora, Lakewood, Arvada', required: false, hint: 'Separate with commas' },
    ],
  },
  {
    id: 'add-team',
    title: 'Add Your First Team Member',
    description: 'Add a technician or office staff member. Jobs and leads get assigned to team members for accountability.',
    whyItMatters: 'Assigned leads are 3x more likely to get followed up. No more leads falling through the cracks.',
    icon: <UserPlus className="w-6 h-6" />,
    category: 'foundation',
    estimatedTime: '2 min',
    isCompleted: false,
    fields: [
      { id: 'member_name', label: 'Full Name', type: 'text', placeholder: 'e.g., Marcus Johnson', required: true },
      { id: 'member_role', label: 'Role', type: 'select', placeholder: 'Select role...', required: true, options: ['Technician', 'Office Manager', 'Dispatcher', 'Owner/Operator', 'Apprentice'] },
      { id: 'member_phone', label: 'Cell Phone', type: 'tel', placeholder: '(555) 987-6543', required: true, hint: 'For job notifications and dispatch alerts' },
      { id: 'member_email', label: 'Email', type: 'email', placeholder: 'marcus@email.com', required: false },
    ],
  },
  {
    id: 'add-customers',
    title: 'Import Your Customers',
    description: 'Add your first 5 customers or import from a spreadsheet. These are the people who already know and trust you — your Ring 1.',
    whyItMatters: 'Your existing customers are 5x more likely to book than cold leads. Start with the people who already love you.',
    icon: <Users className="w-6 h-6" />,
    category: 'foundation',
    estimatedTime: '3 min',
    isCompleted: false,
    linkTo: '/contacts',
    linkLabel: 'Go to Contacts to add customers',
    fields: [
      { id: 'customer_name', label: 'Customer Name', type: 'text', placeholder: 'e.g., John Smith', required: true },
      { id: 'customer_phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567', required: true },
      { id: 'customer_email', label: 'Email', type: 'email', placeholder: 'john@email.com', required: false },
      { id: 'customer_address', label: 'Service Address', type: 'text', placeholder: '456 Oak Street, Denver, CO', required: false },
    ],
  },
  {
    id: 'google-review',
    title: 'Connect Your Google Review Link',
    description: 'Paste your Google Business Profile review link so we can automatically send review requests after every job.',
    whyItMatters: 'Businesses with 50+ Google reviews get 266% more leads than those with fewer than 10.',
    icon: <Star className="w-6 h-6" />,
    category: 'growth',
    estimatedTime: '2 min',
    isCompleted: false,
    fields: [
      { id: 'review_link', label: 'Google Review Link', type: 'url', placeholder: 'https://g.page/r/your-business/review', required: true, hint: 'Search "Google Business Profile" → click your business → Share → "Ask for reviews" → copy the link' },
      { id: 'review_goal', label: 'Monthly Review Goal', type: 'select', placeholder: 'How many reviews per month?', required: false, options: ['5 reviews/month', '10 reviews/month', '15 reviews/month', '20+ reviews/month'] },
    ],
  },
  {
    id: 'activate-autopilot',
    title: 'Activate Your First Autopilot Playbook',
    description: 'Turn on at least one automation to start working smarter. We recommend "Speed to Lead" — it responds to new leads in under 60 seconds.',
    whyItMatters: 'Businesses that respond within 5 minutes are 100x more likely to connect with a lead than those who wait 30 minutes.',
    icon: <Zap className="w-6 h-6" />,
    category: 'autopilot',
    estimatedTime: '1 min',
    isCompleted: false,
    linkTo: '/automations',
    linkLabel: 'Go to Autopilot to activate',
  },
  {
    id: 'first-estimate',
    title: 'Create Your First Estimate',
    description: 'Build a Good/Better/Best estimate to see how Growth OS helps you upsell and close more jobs.',
    whyItMatters: 'Good/Better/Best pricing increases average ticket size by 28%. The "Better" option is chosen 62% of the time.',
    icon: <FileText className="w-6 h-6" />,
    category: 'growth',
    estimatedTime: '3 min',
    isCompleted: false,
    linkTo: '/estimates',
    linkLabel: 'Go to Estimates to create one',
  },
  {
    id: 'payment-setup',
    title: 'Set Up Online Payments',
    description: 'Connect Stripe so customers can pay invoices online with one click. Faster payments = healthier cash flow.',
    whyItMatters: 'Businesses that offer online payments get paid 14 days faster on average.',
    icon: <CreditCard className="w-6 h-6" />,
    category: 'growth',
    estimatedTime: '5 min',
    isCompleted: false,
    linkTo: '/settings',
    linkLabel: 'Go to Settings → Integrations',
  },
];

// ============================================================
// CATEGORY CONFIG
// ============================================================

const CATEGORIES = {
  foundation: { label: 'Foundation', color: 'blue', description: 'Get the basics right' },
  growth: { label: 'Growth Setup', color: 'emerald', description: 'Set up your growth engine' },
  autopilot: { label: 'Autopilot', color: 'purple', description: 'Turn on the automation' },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SetupPage() {
  const [mounted, setMounted] = useState(false);
  const [steps, setSteps] = useState<SetupStep[]>(INITIAL_STEPS);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Auto-open the first incomplete step
    const firstIncomplete = INITIAL_STEPS.find((s) => !s.isCompleted);
    if (firstIncomplete) setActiveStepId(firstIncomplete.id);
  }, []);

  if (!mounted) return <div className="p-8">Loading...</div>;

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const allComplete = completedCount === totalSteps;

  const completeStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, isCompleted: true } : s))
    );

    // Auto-advance to next incomplete step
    const currentIndex = steps.findIndex((s) => s.id === stepId);
    const nextIncomplete = steps.find((s, i) => i > currentIndex && !s.isCompleted);
    if (nextIncomplete) {
      setActiveStepId(nextIncomplete.id);
    } else {
      setActiveStepId(null);
      // Check if all complete
      const newCompleted = steps.filter((s) => s.isCompleted).length + 1;
      if (newCompleted === totalSteps) {
        setShowCelebration(true);
      }
    }
    setFormData({});
  };

  const skipStep = (stepId: string) => {
    const currentIndex = steps.findIndex((s) => s.id === stepId);
    const nextStep = steps.find((s, i) => i > currentIndex);
    if (nextStep) setActiveStepId(nextStep.id);
  };

  const activeStep = steps.find((s) => s.id === activeStepId);

  // Motivation messages based on progress
  const getMotivation = () => {
    if (completedCount === 0) return "Let's get you set up! This takes about 15 minutes and we'll walk you through every step.";
    if (completedCount <= 2) return "Great start! You're laying the foundation for a well-run business.";
    if (completedCount <= 4) return "You're on a roll! Most owners don't get this far — you're already ahead of the competition.";
    if (completedCount <= 6) return "Almost there! Just a few more steps to unlock your full growth potential.";
    if (completedCount < totalSteps) return "One more step and you're fully set up! Your competitors are still using sticky notes.";
    return "You're all set! Growth OS is ready to help you grow.";
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Guided Tour Overlay */}
      {activeTourId && TOURS[activeTourId] && (
        <GuidedTour
          tour={TOURS[activeTourId]}
          onComplete={() => {
            setActiveTourId(null);
          }}
          onClose={() => setActiveTourId(null)}
        />
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 max-w-lg text-center shadow-2xl animate-in">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">You&apos;re All Set!</h2>
            <p className="text-slate-600 mb-2">
              Growth OS is fully configured and ready to help you grow your business.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Your Autopilot playbooks are running, your profile is complete, and you&apos;re ahead of 90% of service businesses out there. Let&apos;s go get some jobs.
            </p>
            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg text-center"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => setShowCelebration(false)}
                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-center"
              >
                Review Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Get Started</h1>
            <p className="text-slate-600">Complete these steps to get the most out of Growth OS. We&apos;ll walk you through everything.</p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-6 mb-6">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">SETUP PROGRESS</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold">{progressPercent}%</span>
                <span className="text-slate-400 text-sm">{completedCount} of {totalSteps} steps complete</span>
              </div>
              <p className="text-blue-300 text-sm mt-2">{getMotivation()}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Est. time left</p>
                <p className="text-lg font-bold">
                  {Math.max(0, (totalSteps - completedCount) * 2)} min
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: allComplete
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : 'linear-gradient(90deg, #3B82F6, #60A5FA)',
              }}
            />
          </div>

          {/* Step Dots */}
          <div className="flex justify-between mt-4 px-1">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step.isCompleted
                    ? 'bg-emerald-500 text-white'
                    : activeStepId === step.id
                      ? 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2 ring-offset-slate-900'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {step.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = activeStepId === step.id;
          const categoryConfig = CATEGORIES[step.category];

          return (
            <div
              key={step.id}
              className={`bg-white rounded-2xl border transition-all ${
                step.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : isActive
                    ? 'border-blue-300 shadow-lg shadow-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Step Header */}
              <button
                onClick={() => setActiveStepId(isActive ? null : step.id)}
                className="w-full p-6 flex items-center gap-4 text-left"
              >
                {/* Step Number / Check */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  step.isCompleted
                    ? 'bg-emerald-100 text-emerald-600'
                    : isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {step.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    step.icon
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-lg font-bold ${
                      step.isCompleted ? 'text-emerald-700' : 'text-slate-900'
                    }`}>
                      {step.isCompleted && 'Done — '}{step.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      step.category === 'foundation'
                        ? 'bg-blue-100 text-blue-600'
                        : step.category === 'growth'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-purple-100 text-purple-600'
                    }`}>
                      {categoryConfig.label}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.estimatedTime}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1">{step.description}</p>
                </div>

                <ChevronRight className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                  isActive ? 'rotate-90' : ''
                }`} />
              </button>

              {/* Expanded Content */}
              {isActive && !step.isCompleted && (
                <div className="px-6 pb-6 border-t border-slate-100">
                  <div className="pt-5">
                    {/* Why It Matters */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800 mb-0.5">Why this matters</p>
                          <p className="text-sm text-amber-700">{step.whyItMatters}</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    {step.fields && (
                      <div className="space-y-4 mb-6">
                        {step.fields.map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                              {field.label}
                              {field.required && <span className="text-rose-500 ml-1">*</span>}
                            </label>
                            {field.type === 'select' ? (
                              <select
                                value={formData[field.id] || ''}
                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                              >
                                <option value="">{field.placeholder}</option>
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : field.type === 'textarea' ? (
                              <textarea
                                value={formData[field.id] || ''}
                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                placeholder={field.placeholder}
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                              />
                            ) : (
                              <input
                                type={field.type}
                                value={formData[field.id] || ''}
                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            )}
                            {field.hint && (
                              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {field.hint}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Link to page (for steps without forms) */}
                    {step.linkTo && !step.fields && (
                      <Link
                        href={step.linkTo}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition mb-6 text-sm"
                      >
                        <ArrowRight className="w-4 h-4" />
                        {step.linkLabel}
                      </Link>
                    )}

                    {/* Walk Me Through It Button */}
                    {TOURS[step.id] && (
                      <button
                        onClick={() => setActiveTourId(step.id)}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 rounded-xl font-medium hover:from-blue-100 hover:to-purple-100 transition-all mb-4 w-full justify-center text-sm"
                      >
                        <MousePointerClick className="w-4 h-4" />
                        Walk me through this step-by-step
                      </button>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => completeStep(step.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {step.fields ? 'Save & Continue' : 'Mark Complete'}
                      </button>
                      <button
                        onClick={() => skipStep(step.id)}
                        className="px-4 py-3 text-sm text-slate-500 hover:text-slate-700 font-medium transition"
                      >
                        Skip for now
                      </button>
                      {step.linkTo && step.fields && (
                        <Link
                          href={step.linkTo}
                          className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          {step.linkLabel}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Help Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Need help?</h4>
          <p className="text-sm text-slate-600">
            Our team is here to help you get set up. Call us at (888) 555-GROW or chat with us anytime.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Your data is safe</h4>
          <p className="text-sm text-slate-600">
            Everything you enter is encrypted and secure. We never sell your data. You own it, period.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Built for the trades</h4>
          <p className="text-sm text-slate-600">
            Growth OS was built by people who understand service businesses. Every feature is designed for the way you actually work.
          </p>
        </div>
      </div>
    </div>
  );
}
