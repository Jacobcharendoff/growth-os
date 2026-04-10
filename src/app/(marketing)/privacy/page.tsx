'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('privacyPage.title')}</h1>
          <p className="text-gray-600">{t('privacyPage.lastUpdated')}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-5 sm:p-8 md:p-12 shadow-sm prose prose-lg max-w-none">
            <h2>{t('privacyPage.introduction')}</h2>
            <p>
              {t('privacyPage.introText')}
            </p>
            <p>
              {t('privacyPage.basedIn')}
            </p>

            <h2>{t('privacyPage.collection')}</h2>
            <p>
              {t('privacyPage.collectText')}
            </p>
            <ul>
              <li><strong>Account Information:</strong> {t('privacyPage.accountInfo')}</li>
              <li><strong>Service Data:</strong> {t('privacyPage.serviceData')}</li>
              <li><strong>Communication Data:</strong> {t('privacyPage.communicationData')}</li>
              <li><strong>Technical Data:</strong> {t('privacyPage.technicalData')}</li>
              <li><strong>Payment Data:</strong> {t('privacyPage.paymentData')}</li>
            </ul>

            <h2>{t('privacyPage.usage')}</h2>
            <p>{t('privacyPage.usageText')}</p>
            <ul>
              <li>{t('privacyPage.useItem1')}</li>
              <li>{t('privacyPage.useItem2')}</li>
              <li>{t('privacyPage.useItem3')}</li>
              <li>{t('privacyPage.useItem4')}</li>
              <li>{t('privacyPage.useItem5')}</li>
              <li>{t('privacyPage.useItem6')}</li>
              <li>{t('privacyPage.useItem7')}</li>
            </ul>

            <h2>{t('privacyPage.cookies')}</h2>
            <p>
              {t('privacyPage.cookiesText')}
            </p>
            <p>
              {t('privacyPage.cookiesText2')}
            </p>

            <h2>{t('privacyPage.thirdParty')}</h2>
            <p>
              {t('privacyPage.thirdPartyText')}
            </p>
            <ul>
              <li>{t('privacyPage.thirdPartyItem1')}</li>
              <li>{t('privacyPage.thirdPartyItem2')}</li>
              <li>{t('privacyPage.thirdPartyItem3')}</li>
            </ul>
            <p>
              {t('privacyPage.thirdPartyNote')}
            </p>

            <h2>{t('privacyPage.retention')}</h2>
            <p>
              {t('privacyPage.retentionText')}
            </p>
            <p>
              {t('privacyPage.retentionText2')}
            </p>

            <h2>{t('privacyPage.security')}</h2>
            <p>
              {t('privacyPage.securityText')}
            </p>

            <h2>{t('privacyPage.rights')}</h2>
            <p>
              {t('privacyPage.rightsText')}
            </p>
            <ul>
              <li>{t('privacyPage.rightsItem1')}</li>
              <li>{t('privacyPage.rightsItem2')}</li>
              <li>{t('privacyPage.rightsItem3')}</li>
              <li>{t('privacyPage.rightsItem4')}</li>
              <li>{t('privacyPage.rightsItem5')}</li>
            </ul>
            <p>
              {t('privacyPage.rightsContact')}
            </p>

            <h2>{t('privacyPage.transfers')}</h2>
            <p>
              {t('privacyPage.transfersText')}
            </p>

            <h2>{t('privacyPage.children')}</h2>
            <p>
              {t('privacyPage.childrenText')}
            </p>

            <h2>{t('privacyPage.changes')}</h2>
            <p>
              {t('privacyPage.changesText')}
            </p>

            <h2>{t('privacyPage.contact')}</h2>
            <p>
              {t('privacyPage.contactText')}
            </p>
            <ul>
              <li>{t('privacyPage.contactEmail')}</li>
              <li>{t('privacyPage.contactPhone')}</li>
              <li>{t('privacyPage.contactAddress')}</li>
            </ul>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
