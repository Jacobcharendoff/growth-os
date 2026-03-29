'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  X, ChevronRight, ChevronLeft, CheckCircle2, Lightbulb,
  MousePointerClick, ArrowRight, Sparkles, Trophy,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

export interface TourStep {
  title: string;
  content: string;
  tip?: string;
  highlight?: string; // CSS selector or description of what to look at
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string; // What the user should do
  navigateTo?: string; // Auto-navigate to a page
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
}

interface GuidedTourProps {
  tour: Tour;
  onComplete: () => void;
  onClose: () => void;
}

// ============================================================
// TOUR DEFINITIONS — All guided walkthroughs
// ============================================================

export const TOURS: Record<string, Tour> = {
  'company-profile': {
    id: 'company-profile',
    name: 'Set Up Your Company',
    description: 'Walk through adding your business details',
    steps: [
      {
        title: 'Welcome! Let\'s set up your company',
        content: 'This takes about 2 minutes. We\'ll walk you through each field — just fill them in and click "Next" when you\'re ready.',
        position: 'center',
        action: 'Click "Next" to start',
      },
      {
        title: 'Business Name',
        content: 'Type your business name exactly how you want customers to see it. This appears on every estimate, invoice, and message.',
        tip: 'Use your full legal business name, like "Denver Pro Plumbing LLC" — not just "DPP".',
        position: 'top',
        highlight: 'company_name',
        action: 'Type your business name',
      },
      {
        title: 'Business Phone',
        content: 'This is the number customers will call. It shows on your estimates, invoices, and appointment confirmations.',
        tip: 'Use your main business line, not a personal cell. If you don\'t have one yet, Google Voice is free.',
        position: 'top',
        highlight: 'phone',
        action: 'Enter your business phone number',
      },
      {
        title: 'Business Email',
        content: 'Estimate PDFs, invoice notifications, and review requests all come from this address.',
        tip: 'A professional email like info@yourbusiness.com builds more trust than a Gmail address.',
        position: 'top',
        highlight: 'email',
        action: 'Enter your business email',
      },
      {
        title: 'Primary Trade',
        content: 'This helps us customize your templates, seasonal campaigns, and pricing defaults for your specific industry.',
        tip: 'Pick your main trade. You can always offer additional services later.',
        position: 'top',
        highlight: 'trade',
        action: 'Select your trade from the dropdown',
      },
      {
        title: 'You\'re done with this step!',
        content: 'Hit "Save & Continue" below and we\'ll move to the next step. Your company profile will appear on all customer-facing documents.',
        position: 'center',
        action: 'Click "Save & Continue"',
      },
    ],
  },
  'service-area': {
    id: 'service-area',
    name: 'Define Your Service Area',
    description: 'Set your coverage zone',
    steps: [
      {
        title: 'Where do you work?',
        content: 'Your service area helps us filter leads by location and optimize your schedule to reduce drive time between jobs.',
        position: 'center',
        action: 'Click "Next" to start',
      },
      {
        title: 'Primary ZIP Code',
        content: 'Enter the ZIP code where your shop or home base is located. We\'ll use this as the center of your service area.',
        tip: 'This is usually where your trucks start each morning.',
        position: 'top',
        highlight: 'service_zip',
        action: 'Enter your ZIP code',
      },
      {
        title: 'Service Radius',
        content: 'How far are you willing to drive for a job? Most residential service businesses stay within 15-25 miles.',
        tip: 'Start smaller and expand later. A tight service area means less windshield time and more billable hours.',
        position: 'top',
        highlight: 'service_radius',
        action: 'Select your radius',
      },
      {
        title: 'Service area set!',
        content: 'Now when leads come in, you\'ll know instantly if they\'re in your zone. No more wasted trips to the other side of town.',
        position: 'center',
        action: 'Click "Save & Continue"',
      },
    ],
  },
  'add-team': {
    id: 'add-team',
    name: 'Add Your First Team Member',
    description: 'Add a tech or office staff',
    steps: [
      {
        title: 'Who\'s on your team?',
        content: 'Adding team members lets you assign leads, schedule jobs by technician, and send dispatch notifications automatically.',
        position: 'center',
        action: 'Click "Next" to start',
      },
      {
        title: 'Team Member Name',
        content: 'This name shows up on the schedule, in customer texts ("Marcus is on his way!"), and on job assignments.',
        position: 'top',
        highlight: 'member_name',
        action: 'Type their full name',
      },
      {
        title: 'Their Role',
        content: 'Different roles see different things. Technicians see their jobs. Office managers see everything. Dispatchers manage the schedule.',
        tip: 'If you\'re a one-person shop, add yourself as "Owner/Operator" — you can add more people later.',
        position: 'top',
        highlight: 'member_role',
        action: 'Select their role',
      },
      {
        title: 'Cell Phone Number',
        content: 'This is crucial — when a job gets assigned or the schedule changes, they get an instant text notification. No more missed dispatches.',
        tip: 'Make sure this is their personal cell, not the office line.',
        position: 'top',
        highlight: 'member_phone',
        action: 'Enter their cell number',
      },
      {
        title: 'Team member ready!',
        content: 'They\'ll now appear in the schedule and can be assigned to jobs. The "On My Way" automation will use their name in customer texts.',
        position: 'center',
        action: 'Click "Save & Continue"',
      },
    ],
  },
  'add-customers': {
    id: 'add-customers',
    name: 'Import Your Customers',
    description: 'Add your existing customers',
    steps: [
      {
        title: 'Your most valuable asset: existing customers',
        content: 'These are your Ring 1 — the people who already know and trust you. They\'re 5x more likely to book than a cold lead.',
        position: 'center',
        action: 'Click "Next" to start',
      },
      {
        title: 'Add at least 5 customers',
        content: 'Start with your best customers — the ones who call you back every year. The Reactivation Engine will automatically keep in touch with them.',
        tip: 'Don\'t have a list? Check your recent call history or old invoices. Even 5 names is a great start.',
        position: 'top',
        highlight: 'customer_name',
        action: 'Enter a customer name',
      },
      {
        title: 'Their phone number',
        content: 'With a phone number, the system can send appointment reminders, "on my way" texts, and review requests automatically.',
        position: 'top',
        highlight: 'customer_phone',
        action: 'Enter their phone number',
      },
      {
        title: 'Service address',
        content: 'The address helps with scheduling — we can estimate drive times and group nearby jobs together to save windshield time.',
        tip: 'For property managers, enter the property address, not their office.',
        position: 'top',
        highlight: 'customer_address',
        action: 'Enter the service address',
      },
      {
        title: 'Great start!',
        content: 'You can add more customers anytime from the Contacts page. You can also import a CSV spreadsheet if you have one.',
        position: 'center',
        action: 'Click "Save & Continue"',
      },
    ],
  },
  'google-review': {
    id: 'google-review',
    name: 'Connect Google Reviews',
    description: 'Set up automatic review requests',
    steps: [
      {
        title: 'Reviews are your #1 growth lever',
        content: 'Businesses with 50+ Google reviews get 266% more leads. The 5-Star Review Machine sends requests after every job — but it needs your review link first.',
        position: 'center',
        action: 'Click "Next" to get your link',
      },
      {
        title: 'How to find your Google review link',
        content: 'Here\'s exactly what to do:\n\n1. Google your business name\n2. Click your Google Business Profile on the right side\n3. Click "Ask for reviews"\n4. Copy the link that appears\n5. Paste it here',
        tip: 'If you don\'t have a Google Business Profile yet, go to business.google.com to create one for free. It\'s the single most important thing for local search.',
        position: 'top',
        highlight: 'review_link',
        action: 'Paste your Google review link',
      },
      {
        title: 'Set a monthly goal',
        content: 'Having a target keeps you motivated. Most service businesses with GrowthOS get 10-15 new reviews per month automatically.',
        position: 'top',
        highlight: 'review_goal',
        action: 'Pick a review goal',
      },
      {
        title: 'Review machine is ready!',
        content: 'Once you activate the "5-Star Review Machine" playbook in Autopilot, every completed job will automatically trigger a review request. No more forgetting to ask.',
        position: 'center',
        action: 'Click "Save & Continue"',
      },
    ],
  },
  'activate-autopilot': {
    id: 'activate-autopilot',
    name: 'Activate Autopilot',
    description: 'Turn on your first automation',
    steps: [
      {
        title: 'Time to put your business on autopilot',
        content: 'This is where the magic happens. With one click, you\'ll activate automation sequences that would take you hours to do manually.',
        position: 'center',
        action: 'Click "Next" to see your options',
      },
      {
        title: 'We recommend starting with "Speed to Lead"',
        content: 'It automatically responds to every new lead within 60 seconds with a text and email. The first business to respond wins 78% of the time — this alone can transform your close rate.',
        tip: 'You can activate all free playbooks at once, or start with one and add more as you get comfortable.',
        position: 'center',
        navigateTo: '/automations',
        action: 'Go to the Autopilot page and click "Activate" on Speed to Lead',
      },
      {
        title: 'You\'re on autopilot!',
        content: 'Every playbook you activate works 24/7 in the background — following up on estimates, requesting reviews, chasing payments, and more. You focus on the work. GrowthOS handles the rest.',
        position: 'center',
        action: 'Head back to Setup to continue',
      },
    ],
  },
  'first-estimate': {
    id: 'first-estimate',
    name: 'Create Your First Estimate',
    description: 'Build a Good/Better/Best quote',
    steps: [
      {
        title: 'The Good/Better/Best advantage',
        content: 'Giving customers 3 options (instead of 1) increases your average ticket by 28%. The "Better" option gets chosen 62% of the time. Let\'s build your first one.',
        position: 'center',
        action: 'Click "Next" to learn how',
      },
      {
        title: 'How to create an estimate',
        content: 'Go to the Estimates page and click "New Estimate." You\'ll pick a customer, add line items for each tier (Good, Better, Best), and the system calculates totals with tax automatically.',
        tip: '"Good" is the basic fix. "Better" includes prevention. "Best" is the premium option with warranty. Price anchoring makes "Better" feel like the smart choice.',
        position: 'center',
        navigateTo: '/estimates',
        action: 'Go to Estimates and click "New Estimate"',
      },
      {
        title: 'Estimate created!',
        content: 'When you send this to a customer, the Estimate Follow-Up Machine will automatically check in at 24hrs, 72hrs, and 7 days if they haven\'t responded. No more forgotten quotes.',
        position: 'center',
        action: 'Head back to Setup to continue',
      },
    ],
  },
  'payment-setup': {
    id: 'payment-setup',
    name: 'Set Up Payments',
    description: 'Connect Stripe for online payments',
    steps: [
      {
        title: 'Get paid faster — way faster',
        content: 'Online payments mean customers can pay the moment they get the invoice. No more waiting for checks in the mail. Average time to payment drops from 30 days to 3.',
        position: 'center',
        action: 'Click "Next" to set up',
      },
      {
        title: 'Connect Stripe',
        content: 'Go to Settings → Integrations and click "Connect" next to Stripe. You\'ll create a free Stripe account (or connect an existing one) and you\'re done. GrowthOS handles the rest.',
        tip: 'Stripe charges 2.9% + $0.30 per transaction. Most businesses pass this to the customer as a "convenience fee" or build it into their pricing.',
        position: 'center',
        navigateTo: '/settings',
        action: 'Go to Settings → Integrations → Connect Stripe',
      },
      {
        title: 'Payments are live!',
        content: 'Every invoice now includes a "Pay Now" button. The Payment Chaser autopilot will send reminders at 7, 14, and 30 days for unpaid invoices. Your cash flow just got a major upgrade.',
        position: 'center',
        action: 'Click "Save & Continue" to finish setup!',
      },
    ],
  },
};

// ============================================================
// GUIDED TOUR COMPONENT
// ============================================================

export function GuidedTour({ tour, onComplete, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const step = tour.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tour.steps.length - 1;
  const progress = ((currentStep + 1) / tour.steps.length) * 100;

  const goNext = useCallback(() => {
    if (isLast) {
      onComplete();
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      // Navigate if the next step requires it
      const nextStep = tour.steps[currentStep + 1];
      if (nextStep?.navigateTo) {
        router.push(nextStep.navigateTo);
      }
      setIsAnimating(false);
    }, 200);
  }, [isLast, onComplete, currentStep, tour.steps, router]);

  const goBack = () => {
    if (isFirst) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsAnimating(false);
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
      if (e.key === 'ArrowLeft') goBack();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" onClick={onClose} />

      {/* Tour Card */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto transition-all duration-200 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MousePointerClick className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600">{tour.name}</p>
                <p className="text-xs text-slate-400">Step {currentStep + 1} of {tour.steps.length}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-2 pb-4">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{step.content}</p>

            {/* Pro Tip */}
            {step.tip && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 mb-0.5">Pro tip</p>
                    <p className="text-xs text-amber-700 leading-relaxed">{step.tip}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Field Highlight */}
            {step.highlight && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-xs font-medium text-blue-700">
                    Look for the <span className="font-bold">&quot;{step.highlight.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}&quot;</span> field below this guide
                  </p>
                </div>
              </div>
            )}

            {/* Navigate prompt */}
            {step.navigateTo && (
              <button
                onClick={() => router.push(step.navigateTo!)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition text-sm"
              >
                <ArrowRight className="w-4 h-4" />
                Go to {step.navigateTo.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            )}
          </div>

          {/* Action Indicator */}
          {step.action && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MousePointerClick className="w-4 h-4 text-blue-500" />
                <span>{step.action}</span>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={isFirst}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isFirst
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-1.5">
              {tour.steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentStep
                      ? 'bg-blue-600 w-6'
                      : i < currentStep
                        ? 'bg-emerald-400'
                        : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className={`flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isLast
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
              }`}
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Done
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
