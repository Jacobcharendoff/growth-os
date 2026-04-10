'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import { Sparkles, PhoneOff, RotateCw, AlertCircle, Clock, CheckCircle2, Star, TrendingUp, Users, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const duration = 2000; const steps = 60; const increment = end / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= end) { setCount(end); clearInterval(timer); }
          else { setCount(Math.floor(current)); }
        }, duration / steps);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 text-left">{question}</span>
        <ChevronDown className={`w-5 h-5 text-cyan-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function CleaningPage() {
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
      {/* HERO */}
      <section ref={heroReveal.ref} className={`pt-32 pb-20 bg-gradient-to-br from-cyan-700 via-cyan-800 to-slate-900 relative overflow-hidden transition-opacity duration-1000 ${heroReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-20 right-0 opacity-10 pointer-events-none hidden md:block">
          <Sparkles className="w-96 h-96 text-cyan-300" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600/20 border border-cyan-400/30 mb-8 text-cyan-100 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {t('cleaningPage.heroBadge') }
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('cleaningPage.heroTitle') }
          </h1>
          <p className="text-lg sm:text-xl text-cyan-100 mb-10 max-w-2xl leading-relaxed">
            {t('cleaningPage.heroDesc') }
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login?tab=signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-700 font-semibold rounded-full hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              {t('cleaningPage.heroCta') }
              <Zap className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/30">
              {t('cleaningPage.heroSecondaryCta') }
              <span className="text-white">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsReveal.ref} className={`py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white transition-opacity duration-1000 ${statsReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                <AnimatedCounter end={19000000000} suffix="" prefix="$" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">US Market (CAD)</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                <AnimatedCounter end={55} suffix="%" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">Typical Labor Cost</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                <AnimatedCounter end={60} suffix="/hr" prefix="$" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">Average Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                <AnimatedCounter end={50} suffix="%" />
              </div>
              <p className="text-sm sm:text-base text-slate-300">Rate Increase (4yr)</p>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section ref={painReveal.ref} className={`py-20 bg-white transition-opacity duration-1000 ${painReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            {t('cleaningPage.painTitle') }
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-cyan-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500">
              <PhoneOff className="w-6 h-6 text-cyan-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('cleaningPage.pain1Title') }</h3>
              <p className="text-gray-600 leading-relaxed">{t('cleaningPage.pain1Desc')}</p>
            </div>
            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-cyan-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-100">
              <RotateCw className="w-6 h-6 text-cyan-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('cleaningPage.pain2Title') }</h3>
              <p className="text-gray-600 leading-relaxed">{t('cleaningPage.pain2Desc') }</p>
            </div>
            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-cyan-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-200">
              <AlertCircle className="w-6 h-6 text-cyan-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('cleaningPage.pain3Title') }</h3>
              <p className="text-gray-600 leading-relaxed">{t('cleaningPage.pain3Desc')}</p>
            </div>
            <div className="p-5 sm:p-8 bg-white rounded-2xl border-l-4 border-cyan-600 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500 delay-300">
              <Clock className="w-6 h-6 text-cyan-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('cleaningPage.pain4Title') }</h3>
              <p className="text-gray-600 leading-relaxed">{t('cleaningPage.pain4Desc') }</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section ref={solutionReveal.ref} className={`py-20 bg-gradient-to-br from-slate-900 to-slate-800 transition-opacity duration-1000 ${solutionReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-4">{t('cleaningPage.solutionTitle') }</h2>
          <p className="text-center text-slate-300 text-lg mb-16 max-w-2xl mx-auto">Purpose-built for cleaning and janitorial services.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-600/50 transition-all">
                <PhoneOff className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('cleaningPage.solution1Title') }</h3>
              <p className="text-slate-300 mb-4">{t('cleaningPage.solution1Desc') }</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution1Bullet1') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution1Bullet2') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution1Bullet3') }</li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-600/50 transition-all">
                <RotateCw className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('cleaningPage.solution2Title') }</h3>
              <p className="text-slate-300 mb-4">{t('cleaningPage.solution2Desc') }</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution2Bullet1') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution2Bullet2') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution2Bullet3') }</li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-600/50 transition-all">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('cleaningPage.solution3Title') }</h3>
              <p className="text-slate-300 mb-4">{t('cleaningPage.solution3Desc') }</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution3Bullet1') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution3Bullet2') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution3Bullet3') }</li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 bg-white/5 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-600/50 transition-all">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('cleaningPage.solution4Title') }</h3>
              <p className="text-slate-300 mb-4">{t('cleaningPage.solution4Desc') }</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution4Bullet1') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution4Bullet2') }</li>
                <li className="flex items-center gap-3 text-slate-200"><CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />{t('cleaningPage.solution4Bullet3') }</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section ref={testimonialReveal.ref} className={`py-20 bg-white transition-opacity duration-1000 ${testimonialReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 bg-white rounded-2xl border-l-4 border-cyan-600 shadow-lg">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-cyan-400 text-cyan-400" />
              ))}
            </div>
            <p className="text-lg sm:text-xl text-gray-900 mb-8 leading-relaxed font-medium italic">
              "{t('cleaningPage.testimonialQuote') }"
            </p>
            <div>
              <p className="font-semibold text-lg text-gray-900">{t('cleaningPage.testimonialName') }</p>
              <p className="text-gray-600">{t('cleaningPage.testimonialCompany') }</p>
              <p className="text-sm text-gray-500 mt-2">{t('cleaningPage.testimonialDetails') }</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqReveal.ref} className={`py-20 bg-gray-50 transition-opacity duration-1000 ${faqReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">{t('cleaningPage.faqTitle') }</h2>
          <div className="space-y-4">
            <FAQItem question={t('cleaningPage.faq1Q') } answer={t('cleaningPage.faq1A')} isOpen={openFAQ === 0} onToggle={() => setOpenFAQ(openFAQ === 0 ? null : 0)} />
            <FAQItem question={t('cleaningPage.faq2Q') } answer={t('cleaningPage.faq2A') } isOpen={openFAQ === 1} onToggle={() => setOpenFAQ(openFAQ === 1 ? null : 1)} />
            <FAQItem question={t('cleaningPage.faq3Q') } answer={t('cleaningPage.faq3A') } isOpen={openFAQ === 2} onToggle={() => setOpenFAQ(openFAQ === 2 ? null : 2)} />
            <FAQItem question={t('cleaningPage.faq4Q') } answer={t('cleaningPage.faq4A') } isOpen={openFAQ === 3} onToggle={() => setOpenFAQ(openFAQ === 3 ? null : 3)} />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('cleaningPage.pricingTitle') }</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">{t('cleaningPage.pricingDesc') }</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-5 sm:p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-bold text-gray-900">$79</span><span className="text-gray-600">/mo CAD</span></div>
              <p className="text-sm text-gray-600 mb-6">For solo operators</p>
              <Link href="/login?tab=signup" className="block w-full px-4 sm:px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors text-center mb-6">Start Free Trial</Link>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Call & booking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Basic scheduling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />1 user</li>
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-cyan-600 p-5 sm:p-8 text-left shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-cyan-600 text-white text-xs font-bold rounded-full">Most Popular</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Growth</h3>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-bold text-gray-900">$149</span><span className="text-gray-600">/mo CAD</span></div>
              <p className="text-sm text-gray-600 mb-6">For growing teams</p>
              <Link href="/login?tab=signup" className="block w-full px-4 sm:px-6 py-3 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors text-center mb-6">Start Free Trial</Link>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Everything in Starter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Recurring billing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Review automation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Up to 5 users</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 sm:p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scale</h3>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-bold text-gray-900">$299</span><span className="text-gray-600">/mo CAD</span></div>
              <p className="text-sm text-gray-600 mb-6">For multi-crew operations</p>
              <Link href="/login?tab=signup" className="block w-full px-4 sm:px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors text-center mb-6">Start Free Trial</Link>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Everything in Growth</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Unlimited users</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />Cost tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-500" />API access</li>
              </ul>
            </div>
          </div>
          <p className="mt-12 text-sm text-gray-600">All plans include a 14-day free trial. No credit card required. <Link href="/#pricing" className="text-cyan-600 hover:underline">See full comparison</Link></p>
        </div>
      </section>

    </MarketingLayout>
  );
}
