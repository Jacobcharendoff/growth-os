'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

export default function VsServiceTitanPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('vsServicetitan.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {t('vsServicetitan.subtitle')}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            {t('vsServicetitan.description')}
          </p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('vsServicetitan.headToHead')}
          </h2>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.monthlyPlan')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.monthlyGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.monthlyServiceTitan')}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.setupFee')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.setupGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.setupServiceTitan')}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.contractTerms')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.contractGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.contractServiceTitan')}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.earlyExit')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.exitGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.exitServiceTitan')}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.setupTime')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.timeGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.timeServiceTitan')}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.canadianTaxes')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.taxesGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.taxesServiceTitan')}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.frenchSupport')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.frenchGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.frenchServiceTitan')}
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.homeStars')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.homeStarsGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.homeStarsServiceTitan')}
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    {t('vsServicetitan.support')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    {t('vsServicetitan.supportGrowthOS')}
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    {t('vsServicetitan.supportServiceTitan')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-gray-600">
              <strong>{t('vsServicetitan.pricingExample')}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Who ServiceTitan is Great For */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('vsServicetitan.greatFor')}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {t('vsServicetitan.greatForDesc')}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ {t('vsServicetitan.multiBranch')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ {t('vsServicetitan.fiftyTechs')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ {t('vsServicetitan.enterpriseBudget')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ {t('vsServicetitan.customIntegrations')}</p>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-sm">
            {t('vsServicetitan.notYou')}
          </p>
        </div>
      </section>

      {/* Who GrowthOS is Built For */}
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('vsServicetitan.builtFor')}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {t('vsServicetitan.builtForDesc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">1–15 person teams</p>
              <p className="text-sm text-gray-600">{t('vsServicetitan.noBlat')}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Canadian first</p>
              <p className="text-sm text-gray-600">{t('vsServicetitan.canadianFirst')}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Month-to-month</p>
              <p className="text-sm text-gray-600">{t('vsServicetitan.monthToMonth')}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Fast setup</p>
              <p className="text-sm text-gray-600">{t('vsServicetitan.fastSetup')}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">You own your data</p>
              <p className="text-sm text-gray-600">{t('vsServicetitan.ownData')}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Real support</p>
              <p className="text-sm text-gray-600">{t('vsServicetitan.realSupport')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Breakdown */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('vsServicetitan.pricingBreakdown')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* GrowthOS Pricing */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">GrowthOS</h3>
              <div className="space-y-4">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">STARTER</p>
                  <p className="text-3xl font-bold text-blue-600 mb-2">$79</p>
                  <p className="text-sm text-gray-600">/month</p>
                  <p className="text-xs text-gray-500 mt-3">Perfect for solo ops or 1–2 person shops.</p>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-300 rounded-2xl ring-2 ring-blue-600">
                  <p className="text-sm font-semibold text-gray-600 mb-2">PRO (MOST POPULAR)</p>
                  <p className="text-3xl font-bold text-blue-600 mb-2">$149</p>
                  <p className="text-sm text-gray-600">/month</p>
                  <p className="text-xs text-gray-500 mt-3">5–10 person teams. Most of our customers.</p>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">ENTERPRISE</p>
                  <p className="text-3xl font-bold text-blue-600 mb-2">$299</p>
                  <p className="text-sm text-gray-600">/month</p>
                  <p className="text-xs text-gray-500 mt-3">10–15 techs + custom features.</p>
                </div>
              </div>
            </div>

            {/* ServiceTitan Pricing */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">ServiceTitan</h3>
              <div className="space-y-4">
                <div className="p-6 bg-gray-100 border border-gray-300 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">PER TECHNICIAN</p>
                  <p className="text-3xl font-bold text-gray-700 mb-2">$125–$245</p>
                  <p className="text-sm text-gray-600">/month per tech</p>
                  <p className="text-xs text-gray-500 mt-3">5 techs = $625–$1,225/month minimum.</p>
                </div>

                <div className="p-6 bg-gray-100 border border-gray-300 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">SETUP FEE</p>
                  <p className="text-3xl font-bold text-gray-700 mb-2">$5K–$10K</p>
                  <p className="text-sm text-gray-600">One-time cost</p>
                  <p className="text-xs text-gray-500 mt-3">Plus 6–12 months of implementation.</p>
                </div>

                <div className="p-6 bg-gray-100 border border-gray-300 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">CONTRACT</p>
                  <p className="text-3xl font-bold text-gray-700 mb-2">12–36 mo</p>
                  <p className="text-sm text-gray-600">Mandatory lock-in</p>
                  <p className="text-xs text-gray-500 mt-3">Exit fees: $5K–$20K+.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#2C3E50] rounded-2xl border border-[#2C3E50]">
            <h4 className="text-lg font-bold text-white mb-3">
              Real Example: 5-Person Crew
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <p className="text-sm text-gray-200 mb-2">GrowthOS (Pro)</p>
                <p className="text-2xl font-bold text-[#27AE60]">$1,788/year</p>
                <p className="text-sm text-gray-200 mt-2">$149/month, no setup fee, cancel anytime.</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">ServiceTitan (Mid-tier)</p>
                <p className="text-2xl font-bold text-red-600">$10,200+/year</p>
                <p className="text-sm text-gray-600 mt-2">$850/month + $5K setup + 36-month lock-in.</p>
              </div>
            </div>
            <p className="text-sm text-gray-100 mt-6 font-semibold">
              That's over $8,400 per year you can invest back into your business.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#27AE60] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.stopLosingLeads')}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t('cta.ctaDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trial"
              className="inline-block px-8 py-4 bg-white text-[#27AE60] font-bold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              {t('cta.startFreeTrial')}
            </Link>
            <Link
              href="/demo"
              className="inline-block px-8 py-4 bg-[#229954] text-white font-bold rounded-2xl hover:bg-[#1e8449] transition-colors border border-[#229954]"
            >
              {t('marketing.bookDemo')}
            </Link>
          </div>

          <p className="text-sm text-white/70 mt-8">
            {t('cta.noCardRequired')}
          </p>
        </div>
      </section>

      {/* FAQ-style footer */}
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('vsServicetitan.haveQuestions')}
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">{t('vsServicetitan.importQuestion')}</h3>
              <p className="text-gray-600">
                {t('vsServicetitan.importAnswer')}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">{t('vsServicetitan.techQuestion')}</h3>
              <p className="text-gray-600">
                {t('vsServicetitan.techAnswer')}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">{t('vsServicetitan.guaranteeQuestion')}</h3>
              <p className="text-gray-600">
                {t('vsServicetitan.guaranteeAnswer')}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">{t('vsServicetitan.moreQuestions')}</p>
            <Link
              href="/contact"
              className="inline-block text-blue-600 font-semibold hover:text-blue-700 underline"
            >
              {t('vsServicetitan.getInTouch')}
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
