'use client';

import React from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import {
  Wrench,
  Flame,
  Plug,
  TreePine,
  Sparkles,
  Home,
} from 'lucide-react';

// ─── Logo Wall Component ─────────────────────────────────────
export function LogoWall() {
  const { t } = useLanguage();

  const companies = [
    { name: 'Northern Plumbing Co.', icon: Wrench, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Arctic HVAC Solutions', icon: Flame, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
    { name: 'Maple Electric', icon: Plug, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50' },
    { name: 'Green Valley Landscaping', icon: TreePine, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
    { name: 'Pristine Clean Services', icon: Sparkles, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50' },
    { name: 'Summit Roofing Inc.', icon: Home, color: 'from-rose-500 to-rose-600', bgColor: 'bg-rose-50' },
    { name: 'Ottawa Drain Experts', icon: Wrench, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Pacific Air Systems', icon: Flame, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
    { name: 'Volt Pro Electrical', icon: Plug, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50' },
    { name: 'Prairie Lawn Care', icon: TreePine, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
    { name: 'Crystal Clear Cleaning', icon: Sparkles, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50' },
    { name: 'Ridgeline Roofing', icon: Home, color: 'from-rose-500 to-rose-600', bgColor: 'bg-rose-50' },
  ];

  // Duplicate for seamless loop
  const displayCompanies = [...companies, ...companies];

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t('trust.logoHeading')}
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          <style jsx>{`
            @keyframes scroll-left {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% / 2));
              }
            }
            .marquee {
              animation: scroll-left 30s linear infinite;
            }
            .marquee:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee flex gap-4">
            {displayCompanies.map((company, idx) => {
              const IconComponent = company.icon;
              return (
                <div
                  key={`${company.name}-${idx}`}
                  className="flex-shrink-0 group"
                >
                  <div
                    className={`${company.bgColor} px-6 py-4 rounded-xl border border-gray-200 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${company.color} flex items-center justify-center text-white flex-shrink-0 transition-all duration-300 group-hover:scale-110`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                        {company.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Integrations Bar Component ──────────────────────────────
export function IntegrationsBar() {
  const { t } = useLanguage();

  const integrations = [
    {
      name: 'QuickBooks',
      label: t('trust.quickbooksLabel'),
      icon: '📊',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      name: 'Google Calendar',
      label: t('trust.googlecalendarLabel'),
      icon: '📅',
      color: 'from-blue-500 via-red-500 to-yellow-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      name: 'Stripe',
      label: t('trust.stripeLabel'),
      icon: '💳',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      name: 'Twilio',
      label: t('trust.twilioLabel'),
      icon: '📱',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      name: 'Google Maps',
      label: t('trust.mapsLabel'),
      icon: '🗺️',
      color: 'from-green-500 via-blue-500 to-red-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      name: 'HomeStars',
      label: t('trust.homestarsLabel'),
      icon: '⭐',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      name: 'Mailchimp',
      label: t('trust.mailchimpLabel'),
      icon: '✉️',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      name: 'Zapier',
      label: t('trust.zapierLabel'),
      icon: '⚡',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t('trust.integrationHeading')}
          </h2>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className={`${integration.bgColor} ${integration.borderColor} border rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{integration.icon}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {integration.name}
              </p>
              <p className="text-xs text-gray-600">
                {integration.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇨🇦</span>
              <div>
                <p className="text-xs text-gray-600">
                  {t('trust.canadianHosting')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-xs text-gray-600">
                  {t('trust.encryption')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="text-xs text-gray-600">
                  {t('trust.pipedaCompliant')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <p className="text-xs text-gray-600">
                  {t('trust.uptime')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
