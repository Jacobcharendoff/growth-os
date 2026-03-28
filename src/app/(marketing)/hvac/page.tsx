'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Zap, Calendar, TrendingUp, DollarSign, CheckCircle, Users, BarChart3, Clock } from 'lucide-react';

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
                    You send 100 estimates a season, 35% never hear back. You forget to follow up, customers move on to competitors, and that's $2,000+ per lost estimate.
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

            {/* Tax Complexity */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <DollarSign className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax season is a nightmare</h3>
                  <p className="text-gray-600">
                    Your invoices, payments, and expenses are scattered across different systems. Your accountant can't find what they need. Tax prep takes weeks and costs you $2,000+ in CPA fees.
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

            {/* Clean Records */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Clean finances for tax time</h3>
              </div>
              <p className="text-gray-600 mb-4">
                All invoices, payments, and expenses organized. Your accountant gets everything they need with one click.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Categorize expenses automatically
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Export clean tax reports
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Ready for your accountant
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
              "Summer used to stress me out. We'd get slammed, miss calls, and half our estimates would just disappear. This year was different. Growth OS handled the scheduling, the follow-ups happened automatically, and I actually got time to run the business instead of being glued to the phone. We booked 12 more jobs in July alone."
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
    </MarketingLayout>
  );
}
