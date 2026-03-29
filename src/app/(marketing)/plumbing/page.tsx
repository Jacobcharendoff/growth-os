'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import {
  Droplet,
  Phone,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  Users,
  Star,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

// Scroll reveal hook for animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

// Animated counter for stats
function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// FAQ Component
function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-left">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function PlumbingPage() {
  const { t } = useLanguage();
  const heroReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const painReveal = useScrollReveal();
  const solutionReveal = useScrollReveal();
  const testimonialReveal = useScrollReveal();
  const faqReveal = useScrollReveal();

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <MarketingLayout>
      {/* 1. HERO SECTION - Trade-colored gradient background */}
      <section
        ref={heroReveal.ref}
        className={`pt-32 pb-20 bg-[#2C3E50] relative overflow-hidden transition-opacity duration-1000 ${
          heroReveal.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background icon */}
        <div className="absolute top-20 right-0 opacity-10 pointer-events-none">
          <Droplet className="w-96 h-96 text-blue-400" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 text-white text-sm font-medium">
            <Droplet className="w-4 h-4" />
            {t('plumbingPage.heroBadge') }
          </div>

          {/* H1 Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t('plumbingPage.heroTitle') }
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
            {t('plumbingPage.heroDesc') }
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#27AE60] text-white font-semibold rounded-full hover:bg-[#229954] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t('plumbingPage.heroCta') }
              <Zap className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/30"
            >
              {t('plumbingPage.heroSecondaryCta') }
              <span className="text-white">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INDUSTRY STATS BAR */}
      <section
        ref={statsReveal.ref}
        className={`py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white transition-opacity duration-1000 ${
          statsReveal.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                <AnimatedCounter end={705} suffix="K" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('plumbingPage.stat1Label') }
              </p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                <AnimatedCounter end={22} suffix=" calls" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('plumbingPage.stat2Label') }
              </p>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                <AnimatedCounter end={30} suffix="%" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('plumbingPage.stat3Label') }
              </p>
            </div>

            {/* Stat 4 */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                <AnimatedCounter end={78} suffix="%" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('plumbingPage.stat4Label') }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PAIN POINTS SECTION */}
      <section
        ref={painReveal.ref}
        className={`py-20 bg-white transition-opacity duration-1000 ${painReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            {t('plumbingPage.painTitle') }
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pain 1: Missed Calls */}
            <div className="p-8 bg-white rounded-2xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('plumbingPage.pain1Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('plumbingPage.pain1Desc') }
                  </p>
                </div>
              </div>
            </div>

            {/* Pain 2: Slow Estimates */}
            <div className="p-8 bg-white rounded-2xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-100">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('plumbingPage.pain2Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('plumbingPage.pain2Desc') }
                  </p>
                </div>
              </div>
            </div>

            {/* Pain 3: Unpaid Invoices */}
            <div className="p-8 bg-white rounded-2xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-200">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('plumbingPage.pain3Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('plumbingPage.pain3Desc') }
                  </p>
                </div>
              </div>
            </div>

            {/* Pain 4: Dispatch Chaos */}
            <div className="p-8 bg-white rounded-2xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-300">
              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('plumbingPage.pain4Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('plumbingPage.pain4Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION SHOWCASE */}
      <section
        ref={solutionReveal.ref}
        className={`py-20 bg-gradient-to-br from-slate-900 to-slate-800 transition-opacity duration-1000 ${
          solutionReveal.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-4">
            {t('plumbingPage.solutionTitle')}
          </h2>
          <p className="text-center text-slate-300 text-lg mb-16 max-w-2xl mx-auto">
            One system. All your calls, jobs, and payments in one place.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white/5 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-[#2C3E50] flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#2C3E50]/50 transition-all">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('plumbingPage.solution1Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('plumbingPage.solution1Desc')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution1Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution1Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution1Bullet3') }
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white/5 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-[#2C3E50] flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#2C3E50]/50 transition-all">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('plumbingPage.solution2Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('plumbingPage.solution2Desc') }
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution2Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution2Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution2Bullet3') }
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white/5 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-[#2C3E50] flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#2C3E50]/50 transition-all">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('plumbingPage.solution3Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('plumbingPage.solution3Desc') }
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution3Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution3Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution3Bullet3') }
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-white/5 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-[#2C3E50] flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-[#2C3E50]/50 transition-all">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('plumbingPage.solution4Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('plumbingPage.solution4Desc')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution4Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution4Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('plumbingPage.solution4Bullet3') }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL */}
      <section
        ref={testimonialReveal.ref}
        className={`py-20 bg-white transition-opacity duration-1000 ${testimonialReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 bg-white rounded-2xl border-l-4 border-blue-600 shadow-lg">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-lg sm:text-xl text-gray-900 mb-8 leading-relaxed font-medium italic">
              "{t('plumbingPage.testimonialQuote')}"
            </p>
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {t('plumbingPage.testimonialName') }
              </p>
              <p className="text-gray-600">
                {t('plumbingPage.testimonialCompany') }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('plumbingPage.testimonialDetails') }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section
        ref={faqReveal.ref}
        className={`py-20 bg-gray-50 transition-opacity duration-1000 ${faqReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            {t('plumbingPage.faqTitle') }
          </h2>

          <div className="space-y-4">
            <FAQItem
              question={t('plumbingPage.faq1Q') }
              answer={t('plumbingPage.faq1A')}
              isOpen={openFAQ === 0}
              onToggle={() => setOpenFAQ(openFAQ === 0 ? null : 0)}
            />
            <FAQItem
              question={t('plumbingPage.faq2Q') }
              answer={t('plumbingPage.faq2A') }
              isOpen={openFAQ === 1}
              onToggle={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
            />
            <FAQItem
              question={t('plumbingPage.faq3Q') }
              answer={t('plumbingPage.faq3A')}
              isOpen={openFAQ === 2}
              onToggle={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
            />
            <FAQItem
              question={t('plumbingPage.faq4Q') }
              answer={t('plumbingPage.faq4A')}
              isOpen={openFAQ === 3}
              onToggle={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
            />
          </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('plumbingPage.pricingTitle') }
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('plumbingPage.pricingDesc') }
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-2xl border border-gray-200 p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$79</span>
                <span className="text-gray-600">/mo CAD</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">For solo operators and small teams</p>
              <Link
                href="/setup"
                className="block w-full px-6 py-3 rounded-xl bg-[#27AE60] text-white text-sm font-semibold hover:bg-[#229954] transition-colors text-center mb-6"
              >
                Start Free Trial
              </Link>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Call capture & voicemail
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Mobile estimates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  1 user
                </li>
              </ul>
            </div>

            {/* Growth - Most Popular */}
            <div className="rounded-2xl border-2 border-blue-600 p-8 text-left shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Growth</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$149</span>
                <span className="text-gray-600">/mo CAD</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">For growing service businesses</p>
              <Link
                href="/setup"
                className="block w-full px-6 py-3 rounded-xl bg-[#27AE60] text-white text-sm font-semibold hover:bg-[#229954] transition-colors text-center mb-6"
              >
                Start Free Trial
              </Link>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Everything in Starter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Invoicing & payments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Up to 5 users
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Smart dispatch
                </li>
              </ul>
            </div>

            {/* Scale */}
            <div className="rounded-2xl border border-gray-200 p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scale</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$299</span>
                <span className="text-gray-600">/mo CAD</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">For multi-team operations</p>
              <Link
                href="/setup"
                className="block w-full px-6 py-3 rounded-xl bg-[#27AE60] text-white text-sm font-semibold hover:bg-[#229954] transition-colors text-center mb-6"
              >
                Start Free Trial
              </Link>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Everything in Growth
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Unlimited users
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Advanced reporting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  API access
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-12 text-sm text-gray-600">
            All plans include a 14-day free trial. No credit card required. {' '}
            <Link href="/pricing" className="text-blue-600 hover:underline">
              See full comparison
            </Link>
          </p>
        </div>
      </section>

    </MarketingLayout>
  );
}
