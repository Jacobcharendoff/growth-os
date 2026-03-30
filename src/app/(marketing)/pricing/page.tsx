'use client';

import { useState, useEffect } from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Check, Minus, ChevronDown, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Strip dark mode class on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const plans = [
    {
      name: 'Starter',
      price: 0,
      annualPrice: 0,
      tag: 'Free',
      description: 'For solo operators getting started',
      features: [
        { text: 'Up to 50 contacts', included: true },
        { text: '1 user', included: true },
        { text: 'Basic pipeline (5 stages)', included: true },
        { text: '5 estimates/month', included: true },
        { text: 'Email support', included: true },
        { text: 'GrowthOS branding on estimates', included: true },
        { text: 'Advanced reporting', included: false },
        { text: 'API access', included: false },
      ],
      cta: 'Get Started Free',
      href: '/setup',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: 49,
      annualPrice: 39,
      tag: 'Most Popular',
      description: 'For growing service businesses',
      features: [
        { text: 'Unlimited contacts', included: true },
        { text: 'Up to 5 users', included: true },
        { text: 'Full pipeline + automations', included: true },
        { text: 'Unlimited estimates & invoices', included: true },
        { text: 'Lead capture forms', included: true },
        { text: 'Email templates', included: true },
        { text: 'Priority support', included: true },
        { text: 'Remove GrowthOS branding', included: true },
      ],
      cta: 'Start Free Trial',
      href: '/setup',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 99,
      annualPrice: 79,
      tag: 'For Scale',
      description: 'For multi-crew operations',
      features: [
        { text: 'Unlimited users', included: true },
        { text: 'Advanced reporting', included: true },
        { text: 'API access', included: true },
        { text: 'Custom pipeline stages', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Phone support', included: true },
        { text: 'White-label options', included: true },
        { text: 'Priority onboarding', included: true },
      ],
      cta: 'Contact Sales',
      href: '/contact',
      highlighted: false,
    },
  ];

  const comparisonCategories = [
    {
      name: 'Core CRM',
      features: [
        { text: 'Contacts management', starter: true, pro: true, enterprise: true },
        { text: 'Pipeline visualization', starter: true, pro: true, enterprise: true },
        { text: 'Custom pipeline stages', starter: false, pro: false, enterprise: true },
        { text: 'Lead assignment rules', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      name: 'Estimates & Invoicing',
      features: [
        { text: 'Create estimates', starter: true, pro: true, enterprise: true },
        { text: 'Unlimited estimates', starter: false, pro: true, enterprise: true },
        { text: 'Invoice generation', starter: false, pro: true, enterprise: true },
        { text: 'Recurring invoices', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      name: 'Automation',
      features: [
        { text: 'Basic automations', starter: false, pro: true, enterprise: true },
        { text: 'Advanced workflows', starter: false, pro: true, enterprise: true },
        { text: 'Email templates', starter: false, pro: true, enterprise: true },
        { text: 'Lead capture forms', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      name: 'Support & Access',
      features: [
        { text: 'Email support', starter: true, pro: true, enterprise: true },
        { text: 'Priority support', starter: false, pro: true, enterprise: true },
        { text: 'Phone support', starter: false, pro: false, enterprise: true },
        { text: 'Dedicated account manager', starter: false, pro: false, enterprise: true },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer:
        'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, we\'ll charge you the pro-rated difference. If you downgrade, you\'ll receive a credit toward your next billing cycle.',
    },
    {
      question: 'Is there a contract?',
      answer:
        'No contracts. We operate on month-to-month billing for all plans. You can cancel anytime, no questions asked. If you choose annual billing, you get a 20% discount.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, Mastercard, American Express). For Enterprise accounts, we can also arrange wire transfers or custom payment terms.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer:
        'Yes! Annual plans come with a 20% discount compared to monthly pricing. For example, Professional is $39/month on an annual plan versus $49/month on monthly billing.',
    },
    {
      question: 'Can I import my existing contacts?',
      answer:
        'Absolutely. We support bulk imports from CSV, Excel, and most other CRM systems. Our onboarding team can help you migrate your data — no data loss, no hassle.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Your data is protected with enterprise-grade encryption and GDPR compliance. We perform regular security audits and maintain automatic daily backups. You own your data and can export it anytime.',
    },
  ];

  const currentPriceNum = (basePrice: number, annualPrice: number) => {
    return isAnnual ? annualPrice : basePrice;
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(39, 174, 96, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(44, 62, 80, 0.03) 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-8">
            <Zap className="w-4 h-4 text-[#27AE60]" />
            <span className="text-xs font-semibold text-[#27AE60] uppercase tracking-wider">Pricing</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2C3E50] tracking-tight mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-8">
            No contracts. No hidden fees. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                !isAnnual
                  ? 'bg-[#27AE60] text-white shadow-lg shadow-green-600/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                isAnnual
                  ? 'bg-[#27AE60] text-white shadow-lg shadow-green-600/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Annual
            </button>
            {isAnnual && (
              <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => {
              const displayPrice = currentPriceNum(plan.price, plan.annualPrice);
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-white border-2 border-[#27AE60] shadow-2xl shadow-[#27AE60]/15 md:scale-105'
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#27AE60] text-white text-xs font-bold rounded-full shadow-lg">
                      {plan.tag}
                    </div>
                  )}

                  <div className="p-8 sm:p-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                      {/* Price */}
                      {plan.price === 0 ? (
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-bold text-[#27AE60]">Free</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-5xl font-bold text-[#2C3E50]">${displayPrice}</span>
                          <span className="text-gray-600 font-semibold">/mo</span>
                        </div>
                      )}
                      {plan.price !== 0 && isAnnual && (
                        <p className="text-sm text-gray-500">
                          ${displayPrice * 12}/year (saves ${(plan.price - plan.annualPrice) * 12}/year)
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={plan.href}
                      className={`w-full py-3 px-6 rounded-xl font-semibold text-base transition-all mb-8 flex items-center justify-center gap-2 ${
                        plan.highlighted
                          ? 'bg-[#27AE60] text-white hover:bg-[#229954] shadow-lg shadow-green-600/25 hover:shadow-green-700/40'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Features */}
                    <ul className="space-y-4 flex-1">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                          ) : (
                            <Minus className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-4">Feature Comparison</h2>
            <p className="text-lg text-gray-600">See exactly what's included in each plan</p>
          </div>

          {/* Mobile: Accordion */}
          <div className="lg:hidden space-y-4">
            {comparisonCategories.map((category, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-[#2C3E50]">{category.name}</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                    {category.features.map((f, fidx) => (
                      <div key={fidx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{f.text}</span>
                        <div className="flex gap-4">
                          <span className="w-12 text-center text-[#27AE60] font-semibold">
                            {f.starter ? '✓' : '–'}
                          </span>
                          <span className="w-12 text-center text-[#27AE60] font-semibold">
                            {f.pro ? '✓' : '–'}
                          </span>
                          <span className="w-12 text-center text-[#27AE60] font-semibold">
                            {f.enterprise ? '✓' : '–'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-[#2C3E50]">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-[#27AE60] bg-emerald-50">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonCategories.map((category, cidx) => (
                  <tr key={cidx} className="border-b border-gray-200 bg-gray-50">
                    <td colSpan={4} className="py-3 px-6 font-semibold text-[#2C3E50] text-sm">
                      {category.name}
                    </td>
                  </tr>
                ))}
                {comparisonCategories.map((category) =>
                  category.features.map((feature, fidx) => (
                    <tr key={`${category.name}-${fidx}`} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-gray-700">{feature.text}</td>
                      <td className="py-4 px-6 text-center">
                        {feature.starter ? (
                          <Check className="w-5 h-5 text-[#27AE60] mx-auto" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center bg-emerald-50">
                        {feature.pro ? (
                          <Check className="w-5 h-5 text-[#27AE60] mx-auto" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {feature.enterprise ? (
                          <Check className="w-5 h-5 text-[#27AE60] mx-auto" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about GrowthOS pricing</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:border-gray-300 hover:shadow-md"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-[#2C3E50] text-left">{faq.question}</h3>
                  <ChevronDown
                    className={`w-6 h-6 text-[#27AE60] shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#2C3E50] via-slate-700 to-[#2C3E50] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to grow your business?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Join 500+ Canadian service businesses already using GrowthOS. Start your free trial today — no credit card required.
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#27AE60] text-white text-lg font-semibold rounded-full hover:bg-[#229954] transition-all shadow-xl shadow-green-600/30 hover:shadow-green-700/40 hover:-translate-y-0.5"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-8 text-sm text-blue-200">No credit card required · Setup in 2 minutes · Cancel anytime</p>
        </div>
      </section>
    </MarketingLayout>
  );
}
