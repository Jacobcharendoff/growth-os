'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import { ArrowRight, Zap, Target, Users, MapPin } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('aboutPage.heroTitle')} <span className="text-blue-600">{t('aboutPage.heroTitleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            {t('aboutPage.heroDesc')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('aboutPage.ourStory')}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6 leading-relaxed">
              {t('aboutPage.storyPart1')}
            </p>
            <p className="mb-6 leading-relaxed">
              {t('aboutPage.storyPart2')}
            </p>
            <p className="leading-relaxed">
              {t('aboutPage.storyPart3')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t('aboutPage.mission')}</h2>
            <p className="text-xl text-blue-700 font-semibold">
              {t('aboutPage.missionStatement')}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">{t('aboutPage.ourValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value 1: Built for Canada */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('aboutPage.builtForCanadaTitle')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.builtForCanadaDesc')}
              </p>
            </div>

            {/* Value 2: Simplicity First */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('aboutPage.simplicityTitle')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.simplicityDesc')}
              </p>
            </div>

            {/* Value 3: Revenue-Focused */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('aboutPage.revenueFocusTitle')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.revenueFocusDesc')}
              </p>
            </div>

            {/* Value 4: Operator-Led */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('aboutPage.operatorLedTitle')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.operatorLedDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('aboutPage.ourTeam')}</h2>
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-6">
              {t('aboutPage.teamDesc1')}
            </p>
            <p className="text-gray-600">
              {t('aboutPage.teamDesc2')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('aboutPage.readyToGrow')}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('aboutPage.growDesc')}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('aboutPage.getInTouch')}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </MarketingLayout>
  );
}
