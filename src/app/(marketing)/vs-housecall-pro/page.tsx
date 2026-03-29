"use client";

import Link from "next/link";
import { MarketingLayout } from "@/components/MarketingLayout";

export default function VsHousecallProPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Growth OS vs Housecall Pro
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            One price. Everything included. No add-on surprises.
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Housecall Pro's base price looks cheap—until you add proposals, service plans, and price books. See why Canadian contractors choose Growth OS.
          </p>
        </div>
      </section>

      {/* Quick Cost Comparison */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-slate-900">
            Real-World Monthly Cost (5 Users)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Growth OS */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Growth OS</h3>
              <div className="text-4xl font-bold text-slate-900 mb-2">$149/mo</div>
              <p className="text-slate-600 mb-8">Plus plan. Everything included.</p>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>5 users included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Proposals & estimates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Recurring service plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Smart price book</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Auto HST/GST/QST</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>French templates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>HomeStars reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span>Phone support (24/7)</span>
                </li>
              </ul>
            </div>

            {/* Housecall Pro */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-700 mb-6">Housecall Pro</h3>
              <div className="text-4xl font-bold text-slate-900 mb-2">$229+/mo</div>
              <p className="text-slate-600 mb-8">Essentials + common add-ons</p>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">+$149</span>
                  <span>Essentials plan (5 users)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">+$40</span>
                  <span>Sales Proposal Tool</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">+$40</span>
                  <span>Recurring Service Plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">—</span>
                  <span>Price book (separate subscription)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>Manual tax setup only</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>No French support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>No HomeStars integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✗</span>
                  <span>Chat support only</span>
                </li>
              </ul>

              <p className="text-xs text-slate-500 mt-6 pt-6 border-t">
                * Add GPS ($20/mo per vehicle) and rate book add-ons separately. Actual cost varies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Feature Comparison Table */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-slate-900">
            Feature-by-Feature Breakdown
          </h2>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Growth OS</th>
                  <th className="px-6 py-4 text-center font-semibold">Housecall Pro</th>
                </tr>
              </thead>
              <tbody>
                {/* Pricing */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Monthly Cost (5 users, full features)
                  </td>
                  <td className="px-6 py-4 text-center text-green-700 font-bold">
                    $149/mo
                  </td>
                  <td className="px-6 py-4 text-center text-orange-700 font-bold">
                    $229+/mo
                  </td>
                </tr>

                {/* Proposals */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Proposals & Estimates
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Included</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">$40/mo extra</span>
                  </td>
                </tr>

                {/* Service Plans */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Recurring Service Plans
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Included</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">$40/mo extra</span>
                  </td>
                </tr>

                {/* Price Book */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Smart Price Book
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Included</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">$149/mo extra</span>
                  </td>
                </tr>

                {/* Canadian Tax */}
                <tr className="border-b hover:bg-slate-50 bg-blue-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Canadian Tax (HST/GST/QST)
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Auto-calculated</span>
                    <p className="text-xs text-slate-600">Pre-configured by province</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">Manual setup</span>
                    <p className="text-xs text-slate-600">Custom rates only</p>
                  </td>
                </tr>

                {/* French Support */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    French Templates & UI
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Built-in</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-600">Not available</span>
                  </td>
                </tr>

                {/* HomeStars */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    HomeStars Review Sync
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Included</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-600">Not available</span>
                  </td>
                </tr>

                {/* Phone Support */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Phone Support
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">24/7 Available</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">Chat only</span>
                    <p className="text-xs text-slate-600">(discontinued early 2025)</p>
                  </td>
                </tr>

                {/* Auto Lead Response */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Auto Lead Response
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">60 seconds</span>
                    <p className="text-xs text-slate-600">AI-powered</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">Not built-in</span>
                  </td>
                </tr>

                {/* Billing */}
                <tr className="border-b hover:bg-slate-50 bg-red-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Billing Transparency
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Simple, cancel anytime</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-600">Reports of post-cancel charges</span>
                    <p className="text-xs text-slate-600">3+ months after cancellation</p>
                  </td>
                </tr>

                {/* QuickBooks */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    QuickBooks Integration
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Reliable sync</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">Known issues</span>
                    <p className="text-xs text-slate-600">Estimates incorrectly convert</p>
                  </td>
                </tr>

                {/* Feature Stability */}
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Feature Stability
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Tested before release</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-600">Critical features break</span>
                    <p className="text-xs text-slate-600">Without warning; support often unaware</p>
                  </td>
                </tr>

                {/* Contract */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    Contract
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Month-to-month</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-bold">Month-to-month</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Housecall Pro Does Well */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            What Housecall Pro Does Well
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-slate-900 mb-3">Good Mobile App</h3>
              <p className="text-slate-600 text-sm">
                Field teams get a solid mobile experience for dispatch and job updates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-slate-900 mb-3">Decent Dispatch</h3>
              <p className="text-slate-600 text-sm">
                Route planning and crew assignment work well for small operations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-slate-900 mb-3">Low Entry Price (Solo)</h3>
              <p className="text-slate-600 text-sm">
                At $59/mo for one person, it's cheap to start. Cost escalates fast with scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where Growth OS Pulls Ahead */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Where Growth OS Pulls Ahead
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                All-In-One Pricing
              </h3>
              <p className="text-slate-600">
                No hunting for add-ons. Proposals, service plans, price book, and automation are built in. One plan scales with you.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Built for Canada
              </h3>
              <p className="text-slate-600">
                HST, GST, and QST auto-calculate by province. French templates included. Designed for how Canadian trades actually work.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Growth Automations
              </h3>
              <p className="text-slate-600">
                Auto-respond to leads in 60 seconds. Smart follow-ups. Recurring service reminders. Grow without hiring more office staff.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Real Support
              </h3>
              <p className="text-slate-600">
                Phone support 24/7. When you call, we answer. Not scripts or chatbots. People who know your business.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                HomeStars Integration
              </h3>
              <p className="text-slate-600">
                Sync reviews directly. Turn reviews into social proof. Build your reputation automatically.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Stability You Can Trust
              </h3>
              <p className="text-slate-600">
                Features work as promised. Support knows what they're talking about. No surprise breakdowns mid-month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-slate-900">
            Growth OS Pricing (No Hidden Costs)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-600 mb-6 text-sm">Solo or pair</p>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                $79<span className="text-lg">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>2 users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Core CRM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Estimates & invoices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Auto tax calc</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=starter"
                className="w-full block text-center bg-slate-200 text-slate-900 py-2 rounded font-semibold hover:bg-slate-300 transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Plus (Recommended) */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600 relative">
              <div className="absolute top-0 left-6 bg-blue-600 text-white px-4 py-1 rounded-b text-sm font-semibold">
                Recommended
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-4">Plus</h3>
              <p className="text-slate-600 mb-6 text-sm">Growing teams</p>
              <div className="text-3xl font-bold text-blue-600 mb-6">
                $149<span className="text-lg">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>5 users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Everything in Starter</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Proposals & contracts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Recurring plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>AI lead response</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>HomeStars sync</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=plus"
                className="w-full block text-center bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-600 mb-6 text-sm">Scaling fast</p>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                Custom<span className="text-lg">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Unlimited users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Everything in Plus</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Subcontractor portal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/demo"
                className="w-full block text-center border-2 border-slate-300 text-slate-900 py-2 rounded font-semibold hover:bg-slate-50 transition"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Ready to Stop Overpaying for Add-Ons?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Switch to Growth OS and save $80/month while getting better support and Canadian-native features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded font-bold hover:bg-blue-50 transition"
            >
              Free 14-Day Trial
            </Link>
            <Link
              href="/demo"
              className="border-2 border-white text-white px-8 py-3 rounded font-bold hover:bg-blue-600 transition"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ-Style Closing */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-10">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Can I import my data from Housecall Pro?
              </h3>
              <p className="text-slate-600">
                Yes. We help you migrate customers, jobs, and settings. Our onboarding team walks you through it.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Is there a setup fee?
              </h3>
              <p className="text-slate-600">
                No. Start free on day one. We charge monthly only—nothing more.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                What if I only need one user?
              </h3>
              <p className="text-slate-600">
                Try the Starter plan at $79/mo for 2 users. All the core features, none of the bloat. Cancel anytime.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">
                Do you integrate with QuickBooks?
              </h3>
              <p className="text-slate-600">
                Yes. Real-time sync without the bugs Housecall Pro users report. Your estimates come through as estimates, not invoices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
