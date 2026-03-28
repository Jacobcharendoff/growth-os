'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
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
  Rocket,
  ArrowRight,
  ChevronRight,
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
  const { contacts, deals, activities, initializeSeedData, getActivities } = useStore();
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isFABExpanded, setIsFABExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>(
    'month'
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

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

  const Phone = AlertCircle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header with Date Range */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 mb-4">
          Welcome back! Here's your business at a glance.
        </p>

        {/* Date Range Selector */}
        <div className="flex gap-2 flex-wrap">
          {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === range
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {range === 'today' && 'Today'}
              {range === 'week' && 'This Week'}
              {range === 'month' && 'This Month'}
              {range === 'quarter' && 'This Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Onboarding Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Finish setting up Growth OS</h3>
              <p className="text-blue-100 text-sm">Complete your setup to unlock the full power of autopilot. Takes about 15 minutes.</p>
            </div>
          </div>
          <Link
            href="/setup"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shrink-0 text-sm"
          >
            Continue Setup
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {/* Total Leads */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Leads</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalLeads}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
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

        {/* Active Deals */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Deals</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{activeDeals}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">In progress</p>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Pipeline Value</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                ${(pipelineValue / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">{activeDeals} active opportunities</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{conversionRate}%</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {completedDeals} of {deals.length} closed
          </p>
        </div>

        {/* Avg Deal Value */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Deal Value</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                ${avgDealValue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Per active deal</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                ${(totalRevenue / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="p-2 bg-cyan-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500">{completedDeals} invoiced deals</p>
        </div>
      </div>

      {/* Charts Row 1: Pipeline Funnel & Revenue by Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline Funnel Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Pipeline Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={pipelineData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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

        {/* Revenue by Lead Source Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
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

      {/* Charts Row 2: Monthly Trend & Stage Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
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
              <CartesianGrid strokeDasharray="3 3" />
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

        {/* Deal Stage Duration */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Stage Duration (Avg Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageDurationData} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="days" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Top Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{activity.timeAgo}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>

        {/* Top Deals */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Top Deals</h2>
          <div className="space-y-4">
            {topDeals.length > 0 ? (
              topDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {deal.contactName}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {deal.stage.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      ${deal.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No deals yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button with Menu */}
      <div className="fixed bottom-8 right-8 z-50">
        {isFABExpanded && (
          <div className="absolute bottom-20 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => {
                setIsAddDealOpen(true);
                setIsFABExpanded(false);
              }}
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100"
            >
              <Zap className="w-4 h-4 text-purple-600" />
              Add Deal
            </button>
            <button
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100"
            >
              <Target className="w-4 h-4 text-blue-600" />
              Add Contact
            </button>
            <button
              className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
            >
              <Clock className="w-4 h-4 text-orange-600" />
              Log Activity
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFABExpanded(!isFABExpanded)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        title="Add New Deal"
      >
        <AddDealForm
          contacts={contacts}
          onClose={() => setIsAddDealOpen(false)}
        />
      </Modal>
    </div>
  );
}
