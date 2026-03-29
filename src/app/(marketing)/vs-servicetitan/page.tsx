'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import Link from 'next/link';

export default function VsServiceTitanPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Growth OS vs ServiceTitan
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Built for Growth, Not for Enterprise Overhead
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Small-to-mid Canadian service shops are making the switch. ServiceTitan's high per-technician fees and complex setup don't fit how you work. Growth OS is built for you.
          </p>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Head-to-Head Comparison
          </h2>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    Monthly Cost (5-person team)
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    $149/month
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    $625–$1,225/month
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    Setup/Implementation Fee
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    Free
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    $5,000–$10,000
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    Contract Terms
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    Month-to-month
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    12–36 months locked
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    Early Exit Penalty
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    None
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    $5,000–$20,000+
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    Setup Time to Go Live
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    10 minutes
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    6–12 months
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    Canadian Taxes (HST/GST/QST)
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    Built-in
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    Not available
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    French + English Support
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    Yes
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    English only
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    HomeStars Integration
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    Built-in
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    Not available
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                    Customer Support
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-blue-600">
                    Email + Priority
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-red-600">
                    Slow response times reported
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-gray-600">
              <strong>Growth OS pricing example:</strong> A 5-person crew with the Pro plan ($149/month) starts at $1,788/year. ServiceTitan's same team costs $7,500–$14,700/year before setup fees. That's $5,700–$12,900 you keep in your pocket.
            </p>
          </div>
        </div>
      </section>

      {/* Who ServiceTitan is Great For */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ServiceTitan: Great for Large Operations
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            ServiceTitan is excellent for big shops. If you have 20+ technicians, a fat budget, and need their enterprise features, it might work. Their system handles complex operations, integrations, and heavy volume.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ Multi-branch operations</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ 50+ technicians</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ Enterprise budgets</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700">✓ Custom integrations</p>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-sm">
            But if that's not you—if you're 1–15 people, you need to move fast, and you want to keep costs down—keep reading.
          </p>
        </div>
      </section>

      {/* Who Growth OS is Built For */}
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Growth OS is Built for You
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            If you're growing a Canadian field service shop—plumbing, HVAC, electrical, landscaping—Growth OS gets it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">1–15 person teams</p>
              <p className="text-sm text-gray-600">No bloat. No features you don't need.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Canadian first</p>
              <p className="text-sm text-gray-600">HST/GST/QST, French, HomeStars built-in.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Month-to-month</p>
              <p className="text-sm text-gray-600">No lock-in. No penalty. Pure flexibility.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Fast setup</p>
              <p className="text-sm text-gray-600">Go live in 10 minutes. Not 10 months.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">You own your data</p>
              <p className="text-sm text-gray-600">Export anytime. We don't hold you hostage.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-300">
              <p className="font-semibold text-gray-900 mb-2">Real support</p>
              <p className="text-sm text-gray-600">Fast, helpful, not a ticket queue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Breakdown */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Pricing Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Growth OS Pricing */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Growth OS</h3>
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

          <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-300">
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              Real Example: 5-Person Crew
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <p className="text-sm text-gray-600 mb-2">Growth OS (Pro)</p>
                <p className="text-2xl font-bold text-blue-600">$1,788/year</p>
                <p className="text-sm text-gray-600 mt-2">$149/month, no setup fee, cancel anytime.</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">ServiceTitan (Mid-tier)</p>
                <p className="text-2xl font-bold text-red-600">$10,200+/year</p>
                <p className="text-sm text-gray-600 mt-2">$850/month + $5K setup + 36-month lock-in.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-6 font-semibold">
              That's over $8,400 per year you can invest back into your business.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-blue-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Switch?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            See how Growth OS compares in action. Start a free trial or book a demo—no credit card, no pressure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trial"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="inline-block px-8 py-4 bg-blue-800 text-white font-bold rounded-2xl hover:bg-blue-900 transition-colors border border-blue-500"
            >
              Book a Demo
            </Link>
          </div>

          <p className="text-sm text-blue-100 mt-8">
            Joining 200+ Canadian service shops on Growth OS.
          </p>
        </div>
      </section>

      {/* FAQ-style footer */}
      <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Have Questions?
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Can I import my data from ServiceTitan?</h3>
              <p className="text-gray-600">
                Yes. We help you migrate customer and job data with zero hassle. Our team handles the heavy lifting.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">What if I only have 1 or 2 techs?</h3>
              <p className="text-gray-600">
                Growth OS Starter is $79/month. Perfect for solopreneurs. Scale up to Pro or Enterprise as you grow.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Do you offer a money-back guarantee?</h3>
              <p className="text-gray-600">
                30-day trial. If it's not for you, no questions asked. But we think you'll stick around.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-block text-blue-600 font-semibold hover:text-blue-700 underline"
            >
              Get in touch with our team
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
