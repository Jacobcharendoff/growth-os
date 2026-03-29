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
    let currentValue = 0;
    const startTime = Date.now();
    const duration = 600; // 600ms animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      currentValue = Math.round(value * progress);
      setDisplayValue(currentValue);

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

// Range slider component with Tailwind styling
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
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <label className="text-sm font-semibold text-slate-900">{label}</label>
        <div className="text-lg font-bold text-blue-600">
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
          className="w-full h-3 appearance-none bg-slate-200 rounded-full cursor-pointer accent-blue-600"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
        />
      </div>
    </div>
  );
}

// Result card component
function ResultCard({
  icon: Icon,
  label,
  value,
  subtext,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border transition-all ${
        highlight
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-md'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-sm font-medium ${highlight ? 'text-blue-700' : 'text-slate-600'}`}>
            {label}
          </p>
        </div>
        <div className={highlight ? 'text-blue-600' : 'text-slate-400'}>{Icon}</div>
      </div>
      <div className={`text-3xl lg:text-4xl font-bold ${highlight ? 'text-blue-900' : 'text-slate-900'}`}>
        {value}
      </div>
      {subtext && (
        <p className={`mt-2 text-sm ${highlight ? 'text-blue-600' : 'text-slate-500'}`}>
          {subtext}
        </p>
      )}
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
    // Additional monthly revenue from missed calls
    // Calculation: missed calls × 4 weeks × 30% conversion × avg job value
    const additionalMonthlyRevenue = missedCalls * 4 * 0.3 * avgJobValue;

    // Annual revenue recovered
    const annualRevenueRecovered = additionalMonthlyRevenue * 12;

    // Hours saved per month (60% admin time savings)
    const hoursSavedPerMonth = adminHours * 0.6 * 4;

    // Annual time savings in hours
    const annualTimeSavingsHours = hoursSavedPerMonth * 12;
    const workWeeks = Math.round(annualTimeSavingsHours / 40);

    // ROI calculation: annual revenue recovered / ($49/month × 12)
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
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">{t('roi.heading')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('roi.heading')}
          </h2>
          <p className="text-lg text-slate-400">{t('roi.subheading')}</p>
        </div>

        {/* Main calculator card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left side - Inputs */}
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Your Numbers
              </h3>

              <div className="space-y-8">
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

            {/* Right side - Results */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-white">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Your Impact
              </h3>

              <div className="space-y-6">
                {/* Additional Monthly Revenue */}
                <ResultCard
                  icon={<DollarSign className="w-5 h-5" />}
                  label={t('roi.additionalRevenue')}
                  value={
                    <>
                      $
                      <AnimatedNumber
                        value={calculations.additionalMonthlyRevenue}
                      />
                    </>
                  }
                  subtext="from missed call recovery"
                />

                {/* Annual Revenue Recovered */}
                <ResultCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label={t('roi.annualRevenue')}
                  value={
                    <>
                      $
                      <AnimatedNumber
                        value={calculations.annualRevenueRecovered}
                      />
                    </>
                  }
                  subtext={`${Math.round(
                    calculations.annualRevenueRecovered / calculations.additionalMonthlyRevenue
                  )} months of recovery`}
                />

                {/* Hours Saved Per Month */}
                <ResultCard
                  icon={<Clock className="w-5 h-5" />}
                  label={t('roi.hoursSaved')}
                  value={
                    <>
                      <AnimatedNumber
                        value={Math.round(calculations.hoursSavedPerMonth)}
                      />
                      {' '}hours
                    </>
                  }
                  subtext="with 60% admin automation"
                />

                {/* Annual Time Savings */}
                <ResultCard
                  icon={<Clock className="w-5 h-5" />}
                  label={t('roi.annualTimeSavings')}
                  value={
                    <>
                      <AnimatedNumber
                        value={calculations.annualTimeSavingsHours}
                      />
                      {' '}hours
                    </>
                  }
                  subtext={t('roi.workWeeks', {
                    hours: calculations.annualTimeSavingsHours,
                    weeks: calculations.workWeeks,
                  })}
                />

                {/* ROI Multiplier - Highlighted */}
                <ResultCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label={t('roi.yourROI')}
                  value={
                    <>
                      <AnimatedNumber value={calculations.roi} />
                      x
                    </>
                  }
                  subtext={t('roi.returnMultiplier', {
                    value: calculations.roi,
                  })}
                  highlight
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5">
            {t('roi.cta')}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-3 text-slate-400">{t('roi.ctaSubtext')}</p>
        </div>
      </div>
    </section>
  );
}
