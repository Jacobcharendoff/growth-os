'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { Deal, Invoice, Estimate, Contact } from '@/types';

type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface StageData {
  stage: string;
  count: number;
  color: string;
}

interface SourceData {
  source: string;
  count: number;
}

interface EstimateConversionData {
  status: string;
  percentage: number;
}

interface TopService {
  name: string;
  revenue: number;
  count: number;
}

interface AgingEstimate {
  id: string;
  number: string;
  customerName: string;
  service: string;
  sentDaysAgo: number;
  amount: number;
}

interface OutstandingInvoice {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  daysOverdue: number;
}

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { contacts, deals, invoices, estimates, initializeSeedData } = useStore();

  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('month');

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'} p-8 animate-pulse`}>
        <div className={`h-8 ${isDark ? 'bg-slate-700' : 'bg-gray-200'} rounded w-48 mb-6`}></div>
      </div>
    );
  }

  // Helper: Get date range in milliseconds
  const getDateRangeMs = (range: DateRange): number => {
    const now = Date.now();
    switch (range) {
      case 'week': return now - 7 * 86400000;
      case 'month': return now - 30 * 86400000;
      case 'quarter': return now - 90 * 86400000;
      case 'year': return now - 365 * 86400000;
      case 'all': return 0;
    }
  };

  const rangeStart = getDateRangeMs(dateRange);

  // Filter data by date range
  const filteredDeals = deals.filter(d => d.createdAt >= rangeStart);
  const filteredInvoices = invoices.filter(inv => inv.createdAt >= rangeStart);
  const filteredEstimates = estimates.filter(e => e.createdAt >= rangeStart);

  // ===== KPI CALCULATIONS =====
  const totalRevenue = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pipelineValue = filteredDeals
    .filter(d => d.stage !== 'completed' && d.stage !== 'invoiced')
    .reduce((sum, d) => sum + d.value, 0);

  const totalLeads = contacts.filter(c => c.type === 'lead').length;
  const dealsWon = filteredDeals.filter(d => d.stage === 'completed' || d.stage === 'invoiced').length;
  const conversionRate = totalLeads > 0 ? Math.round((dealsWon / totalLeads) * 100) : 0;

  const avgJobValue = filteredDeals.length > 0
    ? Math.round(filteredDeals.reduce((sum, d) => sum + d.value, 0) / filteredDeals.length)
    : 0;

  // ===== CHART DATA CALCULATIONS =====

  // Monthly Revenue (last 6 months)
  const getMonthlyRevenue = (): MonthlyRevenue[] => {
    const months: Record<string, number> = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }

    // Add revenue
    filteredInvoices.forEach(inv => {
      if (inv.status === 'paid') {
        const date = new Date(inv.createdAt);
        const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (months.hasOwnProperty(key)) {
          months[key] += inv.total;
        }
      }
    });

    return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
  };

  const monthlyRevenue = getMonthlyRevenue();

  // Pipeline by Stage
  const getPipelineByStage = (): StageData[] => {
    const stages = [
      { stage: 'new_lead', label: 'New Lead', color: '#3B82F6' },
      { stage: 'contacted', label: 'Contacted', color: '#8B5CF6' },
      { stage: 'estimate_scheduled', label: 'Est. Scheduled', color: '#F59E0B' },
      { stage: 'estimate_sent', label: 'Est. Sent', color: '#EF4444' },
      { stage: 'booked', label: 'Booked', color: '#10B981' },
      { stage: 'in_progress', label: 'In Progress', color: '#06B6D4' },
      { stage: 'completed', label: 'Completed', color: '#22C55E' },
      { stage: 'invoiced', label: 'Invoiced', color: '#6366F1' },
    ];

    return stages
      .map(s => ({
        stage: s.label,
        count: filteredDeals.filter(d => d.stage === s.stage).length,
        color: s.color,
      }))
      .filter(s => s.count > 0);
  };

  const stageData = getPipelineByStage();

  // Lead Sources
  const getLeadSources = (): SourceData[] => {
    const sourceMap: Record<string, number> = {};
    contacts.forEach(c => {
      sourceMap[c.source] = (sourceMap[c.source] || 0) + 1;
    });

    return Object.entries(sourceMap)
      .map(([source, count]) => ({
        source: source.replace(/_/g, ' ').toUpperCase(),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const leadSources = getLeadSources();

  // Estimate Conversion Funnel
  const getEstimateConversion = (): EstimateConversionData[] => {
    const total = filteredEstimates.length || 1;
    const sent = filteredEstimates.filter(e => e.status !== 'draft').length;
    const viewed = filteredEstimates.filter(e => e.viewedAt).length;
    const approved = filteredEstimates.filter(e => e.status === 'approved').length;
    const rejected = filteredEstimates.filter(e => e.status === 'rejected').length;

    return [
      { status: 'Sent', percentage: Math.round((sent / total) * 100) },
      { status: 'Viewed', percentage: Math.round((viewed / total) * 100) },
      { status: 'Approved', percentage: Math.round((approved / total) * 100) },
      { status: 'Declined', percentage: Math.round((rejected / total) * 100) },
    ];
  };

  const estimateConversion = getEstimateConversion();

  // Top Services
  const getTopServices = (): TopService[] => {
    const serviceMap: Record<string, { revenue: number; count: number }> = {};
    filteredInvoices.forEach(inv => {
      if (inv.status === 'paid') {
        inv.lineItems.forEach(item => {
          if (!serviceMap[item.description]) {
            serviceMap[item.description] = { revenue: 0, count: 0 };
          }
          serviceMap[item.description].revenue += item.quantity * item.unitPrice;
          serviceMap[item.description].count += 1;
        });
      }
    });

    return Object.entries(serviceMap)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topServices = getTopServices();

  // Aging Estimates
  const getAgingEstimates = (): AgingEstimate[] => {
    return estimates
      .filter(e => (e.status === 'sent' || e.status === 'viewed') && e.sentAt)
      .map(e => ({
        id: e.id,
        number: e.number,
        customerName: e.customerName,
        service: e.service,
        sentDaysAgo: Math.floor((Date.now() - (e.sentAt || 0)) / 86400000),
        amount: e.tiers[0]?.price || 0,
      }))
      .sort((a, b) => b.sentDaysAgo - a.sentDaysAgo);
  };

  const agingEstimates = getAgingEstimates();

  // Outstanding Invoices
  const getOutstandingInvoices = (): OutstandingInvoice[] => {
    return invoices
      .filter(inv => inv.status !== 'paid')
      .map(inv => ({
        id: inv.id,
        number: inv.number,
        customerName: inv.customerName,
        amount: inv.total - inv.amountPaid,
        daysOverdue: Math.max(0, Math.floor((Date.now() - inv.dueDate) / 86400000)),
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const outstandingInvoices = getOutstandingInvoices();

  // ===== CSV EXPORT =====
  const exportToCSV = () => {
    const data: string[] = [];

    // KPI Summary
    data.push('KPI Summary');
    data.push(`Total Revenue,$${totalRevenue.toFixed(2)}`);
    data.push(`Pipeline Value,$${pipelineValue.toFixed(2)}`);
    data.push(`Conversion Rate,${conversionRate}%`);
    data.push(`Average Job Value,$${avgJobValue.toFixed(2)}`);
    data.push('');

    // Top Services
    data.push('Top Performing Services');
    data.push('Service,Revenue,Count');
    topServices.forEach(s => {
      data.push(`"${s.name}",$${s.revenue.toFixed(2)},${s.count}`);
    });
    data.push('');

    // Aging Estimates
    data.push('Aging Estimates');
    data.push('Estimate #,Customer,Service,Days Since Sent,Amount');
    agingEstimates.forEach(e => {
      data.push(`${e.number},"${e.customerName}","${e.service}",${e.sentDaysAgo},$${e.amount.toFixed(2)}`);
    });
    data.push('');

    // Outstanding Invoices
    data.push('Outstanding Invoices');
    data.push('Invoice #,Customer,Outstanding Amount,Days Overdue');
    outstandingInvoices.forEach(inv => {
      data.push(`${inv.number},"${inv.customerName}",$${inv.amount.toFixed(2)},${inv.daysOverdue}`);
    });

    const csv = data.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Color utilities for dark mode
  const cardBg = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const cardText = isDark ? 'text-slate-300' : 'text-gray-600';
  const tableBg = isDark ? 'bg-slate-800' : 'bg-white';
  const tableRow = isDark ? 'border-slate-700' : 'border-gray-200';
  const tableText = isDark ? 'text-slate-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm bg-opacity-80`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8" style={{ color: '#27AE60' }} />
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reports & Analytics</h1>
                <p className={`text-sm ${cardText}`}>Business performance metrics and insights</p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#27AE60] text-white hover:bg-[#229954] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Date Range Controls */}
          <div className="flex items-center gap-2 mt-6">
            <Calendar className={`w-4 h-4 ${cardText}`} />
            <div className="flex gap-2">
              {(['week', 'month', 'quarter', 'year', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    dateRange === range
                      ? 'bg-[#27AE60] text-white'
                      : isDark
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {range === 'week' && 'This Week'}
                  {range === 'month' && 'This Month'}
                  {range === 'quarter' && 'This Quarter'}
                  {range === 'year' && 'This Year'}
                  {range === 'all' && 'All Time'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {/* Total Revenue */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <p className={`text-sm font-medium ${cardText} mb-2`}>Total Revenue</p>
            <p className="text-3xl font-bold text-[#27AE60]">${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className={`text-xs ${cardText} mt-2`}>Paid invoices</p>
          </div>

          {/* Pipeline Value */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <p className={`text-sm font-medium ${cardText} mb-2`}>Pipeline Value</p>
            <p className="text-3xl font-bold text-[#3B82F6]">${pipelineValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className={`text-xs ${cardText} mt-2`}>{filteredDeals.filter(d => d.stage !== 'completed' && d.stage !== 'invoiced').length} active deals</p>
          </div>

          {/* Conversion Rate */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <p className={`text-sm font-medium ${cardText} mb-2`}>Conversion Rate</p>
            <p className="text-3xl font-bold text-[#F59E0B]">{conversionRate}%</p>
            <p className={`text-xs ${cardText} mt-2`}>{dealsWon} of {totalLeads} leads</p>
          </div>

          {/* Average Job Value */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <p className={`text-sm font-medium ${cardText} mb-2`}>Avg Job Value</p>
            <p className="text-3xl font-bold text-[#10B981]">${avgJobValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className={`text-xs ${cardText} mt-2`}>Based on {filteredDeals.length} deals</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Revenue Over Time */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Revenue Over Time (6 months)</h2>
            <div className="flex items-end gap-2 h-64">
              {monthlyRevenue.map((item, idx) => {
                const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
                const heightPercent = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-[#27AE60] to-[#229954] rounded-t opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      title={`$${item.revenue.toFixed(0)}`}
                    />
                    <span className={`text-xs ${cardText} mt-2 text-center`}>{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline by Stage */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Pipeline by Stage</h2>
            <div className="space-y-3 h-64 overflow-y-auto">
              {stageData.map((item, idx) => {
                const maxCount = Math.max(...stageData.map(s => s.count), 1);
                const widthPercent = (item.count / maxCount) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{item.stage}</span>
                      <span className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{item.count}</span>
                    </div>
                    <div className={`${isDark ? 'bg-slate-700' : 'bg-gray-200'} rounded h-2 overflow-hidden`}>
                      <div
                        className="h-full rounded transition-all"
                        style={{ width: `${widthPercent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Sources Pie Chart */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Lead Sources Distribution</h2>
            <div className="flex items-center justify-center h-64">
              <svg viewBox="0 0 200 200" className="w-40 h-40">
                {leadSources.length > 0 ? (
                  (() => {
                    const colors = ['#27AE60', '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#06B6D4', '#22C55E', '#6366F1'];
                    const total = leadSources.reduce((sum, s) => sum + s.count, 0);
                    let currentAngle = -90;

                    return leadSources.map((item, idx) => {
                      const sliceAngle = (item.count / total) * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + sliceAngle;

                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const x1 = 100 + 80 * Math.cos(startRad);
                      const y1 = 100 + 80 * Math.sin(startRad);
                      const x2 = 100 + 80 * Math.cos(endRad);
                      const y2 = 100 + 80 * Math.sin(endRad);

                      const largeArc = sliceAngle > 180 ? 1 : 0;
                      const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

                      currentAngle = endAngle;

                      return (
                        <g key={idx}>
                          <path d={path} fill={colors[idx % colors.length]} opacity="0.8" />
                        </g>
                      );
                    });
                  })()
                ) : (
                  <text x="100" y="100" textAnchor="middle" fill={isDark ? '#94a3b8' : '#9ca3af'}>
                    No data
                  </text>
                )}
              </svg>
              <div className="ml-6 space-y-2">
                {leadSources.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: ['#27AE60', '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#06B6D4', '#22C55E', '#6366F1'][idx % 8],
                      }}
                    />
                    <span className={`text-xs ${cardText}`}>{item.source}: {item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Estimate Conversion Funnel */}
          <div className={`${cardBg} border rounded-xl p-6`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Estimate Conversion Funnel</h2>
            <div className="space-y-3 h-64 flex flex-col justify-center">
              {estimateConversion.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{item.status}</span>
                    <span className="text-sm font-bold text-[#27AE60]">{item.percentage}%</span>
                  </div>
                  <div className={`${isDark ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
                    <div
                      className="h-full rounded-full transition-all bg-gradient-to-r from-[#27AE60] to-[#229954]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Top Performing Services */}
          <div className={`${cardBg} border rounded-xl overflow-hidden`}>
            <div className="px-6 py-4 border-b border-inherit bg-opacity-50">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Performing Services</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Service</th>
                    <th className="px-4 py-2 text-right font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topServices.length > 0 ? (
                    topServices.map((service, idx) => (
                      <tr key={idx} className={`border-t ${tableRow}`}>
                        <td className={`px-4 py-3 ${tableText}`}>
                          <div className="truncate text-xs">{service.name}</div>
                        </td>
                        <td className="px-4 py-3 text-right text-[#27AE60] font-semibold">${service.revenue.toFixed(0)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className={`border-t ${tableRow}`}>
                      <td colSpan={2} className={`px-4 py-3 ${cardText} text-center text-xs`}>No data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Aging Estimates */}
          <div className={`${cardBg} border rounded-xl overflow-hidden`}>
            <div className="px-6 py-4 border-b border-inherit bg-opacity-50">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Aging Estimates</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Est. #</th>
                    <th className="px-4 py-2 text-right font-semibold">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {agingEstimates.length > 0 ? (
                    agingEstimates.slice(0, 5).map((est, idx) => (
                      <tr key={idx} className={`border-t ${tableRow}`}>
                        <td className={`px-4 py-3 ${tableText}`}>
                          <div className="truncate text-xs font-mono">{est.number}</div>
                          <div className="truncate text-xs">{est.customerName}</div>
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${est.sentDaysAgo > 7 ? 'text-red-500' : 'text-orange-500'}`}>
                          {est.sentDaysAgo}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={`border-t ${tableRow}`}>
                      <td colSpan={2} className={`px-4 py-3 ${cardText} text-center text-xs`}>No aging estimates</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outstanding Invoices */}
          <div className={`${cardBg} border rounded-xl overflow-hidden`}>
            <div className="px-6 py-4 border-b border-inherit bg-opacity-50">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Outstanding Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}>
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Inv. #</th>
                    <th className="px-4 py-2 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {outstandingInvoices.length > 0 ? (
                    outstandingInvoices.slice(0, 5).map((inv, idx) => (
                      <tr key={idx} className={`border-t ${tableRow}`}>
                        <td className={`px-4 py-3 ${tableText}`}>
                          <div className="truncate text-xs font-mono">{inv.number}</div>
                          <div className="truncate text-xs">{inv.customerName}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-semibold text-[#27AE60]">${inv.amount.toFixed(0)}</div>
                          {inv.daysOverdue > 0 && <div className="text-xs text-red-500">{inv.daysOverdue}d overdue</div>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={`border-t ${tableRow}`}>
                      <td colSpan={2} className={`px-4 py-3 ${cardText} text-center text-xs`}>All paid up!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
