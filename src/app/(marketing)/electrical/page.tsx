'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Zap, FileText, AlertCircle, TrendingUp, CheckCircle, Phone, BarChart3, Shield } from 'lucide-react';

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
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors">
            Get started free
            <Zap className="w-5 h-5" />
          </button>
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

            {/* Estimate Turnaround */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimates take forever to close</h3>
                  <p className="text-gray-600">
                    You quote a job on a napkin, email it three days later, and never hear back. You're too busy to follow up. Competitors steal those jobs.
                  </p>
                </div>
              </div>
            </div>

            {/* Missed Follow-ups */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Follow-ups slip through cracks</h3>
                  <p className="text-gray-600">
                    You meet a contractor at a supply house, exchange numbers, and forget to follow up. That could have been a $10,000 job.
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
                <h3 className="text-lg font-semibold text-gray-900">Permit tracking and alerts</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Track every permit and inspection deadline. Get alerts before they expire. Never miss a deadline again.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Link permits to job records
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Automatic deadline reminders
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  All paperwork in one place
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

            {/* License Management */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">License and insurance tracking</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Track licenses, insurance, and certifications for you and your team. Get notified before anything expires.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Store all credentials in one place
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Renewal reminders 30 days out
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Team member certification tracking
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
              "I was tracking permits in emails, follow-ups in my head, and estimates in three different places. It was a disaster. Growth OS brought everything together. Now I know exactly which permits are coming due, which estimates are pending, and who needs a follow-up call. We closed 4 extra jobs in the first month just by following up faster. This has been a game-changer for our business."
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
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors text-lg">
            Start free trial
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </section>
    </MarketingLayout>
  );
}
