'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Phone, Clock, CreditCard, Star, CheckCircle, MessageSquare, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PlumbingPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Stop losing plumbing leads to your competitor's voicemail
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Growth OS keeps every call, text, and email organized so you never miss a job. Respond faster than the big companies, book more work, and get paid on time.
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors">
            Get started free
            <Phone className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">No credit card required. Start responding to leads in 5 minutes.</p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Common problems we solve for plumbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Missed Calls */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Missed calls mean lost money</h3>
                  <p className="text-gray-600">
                    Even 2-3 missed calls a week adds up to $2,000-3,000/month in lost jobs. Your phone is ringing when you're on a job site.
                  </p>
                </div>
              </div>
            </div>

            {/* Slow Estimates */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimates that take forever</h3>
                  <p className="text-gray-600">
                    Customers expect quotes back within 24 hours. Calling from your truck, writing estimates on paper, then typing them up later costs you jobs.
                  </p>
                </div>
              </div>
            </div>

            {/* Unpaid Invoices */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <CreditCard className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chasing invoices takes 8+ hours a month</h3>
                  <p className="text-gray-600">
                    You're managing spreadsheets, sending reminder texts, and making collection calls instead of fixing pipes.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Dispatch */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Star className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency calls throw off your whole day</h3>
                  <p className="text-gray-600">
                    A burst pipe at 6am means your whole schedule shifts. You need to reroute your day, communicate with teams, and keep customers in the loop without the chaos.
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
            How Growth OS fixes it
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            One app for calls, texts, estimates, invoices, and payments. Your whole business in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Unified Inbox */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Every message in one place</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Calls, texts, emails, and chat all in one inbox. You'll never miss a lead again. Reply in seconds from your phone.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  See caller name and history before you answer
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Auto-transcribe voicemails
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Two-way texting with customers
                </li>
              </ul>
            </div>

            {/* Fast Estimates */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Send estimates in 3 minutes</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Snap a photo at the job, tap a template, add pricing. Estimate goes out to the customer before you leave their house.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Mobile-friendly quote templates
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Customers approve and pay online
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Automatic payment reminders
                </li>
              </ul>
            </div>

            {/* Smart Invoicing */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Get paid faster</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Invoices sent automatically. Customers can pay with one click. Track who's paid and who owes you at a glance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Accept credit card and bank transfers
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Auto-reminder for late invoices
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  See overdue payments at a glance
                </li>
              </ul>
            </div>

            {/* Parts & Warranty */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Parts tracking and warranty alerts</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Track which jobs need parts on order so nothing falls through the cracks. Get flagged for warranty callbacks so you're never surprised by a 30-day issue.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Link parts orders to jobs
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Automatic warranty callback reminders
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  See pending parts at a glance
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
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xl text-gray-900 mb-8 leading-relaxed font-medium">
              "Biggest thing for us was not missing calls. My wife was fielding maybe 15-20 calls a day and probably losing a third of them. Now they all get logged and we follow up same-day instead of next-week. We're probably booking 4-5 more jobs a month — hard to say exactly, but the phone doesn't ring and go nowhere anymore. Still working on getting guys to update job statuses, but we'll get there."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Mike Reynolds</p>
              <p className="text-gray-600">Reynolds Plumbing, Toronto ON</p>
              <p className="text-sm text-gray-500 mt-1">Family plumbing company, 3 teams, 12 years in business</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to book more jobs and chase fewer invoices?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start free today. Set up takes 5 minutes. No credit card needed.
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors text-lg">
            Start your free trial
            <Phone className="w-5 h-5" />
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
