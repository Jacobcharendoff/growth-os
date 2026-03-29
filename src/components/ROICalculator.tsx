'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import {
  Calculator,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

// Animated number display component
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    const duration = 600;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </>
  );
}

// Range slider component
function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  prefix = '',
  suffix = '',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="text-sm font-bold text-[#27AE60] tabular-nums">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none bg-slate-200 rounded-full cursor-pointer accent-[#27AE60]"
          style={{
            background: `linear-gradient(to right, #27AE60 0%, #27AE60 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
        />
      </div>
    </div>
  );
}

export function ROICalculator() {
  const { t } = useLanguage();

  // Input state
  const [monthlyJobs, setMonthlyJobs] = useState(40);
  const [avgJobValue, setAvgJobValue] = useState(500);
  const [missedCalls, setMissedCalls] = useState(5);
  const [adminHours, setAdminHours] = useState(12);

  // Calculate all metrics
  const calculations = useMemo(() => {
    const additionalMonthlyRevenue = missedCalls * 4 * 0.3 * avgJobValue;
    const annualRevenueRecovered = additionalMonthlyRevenue * 12;
    const hoursSavedPerMonth = adminHours * 0.6 * 4;
    const annualTimeSavingsHours = hoursSavedPerMonth * 12;
    const workWeeks = Math.round(annualTimeSavingsHours / 40);
    const annualSubscriptionCost = 49 * 12;
    const roi = Math.round(annualRevenueRecovered / annualSubscriptionCost);

    return {
      additionalMonthlyRevenue: Math.round(additionalMonthlyRevenue),
      annualRevenueRecovered: Math.round(annualRevenueRecovered),
      hoursSavedPerMonth: Math.round(hoursSavedPerMonth * 10) / 10,
      annualTimeSavingsHours: Math.round(annualTimeSavingsHours),
      workWeeks,
      roi: Math.max(1, roi),
    };
  }, [monthlyJobs, avgJobValue, missedCalls, adminHours]);

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            {t('roi.heading')}
          </h2>
          <p className="text-lg text-slate-500">{t('roi.subheading')}</p>
        </div>

        {/* Calculator card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
          {/* Sliders row */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              <RangeSlider
                label={t('roi.monthlyJobs')}
                value={monthlyJobs}
                min={10}
                max={200}
                step={5}
                onChange={setMonthlyJobs}
                suffix=" jobs"
              />
              <RangeSlider
                label={t('roi.avgJobValue')}
                value={avgJobValue}
                min={100}
                max={5000}
                step={100}
                onChange={setAvgJobValue}
                prefix="$"
              />
              <RangeSlider
                label={t('roi.missedCalls')}
                value={missedCalls}
                min={0}
                max={30}
                step={1}
                onChange={setMissedCalls}
                suffix=" calls"
              />
              <RangeSlider
                label={t('roi.adminHours')}
                value={adminHours}
                min={0}
                max={40}
                step={1}
                onChange={setAdminHours}
                suffix=" hours"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Results row */}
          <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50/80 to-white">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Revenue recovered */}
              <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">{t('roi.additionalRevenue')}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  $<AnimatedNumber value={calculations.additionalMonthlyRevenue} />
                </p>
                <p className="text-xs text-slate-400 mt-1">per month</p>
              </div>

              {/* Annual recovery */}
              <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">{t('roi.annualRevenue')}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  $<AnimatedNumber value={calculations.annualRevenueRecovered} />
                </p>
                <p className="text-xs text-slate-400 mt-1">per year</p>
              </div>

              {/* Time saved */}
              <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">{t('roi.hoursSaved')}</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  <AnimatedNumber value={Math.round(calculations.hoursSavedPerMonth)} /> hrs
                </p>
                <p className="text-xs text-slate-400 mt-1">per month</p>
              </div>

              {/* ROI highlight */}
              <div className="rounded-xl bg-[#2C3E50] p-4 sm:p-5 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white/60 mb-1">{t('roi.yourROI')}</p>
                <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                  <AnimatedNumber value={calculations.roi} />x
                </p>
                <p className="text-xs text-emerald-400 mt-1">return on investment</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#27AE60] hover:bg-[#229954] text-white font-semibold rounded-full transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            {t('roi.cta')}
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="mt-3 text-sm text-slate-400">{t('roi.ctaSubtext')}</p>
        </div>
      </div>
    </section>
  );
}
