'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import {
  Zap,
  FileText,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Phone,
  Shield,
  Clock,
  Star,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

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

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-left">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-yellow-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function ElectricalPage() {
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
      {/* 1. HERO - Yellow/Amber */}
      <section
        ref={heroReveal.ref}
        className={`pt-32 pb-20 bg-gradient-to-br from-yellow-600 via-yellow-700 to-slate-900 relative overflow-hidden transition-opacity duration-1000 ${
          heroReveal.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-20 right-0 opacity-10 pointer-events-none hidden md:block">
          <Zap className="w-96 h-96 text-yellow-300" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-600/20 border border-yellow-400/30 mb-8 text-yellow-100 text-sm font-medium">
            <Zap className="w-4 h-4" />
            {t('electricalPage.heroBadge') }
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('electricalPage.heroTitle') }
          </h1>

          <p className="text-lg sm:text-xl text-yellow-100 mb-10 max-w-2xl leading-relaxed">
            {t('electricalPage.heroDesc') }
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/login?tab=signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-yellow-700 font-semibold rounded-full hover:bg-yellow-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t('electricalPage.heroCta') }
              <Zap className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/30"
            >
              {t('electricalPage.heroSecondaryCta') }
              <span className="text-white">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <section
        ref={statsReveal.ref}
        className={`py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white transition-opacity duration-1000 ${
          statsReveal.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                <AnimatedCounter end={29800} suffix="M CAD" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('electricalPage.stat1Label') }
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                <AnimatedCounter end={1200} suffix=" hrs" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('electricalPage.stat2Label') }
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                <AnimatedCounter end={20} suffix="%" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('electricalPage.stat3Label') }
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                <AnimatedCounter end={15} suffix="K/mo" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">
                {t('electricalPage.stat4Label') }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PAIN POINTS */}
      <section
        ref={painReveal.ref}
        className={`py-20 bg-white transition-opacity duration-1000 ${painReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            {t('electricalPage.painTitle') }
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-yellow-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('electricalPage.pain1Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('electricalPage.pain1Desc') }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-yellow-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-100">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('electricalPage.pain2Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('electricalPage.pain2Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-yellow-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-200">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('electricalPage.pain3Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('electricalPage.pain3Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-yellow-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-300">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('electricalPage.pain4Title') }
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('electricalPage.pain4Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION */}
      <section
        ref={solutionReveal.ref}
        className={`py-20 bg-gradient-to-br from-slate-900 to-slate-800 transition-opacity duration-1000 ${
          solutionReveal.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-4">
            {t('electricalPage.solutionTitle') }
          </h2>
          <p className="text-center text-slate-300 text-lg mb-16 max-w-2xl mx-auto">
            Staybookt built for electricians who need to keep the lights on (literally).
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-yellow-600/50 transition-all">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('electricalPage.solution1Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('electricalPage.solution1Desc') }
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution1Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution1Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution1Bullet3') }
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-yellow-600/50 transition-all">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('electricalPage.solution2Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('electricalPage.solution2Desc') }
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution2Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution2Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution2Bullet3') }
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-yellow-600/50 transition-all">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('electricalPage.solution3Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('electricalPage.solution3Desc') }
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution3Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution3Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution3Bullet3') }
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-yellow-600/50 transition-all">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t('electricalPage.solution4Title') }
              </h3>
              <p className="text-slate-300 mb-4">
                {t('electricalPage.solution4Desc') }
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution4Bullet1') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution4Bullet2') }
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {t('electricalPage.solution4Bullet3') }
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
          <div className="p-10 bg-white rounded-2xl border-l-4 border-yellow-600 shadow-lg">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-lg sm:text-xl text-gray-900 mb-8 leading-relaxed font-medium italic">
              "{t('electricalPage.testimonialQuote')}\"
            </p>
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {t('electricalPage.testimonialName') }
              </p>
              <p className="text-gray-600">
                {t('electricalPage.testimonialCompany') }
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('electricalPage.testimonialDetails') }
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
            {t('electricalPage.faqTitle') }
          </h2>

          <div className="space-y-4">
            <FAQItem
              question={t('electricalPage.faq1Q') }
              answer={t('electricalPage.faq1A')}
              isOpen={openFAQ === 0}
              onToggle={() => setOpenFAQ(openFAQ === 0 ? null : 0)}
            />
            <FAQItem
              question={t('electricalPage.faq2Q')}
              answer={t('electricalPage.faq2A')}
              isOpen={openFAQ === 1}
              onToggle={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
            />
            <FAQItem
              question={t('electricalPage.faq3Q') }
              answer={t('electricalPage.faq3A') }
              isOpen={openFAQ === 2}
              onToggle={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
            />
            <FAQItem
              question={t('electricalPage.faq4Q') }
              answer={t('electricalPage.faq4A') }
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
            {t('electricalPage.pricingTitle') }
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('electricalPage.pricingDesc') }
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-5 sm:p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$79</span>
                <span className="text-gray-600">/mo CAD</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">For solo electricians</p>
              <Link
                href="/login?tab=signup"
                className="block w-full px-4 sm:px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors text-center mb-6"
              >
                Start Free Trial
              </Link>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Call capture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Permit tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  1 user
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-yellow-600 p-5 sm:p-8 text-left shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-yellow-600 text-white text-xs font-bold rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Growth</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$149</span>
                <span className="text-gray-600">/mo CAD</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">For growing electrical teams</p>
              <Link
                href="/login?tab=signup"
                className="block w-full px-4 sm:px-6 py-3 rounded-xl bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700 transition-colors text-center mb-6"
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
                  License tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Inspection scheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Up to 5 users
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 sm:p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scale</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gray-900">$299</span>
                <span className="text-gray-600">/mo CAD</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">For large electrical operations</p>
              <Link
                href="/login?tab=signup"
                className="block w-full px-4 sm:px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors text-center mb-6"
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
            <Link href="/#pricing" className="text-yellow-600 hover:underline">
              See full comparison
            </Link>
          </p>
        </div>
      </section>

    </MarketingLayout>
  );
}
