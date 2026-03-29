'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('termsPage.title')}</h1>
          <p className="text-gray-600">{t('termsPage.lastUpdated')}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of GrowthOS, a web-based customer relationship management platform provided by GrowthOS Inc. ("Company," "we," "us," or "our"), a company based in Toronto, Ontario, Canada.
            </p>
            <p>
              By accessing or using GrowthOS, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you may not use the Service.
            </p>

            <h2>2. Service Description</h2>
            <p>
              GrowthOS is a cloud-based CRM platform designed to help service businesses manage customer relationships, scheduling, invoicing, and business operations. The Service includes features such as contact management, job scheduling, invoicing, and reporting tools.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service at any time with reasonable notice.
            </p>

            <h2>3. Account Terms</h2>
            <p>
              When you create an account with GrowthOS, you agree to:
            </p>
            <ul>
              <li>Provide accurate, complete, and current information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized access or use</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
            <p>
              You are responsible for maintaining the security of your password and account. We are not liable for any unauthorized access to your account.
            </p>

            <h2>4. Payment Terms</h2>
            <p>
              GrowthOS is provided on a subscription basis. All fees are stated in Canadian Dollars (CAD).
            </p>
            <ul>
              <li><strong>Billing Cycle:</strong> Fees are billed monthly or annually, depending on your selected plan</li>
              <li><strong>Payment Method:</strong> You authorize us to charge your payment method on file</li>
              <li><strong>Invoice:</strong> You will receive an invoice for each billing period</li>
              <li><strong>Late Payment:</strong> Accounts with overdue payments may be suspended</li>
              <li><strong>Refunds:</strong> Except where required by law, subscription fees are non-refundable</li>
            </ul>
            <p>
              Price changes will be communicated 30 days in advance. Continued use after the price change constitutes acceptance.
            </p>

            <h2>5. Cancellation</h2>
            <p>
              You may cancel your GrowthOS subscription at any time. Cancellation will take effect at the end of your current billing period. No refunds will be issued for the portion of the billing period after cancellation.
            </p>
            <p>
              Upon cancellation, you will lose access to the Service and your account data will be retained for 90 days before permanent deletion, unless local law requires a different period.
            </p>

            <h2>6. User Content and Data</h2>
            <p>
              "User Content" refers to any data, files, or information you input into GrowthOS, including customer information, job details, invoices, and communications.
            </p>
            <ul>
              <li><strong>Ownership:</strong> You retain full ownership of your User Content</li>
              <li><strong>License to GrowthOS:</strong> You grant us a worldwide, non-exclusive license to use, store, and process your User Content solely to provide the Service</li>
              <li><strong>Responsibility:</strong> You are responsible for ensuring your User Content does not infringe third-party rights or violate applicable laws</li>
              <li><strong>Data Security:</strong> We implement industry-standard security measures, but cannot guarantee absolute protection</li>
            </ul>

            <h2>7. Intellectual Property Rights</h2>
            <p>
              The GrowthOS Service, including all software, documentation, design, graphics, and other materials, are the exclusive property of GrowthOS Inc. and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, modify, distribute, or reverse-engineer any part of the Service without our express written permission. You are granted a limited, non-exclusive, non-transferable license to use the Service solely for your internal business purposes.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, GROWTH OS INC. WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              Our total liability for any claim arising out of or relating to these Terms or the Service shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of liability, so this limitation may not apply to you.
            </p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              GROWTH OS IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, error-free, or secure.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless GrowthOS Inc., its officers, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising out of:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your User Content or its violation of third-party rights</li>
              <li>Your breach of these Terms or applicable laws</li>
            </ul>

            <h2>11. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles.
            </p>
            <p>
              You agree to submit to the exclusive jurisdiction of the courts located in Toronto, Ontario for any legal proceedings arising from these Terms or the Service.
            </p>

            <h2>12. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, that provision will be severed and the remaining provisions will continue in full force and effect.
            </p>

            <h2>13. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other agreements you have entered into with us, constitute the entire agreement between you and GrowthOS Inc. and supersede all prior and contemporaneous agreements, understandings, and negotiations.
            </p>

            <h2>14. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be communicated to you via email or by posting notice on our website. Your continued use of the Service after changes become effective constitutes your acceptance of the updated Terms.
            </p>

            <h2>15. Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> hello@growthos.ca</li>
              <li><strong>Phone:</strong> 1-800-555-0199</li>
              <li><strong>Address:</strong> Toronto, Ontario, Canada</li>
            </ul>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
