'use client';

import { MarketingLayout, CTASection, Footer } from '@/components/MarketingLayout';
import { ArrowRight, Sparkles, PhoneOff, RotateCw, Star, CheckCircle2, Zap, TrendingUp, Users, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CleaningPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Built for Cleaning Services
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Fill your cleaning schedule without spending all day on the phone
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                No-show clients, lost bookings, and pricing chaos waste your time and money. Growth OS handles the phone, keeps your schedule full, and gets you reviews automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/setup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-base font-semibold rounded-full hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-lg shadow-cyan-600/25 hover:shadow-cyan-700/30 hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-cyan-700 text-base font-semibold rounded-full border-2 border-cyan-200 hover:bg-cyan-50 transition-all"
                >
                  See It in Action
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">No credit card needed. Full access for 14 days.</p>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl blur-3xl opacity-60" />
                <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-200">
                  <div className="space-y-4 text-cyan-900">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Book clients 24/7</div>
                        <div className="text-sm text-cyan-700">Even while you're cleaning</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Recurring clients stay locked in</div>
                        <div className="text-sm text-cyan-700">Auto-book and auto-invoice</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Get reviews without asking</div>
                        <div className="text-sm text-cyan-700">Auto-request after each clean</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Cut no-shows in half</div>
                        <div className="text-sm text-cyan-700">Automatic reminders actually work</div>
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
              Cleaning business pain points we solve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From booking chaos to revenue loss, we've heard it all. Here's what keeps cleaning owners up at night.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pain Point 1: No-Show Clients */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <PhoneOff className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No-shows wreck your schedule
              </h3>
              <p className="text-gray-600 mb-4">
                Client forgets. You show up with supplies and crew ready. Nobody's home. Revenue gone, crew idle.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>3-4 cancellations per week with zero notice</li>
                <li>You don't find out until you're at the house</li>
                <li>Crew gets paid for idle time, margins vanish</li>
              </ul>
            </div>

            {/* Pain Point 2: Recurring Booking Management */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <RotateCw className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Recurring bookings are manual chaos
              </h3>
              <p className="text-gray-600 mb-4">
                Client wants biweekly cleaning. You manually schedule each one. They cancel and rebook with someone else.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>You spend 2 hours a week rescheduling</li>
                <li>Clients forget their standing appointment</li>
                <li>Revenue becomes unpredictable</li>
              </ul>
            </div>

            {/* Pain Point 3: Review Generation */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Reviews don't happen by themselves
              </h3>
              <p className="text-gray-600 mb-4">
                You deliver great work. But getting customers to actually leave a review? Feels impossible.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Clients love you but never leave a review</li>
                <li>New leads trust 5-star reviews most</li>
                <li>Asking manually is awkward</li>
              </ul>
            </div>

            {/* Pain Point 4: Supply Costs & Pricing */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Supply costs eat your margins
              </h3>
              <p className="text-gray-600 mb-4">
                Cleaning supplies cost 30-40% of revenue if you're not careful. Residential vs commercial are completely different businesses.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>You don't know which jobs are actually profitable</li>
                <li>Same pricing for residential and post-construction is wrong</li>
                <li>Supplies mysteriously shrink margins</li>
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
              Keep your schedule full automatically
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Features designed specifically for residential and commercial cleaning services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-5">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                24/7 Online Booking
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Clients book when they want, not when you can take a call. Show availability, let them choose. You approve in 30 seconds.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Close more jobs without more phone calls</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Get paid right away</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-5">
                <RotateCw className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Recurring Booking Confirmations
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Biweekly clients get an automatic reminder 24 hours before. They confirm or reschedule — no more showing up to a locked house.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Reduce no-shows by 30-40%</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Lock in predictable revenue</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Automatic Review Requests
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                After each clean, a review request goes out automatically. No embarrassment. Just more 5-star reviews where it counts.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>2-3x more reviews per month</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>Better Google ranking</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                No-Show Prevention
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Automatic reminders 24 hours before appointment. Customers confirm or reschedule. Know by the night before, not at the house.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Client Classification & Supply Tracking
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Residential, commercial, and post-construction are different pricing. Tag each client type. Log supply costs per job to protect margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              "The no-show thing was the reason I signed up. We were getting maybe 3-4 cancellations a week with zero notice. The automatic reminders cut that roughly in half — not completely, people still cancel, but at least we know by the night before instead of showing up to an empty house. The recurring booking feature is honestly what I use most. It's not perfect but it's way better than my Google Sheet."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                AR
              </div>
              <div>
                <p className="font-bold text-gray-900">Anna Ramos</p>
                <p className="text-gray-600 text-sm">Owner, Sparkle Clean Co.</p>
                <p className="text-gray-500 text-xs">Winnipeg, MB</p>
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
