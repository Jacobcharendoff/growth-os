'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Wrench,
  Flame,
  Zap as Lightning,
  Sprout,
  Home,
  Wind,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';

// Trade icons mapping
const tradeIcons: { [key: string]: React.ReactNode } = {
  plumbing: <Wrench className="w-4 h-4" />,
  hvac: <Flame className="w-4 h-4" />,
  electrical: <Lightning className="w-4 h-4" />,
  landscaping: <Sprout className="w-4 h-4" />,
  roofing: <Home className="w-4 h-4" />,
  cleaning: <Wind className="w-4 h-4" />,
};

const tradeLinks = [
  { key: 'plumbing', href: '/plumbing' },
  { key: 'hvac', href: '/hvac' },
  { key: 'electrical', href: '/electrical' },
  { key: 'landscaping', href: '/landscaping' },
  { key: 'roofing', href: '/roofing' },
  { key: 'cleaning', href: '/cleaning' },
];

// ─── Shared Navigation ─────────────────────────────────────────
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileTradeOpen, setMobileTradeOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDesktopDropdownOpen(false);
    if (desktopDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [desktopDropdownOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2C3E50] flex items-center justify-center shadow-lg shadow-slate-600/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Stay</span><span className="text-[#27AE60]">bookt</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/#product" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.product')}
            </Link>

            {/* For Your Trade Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopDropdownOpen(!desktopDropdownOpen);
                }}
                onMouseEnter={() => setDesktopDropdownOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('nav.forYourTrade')}
                <ChevronDown className={`w-4 h-4 transition-transform ${desktopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {desktopDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in duration-200"
                  onMouseLeave={() => setDesktopDropdownOpen(false)}
                >
                  {tradeLinks.map((trade) => (
                    <Link
                      key={trade.key}
                      href={trade.href}
                      onClick={() => setDesktopDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-[#27AE60] hover:bg-emerald-50 transition-colors"
                    >
                      <span className="text-gray-400">{tradeIcons[trade.key]}</span>
                      {t(`industry.${trade.key}` as any)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t('marketing.pricing')}
            </Link>

            <Link href="/switch" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.whyStaybookt')}
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {locale === 'en' ? 'FR' : 'EN'}
            </button>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t('marketing.logIn')}
            </Link>
            <Link
              href="/login?tab=signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#27AE60] text-white text-sm font-semibold rounded-full hover:bg-[#229954] transition-all shadow-lg shadow-green-600/25 hover:shadow-green-700/30 hover:-translate-y-0.5"
            >
              {t('marketing.tryFree')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button className="lg:hidden p-3 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <Link
                href="/#product"
                className="text-sm font-medium text-gray-600 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {t('nav.product')}
              </Link>

              {/* Mobile For Your Trade Collapsible */}
              <div>
                <button
                  onClick={() => setMobileTradeOpen(!mobileTradeOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 w-full py-2"
                >
                  {t('nav.forYourTrade')}
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileTradeOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileTradeOpen && (
                  <div className="mt-2 ml-4 flex flex-col gap-2">
                    {tradeLinks.map((trade) => (
                      <Link
                        key={trade.key}
                        href={trade.href}
                        className="flex items-center gap-2 text-sm text-gray-600"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileTradeOpen(false);
                        }}
                      >
                        <span className="text-gray-400">{tradeIcons[trade.key]}</span>
                        {t(`industry.${trade.key}` as any)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-600 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {t('marketing.pricing')}
              </Link>

              <Link
                href="/switch"
                className="text-sm font-medium text-gray-600 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {t('nav.whyStaybookt')}
              </Link>

              {/* Mobile Language Toggle */}
              <button
                onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                className="flex items-center gap-2 text-sm font-medium text-gray-600"
              >
                <Globe className="w-4 h-4" />
                {locale === 'en' ? 'Français' : 'English'}
                <span className="ml-auto text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{locale.toUpperCase()}</span>
              </button>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('marketing.logIn')}
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-[#27AE60] text-white text-sm font-semibold rounded-full hover:bg-[#229954] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('marketing.tryFree')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Shared Footer ──────────────────────────────────────────────
export function Footer() {
  const { t } = useLanguage();
  const productLinks = [
    { label: t('nav.product'), href: '/#product' },
    { label: t('nav.automations'), href: '/automations' },
    { label: t('marketing.pricing'), href: '/pricing' },
    { label: t('nav.whyStaybookt'), href: '/switch' },
    { label: t('footer.vsServiceTitan'), href: '/vs-servicetitan' },
    { label: t('footer.vsJobber'), href: '/vs-jobber' },
    { label: t('footer.vsHousecallPro'), href: '/vs-housecall-pro' },
  ];

  const industryLinks = [
    { label: t('industry.plumbing'), href: '/plumbing' },
    { label: t('industry.hvac'), href: '/hvac' },
    { label: t('industry.electrical'), href: '/electrical' },
    { label: t('industry.landscaping'), href: '/landscaping' },
    { label: t('industry.roofing'), href: '/roofing' },
    { label: t('industry.cleaning'), href: '/cleaning' },
  ];

  const companyLinks = [
    { label: t('footer.about'), href: '/about' },
    { label: t('footer.contact'), href: '/contact' },
    { label: t('footer.privacyPolicy'), href: '/privacy' },
    { label: t('footer.termsOfService'), href: '/terms' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#2C3E50] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white"><span className="text-white">Stay</span><span className="text-[#27AE60]">bookt</span></span>
            </Link>
            <p className="text-sm leading-relaxed">Stay booked. Stay paid. Purpose-built for the trades.</p>
            <div className="mt-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-slate-500">{t('marketing.madeInCanada')}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('footer.product')}</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('footer.builtFor')}</h4>
            <ul className="space-y-2.5">
              {industryLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500" suppressHydrationWarning>&copy; {new Date().getFullYear()} Staybookt. All rights reserved. {t('marketing.madeInCanada')}.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@staybookt.ca" className="text-slate-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="tel:+18005550199" className="text-slate-500 hover:text-white transition-colors"><Phone className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── CTA Section ────────────────────────────────────────────────
export function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-r from-[#2C3E50] via-slate-700 to-[#2C3E50] overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {t('cta.mainHeading')}
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login?tab=signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#27AE60] hover:bg-[#229954] text-white text-base font-semibold rounded-full transition-all shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
          >
            {t('cta.startFreeTrial')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white text-base font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
          >
            {t('cta.scheduleDemo')}
          </Link>
        </div>
        <p className="mt-6 text-sm text-blue-200">{t('cta.footer')}</p>
      </div>
    </section>
  );
}

// ─── Marketing Page Layout Wrapper ──────────────────────────────
export function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Marketing pages are always light — strip dark class that may linger from app pages
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    return () => {
      // Restore dark class when navigating back to app if user preference is dark
      try {
        const t = localStorage.getItem('staybookt-theme');
        if (t === 'dark') document.documentElement.classList.add('dark');
      } catch {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {children}
      <CTASection />
      <Footer />
    </div>
  );
}
