'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import {
  Wrench, Flame, Zap as ZapIcon, TreePine, Sparkles, Home, HardHat, Grid3x3,
  TrendingUp, Star, Clock, Check, ArrowRight, AlertCircle,
} from 'lucide-react';

type Step = 'business' | 'superpowers' | 'celebrate';

interface SelectedPriorities {
  'speed-to-lead': boolean;
  'win-estimates': boolean;
  'get-reviews': boolean;
  'never-miss-followup': boolean;
}

const INDUSTRIES = [
  { id: 'plumbing', label: 'Plumbing', icon: Wrench, color: '#3B82F6' },
  { id: 'hvac', label: 'HVAC', icon: Flame, color: '#F97316' },
  { id: 'electrical', label: 'Electrical', icon: ZapIcon, color: '#FBBF24' },
  { id: 'landscaping', label: 'Landscaping', icon: TreePine, color: '#10B981' },
  { id: 'cleaning', label: 'Cleaning', icon: Sparkles, color: '#A855F7' },
  { id: 'roofing', label: 'Roofing', icon: Home, color: '#64748B' },
  { id: 'general_contracting', label: 'General Contracting', icon: HardHat, color: '#6B7280' },
  { id: 'other', label: 'Other', icon: Grid3x3, color: '#9CA3AF' },
];

const PROVINCES = [
  { id: 'ON', label: 'Ontario', taxRate: 13 },
  { id: 'QC', label: 'Quebec', taxRate: 15 },
  { id: 'BC', label: 'British Columbia', taxRate: 12 },
  { id: 'AB', label: 'Alberta', taxRate: 5 },
  { id: 'MB', label: 'Manitoba', taxRate: 12 },
  { id: 'SK', label: 'Saskatchewan', taxRate: 11 },
  { id: 'NS', label: 'Nova Scotia', taxRate: 15 },
  { id: 'NB', label: 'New Brunswick', taxRate: 15 },
  { id: 'NL', label: 'Newfoundland & Labrador', taxRate: 15 },
  { id: 'PE', label: 'Prince Edward Island', taxRate: 15 },
];

const SUPERPOWERS = [
  {
    id: 'speed-to-lead',
    title: 'Respond to leads faster',
    subtitle: 'Auto-reply in under 60 seconds',
    icon: ZapIcon,
    gradient: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'win-estimates',
    title: 'Win more estimates',
    subtitle: 'Professional estimates that close',
    icon: TrendingUp,
    gradient: 'from-green-400 to-green-600',
  },
  {
    id: 'get-reviews',
    title: 'Get more 5-star reviews',
    subtitle: 'Automated review requests after every job',
    icon: Star,
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    id: 'never-miss-followup',
    title: 'Never miss a follow-up',
    subtitle: 'Smart reminders so nothing falls through',
    icon: Clock,
    gradient: 'from-blue-400 to-blue-600',
  },
];

export default function SetupPage() {
  const router = useRouter();
  const { updateSettings, setSetupCompleted } = useStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentStep, setCurrentStep] = useState<Step>('business');
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<SelectedPriorities>({
    'speed-to-lead': false,
    'win-estimates': false,
    'get-reviews': false,
    'never-miss-followup': false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const progressPercent =
    currentStep === 'business' ? 33 : currentStep === 'superpowers' ? 66 : 100;

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'business') {
      if (!companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!selectedIndustry) {
        newErrors.industry = 'Please select an industry';
      }
      if (!selectedProvince) {
        newErrors.province = 'Please select a province';
      }
    }

    if (currentStep === 'superpowers') {
      const hasSelected = Object.values(selectedPriorities).some((v) => v);
      if (!hasSelected) {
        newErrors.priorities = 'Please select at least one priority';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep()) return;

    if (currentStep === 'business') {
      setCurrentStep('superpowers');
    } else if (currentStep === 'superpowers') {
      setCurrentStep('celebrate');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'superpowers') {
      setCurrentStep('business');
    } else if (currentStep === 'celebrate') {
      setCurrentStep('superpowers');
    }
  };

  const handleLaunch = async () => {
    setIsLoading(true);
    try {
      // Update store with company settings
      updateSettings({
        companyName: companyName.trim(),
        companyPhone: '',
        companyEmail: '',
        companyAddress: '',
        industry: selectedIndustry,
        companyProvince: selectedProvince,
      });

      // Mark setup as completed
      setSetupCompleted(true);

      // Mark as onboarded in localStorage
      localStorage.setItem('staybookt-onboarded', 'true');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing setup:', error);
      setIsLoading(false);
    }
  };

  const togglePriority = (id: keyof SelectedPriorities) => {
    setSelectedPriorities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getIndustryIcon = (id: string) => {
    const industry = INDUSTRIES.find((ind) => ind.id === id);
    return industry ? industry.icon : Grid3x3;
  };

  const getProvinceInfo = (id: string) => {
    return PROVINCES.find((prov) => prov.id === id);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-center py-2">
          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Step {currentStep === 'business' ? 1 : currentStep === 'superpowers' ? 2 : 3} of 3
          </p>
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 pt-16 sm:pt-20 pb-8">
        <div className="w-full max-w-2xl">
          {/* Step 1: Your Business */}
          {currentStep === 'business' && (
            <div className="space-y-12 animate-fade-in">
              <div className="space-y-4">
                <h1
                  className={`text-3xl sm:text-5xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Your Business
                </h1>
                <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Let's get to know your company. You can update more details later.
                </p>
              </div>

              {/* Company Name */}
              <div className="space-y-3">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }));
                  }}
                  placeholder="Your company name"
                  className={`w-full px-5 py-4 rounded-lg border-2 text-lg transition-all ${
                    errors.companyName
                      ? `border-red-500 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`
                      : `border-gray-300 dark:border-gray-700 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`
                  } ${isDark ? 'text-white' : 'text-gray-900'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {errors.companyName}
                  </p>
                )}
              </div>

              {/* Industry Selection */}
              <div className="space-y-4">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  What industry are you in?
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {INDUSTRIES.map((industry) => {
                    const Icon = industry.icon;
                    const isSelected = selectedIndustry === industry.id;
                    return (
                      <button
                        key={industry.id}
                        onClick={() => {
                          setSelectedIndustry(industry.id);
                          if (errors.industry) setErrors((prev) => ({ ...prev, industry: '' }));
                        }}
                        className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                          isSelected
                            ? `border-emerald-500 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'} ring-2 ring-emerald-500/50`
                            : `border-gray-200 dark:border-gray-700 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`
                        }`}
                      >
                        <Icon
                          size={24}
                          className="mx-auto mb-2"
                          style={{ color: industry.color }}
                        />
                        <p className={`text-sm font-medium text-center ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {industry.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.industry && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {errors.industry}
                  </p>
                )}
              </div>

              {/* Province Selection */}
              <div className="space-y-4">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Which province are you in?
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                  {PROVINCES.map((prov) => {
                    const isSelected = selectedProvince === prov.id;
                    return (
                      <button
                        key={prov.id}
                        onClick={() => {
                          setSelectedProvince(prov.id);
                          if (errors.province) setErrors((prev) => ({ ...prev, province: '' }));
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? `border-emerald-500 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'} ring-2 ring-emerald-500/50`
                            : `border-gray-200 dark:border-gray-700 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`
                        }`}
                      >
                        <p className={`text-sm font-bold ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {prov.id}
                        </p>
                        <p className={`text-xs ${isSelected ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                          {prov.label}
                        </p>
                        <p className={`text-xs mt-1 ${isSelected ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                          {prov.taxRate}% tax
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.province && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {errors.province}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={() => router.push('/dashboard')}
                  className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Skip setup
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                  Next <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Your Superpowers */}
          {currentStep === 'superpowers' && (
            <div className="space-y-12 animate-fade-in">
              <div className="space-y-4">
                <h1
                  className={`text-3xl sm:text-5xl font-bold tracking-tight ${
                    isDark ? 'text-gray-50' : 'text-gray-900'
                  }`}
                >
                  Your Priorities
                </h1>
                <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Pick what matters most right now. You can always change this later.
                </p>
              </div>

              {/* Superpowers Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUPERPOWERS.map((power) => {
                  const Icon = power.icon;
                  const isSelected = selectedPriorities[power.id as keyof SelectedPriorities];

                  return (
                    <button
                      key={power.id}
                      onClick={() => togglePriority(power.id as keyof SelectedPriorities)}
                      className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 text-left ${
                        isSelected
                          ? `border-emerald-500 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'}`
                          : `border-gray-200 dark:border-gray-700 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${power.gradient}`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {power.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {power.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {errors.priorities && (
                <p className="text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {errors.priorities}
                </p>
              )}

              {/* Stat */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-center text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Service businesses using a CRM see an average
                  <span className="text-emerald-600 dark:text-emerald-400 block text-2xl mt-2">
                    47% increase in booked jobs
                  </span>
                </p>
                <p className={`text-center text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Based on industry data from CRM-adopting service businesses in North America
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={handlePrevStep}
                  className={`px-8 py-3 font-semibold rounded-lg border-2 transition-all ${
                    isDark
                      ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Back
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedPriorities({
                        'speed-to-lead': true,
                        'win-estimates': true,
                        'get-reviews': true,
                        'never-miss-followup': true,
                      });
                      setCurrentStep('celebrate');
                    }}
                    className={`text-sm font-medium transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Enable all & skip
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                  >
                    Next <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Celebrate */}
          {currentStep === 'celebrate' && (
            <div className="relative">
              {/* Confetti */}
              <Confetti />

              <div className="space-y-12 text-center animate-fade-in">
                <div className="space-y-6">
                  <div className="inline-block">
                    <div className="text-7xl mb-4">🎉</div>
                  </div>
                  <h1
                    className={`text-3xl sm:text-5xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    You're all set.
                  </h1>
                  <p className={`text-2xl font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Let's grow {companyName}.
                  </p>
                </div>

                {/* Summary */}
                <div className={`p-8 rounded-xl border-2 ${isDark ? 'border-emerald-900/50 bg-emerald-900/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Here's what we'll set up for you:
                  </h2>

                  <div className="space-y-3 text-left">
                    {/* Industry */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      {(() => {
                        const Icon = getIndustryIcon(selectedIndustry);
                        return <Icon size={20} className="text-emerald-600" />;
                      })()}
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {INDUSTRIES.find((ind) => ind.id === selectedIndustry)?.label}
                        </p>
                      </div>
                    </div>

                    {/* Province */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                        {selectedProvince}
                      </div>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {getProvinceInfo(selectedProvince)?.label}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getProvinceInfo(selectedProvince)?.taxRate}% tax rate
                        </p>
                      </div>
                    </div>

                    {/* Selected Priorities */}
                    {Object.entries(selectedPriorities).map(([key, isSelected]) => {
                      if (!isSelected) return null;
                      const power = SUPERPOWERS.find((p) => p.id === key);
                      if (!power) return null;
                      const Icon = power.icon;

                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${power.gradient}`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <div>
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {power.title}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trial Info */}
                <div className={`space-y-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p className="text-lg">
                    Your 14-day trial starts now. No credit card required.
                  </p>
                  <button
                    onClick={handleLaunch}
                    disabled={isLoading}
                    className={`px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isLoading ? 'Launching...' : 'Launch Staybookt'}
                  </button>
                </div>

                {/* Navigation - Back only */}
                <div className="flex justify-center pt-6">
                  <button
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className={`px-8 py-3 font-semibold rounded-lg border-2 transition-all ${
                      isDark
                        ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-piece {
          position: fixed;
          pointer-events: none;
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}

function Confetti() {
  const [pieces, setPieces] = useState<Array<{
    duration: number;
    delay: number;
    left: number;
    rotation: number;
    color: string;
    isCircle: boolean;
  }>>([]);

  useEffect(() => {
    const colors = ['#27AE60', '#3B82F6', '#F97316', '#A855F7', '#EC4899', '#10B981'];
    setPieces(
      Array.from({ length: 40 }, () => ({
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 0.5,
        left: Math.random() * 100,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        isCircle: Math.random() > 0.5,
      }))
    );
  }, []);

  if (pieces.length === 0) return null;

  return (
    <>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: '8px',
            height: '8px',
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '0',
            animation: `fall ${p.duration}s linear ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </>
  );
}
