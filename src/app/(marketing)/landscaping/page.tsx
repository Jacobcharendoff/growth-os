'use client';

import { MarketingLayout, CTASection, Footer } from '@/components/MarketingLayout';
import { ArrowRight, Leaf, Calendar, Clock, RefreshCw, Star, CheckCircle2, Zap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function LandscapingPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Built for Landscaping
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Grow your landscaping business without the back-office headaches
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Stop juggling spreadsheets, lost estimates, and crew chaos. Growth OS handles the paperwork so you focus on what you do best: building beautiful outdoor spaces.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/setup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-base font-semibold rounded-full hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/25 hover:shadow-green-700/30 hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 text-base font-semibold rounded-full border-2 border-green-200 hover:bg-green-50 transition-all"
                >
                  See It in Action
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">No credit card needed. Full access for 14 days.</p>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl blur-3xl opacity-60" />
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
                  <div className="space-y-4 text-green-900">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Schedule crews in seconds</div>
                        <div className="text-sm text-green-700">No more phone tag</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Track seasonal cash flow</div>
                        <div className="text-sm text-green-700">Know exactly where you stand</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Turn estimates into jobs</div>
                        <div className="text-sm text-green-700">Auto follow-up that actually works</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Repeat customers on autopilot</div>
                        <div className="text-sm text-green-700">Seasonal reminders, zero work</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Does this sound familiar?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We built Growth OS specifically to solve the problems landscape contractors face.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pain Point 1: Seasonal Cash Flow */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Seasonal cash flow chaos
              </h3>
              <p className="text-gray-600 mb-4">
                Winter dries up. Spring explodes. You never know if you can make payroll next month.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Unpredictable income makes hiring impossible</li>
                <li>Can't plan equipment upgrades</li>
                <li>Emergency loans become routine</li>
              </ul>
            </div>

            {/* Pain Point 2: Crew Scheduling */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Crew scheduling is a nightmare
              </h3>
              <p className="text-gray-600 mb-4">
                Texting crew members. Emails going to spam. Someone showing up to the wrong job.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>No one knows what site they're going to</li>
                <li>You spend 2 hours a day coordinating</li>
                <li>Equipment ends up at the wrong location</li>
              </ul>
            </div>

            {/* Pain Point 3: Estimate Follow-Up */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Dead estimates pile up
              </h3>
              <p className="text-gray-600 mb-4">
                You send a quote. Weeks pass. You forget to follow up. The lead hires someone else.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>30% of estimates never get a second look</li>
                <li>You forget which leads need follow-up</li>
                <li>Lost revenue from ignored prospects</li>
              </ul>
            </div>

            {/* Pain Point 4: Repeat Customers */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No system for repeat business
              </h3>
              <p className="text-gray-600 mb-4">
                Existing customers are your best source of revenue, but you have no way to remind them.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Customers hire competitors because they forgot about you</li>
                <li>You lose 40% of recurring revenue you should get</li>
                <li>Spring cleanup season needs better planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Growth OS solves it
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built features that speak the language of landscaping.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Smart Crew Dispatch
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Assign jobs to crews with one click. They get instant notifications. No more confusion about which site they're on.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Mobile app updates crews in real-time</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Track who worked on which site</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Auto Follow-Up on Estimates
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Your estimates automatically get flagged if they're sitting idle for 3 days. One-click follow-up, or let us handle it.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Turn 15% more estimates into jobs</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Template messages save time</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <RefreshCw className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Repeat Customers on Autopilot
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Schedule reminders for seasonal jobs. Spring cleanup reminders go to past customers automatically.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Recover 25% more repeat business</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Runs without you lifting a finger</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Cash Flow Clarity
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                See next month's revenue in real time. Know exactly what's locked in, what's pending, what's at risk.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Unlimited team members. Foreman sees jobs. Office staff manages estimates. Everyone stays aligned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              "Growth OS cut my back-office work in half. My crew gets their jobs in the app, I know exactly where cash flow stands, and we're booking 20% more repeat work just from the seasonal reminders. Best $200 a month we spend."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                PR
              </div>
              <div>
                <p className="font-bold text-gray-900">Priya Patel</p>
                <p className="text-gray-600 text-sm">Owner, Patel Landscapes</p>
                <p className="text-gray-500 text-xs">Calgary, AB</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
