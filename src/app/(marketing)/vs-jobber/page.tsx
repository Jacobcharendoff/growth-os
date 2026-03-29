'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

export default function VsJobberPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <div className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('vsJobber.title')}
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            {t('vsJobber.subtitle')}
          </p>
          <p className="text-lg text-slate-700 max-w-3xl">
            {t('vsJobber.description')}
          </p>
        </div>
      </div>

      {/* Pricing Highlight */}
      <div className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase">{t('vsJobber.pricingHighlight')}</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">$149/month</p>
              <p className="text-slate-700 mt-2">{t('vsJobber.forFiveUsers')}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase">{t('vsJobber.jobberLabel')}</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">$315/month</p>
              <p className="text-slate-700 mt-2">{t('vsJobber.jobberUsers')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">{t('comparison.compare')}</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">{t('vsJobber.feature')}</th>
                  <th className="px-4 py-3 text-left font-semibold text-emerald-700">GrowthOS</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Jobber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Pricing */}
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">{t('vsJobber.canadianTaxSetup')}</td>
                  <td className="px-4 py-4 text-emerald-700 font-semibold">$149/month</td>
                  <td className="px-4 py-4 text-slate-700">$315/month</td>
                </tr>

                {/* Canadian Tax */}
                <tr className="bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">Canadian Tax Setup</td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                      Built-in
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs">
                      Manual setup
                    </span>
                  </td>
                </tr>

                {/* French Support */}
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">French Templates & UI</td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                      Built-in
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">
                      Not available
                    </span>
                  </td>
                </tr>

                {/* HomeStars Integration */}
                <tr className="bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">HomeStars Integration</td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                      Built-in
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">
                      Not available
                    </span>
                  </td>
                </tr>

                {/* Estimate Delivery */}
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">Estimate Delivery</td>
                  <td className="px-4 py-4 text-slate-700">Direct from your email</td>
                  <td className="px-4 py-4 text-slate-700">jobbermail.com domain <span className="block text-xs text-slate-500 mt-1">(60%+ unseen)</span></td>
                </tr>

                {/* Calendar Sync */}
                <tr className="bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">Calendar Sync Speed</td>
                  <td className="px-4 py-4 text-emerald-700 font-semibold">Real-time</td>
                  <td className="px-4 py-4 text-slate-700">Every 24 hours</td>
                </tr>

                {/* Double Booking */}
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">Double-Booking Prevention</td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-xs">
                      Yes
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs">
                      No
                    </span>
                  </td>
                </tr>

                {/* Auto Lead Response */}
                <tr className="bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">Auto Lead Response</td>
                  <td className="px-4 py-4 text-emerald-700 font-semibold">60 seconds</td>
                  <td className="px-4 py-4 text-slate-600">Not available</td>
                </tr>

                {/* QuickBooks Sync */}
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">QuickBooks Integration</td>
                  <td className="px-4 py-4 text-emerald-700 font-semibold">Clean sync</td>
                  <td className="px-4 py-4 text-slate-700">~2% line items drop <span className="block text-xs text-slate-500 mt-1">(common complaint)</span></td>
                </tr>

                {/* Growth Automations */}
                <tr className="bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">Built-in Growth Automations</td>
                  <td className="px-4 py-4 text-emerald-700 font-semibold">8+ automations</td>
                  <td className="px-4 py-4 text-slate-600">Limited</td>
                </tr>

                {/* Payment Processing */}
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">Payment Processing Fees</td>
                  <td className="px-4 py-4 text-slate-700">Via Stripe partner</td>
                  <td className="px-4 py-4 text-slate-700">2.9% + $0.30 per transaction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Who is Jobber Good For */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('vsJobber.jobberGood')}</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            {t('vsJobber.jobberDesc')}
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.soloTeams')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.basicScheduling')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.notCanada')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.manualWorkflows')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Who GrowthOS is Built For */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('vsJobber.builtForGrowth')}</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            {t('vsJobber.builtForGrowthDesc')}
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.canadianNeed')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.readyGrow')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.bilingual')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.automateLeads')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>{t('vsJobber.scaleEstimates')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* GrowthOS Pricing Tiers */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{t('vsJobber.pricingTiers')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Starter */}
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('vsJobber.starter')}</h3>
              <p className="text-slate-600 mb-6">{t('vsJobber.startPerfect')}</p>
              <p className="text-3xl font-bold text-slate-900 mb-6">
                $49<span className="text-lg font-normal text-slate-600">/mo</span>
              </p>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Up to 3 users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Scheduling & quoting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Canadian tax setup</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Lead capture</span>
                </li>
              </ul>
            </div>

            {/* Standard (Highlighted) */}
            <div className="bg-white rounded-lg border-2 border-emerald-500 p-8 shadow-lg relative">
              <div className="absolute -top-4 left-4 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                {t('vsJobber.mostPopular')}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('vsJobber.standard')}</h3>
              <p className="text-slate-600 mb-6">{t('vsJobber.builtGrow')}</p>
              <p className="text-3xl font-bold text-slate-900 mb-6">
                $149<span className="text-lg font-normal text-slate-600">/mo</span>
              </p>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Up to 5 users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>All Starter features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Auto lead response</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Growth automations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>French templates</span>
                </li>
              </ul>
            </div>

            {/* Professional */}
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('vsJobber.professional')}</h3>
              <p className="text-slate-600 mb-6">{t('vsJobber.advancedGrow')}</p>
              <p className="text-3xl font-bold text-slate-900 mb-6">
                $299<span className="text-lg font-normal text-slate-600">/mo</span>
              </p>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Unlimited users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>All Standard features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Team coaching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('vsJobber.commonQuestions')}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('vsJobber.switchQuestion')}</h3>
              <p className="text-slate-700">
                {t('vsJobber.switchAnswer')}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('vsJobber.discountQuestion')}</h3>
              <p className="text-slate-700">
                {t('vsJobber.discountAnswer')}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('vsJobber.canadianQuestion')}</h3>
              <p className="text-slate-700">
                {t('vsJobber.canadianAnswer')}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('vsJobber.usersQuestion')}</h3>
              <p className="text-slate-700">
                {t('vsJobber.usersAnswer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
