'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import { ComparisonMatrix } from '@/components/ComparisonMatrix';
import { ROICalculator } from '@/components/ROICalculator';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Languages,
  DollarSign,
  Zap,
  Shield,
  Star,
  Target,
  BarChart3,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';

// Scroll reveal hook
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

// Animated counter component
function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
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

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function WhyGrowthOSPage() {
  const { t } = useLanguage();

  // Scroll reveal sections
  const painSection = useScrollReveal();
  const gainSection = useScrollReveal();
  const switchSection = useScrollReveal();
  const competitorSection = useScrollReveal();
  const testimonialSection = useScrollReveal();

  // Staggered card reveals
  const painCard1 = useScrollReveal();
  const painCard2 = useScrollReveal();
  const painCard3 = useScrollReveal();

  const gainCard1 = useScrollReveal();
  const gainCard2 = useScrollReveal();
  const gainCard3 = useScrollReveal();
  const gainCard4 = useScrollReveal();
  const gainCard5 = useScrollReveal();
  const gainCard6 = useScrollReveal();

  const testimonial1 = useScrollReveal();
  const testimonial2 = useScrollReveal();
  const testimonial3 = useScrollReveal();

  return (
    <>
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-delay-1 {
          transition-delay: 0.1s;
        }

        .reveal-delay-2 {
          transition-delay: 0.2s;
        }

        .reveal-delay-3 {
          transition-delay: 0.3s;
        }

        .reveal-delay-4 {
          transition-delay: 0.4s;
        }

        .reveal-delay-5 {
          transition-delay: 0.5s;
        }

        .reveal-scale {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .reveal-scale.visible {
          opacity: 1;
          transform: scale(1);
        }

        .gradient-text {
          background: linear-gradient(to right, #27AE60, #229954);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glow-hover {
          transition: all 0.3s ease;
        }

        .glow-hover:hover {
          box-shadow: 0 0 30px rgba(39, 174, 96, 0.25);
          border-color: rgba(39, 174, 96, 0.5);
        }

        .animate-progress {
          animation: fillProgress 1.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes fillProgress {
          to {
            opacity: 1;
            width: 100%;
          }
        }

        .hero-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(39,174,96,0.4) 0%, rgba(34,153,84,0.1) 70%, transparent 100%);
          top: -5%;
          left: -5%;
          animation: float 20s ease-in-out infinite;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.1) 70%, transparent 100%);
          bottom: -10%;
          right: -5%;
          animation: float 25s ease-in-out infinite reverse;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%);
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
          animation: float 18s ease-in-out infinite 3s;
        }

        .hero-grid {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-glow-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(39,174,96,0.3), transparent);
          width: 60%;
          left: 20%;
          bottom: 0;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        .pulse-ring {
          position: relative;
        }

        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(39, 174, 96, 0.2);
          animation: pulse-expand 2s ease-out infinite;
        }

        @keyframes pulse-expand {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
      `}</style>

      <MarketingLayout>
        {/* SECTION 1: HERO */}
        <section className="relative w-full overflow-hidden bg-[#0a0f1a] py-20 sm:py-32 px-4 sm:px-6 lg:px-8 pt-28">
          {/* Layered background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0c1220] to-[#0a1628]" />
          <div className="absolute inset-0 hero-grid" />
          {/* Decorative gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="hero-gradient-orb orb-1"></div>
            <div className="hero-gradient-orb orb-2"></div>
            <div className="hero-gradient-orb orb-3"></div>
          </div>
          <div className="hero-glow-line" />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8 hover:bg-emerald-500/15 transition-colors">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-emerald-300">
                {t('whyGrowthOS.heroBadge')}
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              {t('whyGrowthOS.heroTitle')}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('whyGrowthOS.heroSubtitle')}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Stat 1 */}
              <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                  <AnimatedCounter end={40} suffix="%" />
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {t('whyGrowthOS.statMoreJobsLabel')}
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                  <AnimatedCounter end={60} suffix="sec" />
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {t('whyGrowthOS.statResponseTimeLabel')}
                </p>
              </div>

              {/* Stat 3 */}
              <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                  <AnimatedCounter end={12} suffix="hrs" />
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {t('whyGrowthOS.statSavedPerWeekLabel')}
                </p>
              </div>

              {/* Stat 4 */}
              <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                  $<AnimatedCounter end={8500} />
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {t('whyGrowthOS.statExtraRevenueLabel')}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login?tab=signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#27AE60] text-white text-base font-semibold rounded-full hover:bg-[#229954] transition-all shadow-lg shadow-[#27AE60]/40 hover:shadow-[#229954]/50 hover:-translate-y-0.5"
              >
                {t('whyGrowthOS.heroCta')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 border border-slate-700 text-white text-base font-semibold rounded-full hover:bg-slate-800 hover:border-slate-600 transition-all"
              >
                {t('whyGrowthOS.heroSecondaryCta')}
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHAT YOU LEAVE BEHIND */}
        <section
          ref={painSection.ref}
          className={`w-full bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8 reveal ${
            painSection.isVisible ? 'visible' : ''
          }`}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
                {t('whyGrowthOS.painTitle')}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                These challenges disappear when you move to GrowthOS.
              </p>
            </div>

            {/* Pain Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Manual Tax */}
              <div
                ref={painCard1.ref}
                className={`reveal reveal-delay-1 p-8 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl hover:border-rose-300 transition-all ${
                  painCard1.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {t('whyGrowthOS.pain1Title')}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('whyGrowthOS.pain1Desc')}
                </p>
              </div>

              {/* Card 2: No French */}
              <div
                ref={painCard2.ref}
                className={`reveal reveal-delay-2 p-8 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl hover:border-rose-300 transition-all ${
                  painCard2.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                  <Languages className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {t('whyGrowthOS.pain2Title')}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('whyGrowthOS.pain2Desc')}
                </p>
              </div>

              {/* Card 3: Paying Too Much */}
              <div
                ref={painCard3.ref}
                className={`reveal reveal-delay-3 p-8 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl hover:border-rose-300 transition-all ${
                  painCard3.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {t('whyGrowthOS.pain3Title')}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {t('whyGrowthOS.pain3Desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: WHAT YOU GAIN */}
        <section
          ref={gainSection.ref}
          className={`w-full bg-gradient-to-b from-slate-950 to-slate-900 py-20 sm:py-32 px-4 sm:px-6 lg:px-8 reveal ${
            gainSection.isVisible ? 'visible' : ''
          }`}
        >
          <div className="max-w-6xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                {t('whyGrowthOS.gainTitle')}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Everything is built with Canadian service businesses in mind.
              </p>
            </div>

            {/* Benefit Cards - 2x3 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Gain 1: Bilingual */}
              <div
                ref={gainCard1.ref}
                className={`reveal reveal-delay-1 reveal-scale p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm glow-hover ${
                  gainCard1.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-[#2C3E50] rounded-xl flex items-center justify-center mb-6">
                  <Languages className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t('whyGrowthOS.gain1Title')}
                </h3>
                <p className="text-slate-400">
                  {t('whyGrowthOS.gain1Desc')}
                </p>
              </div>

              {/* Gain 2: Canadian Tax */}
              <div
                ref={gainCard2.ref}
                className={`reveal reveal-delay-2 reveal-scale p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm glow-hover ${
                  gainCard2.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t('whyGrowthOS.gain2Title')}
                </h3>
                <p className="text-slate-400">
                  {t('whyGrowthOS.gain2Desc')}
                </p>
              </div>

              {/* Gain 3: Automations */}
              <div
                ref={gainCard3.ref}
                className={`reveal reveal-delay-3 reveal-scale p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm glow-hover ${
                  gainCard3.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t('whyGrowthOS.gain3Title')}
                </h3>
                <p className="text-slate-400">
                  {t('whyGrowthOS.gain3Desc')}
                </p>
              </div>

              {/* Gain 4: Cost */}
              <div
                ref={gainCard4.ref}
                className={`reveal reveal-delay-4 reveal-scale p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm glow-hover ${
                  gainCard4.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t('whyGrowthOS.gain4Title')}
                </h3>
                <p className="text-slate-400">
                  {t('whyGrowthOS.gain4Desc')}
                </p>
              </div>

              {/* Gain 5: HomeStars */}
              <div
                ref={gainCard5.ref}
                className={`reveal reveal-delay-5 reveal-scale p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm glow-hover ${
                  gainCard5.isVisible ? 'visible' : ''
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center mb-6">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t('whyGrowthOS.gain5Title')}
                </h3>
                <p className="text-slate-400">
                  {t('whyGrowthOS.gain5Desc')}
                </p>
              </div>

              {/* Gain 6: Built for Your Trade */}
              <div
                className={`reveal reveal-delay-1 reveal-scale p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm glow-hover ${
                  gainCard6.isVisible ? 'visible' : ''
                }`}
                ref={gainCard6.ref}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t('whyGrowthOS.gain6Title')}
                </h3>
                <p className="text-slate-400">
                  {t('whyGrowthOS.gain6Desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE SWITCH TAKES 10 MINUTES */}
        <section
          ref={switchSection.ref}
          className={`w-full bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8 reveal ${
            switchSection.isVisible ? 'visible' : ''
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
                {t('whyGrowthOS.switchTitle')}
              </h2>
              <p className="text-lg text-slate-600">
                {t('whyGrowthOS.switchSubtitle')}
              </p>
            </div>

            {/* Timeline Steps */}
            <div className="relative">
              {/* Progress line background */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#2C3E50] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-[#2C3E50]/40 pulse-ring">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {t('whyGrowthOS.step1Label')}
                  </h3>
                  <p className="text-slate-600">
                    {t('whyGrowthOS.step1Desc')}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#2C3E50] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-[#2C3E50]/40 pulse-ring">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {t('whyGrowthOS.step2Label')}
                  </h3>
                  <p className="text-slate-600">
                    {t('whyGrowthOS.step2Desc')}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#2C3E50] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-[#2C3E50]/40 pulse-ring">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {t('whyGrowthOS.step3Label')}
                  </h3>
                  <p className="text-slate-600">
                    {t('whyGrowthOS.step3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: COMING FROM... */}
        <section
          ref={competitorSection.ref}
          className={`w-full bg-gradient-to-b from-slate-900 to-slate-950 py-20 sm:py-32 px-4 sm:px-6 lg:px-8 reveal ${
            competitorSection.isVisible ? 'visible' : ''
          }`}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                {t('whyGrowthOS.comingFromTitle')}
              </h2>
              <p className="text-lg text-slate-400">
                We make switching painless, regardless of where you're coming from.
              </p>
            </div>

            {/* Competitor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* ServiceTitan */}
              <div className="p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                  {t('whyGrowthOS.fromST')}
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {t('whyGrowthOS.fromSTDesc')}
                </p>
                <Link
                  href="/vs-servicetitan"
                  className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  {t('whyGrowthOS.fromSTLink')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Jobber */}
              <div className="p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                  {t('whyGrowthOS.fromJobber')}
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {t('whyGrowthOS.fromJobberDesc')}
                </p>
                <Link
                  href="/vs-jobber"
                  className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  {t('whyGrowthOS.fromJobberLink')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Housecall Pro */}
              <div className="p-8 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-all group">
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                  {t('whyGrowthOS.fromHCP')}
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {t('whyGrowthOS.fromHCPDesc')}
                </p>
                <Link
                  href="/vs-housecall-pro"
                  className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  {t('whyGrowthOS.fromHCPLink')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILED COMPARISON MATRIX */}
        <ComparisonMatrix />

        {/* ROI CALCULATOR */}
        <ROICalculator />

        {/* SECTION 6: REAL RESULTS - TESTIMONIALS */}
        <section
          ref={testimonialSection.ref}
          className={`w-full bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8 reveal ${
            testimonialSection.isVisible ? 'visible' : ''
          }`}
        >
          <div className="max-w-5xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
                {t('whyGrowthOS.socialTitle')}
              </h2>
              <p className="text-lg text-slate-600">
                Hear from service business owners using GrowthOS right now.
              </p>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div
                ref={testimonial1.ref}
                className={`reveal reveal-delay-1 p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all ${
                  testimonial1.isVisible ? 'visible' : ''
                }`}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">
                  "{t('whyGrowthOS.testimonial1Quote')}"
                </p>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <p className="font-bold text-slate-900">
                    {t('whyGrowthOS.testimonial1Name')}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t('whyGrowthOS.testimonial1Company')}
                  </p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div
                ref={testimonial2.ref}
                className={`reveal reveal-delay-2 p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all ${
                  testimonial2.isVisible ? 'visible' : ''
                }`}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">
                  "{t('whyGrowthOS.testimonial2Quote')}"
                </p>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <p className="font-bold text-slate-900">
                    {t('whyGrowthOS.testimonial2Name')}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t('whyGrowthOS.testimonial2Company')}
                  </p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div
                ref={testimonial3.ref}
                className={`reveal reveal-delay-3 p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all ${
                  testimonial3.isVisible ? 'visible' : ''
                }`}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed">
                  "{t('whyGrowthOS.testimonial3Quote')}"
                </p>
                <div className="border-l-4 border-emerald-600 pl-4">
                  <p className="font-bold text-slate-900">
                    {t('whyGrowthOS.testimonial3Name')}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t('whyGrowthOS.testimonial3Company')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </MarketingLayout>
    </>
  );
}
