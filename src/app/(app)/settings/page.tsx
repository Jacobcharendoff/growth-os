'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import {
  Settings,
  Users,
  Zap,
  Package,
  Bell,
  CreditCard,
  Building2,
  Mail,
  Phone,
  MapPin,
  Upload,
  GripHorizontal,
  Check,
  AlertCircle,
  ExternalLink,
  ToggleLeft,
} from 'lucide-react';

type TabType = 'profile' | 'team' | 'pipeline' | 'integrations' | 'notifications' | 'billing';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'technician';
  status: 'active' | 'inactive';
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not_connected';
  url: string;
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@company.com',
    role: 'owner',
    status: 'active',
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    email: 'marcus@company.com',
    role: 'manager',
    status: 'active',
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah@company.com',
    role: 'technician',
    status: 'active',
  },
  {
    id: '4',
    name: 'James Rodriguez',
    email: 'james@company.com',
    role: 'technician',
    status: 'inactive',
  },
];

const MOCK_PIPELINE: PipelineStage[] = [
  { id: '1', name: 'New Lead', color: 'blue', order: 1 },
  { id: '2', name: 'Contacted', color: 'slate', order: 2 },
  { id: '3', name: 'Estimate Scheduled', color: 'purple', order: 3 },
  { id: '4', name: 'Estimate Sent', color: 'indigo', order: 4 },
  { id: '5', name: 'Booked', color: 'cyan', order: 5 },
  { id: '6', name: 'In Progress', color: 'amber', order: 6 },
  { id: '7', name: 'Completed', color: 'emerald', order: 7 },
  { id: '8', name: 'Invoiced', color: 'green', order: 8 },
];

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: '1',
    name: 'QuickBooks',
    description: 'Sync invoices and financial data',
    icon: '📊',
    status: 'connected',
    url: 'https://quickbooks.intuit.com',
  },
  {
    id: '2',
    name: 'Stripe',
    description: 'Accept payments online',
    icon: '💳',
    status: 'connected',
    url: 'https://stripe.com',
  },
  {
    id: '3',
    name: 'Twilio',
    description: 'Send SMS notifications',
    icon: '📱',
    status: 'not_connected',
    url: 'https://twilio.com',
  },
  {
    id: '4',
    name: 'Google Calendar',
    description: 'Schedule and manage appointments',
    icon: '📅',
    status: 'not_connected',
    url: 'https://calendar.google.com',
  },
  {
    id: '5',
    name: 'Zapier',
    description: 'Automate workflows',
    icon: '⚡',
    status: 'connected',
    url: 'https://zapier.com',
  },
  {
    id: '6',
    name: 'SendGrid',
    description: 'Send professional emails',
    icon: '✉️',
    status: 'not_connected',
    url: 'https://sendgrid.com',
  },
];

export default function SettingsPage() {
  const { initializeSeedData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(MOCK_PIPELINE);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);

  const [companyData, setCompanyData] = useState({
    businessName: 'ProPlumbers Inc.',
    phone: '(720) 555-0123',
    email: 'info@proplumbers.com',
    address: '1234 Main St, Denver, CO 80202',
    industry: 'plumbing',
    timezone: 'America/Denver',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailEstimates: true,
    emailInvoices: true,
    emailReminders: true,
    smsUpdates: false,
    smsReminders: true,
    pushNotifications: true,
  });

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) return <div className="p-8">Loading...</div>;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Company Profile', icon: <Building2 className="w-5 h-5" /> },
    { id: 'team', label: 'Team Members', icon: <Users className="w-5 h-5" /> },
    { id: 'pipeline', label: 'Pipeline Settings', icon: <Zap className="w-5 h-5" /> },
    { id: 'integrations', label: 'Integrations', icon: <Package className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
  ];

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-slate-900" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
        </div>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-blue-600 text-blue-600 bg-blue-50'
                  : 'border-b-transparent text-slate-700 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-8">
          {/* Company Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={companyData.businessName}
                      onChange={(e) =>
                        setCompanyData({ ...companyData, businessName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={companyData.phone}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, phone: e.target.value })
                        }
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={companyData.email}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, email: e.target.value })
                        }
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={companyData.address}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, address: e.target.value })
                        }
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Industry
                    </label>
                    <select
                      value={companyData.industry}
                      onChange={(e) =>
                        setCompanyData({ ...companyData, industry: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="hvac">HVAC</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={companyData.timezone}
                      onChange={(e) =>
                        setCompanyData({ ...companyData, timezone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="America/New_York">Eastern</option>
                      <option value="America/Chicago">Central</option>
                      <option value="America/Denver">Mountain</option>
                      <option value="America/Los_Angeles">Pacific</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Logo</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  Save Changes
                </button>
                <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Team Members
                </h3>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  Add Team Member
                </button>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full capitalize">
                          {member.role}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            member.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {member.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm border border-rose-300 text-rose-600 rounded hover:bg-rose-50 transition">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline Settings Tab */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Pipeline Stages</h3>
              <div className="space-y-3">
                {pipelineStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 hover:bg-slate-50 transition group"
                  >
                    <button className="cursor-move opacity-0 group-hover:opacity-100 transition">
                      <GripHorizontal className="w-5 h-5 text-slate-400" />
                    </button>
                    <div
                      className={`w-4 h-4 rounded-full bg-${stage.color}-500`}
                    />
                    <input
                      type="text"
                      value={stage.name}
                      onChange={(e) => {
                        const updated = [...pipelineStages];
                        updated[index].name = e.target.value;
                        setPipelineStages(updated);
                      }}
                      className="flex-1 bg-transparent font-medium text-slate-900 focus:outline-none border-b border-transparent hover:border-slate-300 focus:border-blue-500"
                    />
                    <button className="text-sm px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 transition">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transition">
                + Add Stage
              </button>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Connected Apps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="p-6 border border-slate-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{integration.icon}</span>
                      {integration.status === 'connected' ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3" />
                          Connected
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Not Connected
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      {integration.name}
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      {integration.description}
                    </p>
                    <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition flex items-center justify-center gap-2">
                      {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      key: 'emailEstimates',
                      label: 'Estimate notifications',
                      description: 'Get notified when estimates are sent or viewed',
                    },
                    {
                      key: 'emailInvoices',
                      label: 'Invoice notifications',
                      description: 'Get notified when invoices are sent or paid',
                    },
                    {
                      key: 'emailReminders',
                      label: 'Reminder notifications',
                      description: 'Get daily reminders about pending tasks',
                    },
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{label}</p>
                        <p className="text-sm text-slate-600">{description}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key as keyof typeof notificationSettings]:
                              !notificationSettings[key as keyof typeof notificationSettings],
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          notificationSettings[key as keyof typeof notificationSettings]
                            ? 'bg-blue-600'
                            : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            notificationSettings[key as keyof typeof notificationSettings]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  SMS & Push Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      key: 'smsUpdates',
                      label: 'SMS updates',
                      description: 'Receive job updates via SMS',
                    },
                    {
                      key: 'smsReminders',
                      label: 'SMS reminders',
                      description: 'Get SMS reminders for upcoming appointments',
                    },
                    {
                      key: 'pushNotifications',
                      label: 'Push notifications',
                      description: 'Receive browser push notifications',
                    },
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{label}</p>
                        <p className="text-sm text-slate-600">{description}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key as keyof typeof notificationSettings]:
                              !notificationSettings[key as keyof typeof notificationSettings],
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          notificationSettings[key as keyof typeof notificationSettings]
                            ? 'bg-blue-600'
                            : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            notificationSettings[key as keyof typeof notificationSettings]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Growth Plan</h3>
                    <p className="text-slate-600 mt-1">Your current plan</p>
                  </div>
                  <span className="text-4xl font-bold text-blue-600">$149</span>
                </div>
                <p className="text-slate-700 mb-6">/month, billed annually at $1,788</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-5 h-5 text-emerald-500" />
                    Up to 5 users
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-5 h-5 text-emerald-500" />
                    Unlimited estimates & invoices
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-5 h-5 text-emerald-500" />
                    Advanced scheduling
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white transition">
                    Upgrade Plan
                  </button>
                  <button className="px-6 py-2 text-slate-600 hover:text-slate-900 transition">
                    Change Payment Method
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Usage This Month
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Estimates Created</p>
                    <p className="text-2xl font-bold text-slate-900">24<span className="text-sm text-slate-500">/∞</span></p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Invoices Created</p>
                    <p className="text-2xl font-bold text-slate-900">18<span className="text-sm text-slate-500">/∞</span></p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Team Members</p>
                    <p className="text-2xl font-bold text-slate-900">4<span className="text-sm text-slate-500">/5</span></p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">API Calls</p>
                    <p className="text-2xl font-bold text-slate-900">12.3k<span className="text-sm text-slate-500">/100k</span></p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Billing History
                </h3>
                <div className="space-y-2">
                  {[
                    { date: 'March 1, 2026', amount: '$149.00', status: 'Paid' },
                    { date: 'February 1, 2026', amount: '$149.00', status: 'Paid' },
                    { date: 'January 1, 2026', amount: '$149.00', status: 'Paid' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                      <div>
                        <p className="font-medium text-slate-900">{invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-slate-900">{invoice.amount}</span>
                        <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
