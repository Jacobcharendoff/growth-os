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
} from 'lucide-react';

// ─── Shared Navigation ─────────────────────────────────────────
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50'
          : 'bg-white/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Growth OS<span className="text-blue-600">™</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</Link>
            <Link href="/#autopilot" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Autopilot</Link>
            <Link href="/#compare" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Compare</Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
            >
              Try Free for 14 Days
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button className="lg:hidden p-3 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/#how-it-works" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link href="/#autopilot" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Autopilot</Link>
              <Link href="/#compare" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Compare</Link>
              <Link href="/#pricing" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <div className="flex gap-3 pt-2">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600">Log in</Link>
                <Link href="/setup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  Try Free <ArrowRight className="w-4 h-4" />
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
  const productLinks = [
    { label: 'Features', href: '/#explorer' },
    { label: 'Autopilot', href: '/#autopilot' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'vs ServiceTitan', href: '/vs-servicetitan' },
    { label: 'vs Jobber', href: '/vs-jobber' },
    { label: 'vs Housecall Pro', href: '/vs-housecall-pro' },
  ];

  const industryLinks = [
    { label: 'Plumbing', href: '/plumbing' },
    { label: 'HVAC', href: '/hvac' },
    { label: 'Electrical', href: '/electrical' },
    { label: 'Landscaping', href: '/landscaping' },
    { label: 'Roofing', href: '/roofing' },
    { label: 'Cleaning', href: '/cleaning' },
  ];

  const companyLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Growth OS<span className="text-blue-500">™</span></span>
            </Link>
            <p className="text-sm leading-relaxed">The operating system for service business growth. Purpose-built for the trades.</p>
            <div className="mt-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-slate-500">Made in Canada</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Built For</h4>
            <ul className="space-y-2.5">
              {industryLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Growth OS. All rights reserved. Made in Canada.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@growthos.ca" className="text-slate-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="tel:+18005550199" className="text-slate-500 hover:text-white transition-colors"><Phone className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── CTA Section ────────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to stop losing leads?
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join hundreds of Canadian service businesses already growing with Growth OS. Start your free 14-day trial today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 text-base font-semibold rounded-full hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white text-base font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
          >
            Book a Demo
          </Link>
        </div>
        <p className="mt-6 text-sm text-blue-200">No credit card required. Cancel anytime.</p>
      </div>
    </section>
  );
}

// ─── Marketing Page Layout Wrapper ──────────────────────────────
export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {children}
      <CTASection />
      <Footer />
    </div>
  );
}
