'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { Check, X, Crown, ArrowRight, Star } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface ComparisonRow {
  feature: string;
  growthOS: string;
  serviceTitan: string;
  jobber: string;
  housecallPro: string;
  category: string;
  highlight?: boolean;
}

export function ComparisonMatrix() {
  const { t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['pricing', 'core', 'canadian']);

  const comparisonData: ComparisonRow[] = [
    // Pricing & Setup
    {
      feature: t('compare.startingPrice'),
      growthOS: '$49/mo',
      serviceTitan: '$300+/mo',
      jobber: '$69/mo',
      housecallPro: '$79/mo',
      category: 'pricing',
    },
    {
      feature: t('compare.freeTrial'),
      growthOS: t('compare.freeTrialGrowthOS'),
      serviceTitan: t('compare.freeTrialNo'),
      jobber: t('compare.freeTrialStandard'),
      housecallPro: t('compare.freeTrialStandard'),
      category: 'pricing',
    },
    {
      feature: t('compare.setupTime'),
      growthOS: t('compare.setupTimeGrowthOS'),
      serviceTitan: t('compare.setupTimeLong'),
      jobber: t('compare.setupTimeModerate'),
      housecallPro: t('compare.setupTimeModerate'),
      category: 'pricing',
    },
    {
      feature: t('compare.contractRequired'),
      growthOS: t('compare.contractNo'),
      serviceTitan: t('compare.contractYes'),
      jobber: t('compare.contractNo'),
      housecallPro: t('compare.contractNo'),
      category: 'pricing',
    },

    // Core Features
    {
      feature: t('compare.crm'),
      growthOS: '✓',
      serviceTitan: '✓',
      jobber: '✓',
      housecallPro: '✓',
      category: 'core',
    },
    {
      feature: t('compare.estimatesInvoicing'),
      growthOS: '✓',
      serviceTitan: '✓',
      jobber: '✓',
      housecallPro: '✓',
      category: 'core',
    },
    {
      feature: t('compare.schedulingDispatch'),
      growthOS: '✓',
      serviceTitan: '✓',
      jobber: '✓',
      housecallPro: '✓',
      category: 'core',
    },
    {
      feature: t('compare.automations'),
      growthOS: t('compare.automationsGrowthOS'),
      serviceTitan: t('compare.automationsAdvanced'),
      jobber: t('compare.automationsBasic'),
      housecallPro: t('compare.automationsBasic'),
      category: 'core',
      highlight: true,
    },
    {
      feature: t('compare.aiGrowthAdvisor'),
      growthOS: t('compare.aiGrowthAdvisorYes'),
      serviceTitan: '✗',
      jobber: '✗',
      housecallPro: '✗',
      category: 'core',
      highlight: true,
    },

    // Canadian-Specific
    {
      feature: t('compare.bilingualEnFr'),
      growthOS: t('compare.bilingualNative'),
      serviceTitan: '✗',
      jobber: '✗',
      housecallPro: '✗',
      category: 'canadian',
      highlight: true,
    },
    {
      feature: t('compare.canadianTax'),
      growthOS: t('compare.canadianTaxAuto'),
      serviceTitan: t('compare.canadianTaxPartial'),
      jobber: '✓',
      housecallPro: '✓',
      category: 'canadian',
    },
    {
      feature: t('compare.homeStarsIntegration'),
      growthOS: '✓',
      serviceTitan: '✗',
      jobber: '✗',
      housecallPro: '✗',
      category: 'canadian',
    },
    {
      feature: t('compare.canadianDataHosting'),
      growthOS: '✓',
      serviceTitan: '✗',
      jobber: '✗',
      housecallPro: '✗',
      category: 'canadian',
    },
    {
      feature: t('compare.cadPricing'),
      growthOS: '✓',
      serviceTitan: t('compare.usdOnly'),
      jobber: t('compare.usdOnly'),
      housecallPro: t('compare.usdOnly'),
      category: 'canadian',
    },
  ];

  const categories = [
    { id: 'pricing', label: t('compare.pricingSetup') },
    { id: 'core', label: t('compare.coreFeatures') },
    { id: 'canadian', label: t('compare.canadianSpecific') },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  const renderValue = (value: string) => {
    if (value === '✓') {
      return <Check className="w-5 h-5 text-emerald-500" />;
    }
    if (value === '✗') {
      return <X className="w-5 h-5 text-slate-400" />;
    }
    return <span className="text-sm font-medium text-slate-700">{value}</span>;
  };

  return (
    <section className="w-full bg-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
            {t('compare.heading')}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {t('compare.subheading')}
          </p>
        </div>

        {/* Desktop Table View (lg+) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-4 font-bold text-slate-900 bg-white sticky left-0 z-10 min-w-[180px]">
                  {t('compare.feature')}
                </th>
                <th className="text-center px-6 py-4 bg-gradient-to-b from-blue-50 to-blue-100/50 border-b-2 border-blue-200 min-w-[140px]">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="font-black text-slate-900 text-lg">GrowthOS</span>
                    <Crown className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t('compare.winner')}
                  </div>
                </th>
                <th className="text-center px-6 py-4 font-bold text-slate-900 bg-slate-50 border-b border-slate-200">
                  ServiceTitan
                </th>
                <th className="text-center px-6 py-4 font-bold text-slate-900 bg-slate-50 border-b border-slate-200">
                  Jobber
                </th>
                <th className="text-center px-6 py-4 font-bold text-slate-900 bg-slate-50 border-b border-slate-200">
                  Housecall Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const categoryRows = comparisonData.filter((row) => row.category === category.id);
                return categoryRows.map((row, idx) => (
                  <tr
                    key={`${category.id}-${idx}`}
                    className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${
                      row.highlight ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 bg-white sticky left-0 z-10 min-w-[180px]">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center bg-blue-50/50 min-w-[140px]">
                      {renderValue(row.growthOS)}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-700 min-w-[140px]">{renderValue(row.serviceTitan)}</td>
                    <td className="px-6 py-4 text-center text-slate-700 min-w-[120px]">{renderValue(row.jobber)}</td>
                    <td className="px-6 py-4 text-center text-slate-700 min-w-[140px]">{renderValue(row.housecallPro)}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>

        {/* Tablet View (md-lg): Horizontal Scroll */}
        <div className="hidden md:block lg:hidden overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 font-bold text-slate-900 bg-white sticky left-0 z-10 min-w-32">
                  {t('compare.feature')}
                </th>
                <th className="text-center px-4 py-3 bg-gradient-to-b from-blue-50 to-blue-100/50 border-b-2 border-blue-200 min-w-28">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-sm text-slate-900">GrowthOS</span>
                    <Crown className="w-4 h-4 text-blue-600" />
                  </div>
                </th>
                <th className="text-center px-4 py-3 font-bold text-xs text-slate-900 bg-slate-50 border-b border-slate-200 min-w-24">
                  ServiceTitan
                </th>
                <th className="text-center px-4 py-3 font-bold text-xs text-slate-900 bg-slate-50 border-b border-slate-200 min-w-20">
                  Jobber
                </th>
                <th className="text-center px-4 py-3 font-bold text-xs text-slate-900 bg-slate-50 border-b border-slate-200 min-w-24">
                  HCP
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${
                    row.highlight ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900 bg-white sticky left-0 z-10 min-w-32 text-sm">
                    {row.feature}
                  </td>
                  <td className="px-4 py-3 text-center bg-blue-50/50 min-w-28">{renderValue(row.growthOS)}</td>
                  <td className="px-4 py-3 text-center text-slate-700 min-w-24">
                    {renderValue(row.serviceTitan)}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700 min-w-20">{renderValue(row.jobber)}</td>
                  <td className="px-4 py-3 text-center text-slate-700 min-w-24">{renderValue(row.housecallPro)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (sm): Accordion by Category */}
        <div className="md:hidden space-y-4">
          {categories.map((category) => {
            const categoryRows = comparisonData.filter((row) => row.category === category.id);
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <div key={category.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-4 py-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between font-bold text-slate-900"
                >
                  <span>{category.label}</span>
                  <span className="text-slate-600">{isExpanded ? '−' : '+'}</span>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-slate-200">
                    {categoryRows.map((row, idx) => (
                      <div
                        key={`${category.id}-${idx}`}
                        className={`p-4 ${row.highlight ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="font-medium text-slate-900 mb-3 text-sm">{row.feature}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">GrowthOS:</span>
                            <span className="font-bold text-blue-600">{renderValue(row.growthOS)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">ServiceTitan:</span>
                            <span className="text-slate-700">{renderValue(row.serviceTitan)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Jobber:</span>
                            <span className="text-slate-700">{renderValue(row.jobber)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">HCP:</span>
                            <span className="text-slate-700">{renderValue(row.housecallPro)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <div>
              <p className="text-slate-600 mb-2">{t('compare.ctaSubtext')}</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t('compare.ctaHeading')}
              </h3>
            </div>
            <Link
              href="/login?tab=signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#27AE60] hover:bg-[#229954] text-white text-base font-semibold rounded-full transition-all shadow-lg shadow-emerald-600/40 hover:shadow-emerald-700/50 hover:-translate-y-0.5 whitespace-nowrap"
            >
              {t('compare.switchCta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Trust note */}
        <div className="mt-16 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
          <div className="flex gap-3 items-start">
            <Star className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-slate-700 text-sm">
              <span className="font-bold">All data current as of March 2026.</span> {t('compare.comparisonDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
