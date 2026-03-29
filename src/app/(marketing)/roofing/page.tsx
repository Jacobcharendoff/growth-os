'use client';

import { MarketingLayout, CTASection, Footer } from '@/components/MarketingLayout';
import { ArrowRight, Home, Clock, AlertCircle, Users, Star, CheckCircle2, Zap, TrendingUp, Hammer } from 'lucide-react';
import Link from 'next/link';

export default function RoofingPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Home className="w-4 h-4" />
                Built for Roofing
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Roofing contractors: from estimate to invoice in half the time
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Big ticket jobs need tight follow-up. Weather delays happen. Subcontractors need coordination. Growth OS handles the business side so you close bigger deals faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/setup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 text-base font-semibold rounded-full border-2 border-blue-200 hover:bg-blue-50 transition-all"
                >
                  See It in Action
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">No credit card needed. Full access for 14 days.</p>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl blur-3xl opacity-60" />
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200">
                  <div className="space-y-4 text-blue-900">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Follow up on big estimates</div>
                        <div className="text-sm text-blue-700">Never lose a $15K job to lost follow-up</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Track insurance claims end-to-end</div>
                        <div className="text-sm text-blue-700">Assessment to approval to payment</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Coordinate subcontractors</div>
                        <div className="text-sm text-blue-700">Everyone knows what's happening</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Close deals faster</div>
                        <div className="text-sm text-blue-700">Invoice instantly when work's done</div>
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
              Roofing business gets complicated
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Long sales cycles. Weather delays. Big ticket deals. We built Growth OS to handle it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pain Point 1: Long Sales Cycles */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Long, messy sales cycles
              </h3>
              <p className="text-gray-600 mb-4">
                Estimate sits for a month. Client goes quiet. You're not sure where they are in the decision.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Can't track which stage each deal is in</li>
                <li>Big estimates get lost in email chains</li>
                <li>No reminders to follow up on stalled deals</li>
              </ul>
            </div>

            {/* Pain Point 2: Weather Delays */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Weather delays frustrate everyone
              </h3>
              <p className="text-gray-600 mb-4">
                Rain. You reschedule. Client doesn't see the new date. They hire someone else.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Manual reschedule process is painful</li>
                <li>Customers don't know what's happening</li>
                <li>You're making multiple phone calls per delay</li>
              </ul>
            </div>

            {/* Pain Point 3: Estimate Follow-Up */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Hammer className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Big-ticket estimates go dark
              </h3>
              <p className="text-gray-600 mb-4">
                A $20K roofing estimate. You sent it two weeks ago. Did they even open it?
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>You lose 25% of high-value deals to no follow-up</li>
                <li>Can't see which prospects are serious</li>
                <li>Manual tracking wastes hours</li>
              </ul>
            </div>

            {/* Pain Point 4: Insurance & Material Tracking */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Insurance flow chaos and material delays
              </h3>
              <p className="text-gray-600 mb-4">
                Adjuster request. Supplement negotiations. Materials on backorder. No way to track it all or keep subs in sync.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Insurance jobs disappear into spreadsheets</li>
                <li>Material delays aren't visible until crew shows up</li>
                <li>Subs don't know why work keeps getting pushed</li>
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
              How Growth OS helps you win more
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for the complexity of roofing deals and timelines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Insurance Claims Pipeline
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Damage assessment → estimate → adjuster review → supplement → approval → invoice. Track every step. Stop using spreadsheets.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Close 10-15% more big deals</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Never lose a quote to disorganization</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Weather Delays & Material Backorders
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Rain pushed the job back 3 days? Shingles on 4-week backorder? Log it in two taps. Customer gets notified. Everyone knows the status.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Reduce no-shows by 30-40%</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Never forget a material follow-up</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Subcontractor Payment Management
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Your subs want to get paid on completion, not net-30. Track sub invoices separately from customer invoices. Everyone gets paid on time.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Subs stay happy and show up</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Better coordination on complex jobs</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Quick Invoicing
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Work's done. Generate invoice and send instantly. Get paid a week faster on average.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Reduce Admin Time
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Spend less time coordinating, more time building relationships. Automate the paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              "Honestly, I resisted this for a year. My accountant kept saying I needed a system. The biggest win is tracking where every estimate stands — I had 12 open quotes I'd basically forgotten about. The system reminded the customers and three of them came back. That alone paid for it. Insurance tracking is still something I'm learning but it beats my old notebook by a mile."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                TD
              </div>
              <div>
                <p className="font-bold text-gray-900">Tom Devries</p>
                <p className="text-gray-600 text-sm">Owner, Devries Roofing</p>
                <p className="text-gray-500 text-xs">Ottawa, ON</p>
              </div>
            </div>
          </div>
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
