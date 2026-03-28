'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { KPICard } from '@/components/KPICard';
import { Modal } from '@/components/Modal';
import { AddDealForm } from '@/components/AddDealForm';
import { Plus, TrendingUp, DollarSign, Zap, Target, Activity } from 'lucide-react';

export default function Dashboard() {
  const { contacts, deals, activities, initializeSeedData, getActivities } = useStore();
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
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
  const totalCustomers = contacts.filter((c) => c.type === 'customer').length;
  const activeDeals = deals.filter(
    (d) => d.stage !== 'completed' && d.stage !== 'invoiced'
  ).length;
  const pipelineValue = deals
    .filter((d) => d.stage !== 'completed' && d.stage !== 'invoiced')
    .reduce((sum, d) => sum + d.value, 0);
  const completedDeals = deals.filter((d) => d.stage === 'invoiced').length;
  const conversionRate =
    deals.length > 0
      ? Math.round((completedDeals / deals.length) * 100)
      : 0;
  const avgDealValue = deals.length > 0 ? Math.round(pipelineValue / activeDeals) : 0;

  // Lead source breakdown
  const ring1 = deals.filter((d) =>
    ['existing_customer', 'reactivation', 'cross_sell'].includes(d.source)
  ).length;
  const ring2 = deals.filter((d) =>
    ['referral', 'review', 'neighborhood'].includes(d.source)
  ).length;
  const ring3 = deals.filter((d) =>
    ['google_lsa', 'seo', 'gbp'].includes(d.source)
  ).length;

  const recentActivities = getActivities(5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your pipeline overview.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          label="Total Leads"
          value={totalLeads}
          icon={<Target className="w-6 h-6" />}
          trend={12}
        />
        <KPICard
          label="Active Deals"
          value={activeDeals}
          icon={<Zap className="w-6 h-6" />}
          trend={8}
        />
        <KPICard
          label="Pipeline Value"
          value={`$${(pipelineValue / 1000).toFixed(1)}k`}
          icon={<DollarSign className="w-6 h-6" />}
          trend={15}
        />
        <KPICard
          label="Avg Deal Value"
          value={`$${avgDealValue.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <KPICard
          label="Conversion Rate"
          value={conversionRate}
          suffix="%"
          icon={<Activity className="w-6 h-6" />}
          trend={5}
        />
        <KPICard
          label="Total Customers"
          value={totalCustomers}
          icon={<Target className="w-6 h-6" />}
          trend={18}
        />
      </div>

      {/* Funnel & Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline Funnel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Pipeline Funnel
          </h2>
          <div className="space-y-4">
            {[
              { stage: 'New Leads', count: deals.filter((d) => d.stage === 'new_lead').length },
              { stage: 'Contacted', count: deals.filter((d) => d.stage === 'contacted').length },
              { stage: 'Estimate Sent', count: deals.filter((d) => d.stage === 'estimate_sent').length },
              { stage: 'Booked', count: deals.filter((d) => d.stage === 'booked').length },
              { stage: 'In Progress', count: deals.filter((d) => d.stage === 'in_progress').length },
              { stage: 'Completed', count: deals.filter((d) => d.stage === 'completed').length },
            ].map(({ stage, count }) => {
              const percentage = deals.length > 0 ? (count / deals.length) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {stage}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Lead Source Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Ring 1 (High-Quality)
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{ring1}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      ring1 + ring2 + ring3 > 0
                        ? (ring1 / (ring1 + ring2 + ring3)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Ring 2 (Community)
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{ring2}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      ring1 + ring2 + ring3 > 0
                        ? (ring2 / (ring1 + ring2 + ring3)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Ring 3 (Paid Channels)
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{ring3}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      ring1 + ring2 + ring3 > 0
                        ? (ring3 / (ring1 + ring2 + ring3)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No recent activity</p>
          )}
        </div>
      </div>

      {/* Add Deal Button */}
      <button
        onClick={() => setIsAddDealOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-6 h-6" />
      </button>

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
