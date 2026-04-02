'use client';

import { useState, useEffect } from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Check, Minus, ChevronDown, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import type { TranslationKey } from '@/i18n/translations';

export default function PricingPage() {
  const { t } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Strip dark mode class on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const plans: Array<{
    nameKey: TranslationKey;
    price: number;
    annualPrice: number;
    tagKey: TranslationKey;
    descriptionKey: TranslationKey;
    features: Array<{ textKey: TranslationKey; included: boolean }>;
    ctaKey: TranslationKey;
    href: string;
    highlighted: boolean;
  }> = [
    {
      nameKey: 'pricing.starterPlanName',
      price: 0,
      annualPrice: 0,
      tagKey: 'pricing.starterTag',
      descriptionKey: 'pricing.starterDescription',
      features: [
        { textKey: 'pricing.feature.contacts50', included: true },
        { textKey: 'pricing.feature.user1', included: true },
        { textKey: 'pricing.feature.pipeline5', included: true },
        { textKey: 'pricing.feature.estimates5', included: true },
        { textKey: 'pricing.feature.emailSupport', included: true },
        { textKey: 'pricing.feature.brandingGrowth', included: true },
        { textKey: 'pricing.feature.reporting', included: false },
        { textKey: 'pricing.feature.apiAccess', included: false },
      ],
      ctaKey: 'pricing.starterCta',
      href: '/setup',
      highlighted: false,
    },
    {
      nameKey: 'pricing.growthPlanName',
      price: 49,
      annualPrice: 39,
      tagKey: 'pricing.growthTag',
      descriptionKey: 'pricing.growthDescription',
      features: [
        { textKey: 'pricing.feature.contactsUnlimited', included: true },
        { textKey: 'pricing.feature.users5', included: true },
        { textKey: 'pricing.feature.pipelineFull', included: true },
        { textKey: 'pricing.feature.estimatesUnlimited', included: true },
        { textKey: 'pricing.feature.leadCapture', included: true },
        { textKey: 'pricing.feature.emailTemplates', included: true },
        { textKey: 'pricing.feature.prioritySupport', included: true },
        { textKey: 'pricing.feature.brandingRemove', included: true },
      ],
      ctaKey: 'pricing.growthCta',
      href: '/setup',
      highlighted: true,
    },
    {
      nameKey: 'pricing.scalePlanName',
      price: 99,
      annualPrice: 79,
      tagKey: 'pricing.scaleTag',
      descriptionKey: 'pricing.scaleDescription',
      features: [
        { textKey: 'pricing.feature.usersUnlimited', included: true },
        { textKey: 'pricing.feature.reporting', included: true },
        { textKey: 'pricing.feature.apiAccess', included: true },
        { textKey: 'pricing.feature.pipelineCustom', included: true },
        { textKey: 'pricing.feature.accountManager', included: true },
        { textKey: 'pricing.feature.phoneSupport', included: true },
        { textKey: 'pricing.feature.whiteLabel', included: true },
        { textKey: 'pricing.feature.onboarding', included: true },
      ],
      ctaKey: 'pricing.scaleCta',
      href: '/setup',
      highlighted: false,
    },
  ];

  const comparisonCategories: Array<{
    nameKey: TranslationKey;
    features: Array<{ textKey: TranslationKey; starter: boolean; pro: boolean; enterprise: boolean }>;
  }> = [
    {
      nameKey: 'pricing.categoryCoreCrm',
      features: [
        { textKey: 'pricing.feature.contactsMgmt', starter: true, pro: true, enterprise: true },
        { textKey: 'pricing.feature.pipelineViz', starter: true, pro: true, enterprise: true },
        { textKey: 'pricing.feature.pipelineCustom', starter: false, pro: false, enterprise: true },
        { textKey: 'pricing.feature.assignmentRules', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      nameKey: 'pricing.categoryEstimatesInvoicing',
      features: [
        { textKey: 'pricing.feature.estimatesCreate', starter: true, pro: true, enterprise: true },
        { textKey: 'pricing.feature.estimatesUnlimitedTable', starter: false, pro: true, enterprise: true },
        { textKey: 'pricing.feature.invoiceGeneration', starter: false, pro: true, enterprise: true },
        { textKey: 'pricing.feature.invoicesRecurring', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      nameKey: 'pricing.categoryAutomation',
      features: [
        { textKey: 'pricing.feature.automationsBasic', starter: false, pro: true, enterprise: true },
        { textKey: 'pricing.feature.workflowsAdvanced', starter: false, pro: true, enterprise: true },
        { textKey: 'pricing.feature.emailTemplatesTable', starter: false, pro: true, enterprise: true },
        { textKey: 'pricing.feature.leadCaptureForms', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      nameKey: 'pricing.categorySupportAccess',
      features: [
        { textKey: 'pricing.feature.emailSupportTable', starter: true, pro: true, enterprise: true },
        { textKey: 'pricing.feature.prioritySupport', starter: false, pro: true, enterprise: true },
        { textKey: 'pricing.feature.phoneSupport', starter: false, pro: false, enterprise: true },
        { textKey: 'pricing.feature.accountManager', starter: false, pro: false, enterprise: true },
      ],
    },
  ];

  const faqs: Array<{ questionKey: TranslationKey; answerKey: TranslationKey }> = [
    {
      questionKey: 'pricing.faq1Question',
      answerKey: 'pricing.faq1Answer',
    },
    {
      questionKey: 'pricing.faq2Question',
      answerKey: 'pricing.faq2Answer',
    },
    {
      questionKey: 'pricing.faq3Question',
      answerKey: 'pricing.faq3Answer',
    },
    {
      questionKey: 'pricing.faq4Question',
      answerKey: 'pricing.faq4Answer',
    },
    {
      questionKey: 'pricing.faq5Question',
      answerKey: 'pricing.faq5Answer',
    },
    {
      questionKey: 'pricing.faq6Question',
      answerKey: 'pricing.faq6Answer',
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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E50] tracking-tight mb-6">
            {t('pricing.pageTitle')}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('pricing.pageSubtitle')}
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
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                isAnnual
                  ? 'bg-[#27AE60] text-white shadow-lg shadow-green-600/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('pricing.annual')}
            </button>
            {isAnnual && (
              <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                {t('pricing.save20')}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => {
              const displayPrice = currentPriceNum(plan.price, plan.annualPrice);
              return (
                <div
                  key={t(plan.nameKey)}
                  className={`relative rounded-2xl transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-white border-2 border-[#27AE60] shadow-2xl shadow-[#27AE60]/15 md:scale-105'
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#27AE60] text-white text-xs font-bold rounded-full shadow-lg">
                      {t(plan.tagKey)}
                    </div>
                  )}

                  <div className="p-8 sm:p-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">{t(plan.nameKey)}</h3>
                      <p className="text-gray-600 text-sm mb-6">{t(plan.descriptionKey)}</p>

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
                      {t(plan.ctaKey)}
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
                            {t(feature.textKey)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Signals */}
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                {t('pricing.noCardRequired')} <span className="text-gray-400">·</span> {t('pricing.cancelAnytime')} <span className="text-gray-400">·</span> {t('pricing.pricesInCad')}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Competitor Comparison Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] mb-4">{t('pricing.comparisonHeading')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Competitor Cards */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg text-[#2C3E50] mb-2">{t('pricing.serviceTitan')}</h3>
              <p className="text-gray-700 text-sm">{t('pricing.serviceTitanPrice')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg text-[#2C3E50] mb-2">{t('pricing.jobber')}</h3>
              <p className="text-gray-700 text-sm">{t('pricing.jobberPrice')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg text-[#2C3E50] mb-2">{t('pricing.housecall')}</h3>
              <p className="text-gray-700 text-sm">{t('pricing.housecallPrice')}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-[#27AE60]">
              <h3 className="font-bold text-lg text-[#27AE60] mb-2">{t('pricing.growthOS')}</h3>
              <p className="text-gray-700 text-sm">{t('pricing.growthOSPrice')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-4">{t('pricing.featureComparison')}</h2>
            <p className="text-lg text-gray-600">{t('pricing.featureComparisonSubtitle')}</p>
          </div>

          {/* Mobile: Accordion */}
          <div className="lg:hidden space-y-4">
            {comparisonCategories.map((category, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-[#2C3E50]">{t(category.nameKey)}</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                    {category.features.map((f, fidx) => (
                      <div key={fidx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{t(f.textKey)}</span>
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
                  <th className="text-left py-4 px-6 font-semibold text-[#2C3E50]">{t('pricing.featureHeaderFeature')}</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">{t('pricing.featureHeaderStarter')}</th>
                  <th className="text-center py-4 px-6 font-semibold text-[#27AE60] bg-emerald-50">{t('pricing.featureHeaderGrowth')}</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">{t('pricing.featureHeaderScale')}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonCategories.map((category, cidx) => (
                  <tr key={cidx} className="border-b border-gray-200 bg-gray-50">
                    <td colSpan={4} className="py-3 px-6 font-semibold text-[#2C3E50] text-sm">
                      {t(category.nameKey)}
                    </td>
                  </tr>
                ))}
                {comparisonCategories.map((category) =>
                  category.features.map((feature, fidx) => (
                    <tr key={`${t(category.nameKey)}-${fidx}`} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-gray-700">{t(feature.textKey)}</td>
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
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-4">{t('pricing.faqTitle')}</h2>
            <p className="text-lg text-gray-600">{t('pricing.faqSubtitle')}</p>
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
                  <h3 className="text-lg font-semibold text-[#2C3E50] text-left">{t(faq.questionKey)}</h3>
                  <ChevronDown
                    className={`w-6 h-6 text-[#27AE60] shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{t(faq.answerKey)}</p>
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
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">{t('pricing.ctaHeading')}</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            {t('pricing.ctaDescription')}
          </p>
          <Link
            href="/login?tab=signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#27AE60] text-white text-lg font-semibold rounded-full hover:bg-[#229954] transition-all shadow-xl shadow-green-600/30 hover:shadow-green-700/40 hover:-translate-y-0.5"
          >
            {t('pricing.ctaButton')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-8 text-sm text-blue-200">{t('pricing.ctaFooter')}</p>
        </div>
      </section>
    </MarketingLayout>
  );
}
