'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import { Invoice } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Target,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Phone,
  Rocket,
  ArrowRight,
  ChevronRight,
  Check,
  ChevronDown,
  X,
  FileText,
  Settings,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/Modal';
import { AddDealForm } from '@/components/AddDealForm';

const PIPELINE_STAGE_COLORS: Record<string, string> = {
  new_lead: '#3B82F6',
  contacted: '#8B5CF6',
  estimate_scheduled: '#F59E0B',
  estimate_sent: '#EF4444',
  booked: '#10B981',
  in_progress: '#06B6D4',
  completed: '#22C55E',
  invoiced: '#6366F1',
};

const RING_COLORS = {
  'Ring 1': '#10B981',
  'Ring 2': '#3B82F6',
  'Ring 3': '#F59E0B',
};

export default function Dashboard() {
  const { t } = useLanguage();
  const { contacts, deals, activities, invoices, settings, initializeSeedData, getActivities, setupCompleted, clearSampleData, setSetupCompleted } = useStore();
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isFABExpanded, setIsFABExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>(
    'month'
  );
  const [mounted, setMounted] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [isWelcomeExpanded, setIsWelcomeExpanded] = useState(true);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
    // Check if welcome widget was dismissed
    const isDismissed = localStorage.getItem('growth-os-welcome-dismissed') === 'true';
    setWelcomeDismissed(isDismissed);
  }, []);

  // Define onboarding steps with completion checks
  const onboardingSteps = [
    {
      id: 'add-contact',
      title: 'Add your first contact',
      description: 'Start building your contact database',
      href: '/contacts',
      completed: contacts.length > 0,
      icon: Target,
    },
    {
      id: 'create-deal',
      title: 'Create a deal',
      description: 'Add your first job to the pipeline',
      href: '/pipeline',
      completed: deals.length > 0,
      icon: Zap,
    },
    {
      id: 'send-estimate',
      title: 'Send an estimate',
      description: 'Create and send your first quote',
      href: '/estimates',
      completed: false, // This would need estimates check from store
      icon: FileText,
    },
    {
      id: 'company-info',
      title: 'Set up your company info',
      description: 'Configure your business details',
      href: '/setup',
      completed: !!settings.companyName && settings.companyName !== 'ProPlumbers Inc.',
      icon: Settings,
    },
    {
      id: 'pipeline-stages',
      title: 'Customize your pipeline stages',
      description: 'Tailor pipeline to your workflow',
      href: '/settings',
      completed: false, // This would need customization check
      icon: Settings,
    },
    {
      id: 'import-contacts',
      title: 'Import contacts from CSV',
      description: 'Bulk import your existing contacts',
      href: '/contacts/import',
      completed: false,
      icon: Upload,
    },
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const completionPercentage = Math.round((completedSteps / onboardingSteps.length) * 100);
  const allStepsCompleted = completedSteps === onboardingSteps.length;

  // Auto-hide when all steps completed
  useEffect(() => {
    if (allStepsCompleted && !welcomeDismissed) {
      setWelcomeDismissed(true);
      localStorage.setItem('growth-os-welcome-dismissed', 'true');
    }
  }, [allStepsCompleted, welcomeDismissed]);

  const handleDismissWelcome = () => {
    setWelcomeDismissed(true);
    localStorage.setItem('growth-os-welcome-dismissed', 'true');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl h-28 shadow-sm"></div>)}
        </div>
      </div>
    );
  }

  // Calculate overdue invoices
  const overdueInvoices = invoices.filter(
    (inv: Invoice) => inv.dueDate < Date.now() && inv.status !== 'paid'
  );
  const totalOverdueAmount = overdueInvoices.reduce((sum: number, inv: Invoice) => sum + (inv.total - inv.amountPaid), 0);

  // Calculate KPIs
  const totalLeads = contacts.filter((c) => c.type === 'lead').length;
  const previousLeads = Math.max(totalLeads - 3, 0);
  const leadsTrend = totalLeads - previousLeads;
  const leadsTrendPercent =
    previousLeads > 0 ? Math.round((leadsTrend / previousLeads) * 100) : 0;

  const activeDeals = deals.filter(
    (d) => d.stage !== 'completed' && d.stage !== 'invoiced'
  ).length;

  const pipelineValue = deals
    .filter((d) => d.stage !== 'completed' && d.stage !== 'invoiced')
    .reduce((sum, d) => sum + d.value, 0);

  const totalRevenue = deals
    .filter((d) => d.stage === 'invoiced')
    .reduce((sum, d) => sum + d.value, 0);

  const completedDeals = deals.filter((d) => d.stage === 'invoiced').length;
  const conversionRate =
    deals.length > 0 ? Math.round((completedDeals / deals.length) * 100) : 0;

  const avgDealValue = activeDeals > 0 ? Math.round(pipelineValue / activeDeals) : 0;

  // Pipeline funnel data for BarChart
  const pipelineData = [
    { stage: 'New Lead', count: deals.filter((d) => d.stage === 'new_lead').length },
    { stage: 'Contacted', count: deals.filter((d) => d.stage === 'contacted').length },
    {
      stage: 'Est. Scheduled',
      count: deals.filter((d) => d.stage === 'estimate_scheduled').length,
    },
    { stage: 'Est. Sent', count: deals.filter((d) => d.stage === 'estimate_sent').length },
    { stage: 'Booked', count: deals.filter((d) => d.stage === 'booked').length },
    {
      stage: 'In Progress',
      count: deals.filter((d) => d.stage === 'in_progress').length,
    },
    { stage: 'Completed', count: deals.filter((d) => d.stage === 'completed').length },
    { stage: 'Invoiced', count: deals.filter((d) => d.stage === 'invoiced').length },
  ];

  // Revenue by lead source (Ring breakdown)
  const ring1Revenue = deals
    .filter(
      (d) =>
        ['existing_customer', 'reactivation', 'cross_sell'].includes(d.source) &&
        d.stage === 'invoiced'
    )
    .reduce((sum, d) => sum + d.value, 0);

  const ring2Revenue = deals
    .filter(
      (d) =>
        ['referral', 'review', 'neighborhood'].includes(d.source) &&
        d.stage === 'invoiced'
    )
    .reduce((sum, d) => sum + d.value, 0);

  const ring3Revenue = deals
    .filter(
      (d) => ['google_lsa', 'seo', 'gbp'].includes(d.source) && d.stage === 'invoiced'
    )
    .reduce((sum, d) => sum + d.value, 0);

  // Use total deal value (not just invoiced) so pie chart shows meaningful data
  const ring1Total = deals
    .filter((d) => ['existing_customer', 'reactivation', 'cross_sell'].includes(d.source))
    .reduce((sum, d) => sum + d.value, 0);
  const ring2Total = deals
    .filter((d) => ['referral', 'review', 'neighborhood'].includes(d.source))
    .reduce((sum, d) => sum + d.value, 0);
  const ring3Total = deals
    .filter((d) => ['google_lsa', 'seo', 'gbp'].includes(d.source))
    .reduce((sum, d) => sum + d.value, 0);

  const revenueBySourceData = [
    { name: 'Ring 1 (Harvest)', value: ring1Total },
    { name: 'Ring 2 (Amplify)', value: ring2Total },
    { name: 'Ring 3 (Acquire)', value: ring3Total },
  ].filter((d) => d.value > 0);

  // Monthly revenue trend (mock 6-month data)
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 22300 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 28400 },
    { month: 'May', revenue: 32100 },
    { month: 'Jun', revenue: 35600 },
  ];

  // Deal stage duration (days spent in each stage)
  const stageDurationData = [
    { stage: 'New Lead', days: 3 },
    { stage: 'Contacted', days: 5 },
    { stage: 'Est. Scheduled', days: 4 },
    { stage: 'Est. Sent', days: 7 },
    { stage: 'Booked', days: 6 },
    { stage: 'In Progress', days: 14 },
  ];

  // Recent activities with time ago
  const recentActivities = getActivities(5).map((activity) => {
    const now = new Date();
    const createdAt = new Date(activity.createdAt);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeAgo = '';
    if (diffMins < 60) timeAgo = `${diffMins}m ago`;
    else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
    else timeAgo = `${diffDays}d ago`;

    return { ...activity, timeAgo };
  });

  // Top deals by value
  const topDeals = [...deals]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((deal) => {
      const contact = contacts.find((c) => c.id === deal.contactId);
      return { ...deal, contactName: contact?.name || 'Unknown' };
    });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'call':
        return <Phone className="w-4 h-4 text-green-500" />;
      case 'meeting':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      {/* Sample Data Banner */}
      {!setupCompleted && contacts.length > 0 && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-amber-600 dark:text-amber-400 text-lg">&#9888;</span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">You&apos;re viewing sample data</p>
              <p className="text-amber-700 dark:text-amber-300 text-xs">This demo data helps you explore GrowthOS. Clear it when you&apos;re ready to add your own.</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearSampleData();
              setSetupCompleted(true);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            Clear Sample Data
          </button>
        </div>
      )}

      {/* Header with Date Range */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {deals.length === 0 ? 'Welcome to GrowthOS' : t('dashboard.welcomeBack')}
        </p>

        {/* Date Range Selector */}
        <div className="flex gap-2 flex-wrap">
          {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === range
                  ? 'bg-[#27AE60] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              {range === 'today' && t('dashboard.today')}
              {range === 'week' && t('dashboard.thisWeek')}
              {range === 'month' && t('dashboard.thisMonth')}
              {range === 'quarter' && t('dashboard.thisQuarter')}
            </button>
          ))}
        </div>
      </div>

      {/* Getting Started Welcome Widget */}
      {!welcomeDismissed && !allStepsCompleted && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8 border border-slate-100 dark:border-slate-700 transition-all">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#2C3E50] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5 text-[#27AE60]" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Welcome to GrowthOS!
                </h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Complete these steps to get the most out of your CRM.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsWelcomeExpanded(!isWelcomeExpanded)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                aria-label="Toggle welcome widget"
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${isWelcomeExpanded ? '' : '-rotate-90'}`}
                />
              </button>
              <button
                onClick={handleDismissWelcome}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                aria-label="Dismiss welcome widget"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Content */}
          {isWelcomeExpanded && (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    PROGRESS
                  </span>
                  <span className="text-sm font-bold text-[#27AE60]">
                    {completedSteps} of {onboardingSteps.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#27AE60] to-[#229954] transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {onboardingSteps.map((step) => {
                  const IconComponent = step.icon;
                  return (
                    <Link
                      key={step.id}
                      href={step.href}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                        step.completed
                          ? 'bg-green-50 dark:bg-green-950/20 border-[#27AE60] dark:border-green-700'
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-[#27AE60] dark:hover:border-[#27AE60]'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        step.completed
                          ? 'bg-[#27AE60] border-[#27AE60]'
                          : 'border-slate-300 dark:border-slate-500'
                      }`}>
                        {step.completed && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm sm:text-base ${
                          step.completed
                            ? 'text-[#27AE60] line-through'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {step.description}
                        </p>
                      </div>

                      {/* Action Arrow */}
                      {!step.completed && (
                        <div className="text-[#27AE60] flex-shrink-0 mt-0.5">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Onboarding Banner */}
      <div className="bg-[#2C3E50] rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{t('dashboard.finishSetup')}</h3>
              <p className="text-white/70 text-sm">Complete your setup to unlock the full power of autopilot. Takes under 5 minutes.</p>
            </div>
          </div>
          <Link
            href="/setup"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#27AE60] text-white rounded-xl font-semibold hover:bg-[#229954] transition-all shrink-0 text-sm"
          >
            {t('dashboard.continueSetup')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Overdue Invoices Alert */}
      {overdueInvoices.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-100/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900 dark:text-red-100">{t('dashboard.overdueInvoices')}</h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''} — ${totalOverdueAmount.toLocaleString()} {t('dashboard.overdueAmount')}
                </p>
              </div>
            </div>
            <Link
              href="/invoices"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shrink-0 text-sm"
            >
              View
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {/* Total Leads */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{t('dashboard.totalLeads')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">{totalLeads}</p>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Target className="w-6 h-6 text-[#27AE60]" />
            </div>
          </div>
          {leadsTrend !== 0 && (
            <div className="flex items-center gap-1 text-sm">
              {leadsTrend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={
                  leadsTrend > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                }
              >
                {Math.abs(leadsTrendPercent)}%
              </span>
            </div>
          )}
        </div>

        {/* Active Jobs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{t('dashboard.activeDeals')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">{activeDeals}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.inProgress')}</p>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{t('dashboard.pipelineValue')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                ${(pipelineValue / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{activeDeals} {t('dashboard.activeOpportunities')}</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{t('dashboard.conversionRate')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">{conversionRate}%</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {completedDeals} of {deals.length} closed
          </p>
        </div>

        {/* Avg Job Value */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{t('dashboard.avgDealValue')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                ${avgDealValue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#27AE60]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.perActiveDeal')}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{t('dashboard.totalRevenue')}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                ${(totalRevenue / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-2 bg-cyan-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{completedDeals} invoiced jobs</p>
        </div>
      </div>

      {/* Charts Row 1: Pipeline Funnel & Revenue by Source */}
      {deals.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Charts will appear once you add your first job</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Charts will appear once you add your first job</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pipeline Funnel Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t('dashboard.pipelineFunnel')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={pipelineData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(PIPELINE_STAGE_COLORS)[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* {t('dashboard.revenueBySource')} Pie Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Revenue by Lead Source
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${(value / 1000).toFixed(1)}k`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBySourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(RING_COLORS)[index]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(Number(value) / 1000).toFixed(1)}k`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Charts Row 2: Monthly Trend & Stage Duration */}
      {deals.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Charts will appear once you add your first job</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">Charts will appear once you add your first job</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* {t('dashboard.monthlyRevenue')} */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Monthly Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Job Stage Duration */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              {t('dashboard.stageDuration')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageDurationData} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="days" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Section: Recent Activity & Top Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t('dashboard.recentActivity')}</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.timeAgo}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.noRecentActivity')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Jobs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{t('dashboard.topDeals')}</h2>
          <div className="space-y-4">
            {topDeals.length > 0 ? (
              topDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {deal.contactName}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
                        {deal.stage.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      ${deal.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.noDealsYet')}</p>
                <Link href="/pipeline" className="text-sm text-[#27AE60] hover:underline mt-2 inline-block">
                  Add your first job →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button with Menu */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        {isFABExpanded && (
          <div className="absolute bottom-20 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => {
                setIsAddDealOpen(true);
                setIsFABExpanded(false);
              }}
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700"
            >
              <Zap className="w-4 h-4 text-purple-600" />
              {t('dashboard.addDeal')}
            </button>
            <button
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700"
            >
              <Target className="w-4 h-4 text-[#27AE60]" />
              {t('dashboard.addContact')}
            </button>
            <button
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3"
            >
              <Clock className="w-4 h-4 text-orange-600" />
              {t('dashboard.logActivity')}
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFABExpanded(!isFABExpanded)}
          className="bg-[#27AE60] hover:bg-[#229954] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Job Modal */}
      <Modal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        title="Add New Job"
      >
        <AddDealForm
          contacts={contacts}
          onClose={() => setIsAddDealOpen(false)}
        />
      </Modal>
    </div>
  );
}
