'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import {
  Phone,
  UserPlus,
  FileText,
  CheckCircle2,
  CreditCard,
  Check,
  ArrowRight,
} from 'lucide-react';

export function InteractiveProductTour() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    {
      id: 0,
      title: t('tour.stepTitle1'),
      description: t('tour.stepDesc1'),
      icon: <Phone className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 1,
      title: t('tour.stepTitle2'),
      description: t('tour.stepDesc2'),
      icon: <UserPlus className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 2,
      title: t('tour.stepTitle3'),
      description: t('tour.stepDesc3'),
      icon: <FileText className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-600',
    },
    {
      id: 3,
      title: t('tour.stepTitle4'),
      description: t('tour.stepDesc4'),
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 4,
      title: t('tour.stepTitle5'),
      description: t('tour.stepDesc5'),
      icon: <CreditCard className="w-5 h-5" />,
      color: 'from-rose-500 to-pink-600',
    },
  ];

  // Auto-advance when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAutoAdvancing(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance every 4 seconds when visible
  useEffect(() => {
    if (!isAutoAdvancing) return;

    autoAdvanceTimeoutRef.current = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [activeStep, isAutoAdvancing, steps.length]);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const CallIncomingMockup = () => (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 h-full flex flex-col justify-center items-center">
      {/* Phone animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#2C3E50]/30 rounded-3xl blur-2xl animate-pulse" />
        <div className="relative bg-[#2C3E50] rounded-3xl p-5 sm:p-8 shadow-2xl">
          <Phone className="w-16 h-16 text-white animate-bounce" />
        </div>
      </div>

      {/* Caller Info Card */}
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 border border-slate-700/50 space-y-4 animate-fade-in">
        <p className="text-slate-400 text-sm uppercase tracking-wider">Incoming Call</p>
        <div className="space-y-3">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm text-slate-500 mb-1">Name</p>
            <p className="text-lg font-semibold text-slate-100">{t('tour.mockup1Line1')}</p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-slate-500 mb-1">Address</p>
            <p className="text-lg font-semibold text-slate-100">{t('tour.mockup1Line2')}</p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-slate-500 mb-1">Service</p>
            <p className="text-lg font-semibold text-slate-100">{t('tour.mockup1Line3')}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
            Answer
          </button>
          <button className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
            Decline
          </button>
        </div>
      </div>
    </div>
  );

  const LeadCapturedMockup = () => (
    <div className="bg-slate-900 p-6 h-full flex flex-col justify-center">
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700/50 space-y-4 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{t('tour.mockup2Customer')}</h3>
            <p className="text-sm text-slate-400">{t('tour.mockup1Line2')}</p>
          </div>
          <div className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full">
            <span className="text-xs font-semibold text-red-400">{t('tour.mockup2Priority')}</span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Service</span>
            <span className="text-sm font-medium text-slate-200">{t('tour.mockup2Service')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Status</span>
            <div className="px-2.5 py-1 bg-blue-500/20 rounded-full">
              <span className="text-xs font-semibold text-blue-300">{t('tour.mockup2Status')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Created</span>
            <span className="text-sm font-medium text-slate-200">Just now</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors">
            Send Estimate
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-colors">
            Call
          </button>
        </div>
      </div>
    </div>
  );

  const EstimateSentMockup = () => (
    <div className="bg-slate-900 p-6 h-full flex flex-col justify-center overflow-hidden">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-2xl animate-fade-in">
        {/* Document header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">ESTIMATE</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{t('tour.mockup3EstId')}</p>
        </div>

        {/* Customer and items */}
        <div className="space-y-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Bill To</p>
            <p className="font-semibold text-gray-900">{t('tour.mockup3Customer')}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('tour.mockup3Labor')}</span>
              <span className="font-medium text-gray-900">$255.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('tour.mockup3Parts')}</span>
              <span className="font-medium text-gray-900">$850.00</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-900">{t('tour.mockup3Total')}</span>
          <span className="text-2xl font-bold text-gray-900">$1,105</span>
        </div>

        {/* Sent badge */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-xs text-emerald-700 font-semibold text-center">{t('tour.mockup3Sent')}</p>
        </div>
      </div>
    </div>
  );

  const JobCompletedMockup = () => (
    <div className="bg-slate-900 p-6 h-full flex flex-col justify-center">
      <div className="max-w-sm mx-auto w-full space-y-4 animate-fade-in">
        {/* Completion badge */}
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-4 text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/30 mb-2 mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-emerald-300">{t('tour.mockup4JobCompleted')}</p>
        </div>

        {/* Checklist */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700/50 space-y-3">
          {[
            { label: t('tour.mockup4InspectionDone'), done: true },
            { label: t('tour.mockup4PhotosUploaded'), done: true },
            { label: t('tour.mockup4SignatureCaptured'), done: true },
            { label: t('tour.mockup4NotifyCustomer'), done: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0">
                {item.done && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <span className="text-sm text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const InvoicePaidMockup = () => (
    <div className="bg-slate-900 p-6 h-full flex flex-col justify-center items-center">
      <div className="max-w-sm w-full animate-fade-in">
        {/* Paid stamp with animation */}
        <div className="relative mb-6 perspective">
          <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 sm:px-6 py-2 rounded-2xl font-bold text-xl transform rotate-12 shadow-lg animate-scale-up">
            {t('tour.mockup5PaidStamp')}
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-6 border border-gray-200 shadow-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Invoice</p>
            <p className="text-2xl font-bold text-gray-900 mb-4">{t('tour.mockup5InvoiceId')}</p>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount Due</span>
                <span className="font-semibold text-gray-900">{t('tour.mockup5Amount')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">Interac e-Transfer</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Date</span>
                <span className="font-semibold text-emerald-600">Today</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-emerald-600 font-semibold text-center">✓ Payment received</p>
            </div>
          </div>
        </div>

        {/* Revenue ticker animation */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50 w-full">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Monthly Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 tabular-nums animate-[counter_2s_ease-out_forwards]">
              $34,200
            </span>
            <span className="text-sm text-emerald-400 font-semibold">↑ 18%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMockup = () => {
    switch (activeStep) {
      case 0:
        return <CallIncomingMockup />;
      case 1:
        return <LeadCapturedMockup />;
      case 2:
        return <EstimateSentMockup />;
      case 3:
        return <JobCompletedMockup />;
      case 4:
        return <InvoicePaidMockup />;
      default:
        return <CallIncomingMockup />;
    }
  };

  const currentStep = steps[activeStep];

  return (
    <section
      ref={containerRef}
      id="product-tour"
      className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-1/4 -left-48 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            {t('tour.sectionHeading')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
            {t('tour.sectionSubheading')}
          </p>
        </div>

        {/* Main layout: steps on left/top, mockup on right/bottom */}
        <div className="grid lg:grid-cols-5 gap-8 items-start lg:items-stretch">
          {/* Steps timeline — vertical on desktop, horizontal on mobile */}
          <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`relative flex-shrink-0 lg:flex-shrink p-4 rounded-xl transition-all duration-300 group text-left ${
                  activeStep === step.id
                    ? 'bg-white border-2 border-[#27AE60] shadow-lg'
                    : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Completed checkmark */}
                {completedSteps.includes(step.id) && activeStep !== step.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Icon and title */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} text-white flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 ${
                      activeStep === step.id ? 'scale-110' : ''
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-sm transition-colors ${
                      activeStep === step.id ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{step.description}</p>
                  </div>
                </div>

                {/* Active indicator */}
                {activeStep === step.id && (
                  <div className="absolute inset-0 rounded-xl bg-emerald-500/5 pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          {/* Mockup panel */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 flex flex-col h-[480px] sm:h-[520px] lg:h-[560px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-700/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2C3E50] to-[#34495E] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">GO</span>
                  </div>
                  <span className="text-sm font-medium text-slate-300">Staybookt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Live</span>
                </div>
              </div>

              {/* Content area with crossfade */}
              <div className="flex-1 min-h-0 overflow-hidden relative bg-gradient-to-br from-slate-900 to-slate-950">
                <div
                  className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                  style={{ opacity: 1 }}
                >
                  {renderMockup()}
                </div>
              </div>
            </div>

            {/* Step counter and progress */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Step <span className="font-semibold text-gray-900">{activeStep + 1}</span> of{' '}
                <span className="font-semibold text-gray-900">{steps.length}</span>
              </div>
              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStepClick(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeStep
                        ? 'bg-[#27AE60] w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-2'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-[#27AE60] hover:bg-[#229954] shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-105"
          >
            {t('tour.cta')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">14-day free trial. No credit card required.</p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes counter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </section>
  );
}
