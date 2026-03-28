'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { ArrowRight, Zap, Target, Users, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Built by operators, <span className="text-blue-600">for operators</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Growth OS was created by people who understand the real challenges service businesses face. We built the tools we wished we had.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6 leading-relaxed">
              Growth OS was born from frustration. We watched talented tradespeople—electricians, plumbers, HVAC technicians, cleaners, landscapers—pour their expertise into building amazing service businesses. Yet they were losing revenue every day to spreadsheets, missed calls, and disorganized schedules.
            </p>
            <p className="mb-6 leading-relaxed">
              The systems that could solve these problems existed, but they cost thousands per month and required IT departments to set up. That wasn't fair. A solo contractor shouldn't have to choose between growth and going broke.
            </p>
            <p className="leading-relaxed">
              So we built Growth OS in Canada, for Canadian service businesses. Not as a generic tool. But as a platform that speaks your language, understands your seasonal swings, respects your time, and actually helps you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-blue-700 font-semibold">
              Make growth automatic for every service business in Canada
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Value 1: Built for Canada */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Built for Canada</h3>
              <p className="text-gray-600">
                We're Canadian. We understand provincial licensing requirements, seasonal patterns, and the unique needs of Canadian service businesses. This isn't a global tool adapted for Canada—it's built here, for here.
              </p>
            </div>

            {/* Value 2: Simplicity First */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simplicity First</h3>
              <p className="text-gray-600">
                You didn't start a service business to manage software. We obsess over making Growth OS intuitive, fast, and easy to use—even if you've never used a CRM before.
              </p>
            </div>

            {/* Value 3: Revenue-Focused */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Revenue-Focused</h3>
              <p className="text-gray-600">
                Every feature we build has one goal: help you make more money. Better scheduling, faster invoicing, smarter follow-ups—everything points to growth.
              </p>
            </div>

            {/* Value 4: Operator-Led */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Operator-Led</h3>
              <p className="text-gray-600">
                Our decisions are driven by real service business owners, not venture capital and growth-at-all-costs. We listen to our customers and build what actually matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Team</h2>
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-6">
              Growth OS is built by a small, focused team based in Toronto. We're product-obsessed, customer-obsessed, and deeply committed to the success of Canadian service businesses.
            </p>
            <p className="text-gray-600">
              Everyone on our team has either built or worked closely with service businesses. We don't theorize about your challenges—we've lived them. And that experience drives everything we build.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to grow?</h2>
          <p className="text-xl text-gray-600 mb-8">
            See how Growth OS can help your service business thrive.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get in touch
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </MarketingLayout>
  );
}
