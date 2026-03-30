'use client';

import { useState } from 'react';
import { Mail, Eye, Copy, Check, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface EmailTemplate {
  id: string;
  name: string;
  category: 'All' | 'Follow-Up' | 'Estimates' | 'Reviews' | 'Reactivation';
  description: string;
  from: string;
  subject: string;
  body: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'New Lead Welcome',
    category: 'Follow-Up',
    description: 'Welcome email for newly captured leads',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Welcome to {{companyName}} - We\'re Excited to Help',
    body: `Hi {{firstName}},

Thank you for reaching out to {{companyName}}! We're thrilled to have the opportunity to help with your {{serviceType}} needs. Your inquiry is important to us, and we're committed to providing you with top-quality service and honest, transparent communication.

One of our team members will review your request shortly and reach out within 24 business hours with more information and to discuss the best solution for your home or business. In the meantime, if you have any urgent questions, please don't hesitate to call us at {{companyPhone}}.

We look forward to working with you!

Best regards,
{{companyName}} Team`,
  },
  {
    id: '2',
    name: 'Estimate Follow-Up',
    category: 'Estimates',
    description: 'Send estimate reminder and answer questions',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Your {{companyName}} Estimate - Let\'s Answer Your Questions',
    body: `Hi {{firstName}},

I hope you had a chance to review the estimate we sent over for your {{serviceType}} project. We took great care to provide accurate pricing and timeline so you know exactly what to expect.

I wanted to follow up and let you know we're here to answer any questions you might have about the estimate, the scope of work, or anything else. Many clients appreciate the opportunity to discuss details before moving forward, so please don't hesitate to reach out.

Feel free to call me directly at {{companyPhone}} or reply to this email. I'm here to help!

Looking forward to working with you,
{{assignedTo}}
{{companyName}}`,
  },
  {
    id: '3',
    name: 'Estimate Reminder',
    category: 'Estimates',
    description: 'Gentle reminder about pending estimate',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Quick Reminder: Your {{companyName}} Estimate',
    body: `Hi {{firstName}},

I wanted to reach out with a quick reminder about the estimate we sent you last week for your {{serviceType}} project. I know decisions like these can take time, and we wanted to make sure you had everything you need.

Our team is ready to get started whenever you're ready. We pride ourselves on reliability, quality workmanship, and competitive pricing. If you'd like to move forward or have any lingering questions, I'm just an email or phone call away.

Looking forward to serving you!

Best regards,
{{assignedTo}}
{{companyName}}
{{companyPhone}}`,
  },
  {
    id: '4',
    name: 'Job Booked Confirmation',
    category: 'Follow-Up',
    description: 'Confirm job is scheduled and set expectations',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Your {{serviceType}} Appointment is Confirmed - {{appointmentDate}}',
    body: `Hi {{firstName}},

Great news! Your appointment with {{companyName}} has been confirmed. We're excited to get started on your {{serviceType}} project.

Here are the details:
Scheduled Date: {{appointmentDate}}
Estimated Time Window: {{timeWindow}}
Service: {{serviceType}}
Assigned Team: {{assignedTo}}

Please make sure someone is home or available to let our team inside. We'll arrive on time and in a professional manner, ready to complete the work efficiently. If you need to reschedule for any reason, just give us a call at {{companyPhone}} as soon as possible.

We're looking forward to exceeding your expectations!

Best regards,
{{companyName}} Team`,
  },
  {
    id: '5',
    name: 'Review Request',
    category: 'Reviews',
    description: 'Request customer feedback after job completion',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'How Did We Do? We\'d Love Your Feedback',
    body: `Hi {{firstName}},

Thank you for choosing {{companyName}} for your {{serviceType}} project! We truly appreciate your business and wanted to reach out to see how everything went.

Your feedback is incredibly important to us and helps us continue delivering excellent service to all our customers. If you have a few moments, we'd love to hear about your experience. You can leave a review on Google, Facebook, or your preferred platform.

We're committed to building lasting relationships with our customers, and your honest feedback helps us improve every single day. If there's anything we can do better or if you have any concerns, please reach out directly so we can make it right.

Thank you again for trusting us with your home!

Warm regards,
{{companyName}} Team`,
  },
  {
    id: '6',
    name: 'Invoice Sent',
    category: 'Follow-Up',
    description: 'Invoice notification after work completion',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Invoice for Your {{serviceType}} Service - #{{invoiceNumber}}',
    body: `Hi {{firstName}},

Your {{serviceType}} service has been completed! We've attached an invoice for your records. Here's what you need to know:

Invoice Number: {{invoiceNumber}}
Total Amount: {{invoiceAmount}}
Due Date: {{dueDate}}

We accept payment via check, credit card, or direct transfer. Please let us know if you have any questions about the invoice or the work completed. We stand behind all our work with our satisfaction guarantee.

Thank you for choosing {{companyName}}. We'd love to work with you again in the future!

Best regards,
{{companyName}} Team
{{companyPhone}}`,
  },
  {
    id: '7',
    name: 'Payment Reminder',
    category: 'Follow-Up',
    description: 'Friendly payment reminder',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Payment Reminder - Invoice #{{invoiceNumber}}',
    body: `Hi {{firstName}},

This is a friendly reminder that payment for invoice #{{invoiceNumber}} is due on {{dueDate}}. We know life gets busy, so we wanted to make sure this didn't slip through the cracks!

Outstanding Balance: {{invoiceAmount}}

You can pay quickly and securely online, or feel free to call us at {{companyPhone}} if you need to arrange alternative payment terms. We appreciate your prompt attention to this.

Thank you for your business!

Best regards,
{{companyName}} Team`,
  },
  {
    id: '8',
    name: 'Seasonal Maintenance',
    category: 'Reactivation',
    description: 'Promote seasonal maintenance services',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Don\'t Miss Your {{season}} {{serviceType}} Maintenance',
    body: `Hi {{firstName}},

As we head into {{season}}, we wanted to reach out and remind you about the importance of seasonal {{serviceType}} maintenance. Many homeowners overlook this until an emergency happens – and we'd love to help you avoid that!

Regular maintenance helps:
- Prevent costly emergency repairs
- Extend the life of your systems
- Improve energy efficiency
- Keep your warranty valid

We offer comprehensive maintenance packages tailored to your specific needs. Our team will perform a thorough inspection, identify any potential issues, and ensure everything is running smoothly for the season ahead.

Ready to schedule your maintenance? Give us a call at {{companyPhone}} or reply to this email. We'd be happy to discuss a maintenance plan that works for you.

Best regards,
{{companyName}} Team`,
  },
  {
    id: '9',
    name: 'Referral Request',
    category: 'Reactivation',
    description: 'Ask satisfied customers for referrals',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Know Someone Who Needs {{serviceType}}? We\'ll Take Good Care of Them',
    body: `Hi {{firstName}},

We've truly enjoyed working with you and are grateful for the opportunity to serve you. It's customers like you that make {{companyName}} what it is today – a trusted name in the {{industry}} industry.

If you know anyone who could benefit from our services, we'd be honored if you'd refer them to us. Whether it's a friend, family member, or colleague, we promise to provide them with the same quality service and professional integrity you've experienced.

As a token of our appreciation, we'd like to offer you a {{referralDiscount}} discount on your next service when your referral becomes a paying customer. Everyone wins!

Thank you for thinking of us, and for being an awesome customer.

Best regards,
{{companyName}} Team
{{companyPhone}}`,
  },
  {
    id: '10',
    name: 'Win-Back',
    category: 'Reactivation',
    description: 'Re-engage past customers',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'We Miss You, {{firstName}} – Special Offer Inside',
    body: `Hi {{firstName}},

It's been a while since we last worked together, and we wanted to reach out. We've made some great improvements to our services and would love the opportunity to help you again.

To show our appreciation for your past business, we're offering {{specialOffer}} off your next service when you book within the next 14 days. This is our way of saying thank you and inviting you back to the {{companyName}} family.

Whether you need {{serviceType}} maintenance, a repair, or something else entirely, we're here and ready to deliver the same quality service you remember. Give us a call at {{companyPhone}} or reply to this email to schedule your appointment.

We look forward to reconnecting with you soon!

Best regards,
{{companyName}} Team`,
  },
];

export default function TemplatesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const filters = ['All', 'Follow-Up', 'Estimates', 'Reviews', 'Reactivation'];
  const filteredTemplates =
    activeFilter === 'All'
      ? emailTemplates
      : emailTemplates.filter((t) => t.category === activeFilter);

  const categoryBadgeColor = {
    'Follow-Up': isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700',
    Estimates: isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700',
    Reviews: isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700',
    Reactivation: isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700',
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'} transition-colors duration-200`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-[#27AE60]" />
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Email Templates
            </h1>
          </div>
          <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
            Pre-built professional email templates for your Canadian service business
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-[#27AE60] text-white shadow-lg shadow-emerald-600/20'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`rounded-lg border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              } transition-all duration-200 hover:shadow-lg overflow-hidden`}
            >
              {/* Card Header */}
              <div className={`p-6 ${isDark ? 'border-slate-800' : 'border-gray-200'} border-b`}>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {template.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      categoryBadgeColor[template.category as keyof typeof categoryBadgeColor]
                    }`}
                  >
                    {template.category}
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {template.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className={`px-6 py-4 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'} flex gap-2`}>
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-white bg-[#27AE60] hover:bg-emerald-700 transition-all duration-200"
                >
                  <Copy className="w-4 h-4" />
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-slate-900' : 'bg-white'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`sticky top-0 ${isDark ? 'bg-slate-800' : 'bg-gray-50'} px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'} flex items-center justify-between`}
            >
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {previewTemplate.name}
              </h2>
              <button
                onClick={() => setPreviewTemplate(null)}
                className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Email Preview */}
            <div className={`p-6 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              {/* Mock Email Client */}
              <div className={`rounded-lg border ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-300 bg-white'} overflow-hidden shadow-lg`}>
                {/* Email Header */}
                <div className={`${isDark ? 'bg-slate-800' : 'bg-gray-100'} px-4 py-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
                  <div className="mb-3">
                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      From: {previewTemplate.from}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      Subject: {previewTemplate.subject}
                    </p>
                  </div>
                </div>

                {/* Email Body */}
                <div className={`p-6 ${isDark ? 'text-slate-300' : 'text-gray-700'} whitespace-pre-wrap text-sm leading-relaxed`}>
                  {previewTemplate.body}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 ${isDark ? 'bg-slate-800' : 'bg-gray-50'} px-6 py-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} flex gap-3`}>
              <button
                onClick={() => setPreviewTemplate(null)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isDark
                    ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Close
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg font-medium text-white bg-[#27AE60] hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" />
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
