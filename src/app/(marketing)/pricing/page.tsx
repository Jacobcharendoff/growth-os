'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.starter'),
      price: '79',
      description: t('pricing.starterDesc'),
      features: [
        t('pricing.oneUser'),
        t('pricing.seeEveryJobGlance'),
        t('pricing.allCustomersOnePlace'),
        t('pricing.provincialTax'),
        t('pricing.speedToLeadReviewsReminders'),
        t('pricing.emailSupport'),
      ],
      cta: t('pricing.tryFree'),
      highlighted: false,
    },
    {
      name: t('pricing.growth'),
      price: '149',
      description: t('pricing.growthDesc'),
      features: [
        t('pricing.upTo5Users'),
        t('pricing.trackAsMany'),
        t('pricing.all8Automations'),
        t('pricing.tieredEstimates'),
        t('pricing.frenchEnglishTemplates'),
        t('pricing.whichJobsMakeMoney'),
        t('pricing.prioritySupport'),
        t('pricing.googleHomeStarsSync'),
      ],
      cta: t('pricing.tryFree'),
      highlighted: true,
    },
    {
      name: t('pricing.scale'),
      price: '299',
      description: t('pricing.scaleDesc'),
      features: [
        t('pricing.unlimitedUsers'),
        t('pricing.multiLocationSupport'),
        t('pricing.licenseWsibWcbTracking'),
        t('pricing.connectToAnySoftware'),
        t('pricing.dedicatedAccountManager'),
        t('pricing.interacETransferIntegration'),
        t('pricing.trainYourTeam'),
        t('pricing.accountingSoftwareSyncs'),
      ],
      cta: t('pricing.tryFree'),
      highlighted: false,
    },
  ];

  const comparisonFeatures = [
    { label: t('comparison.autoRespondMissedCalls'), starter: true, growth: true, scale: true },
    { label: t('comparison.automatedFollowUps'), starter: true, growth: true, scale: true },
    { label: t('comparison.goodBetterBest'), starter: false, growth: true, scale: true },
    { label: t('comparison.canadianTaxCalculations'), starter: true, growth: true, scale: true },
    { label: t('comparison.frenchEnglishTemplates'), starter: false, growth: true, scale: true },
    { label: t('comparison.monthToMonth'), starter: true, growth: true, scale: true },
    { label: t('comparison.googleHomeStarsReviews'), starter: true, growth: true, scale: true },
    { label: t('comparison.visualPipeline'), starter: true, growth: true, scale: true },
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{t('pricing.title')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            {t('pricing.description')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.noCredit')}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-[#27AE60] text-white shadow-2xl shadow-[#27AE60]/25 md:scale-105 border-2 border-[#229954]'
                    : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name and Price */}
                  <h3 className={`text-lg font-semibold mb-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-sm ${plan.highlighted ? 'text-blue-200' : 'text-gray-400'}`}>$</span>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-blue-200' : 'text-gray-400'}`}>/mo CAD</span>
                  </div>
                  <p className={`text-sm mb-8 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href="/setup"
                    className={`block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all mb-8 ${
                      plan.highlighted
                        ? 'bg-white text-[#27AE60] hover:bg-gray-50 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            plan.highlighted ? 'text-blue-200' : 'text-emerald-500'
                          }`}
                        />
                        <span className={`text-sm ${plan.highlighted ? 'text-blue-50' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Risk Reversal Copy */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
              <p className="text-lg font-semibold text-blue-900 mb-2">
                {t('pricing.riskReversal')}
              </p>
              <p className="text-blue-700">
                {t('pricing.noCredit')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            {t('comparison.compare')}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600 bg-blue-50">Growth</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Scale</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{feature.label}</td>
                    <td className="py-4 px-6 text-center">
                      {feature.starter ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-blue-50">
                      {feature.growth ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.scale ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ / Additional Info */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Questions?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I upgrade or downgrade?</h3>
              <p className="text-gray-600 text-sm">
                Yes. Change your plan anytime. We'll pro-rate the difference, so you only pay for what you use.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's included in the free trial?</h3>
              <p className="text-gray-600 text-sm">
                Full access to Growth plan features for 14 days. No credit card required, and you can cancel anytime.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer annual discounts?</h3>
              <p className="text-gray-600 text-sm">
                We focus on month-to-month pricing so you're never locked in. Contact us for enterprise pricing if you need it.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                Credit cards (Visa, Mastercard, Amex) and Interac e-Transfer on the Scale plan.
              </p>
            </div>
          </div>
        </div>
      </section>

    </MarketingLayout>
  );
}
