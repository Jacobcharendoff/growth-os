'use client';

import { MarketingLayout } from '@/components/MarketingLayout';

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm prose prose-lg max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Growth OS Inc. ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our web application ("Service").
            </p>
            <p>
              We are based in Toronto, Ontario, Canada, and comply with the Personal Information Protection and Electronic Documents Act (PIPEDA), Canada's federal private sector privacy law, as well as applicable provincial privacy legislation.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We collect information you provide directly and information collected automatically:
            </p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, company name, and business details when you create an account or contact us</li>
              <li><strong>Service Data:</strong> Job information, customer contacts, scheduling data, invoices, and other business data you input into Growth OS</li>
              <li><strong>Communication Data:</strong> Messages, support tickets, feedback, and other communications you send us</li>
              <li><strong>Technical Data:</strong> IP address, browser type, pages visited, time spent, and similar analytics data</li>
              <li><strong>Payment Data:</strong> Billing address and transaction history (payment processing is handled by third-party providers)</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Growth OS Service</li>
              <li>Process transactions and send related information</li>
              <li>Send transactional and promotional communications</li>
              <li>Respond to your inquiries and customer support requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address fraud and security issues</li>
              <li>Comply with legal obligations and enforce our agreements</li>
            </ul>

            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience with Growth OS. Cookies help us remember your preferences, understand how you use our Service, and improve functionality. You can control cookie preferences through your browser settings.
            </p>
            <p>
              We use both session-based and persistent cookies. Session cookies are temporary, while persistent cookies remain on your device for a specified period.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>
              Growth OS integrates with third-party services for functionality such as:
            </p>
            <ul>
              <li>Payment processing (Stripe)</li>
              <li>Email communications (SendGrid)</li>
              <li>Analytics (Google Analytics)</li>
            </ul>
            <p>
              These third parties have their own privacy policies, and we are not responsible for their practices. We recommend reviewing their privacy policies before providing information.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we retain data as required by law or for legitimate business purposes.
            </p>
            <p>
              You may request deletion of your data at any time by contacting us at hello@growthos.ca. We will comply with your request within 30 days, subject to legal obligations.
            </p>

            <h2>7. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption, secure servers, and access controls to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
            </p>

            <h2>8. Your Privacy Rights (PIPEDA)</h2>
            <p>
              Under PIPEDA and applicable Canadian provincial laws, you have the right to:
            </p>
            <ul>
              <li>Access your personal information held by us</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Withdraw consent to our collection and use of your information</li>
              <li>Lodge a complaint with the Privacy Commissioner of Canada</li>
            </ul>
            <p>
              To exercise these rights, contact us at hello@growthos.ca. We will respond to your request within 30 days.
            </p>

            <h2>9. Data Transfers</h2>
            <p>
              Your information is processed and stored in Canada. If we transfer information internationally, we do so in compliance with applicable privacy laws and only with appropriate safeguards.
            </p>

            <h2>10. Children's Privacy</h2>
            <p>
              Growth OS is intended for business use by adults. We do not knowingly collect information from children under 13. If we become aware that we have collected information from a child under 13, we will delete it promptly.
            </p>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of Growth OS constitutes acceptance of the updated Privacy Policy.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
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
