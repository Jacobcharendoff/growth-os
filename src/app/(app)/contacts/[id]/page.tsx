'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { Contact, Deal, Activity, Estimate, Invoice } from '@/types';
import { LeadSourceBadge } from '@/components/LeadSourceBadge';
import {
  ChevronLeft,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone as CallIcon,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'overview' | 'jobs-estimates' | 'invoices-payments';

const ACTIVITY_ICONS = {
  call: CallIcon,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  estimate: FileText,
  payment: DollarSign,
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    getContact,
    getDealsByContact,
    getEstimatesByContact,
    getInvoicesByContact,
    deleteContact,
    updateContact,
    activities,
    initializeSeedData,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contactActivities, setContactActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, [initializeSeedData]);

  useEffect(() => {
    if (mounted && id) {
      const foundContact = getContact(id);
      setContact(foundContact || null);

      if (foundContact) {
        const relatedDeals = getDealsByContact(id);
        setDeals(relatedDeals);

        const relatedEstimates = getEstimatesByContact(id);
        setEstimates(relatedEstimates);

        const relatedInvoices = getInvoicesByContact(id);
        setInvoices(relatedInvoices);

        const relatedActivities = activities.filter((a) => a.contactId === id);
        setContactActivities(relatedActivities.sort((a, b) => b.createdAt - a.createdAt));

        setNotes(foundContact.notes);
      }
    }
  }, [mounted, id, getContact, getDealsByContact, getEstimatesByContact, getInvoicesByContact, activities]);

  const handleSaveNotes = async () => {
    if (!contact) return;
    setIsSavingNotes(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateContact(contact.id, { notes });
    setEditingNotes(false);
    setIsSavingNotes(false);
  };

  const handleDelete = () => {
    if (!contact || !window.confirm('Are you sure you want to delete this contact?')) return;
    deleteContact(contact.id);
    router.push('/contacts');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (type: string) => {
    if (type === 'customer') {
      return 'bg-emerald-500 text-white';
    }
    return 'bg-blue-500 text-white';
  };

  const calculateStats = () => {
    const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const totalInvoicesPaid = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amountPaid, 0);
    const activityCount = contactActivities.length;

    return { totalDealValue, totalInvoicesPaid, activityCount };
  };

  if (!mounted) {
    return (
      <div
        className={`p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} animate-pulse`}
      >
        <div
          className={`h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded w-48 mb-4`}
        ></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className={`h-full flex flex-col ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div
          className={`px-4 sm:px-8 py-4 sm:py-6 border-b ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}
        >
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 mb-4 ${
              isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Contacts
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p
              className={`text-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Contact not found
            </p>
            <Link
              href="/contacts"
              className={`${
                isDark
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              } mt-2 inline-block`}
            >
              Return to Contacts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const contactTypeColor =
    contact.type === 'customer'
      ? isDark
        ? 'bg-emerald-900 text-emerald-200'
        : 'bg-emerald-100 text-emerald-700'
      : isDark
      ? 'bg-blue-900 text-blue-200'
      : 'bg-blue-100 text-blue-700';

  return (
    <div
      className={`h-full flex flex-col ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 px-4 sm:px-8 py-4 sm:py-6 border-b ${
          isDark
            ? 'bg-slate-900 border-slate-700'
            : 'bg-white border-slate-200'
        } z-10`}
      >
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 mb-4 ${
            isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Contacts
        </button>
        <div className="flex items-center justify-between">
          <h1
            className={`text-2xl sm:text-3xl font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {contact.name}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/contacts/${id}/edit`)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400'
                  : 'hover:bg-slate-100 text-slate-600 hover:text-red-600'
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div
        className={`flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 grid gap-6 lg:grid-cols-3 xl:grid-cols-4`}
      >
        {/* Left Column - Contact Info Card */}
        <div
          className={`lg:col-span-1 ${
            isDark ? 'bg-slate-900' : 'bg-white'
          } rounded-xl p-6 shadow-sm border ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          } h-fit`}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${getAvatarColor(
                contact.type
              )}`}
            >
              {getInitials(contact.name)}
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-center">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${contactTypeColor}`}
              >
                {contact.type === 'customer' ? 'Customer' : 'Lead'}
              </span>
            </div>
            <div className="flex justify-center">
              <LeadSourceBadge source={contact.source} variant="full" />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 border-t border-b dark:border-slate-700 border-slate-200 py-4 mb-4">
            <div>
              <p
                className={`text-xs font-semibold uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}
              >
                Email
              </p>
              <a
                href={`mailto:${contact.email}`}
                className={`flex items-center gap-2 ${
                  isDark
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                } text-sm font-medium break-all`}
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                {contact.email}
              </a>
            </div>

            <div>
              <p
                className={`text-xs font-semibold uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}
              >
                Phone
              </p>
              <a
                href={`tel:${contact.phone}`}
                className={`flex items-center gap-2 ${
                  isDark
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                } text-sm font-medium`}
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                {contact.phone}
              </a>
            </div>

            <div>
              <p
                className={`text-xs font-semibold uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}
              >
                Address
              </p>
              <p
                className={`flex items-start gap-2 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </p>
            </div>

            <div>
              <p
                className={`text-xs font-semibold uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}
              >
                Member Since
              </p>
              <p
                className={`flex items-center gap-2 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                {new Date(contact.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Tabbed Content */}
        <div
          className={`lg:col-span-2 xl:col-span-3 ${
            isDark ? 'bg-slate-900' : 'bg-white'
          } rounded-xl shadow-sm border ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          } overflow-hidden flex flex-col`}
        >
          {/* Tab Navigation */}
          <div
            className={`flex flex-wrap gap-0 border-b ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            } overflow-x-auto`}
          >
            {(['overview', 'jobs-estimates', 'invoices-payments'] as TabType[]).map(
              (tab) => {
                const tabLabels: Record<TabType, string> = {
                  'overview': 'Overview',
                  'jobs-estimates': 'Jobs & Estimates',
                  'invoices-payments': 'Invoices & Payments',
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? `border-emerald-500 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`
                        : `border-transparent ${
                            isDark
                              ? 'text-slate-400 hover:text-slate-300'
                              : 'text-slate-600 hover:text-slate-900'
                          }`
                    }`}
                  >
                    {tabLabels[tab]}
                  </button>
                );
              }
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? 'bg-slate-800' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className={`text-xs font-semibold uppercase ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        Total Deals Value
                      </p>
                      <DollarSign
                        className={`w-4 h-4 ${
                          isDark ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      ${stats.totalDealValue.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? 'bg-slate-800' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className={`text-xs font-semibold uppercase ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        Paid Invoices
                      </p>
                      <CheckCircle
                        className={`w-4 h-4 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      ${stats.totalInvoicesPaid.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? 'bg-slate-800' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className={`text-xs font-semibold uppercase ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        Activities
                      </p>
                      <BarChart3
                        className={`w-4 h-4 ${
                          isDark ? 'text-purple-400' : 'text-purple-600'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {stats.activityCount}
                    </p>
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                {contactActivities.length > 0 && (
                  <div>
                    <h3
                      className={`text-sm font-semibold mb-4 ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}
                    >
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {contactActivities.slice(0, 5).map((activity) => {
                        const IconComponent = ACTIVITY_ICONS[activity.type];
                        return (
                          <div key={activity.id} className="flex gap-3">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${
                                isDark ? 'bg-slate-800' : 'bg-slate-100'
                              }`}
                            >
                              <IconComponent
                                className={`w-4 h-4 ${
                                  isDark
                                    ? 'text-slate-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium capitalize ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {activity.type}
                              </p>
                              <p
                                className={`text-sm ${
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                } truncate`}
                              >
                                {activity.description}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDark ? 'text-slate-500' : 'text-slate-500'
                                } mt-1`}
                              >
                                {new Date(activity.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} pt-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`font-semibold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Notes
                    </h3>
                    {!editingNotes && (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className={`text-sm font-medium ${
                          isDark
                            ? 'text-blue-400 hover:text-blue-300'
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {editingNotes ? (
                    <div className="space-y-3">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg text-sm border ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        rows={6}
                        placeholder="Add notes about this contact..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingNotes(false);
                            setNotes(contact.notes);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                            isDark
                              ? 'border-slate-600 text-slate-300 hover:bg-slate-800'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveNotes}
                          disabled={isSavingNotes}
                          className={`px-3 py-2 rounded-lg text-sm font-medium text-white ${
                            isDark
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          } disabled:opacity-50`}
                        >
                          {isSavingNotes ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`whitespace-pre-wrap text-sm ${
                        isDark
                          ? 'text-slate-300'
                          : 'text-slate-700'
                      }`}
                    >
                      {notes || 'No notes yet. Click Edit to add notes about this contact.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Jobs & Estimates Tab */}
            {activeTab === 'jobs-estimates' && (
              <div className="space-y-6">
                {/* Deals Section */}
                <div>
                  <h3
                    className={`text-sm font-semibold mb-4 ${
                      isDark ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    Deals
                  </h3>
                  <div className="space-y-4">
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <Link
                          key={deal.id}
                          href={`/pipeline`}
                          className={`block p-4 rounded-lg border ${
                            isDark
                              ? 'border-slate-700 hover:bg-slate-800'
                              : 'border-slate-200 hover:bg-slate-50'
                          } transition-colors`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4
                              className={`font-semibold ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {deal.title}
                            </h4>
                            <p
                              className={`font-bold ${
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                              }`}
                            >
                              ${deal.value.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                isDark
                                  ? 'bg-slate-700 text-slate-200'
                                  : 'bg-slate-100 text-slate-700'
                              } capitalize`}
                            >
                              {deal.stage.replace(/_/g, ' ')}
                            </span>
                            <span
                              className={`text-xs ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}
                            >
                              {deal.assignedTo}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p
                        className={`text-center py-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        No deals found
                      </p>
                    )}
                  </div>
                </div>

                {/* Estimates Section */}
                <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} pt-6`}>
                  <h3
                    className={`text-sm font-semibold mb-4 ${
                      isDark ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    Estimates
                  </h3>
                  <div className="space-y-4">
                    {estimates.length > 0 ? (
                      estimates.map((estimate) => (
                        <div
                          key={estimate.id}
                          className={`p-4 rounded-lg border ${
                            isDark
                              ? 'border-slate-700'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4
                                className={`font-semibold ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {estimate.service}
                              </h4>
                              <p
                                className={`text-sm ${
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}
                              >
                                {estimate.number}
                              </p>
                            </div>
                            <span
                              className={`text-sm px-2 py-1 rounded ${
                                estimate.status === 'approved'
                                  ? isDark
                                    ? 'bg-emerald-900 text-emerald-200'
                                    : 'bg-emerald-100 text-emerald-700'
                                  : estimate.status === 'sent'
                                  ? isDark
                                    ? 'bg-blue-900 text-blue-200'
                                    : 'bg-blue-100 text-blue-700'
                                  : isDark
                                  ? 'bg-slate-700 text-slate-200'
                                  : 'bg-slate-100 text-slate-700'
                              } font-medium capitalize`}
                            >
                              {estimate.status}
                            </span>
                          </div>
                          {estimate.selectedTier && (
                            <p
                              className={`text-sm ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}
                            >
                              Tier: {estimate.selectedTier}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p
                        className={`text-center py-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        No estimates found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Invoices & Payments Tab */}
            {activeTab === 'invoices-payments' && (
              <div className="space-y-6">
                {/* Invoices Section */}
                <div>
                  <h3
                    className={`text-sm font-semibold mb-4 ${
                      isDark ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    Invoices
                  </h3>
                  <div className="space-y-4">
                    {invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className={`p-4 rounded-lg border ${
                            isDark
                              ? 'border-slate-700'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4
                                className={`font-semibold ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {invoice.number}
                              </h4>
                              <p
                                className={`text-sm ${
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}
                              >
                                {new Date(invoice.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                ${invoice.total.toLocaleString()}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded font-medium capitalize mt-1 inline-block ${
                                  invoice.status === 'paid'
                                    ? isDark
                                      ? 'bg-emerald-900 text-emerald-200'
                                      : 'bg-emerald-100 text-emerald-700'
                                    : invoice.status === 'overdue'
                                    ? isDark
                                      ? 'bg-red-900 text-red-200'
                                      : 'bg-red-100 text-red-700'
                                    : isDark
                                    ? 'bg-slate-700 text-slate-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {invoice.status}
                              </span>
                            </div>
                          </div>
                          <p
                            className={`text-sm ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            Paid: ${invoice.amountPaid.toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p
                        className={`text-center py-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        No invoices found
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Activity Section */}
                {contactActivities.some((a) => a.type === 'payment') && (
                  <div className={`border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} pt-6`}>
                    <h3
                      className={`text-sm font-semibold mb-4 ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}
                    >
                      Payment Activity
                    </h3>
                    <div className="space-y-3">
                      {contactActivities
                        .filter((a) => a.type === 'payment')
                        .slice(0, 10)
                        .map((activity) => {
                          const IconComponent = ACTIVITY_ICONS[activity.type];
                          return (
                            <div key={activity.id} className="flex gap-3">
                              <div
                                className={`p-2 rounded-lg flex-shrink-0 ${
                                  isDark ? 'bg-slate-800' : 'bg-slate-100'
                                }`}
                              >
                                <IconComponent
                                  className={`w-4 h-4 ${
                                    isDark
                                      ? 'text-slate-400'
                                      : 'text-slate-600'
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium capitalize ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                  }`}
                                >
                                  {activity.type}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                  } truncate`}
                                >
                                  {activity.description}
                                </p>
                                <p
                                  className={`text-xs ${
                                    isDark ? 'text-slate-500' : 'text-slate-500'
                                  } mt-1`}
                                >
                                  {new Date(activity.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
