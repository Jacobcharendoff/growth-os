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
    description: 'First reply when a new lead comes in',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Got your request - {{companyName}}',
    body: `Hi {{firstName}},

Thanks for reaching out. We got your request for {{serviceType}} and someone from our team will give you a call shortly to go over everything.

If it's urgent, call us directly at {{companyPhone}}.

Talk soon,
{{companyName}}`,
  },
  {
    id: '2',
    name: 'Estimate Follow-Up',
    category: 'Estimates',
    description: 'Check in after sending an estimate',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Checking in on your estimate',
    body: `Hi {{firstName}},

Just wanted to check in on the estimate we sent for the {{serviceType}} work. Did you get a chance to look it over?

If anything doesn't make sense or you want to talk through the pricing, give me a call at {{companyPhone}}. Happy to walk through it.

{{assignedTo}}
{{companyName}}`,
  },
  {
    id: '3',
    name: 'Estimate Reminder',
    category: 'Estimates',
    description: 'Second follow-up on a pending estimate',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Still interested in the {{serviceType}} work?',
    body: `Hi {{firstName}},

Following up on the estimate from last week for your {{serviceType}} project. No pressure at all, just want to make sure it didn't get buried in your inbox.

We can get you on the schedule pretty quick if you want to move forward. Call or text me at {{companyPhone}} whenever.

{{assignedTo}}
{{companyName}}`,
  },
  {
    id: '4',
    name: 'Job Booked Confirmation',
    category: 'Follow-Up',
    description: 'Confirm a scheduled appointment',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'You\'re booked - {{serviceType}} on {{appointmentDate}}',
    body: `Hi {{firstName}},

Your appointment is confirmed. Here are the details:

Date: {{appointmentDate}}
Time: {{timeWindow}}
Service: {{serviceType}}
Tech: {{assignedTo}}

Just make sure someone's available to let us in. If something comes up and you need to reschedule, call us at {{companyPhone}} as soon as you can so we can get someone else into that slot.

See you then,
{{companyName}}`,
  },
  {
    id: '5',
    name: 'Review Request',
    category: 'Reviews',
    description: 'Ask for a Google review after a completed job',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Quick favour?',
    body: `Hi {{firstName}},

Hope the {{serviceType}} work is holding up well. Quick favour: if you were happy with how things went, would you mind leaving us a Google review? Takes about 30 seconds and it really helps other folks find us.

If anything isn't right, just call me at {{companyPhone}} and we'll sort it out.

Thanks,
{{companyName}}`,
  },
  {
    id: '6',
    name: 'Invoice Sent',
    category: 'Follow-Up',
    description: 'Send invoice after completing work',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Invoice #{{invoiceNumber}} - {{serviceType}}',
    body: `Hi {{firstName}},

Work's done. Here's the invoice:

Invoice: #{{invoiceNumber}}
Amount: {{invoiceAmount}}
Due: {{dueDate}}

We take cheque, credit card, or e-transfer. Let us know if you have any questions about the bill.

Thanks,
{{companyName}}
{{companyPhone}}`,
  },
  {
    id: '7',
    name: 'Payment Reminder',
    category: 'Follow-Up',
    description: 'Friendly nudge on an outstanding invoice',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Reminder: Invoice #{{invoiceNumber}}',
    body: `Hi {{firstName}},

Just a heads up that invoice #{{invoiceNumber}} for {{invoiceAmount}} is coming due on {{dueDate}}. Wanted to make sure it didn't slip through.

If you need to work out a different payment arrangement, give us a call at {{companyPhone}}.

Thanks,
{{companyName}}`,
  },
  {
    id: '8',
    name: 'Seasonal Maintenance',
    category: 'Reactivation',
    description: 'Remind past customers about seasonal service',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: '{{season}} is coming - time for {{serviceType}} maintenance',
    body: `Hi {{firstName}},

{{season}} is around the corner. Good time to get your {{serviceType}} checked before the weather turns and everyone's calling at once.

Catching small issues now saves you from a bigger bill later, and keeps everything running right when you actually need it.

Want to get on the schedule? Call us at {{companyPhone}} or just reply here.

{{companyName}}`,
  },
  {
    id: '9',
    name: 'Referral Request',
    category: 'Reactivation',
    description: 'Ask happy customers to spread the word',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Know anyone who needs {{serviceType}} work?',
    body: `Hi {{firstName}},

Thanks again for letting us handle your {{serviceType}} work. If you know anyone who needs similar help, send them our way. We'll take good care of them.

And as a thank you, you'll get {{referralDiscount}} off your next service when they book with us.

{{companyName}}
{{companyPhone}}`,
  },
  {
    id: '10',
    name: 'Win-Back',
    category: 'Reactivation',
    description: 'Reach out to customers who haven\'t called in a while',
    from: '{{companyName}} <{{companyEmail}}>',
    subject: 'Been a while - {{specialOffer}} off your next service',
    body: `Hi {{firstName}},

It's been a while since we last did work for you. Just wanted to check in and let you know we're still here if you need anything.

If you book in the next couple weeks, we'll take {{specialOffer}} off the job. Doesn't matter if it's {{serviceType}} or something else.

Call or text us at {{companyPhone}} whenever you're ready.

{{companyName}}`,
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
      <div className={`border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-gradient-to-r from-slate-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-[#27AE60]" />
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Email Templates
            </h1>
          </div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Pre-built professional email templates for your Canadian service business
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-[#27AE60] text-white shadow-lg shadow-emerald-600/20'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-4 sm:p-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`rounded-lg border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              } transition-all duration-200 hover:shadow-lg overflow-hidden`}
            >
              {/* Card Header */}
              <div className={`p-4 sm:p-6 ${isDark ? 'border-slate-800' : 'border-slate-200'} border-b`}>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {template.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className={`px-4 sm:px-6 py-3 sm:py-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} flex gap-2`}>
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                    isDark
                      ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className={`rounded-lg w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto ${
              isDark ? 'bg-slate-900' : 'bg-white'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`sticky top-0 ${isDark ? 'bg-slate-800' : 'bg-slate-50'} px-4 sm:px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}
            >
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {previewTemplate.name}
              </h2>
              <button
                onClick={() => setPreviewTemplate(null)}
                className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Email Preview */}
            <div className={`p-3 sm:p-6 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              {/* Mock Email Client */}
              <div className={`rounded-lg border ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'} overflow-hidden shadow-lg`}>
                {/* Email Header */}
                <div className={`${isDark ? 'bg-slate-800' : 'bg-slate-100'} px-4 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                  <div className="mb-3">
                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      From: {previewTemplate.from}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Subject: {previewTemplate.subject}
                    </p>
                  </div>
                </div>

                {/* Email Body */}
                <div className={`p-4 sm:p-6 ${isDark ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-wrap text-sm leading-relaxed`}>
                  {previewTemplate.body}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 ${isDark ? 'bg-slate-800' : 'bg-slate-50'} px-4 sm:px-6 py-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} flex gap-2 sm:gap-3`}>
              <button
                onClick={() => setPreviewTemplate(null)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isDark
                    ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
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
