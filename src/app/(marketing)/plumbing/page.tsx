'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Phone, Clock, CreditCard, Star, CheckCircle, MessageSquare, BarChart3, FileText } from 'lucide-react';

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
                    Three missed calls a week equals $5,000+ in lost revenue per month. Your phone is ringing when you're on a job site.
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

            {/* No Reviews */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Star className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews coming in</h3>
                  <p className="text-gray-600">
                    You're too busy to ask for Google reviews. New customers can't find you online because your profile has 2 reviews from 2019.
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

            {/* Reviews */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Automatic review requests</h3>
              </div>
              <p className="text-gray-600 mb-4">
                After every job, Growth OS sends customers a link to leave a review. Watch your Google rating climb on autopilot.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Customizable review requests
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Track all your reviews in one dashboard
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  More 5-stars in 90 days
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
              "Growth OS cut my office time in half. I was spending 2 hours a day answering calls and following up on estimates. Now my phone is organized, estimates go out fast, and I'm getting paid on time. Last month we booked 6 more jobs because we were faster than the guys we usually compete with."
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
    </MarketingLayout>
  );
}
