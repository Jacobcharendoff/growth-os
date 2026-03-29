'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Zap, Calendar, TrendingUp, DollarSign, CheckCircle, Users, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HvacPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Book more HVAC jobs without hiring another office person
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Winter and summer are chaos. Your phone is ringing off the hook, estimates are piling up, and your office is drowning in calls. Growth OS handles the busy season automatically.
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors">
            Get started free
            <Zap className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">No credit card required. See the difference in your first week.</p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            The HVAC problems we solve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Seasonal Swings */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Seasonal demand whiplash</h3>
                  <p className="text-gray-600">
                    Summer AC calls are pouring in while your team is booked solid. Winter furnace emergencies mean 3am service calls and overtime costs. Managing peak seasons costs 40% more than off-season.
                  </p>
                </div>
              </div>
            </div>

            {/* Estimate Follow-up */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimates fall through the cracks</h3>
                  <p className="text-gray-600">
                    1 in 4 estimates never gets a response. You forget to follow up, customers move on to competitors, and that's $800-1,500 per lost estimate on average.
                  </p>
                </div>
              </div>
            </div>

            {/* Maintenance Scheduling */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance contracts are invisible</h3>
                  <p className="text-gray-600">
                    You sell maintenance plans but forget to remind customers for their annual check-ups. They call someone else. Recurring revenue disappears.
                  </p>
                </div>
              </div>
            </div>

            {/* Warranty Callbacks */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <DollarSign className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Warranty callbacks eat your margins</h3>
                  <p className="text-gray-600">
                    Warranty callbacks eat your profitable hours. You can't tell which jobs are under warranty or who's calling you back. Track them separately so you know your real margins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            How Growth OS handles peak season
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Automation for calls, estimates, scheduling, and follow-ups. Run the office from your phone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Smart Scheduling */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Smart scheduling</h3>
              </div>
              <p className="text-gray-600 mb-4">
                See your whole team's calendar in one place. Customers can book available time slots online. No more back-and-forth calls.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Real-time availability for customers
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Auto-confirmation text and email
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Automated no-show reminders
                </li>
              </ul>
            </div>

            {/* Automatic Follow-ups */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Automatic estimate follow-ups</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Stop losing estimates to silence. Growth OS follows up with customers automatically. Get answers without lifting a finger.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Follow up after 24 hours
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Customers approve and pay online
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Track estimate-to-booking rate
                </li>
              </ul>
            </div>

            {/* Maintenance Reminders */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Maintenance plan automation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Remind customers when their annual check-up is due. They book it. You don't have to chase them.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Auto-reminder 30 days before renewal
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Track maintenance revenue
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  One-click contract renewal
                </li>
              </ul>
            </div>

            {/* Seasonal Campaigns */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Pre-season outreach campaigns</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Build your fall furnace-check campaign in 5 minutes. Reach every past customer with one click and book maintenance jobs before the rush.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Pre-built seasonal templates
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Send to all past customers in bulk
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Track responses and bookings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 rounded-2xl shadow-sm">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-2xl">★</span>
              ))}
            </div>
            <p className="text-xl text-gray-900 mb-8 leading-relaxed font-medium">
              "Last summer was the first July I didn't feel like I was drowning. The auto-follow-up on estimates is the big one — we used to send a quote and just hope. Now the system nudges them if they don't respond in 48 hours. We probably recovered 8-10 jobs we would have lost. The maintenance reminders are nice but honestly we're still figuring those out."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Julie Lavoie</p>
              <p className="text-gray-600">Lavoie Climatisation, Montreal QC</p>
              <p className="text-sm text-gray-500 mt-1">HVAC contractor, 2 trucks, 8 years in business</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Take the chaos out of peak season
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Free trial starts today. No credit card needed. Setup takes 5 minutes.
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors text-lg">
            Start free trial
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Month-to-month. Cancel anytime. No contracts, no setup fees.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$79</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Solo operators. One dashboard, never miss a lead.</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                Try Free (14 Days)
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-blue-600 p-6 text-left shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$149</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Your whole team. All automations. French + English.</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                Try Free (14 Days)
              </Link>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Scale</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$299</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Multiple crews. Multiple locations. Dedicated support.</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                Try Free (14 Days)
              </Link>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            All plans include a 14-day free trial. No credit card required.{" "}
            <Link href="/#pricing" className="text-blue-600 hover:underline">See full plan comparison</Link>
          </p>
        </div>
      </section>

      {/* Book a Demo */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Want to see it before you try it?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Book a free 15-minute walkthrough. We'll show you how Growth OS works for your specific business — no sales pitch, just a demo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-base font-semibold rounded-full hover:bg-gray-800 transition-all hover:-translate-y-0.5"
            >
              Book a Demo
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-base font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              Or start your free trial
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
