'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Zap, FileText, AlertCircle, TrendingUp, CheckCircle, Phone, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ElectricalPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Electrical contractors: close more jobs, chase fewer invoices
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Permits, licenses, inspections, invoices, follow-ups. You're juggling too much. Growth OS keeps all your electrical business organized so you can focus on wiring, not paperwork.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors"
          >
            Get started free
            <Zap className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required. 5-minute setup.</p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Problems we solve for electrical contractors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Permit Tracking */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Permit chaos costs time and fines</h3>
                  <p className="text-gray-600">
                    You miss permit deadlines, forget which jobs need final inspection sign-offs, and loose track of paperwork. One missed permit fee is $500+.
                  </p>
                </div>
              </div>
            </div>

            {/* Estimates & Follow-ups */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimates and follow-ups take forever</h3>
                  <p className="text-gray-600">
                    You quote a job on a napkin, send it days later from your email, and never follow up. Competitors are faster. An average job is $3,000-5,000 — you can't afford to lose those.
                  </p>
                </div>
              </div>
            </div>

            {/* Code Inspections */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Inspection failures and re-checks</h3>
                  <p className="text-gray-600">
                    Inspection didn't pass? You need to log it, schedule the re-check, and keep the customer in the loop. One forgotten re-inspection means a delayed project and upset customer.
                  </p>
                </div>
              </div>
            </div>

            {/* License Management */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">License and insurance tracking</h3>
                  <p className="text-gray-600">
                    You can't remember when your licenses renew, when insurance expires, or which crew members are still certified. One expired license and you're off the clock.
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
            How Growth OS keeps you organized
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            One system for estimates, permits, licenses, invoices, and follow-ups. Everything in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Permit Tracking */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Permit tracking is THE feature</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Every permit has a deadline. Growth OS tracks them so you never miss one and never lose a contract over paperwork. That's recurring revenue protected.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Deadline reminders 7 days out
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Link permits to job records
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Never lose a permit again
                </li>
              </ul>
            </div>

            {/* Fast Estimates */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Estimates that close faster</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Send professional estimates in minutes. Track which ones are pending. Automatic follow-ups when customers go silent.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Custom estimate templates
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Online approval and payment
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Auto-follow-up after 2 days
                </li>
              </ul>
            </div>

            {/* Smart Follow-ups */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Never forget a follow-up</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create reminders for every lead. Growth OS tells you exactly who to follow up with and when. No more lost opportunities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Custom task reminders
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  See your lead pipeline at a glance
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Auto-follow-up texts and emails
                </li>
              </ul>
            </div>

            {/* Solo Operator Support */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">The office manager you can't afford to hire</h3>
              </div>
              <p className="text-gray-600 mb-4">
                You left someone else's shop to run your own. Growth OS handles scheduling, follow-ups, invoicing, and compliance tracking so you can focus on electrical work.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Licenses and insurance tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Automatic renewal reminders
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Scale without hiring office staff
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
              "I was tracking permits in my email, follow-ups in my head, and estimates in three different places. Now it's one screen. I'm still getting used to it — took me about a week to really trust it. But my estimates go out same-day now instead of whenever I get home, and I've definitely closed a few jobs I would have lost to someone faster."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Steve Kim</p>
              <p className="text-gray-600">Kim Electric, Vancouver BC</p>
              <p className="text-sm text-gray-500 mt-1">Electrical contractor, 2 teams, 9 years in business</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Stop losing jobs to disorganization
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Free trial, no credit card. Get organized in 5 minutes.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors text-lg"
          >
            Start free trial
            <Zap className="w-5 h-5" />
          </Link>
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
