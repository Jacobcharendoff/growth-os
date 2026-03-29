'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import Link from 'next/link';

export default function VsJobberPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <div className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Growth OS vs Jobber
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            More Than Scheduling. Built to Grow.
          </p>
          <p className="text-lg text-slate-700 max-w-3xl">
            Jobber excels at the basics — scheduling, quoting, and keeping your calendar straight.
            But Growth OS is built for teams ready to grow their revenue, not just manage their schedule.
            Canadian contractors. Bilingual teams. Hands-on growth.
          </p>
        </div>
      </div>

      {/* Pricing Highlight */}
      <div className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase">Growth OS</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">$149/month</p>
              <p className="text-slate-700 mt-2">For 5 users on Standard plan</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase">Jobber</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">$315/month</p>
              <p className="text-slate-700 mt-2">Grow plan + 4 extra users @ $29 each</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Head-to-Head Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-emerald-700">Growth OS</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Jobber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Pricing */}
                <tr>
                  <td className="px-4 py-4 font-medium text-slate-900">Monthly Cost (5 users)</td>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Jobber is Great For</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Jobber is solid if you need a simple scheduling tool. It works well for small teams — 1 to 3 people —
            who just need basic quoting and calendar management. If you're not worried about estimates landing in inboxes (or 60% going unseen),
            and you're okay with manual QuickBooks matching, Jobber gets the job done.
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Solo contractors or very small teams</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Teams comfortable with basic scheduling only</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Businesses not in Canada or needing bilingual support</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Manual invoice and payment workflows</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Who Growth OS is Built For */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Growth OS is Built For</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Growth OS is for shops ready to grow — not just manage the schedule. Canadian contractors. Bilingual teams.
            Businesses that want estimates to actually be read, leads to get instant responses, and automations to handle
            the repetitive stuff so you can focus on winning and serving.
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Service businesses in Canada needing tax compliance built-in</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Teams ready to grow beyond basic scheduling</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Bilingual teams serving French and English markets</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Businesses serious about automating lead follow-up</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>Teams ready to scale estimate delivery and customer trust</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Growth OS Pricing Tiers */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Growth OS Pricing Plans</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Starter */}
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-600 mb-6">Perfect to start</p>
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
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Standard</h3>
              <p className="text-slate-600 mb-6">Built to grow</p>
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
              <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
              <p className="text-slate-600 mb-6">Advanced growth</p>
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

      {/* Final CTA */}
      <div className="py-16 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">See Growth OS in Action</h2>
          <p className="text-lg text-slate-700 mb-8">
            Ready to grow beyond scheduling? Try Growth OS free for 14 days.
            No credit card. No long-term contract.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="inline-block px-8 py-3 bg-white text-emerald-600 font-semibold border-2 border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Common Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I switch from Jobber to Growth OS?</h3>
              <p className="text-slate-700">
                Yes. We can help you move your customers, jobs, and estimates over.
                Your data belongs to you — we make the transition smooth.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you offer discounts for annual plans?</h3>
              <p className="text-slate-700">
                We keep pricing simple and fair. Pay monthly and cancel anytime. No long contracts. No surprise fees.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Is Growth OS right for my Canadian business?</h3>
              <p className="text-slate-700">
                If you're in Canada and need bilingual support, tax compliance, or HomeStars integration, yes.
                Growth OS is built for the Canadian market.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What if I need more users?</h3>
              <p className="text-slate-700">
                Professional plan includes unlimited users. Starter and Standard plans come with user limits,
                and you can add extra users anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
