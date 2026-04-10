'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { Deal, Activity, Estimate, Invoice, Contact } from '@/types';
import { PipelineStage } from '@/types';
import {
  ChevronLeft,
  Edit2,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Trophy,
  XCircle,
  FileText,
  Phone as CallIcon,
  Mail,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'overview' | 'activity' | 'estimates' | 'invoices' | 'notes';

const PIPELINE_STAGES: PipelineStage[] = [
  'new_lead',
  'contacted',
  'estimate_scheduled',
  'estimate_sent',
  'booked',
  'in_progress',
  'completed',
  'invoiced',
];

const STAGE_LABELS: Record<PipelineStage, string> = {
  new_lead: 'New Lead',
  contacted: 'Contacted',
  estimate_scheduled: 'Est. Scheduled',
  estimate_sent: 'Est. Sent',
  booked: 'Booked',
  in_progress: 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoiced',
};

const ACTIVITY_ICONS = {
  call: CallIcon,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  estimate: FileText,
  payment: DollarSign,
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    getDeal,
    getContact,
    getEstimatesByContact,
    getInvoicesByContact,
    deleteDeal,
    updateDeal,
    activities,
    initializeSeedData,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dealActivities, setDealActivities] = useState<Activity[]>([]);
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
      const foundDeal = getDeal(id);
      setDeal(foundDeal || null);

      if (foundDeal) {
        const relatedContact = getContact(foundDeal.contactId);
        setContact(relatedContact || null);

        const relatedEstimates = getEstimatesByContact(foundDeal.contactId);
        setEstimates(relatedEstimates);

        const relatedInvoices = getInvoicesByContact(foundDeal.contactId);
        setInvoices(relatedInvoices);

        const relatedActivities = activities.filter((a) => a.dealId === id);
        setDealActivities(relatedActivities.sort((a, b) => b.createdAt - a.createdAt));

        setNotes(foundDeal.notes || '');
      }
    }
  }, [mounted, id, getDeal, getContact, getEstimatesByContact, getInvoicesByContact, activities]);

  const handleSaveNotes = async () => {
    if (!deal) return;
    setIsSavingNotes(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateDeal(deal.id, { notes });
    setEditingNotes(false);
    setIsSavingNotes(false);
  };

  const handleDelete = () => {
    if (!deal || !window.confirm('Are you sure you want to delete this deal?')) return;
    deleteDeal(deal.id);
    router.push('/pipeline');
  };

  const handleMoveToNextStage = () => {
    if (!deal) return;
    const currentIndex = PIPELINE_STAGES.indexOf(deal.stage);
    if (currentIndex < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[currentIndex + 1];
      updateDeal(deal.id, { stage: nextStage });
      setDeal({ ...deal, stage: nextStage });
    }
  };

  const handleMarkAsWon = () => {
    if (!deal) return;
    updateDeal(deal.id, { stage: 'invoiced' });
    setDeal({ ...deal, stage: 'invoiced' });
  };

  const handleMarkAsLost = () => {
    if (!deal || !window.confirm('Mark this deal as lost?')) return;
    deleteDeal(deal.id);
    router.push('/pipeline');
  };

  const stageColors: Record<PipelineStage, string> = {
    new_lead: 'bg-blue-500',
    contacted: 'bg-slate-500',
    estimate_scheduled: 'bg-purple-500',
    estimate_sent: 'bg-indigo-500',
    booked: 'bg-cyan-500',
    in_progress: 'bg-amber-500',
    completed: 'bg-emerald-500',
    invoiced: 'bg-green-500',
  };

  const getCurrentStageIndex = () => deal ? PIPELINE_STAGES.indexOf(deal.stage) : -1;

  if (!mounted) {
    return (
      <div className={`p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} animate-pulse`}>
        <div className={`h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded w-48 mb-4`}></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className={`h-full flex flex-col ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className={`px-4 sm:px-8 py-4 sm:py-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 mb-4 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Pipeline
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Deal not found</p>
            <Link
              href="/pipeline"
              className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} mt-2 inline-block`}
            >
              Return to Pipeline
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stageIndex = getCurrentStageIndex();

  const dealValue = deal.value;
  const createdDate = new Date(deal.createdAt).toLocaleDateString();
  const scheduledDate = deal.scheduledDate ? new Date(deal.scheduledDate).toLocaleDateString() : null;

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div
        className={`sticky top-0 px-4 sm:px-8 py-4 sm:py-6 border-b ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        } z-10`}
      >
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 mb-4 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Pipeline
        </button>
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl sm:text-xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {deal.title}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/pipeline/${id}/edit`)}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400' : 'hover:bg-slate-100 text-slate-600 hover:text-red-600'
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage Progress Tracker */}
      <div className={`px-4 sm:px-8 py-6 border-b ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isCompleted = idx < stageIndex;
            const isCurrent = idx === stageIndex;
            const bgColor = isCurrent ? stageColors[stage] : isCompleted ? 'bg-emerald-500' : isDark ? 'bg-slate-700' : 'bg-slate-300';

            return (
              <div key={stage} className="flex items-center flex-1">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${bgColor} transition-all`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                {idx < PIPELINE_STAGES.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-emerald-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-center">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Current stage: <span className="font-semibold">{STAGE_LABELS[deal.stage]}</span>
          </p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className={`flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 grid gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4`}>
        {/* Left Column - Deal Info Card */}
        <div
          className={`lg:col-span-1 ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl p-6 shadow-sm border ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          } h-fit`}
        >
          {/* Stage Badge */}
          <div className="flex justify-center mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${stageColors[deal.stage]}`}>
              {STAGE_LABELS[deal.stage]}
            </span>
          </div>

          {/* Deal Value */}
          <div className="text-center mb-6 pb-6 border-b dark:border-slate-700 border-slate-200">
            <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>Deal Value</p>
            <p className={`text-xl sm:text-3xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              ${dealValue.toLocaleString()}
            </p>
          </div>

          {/* Contact Info */}
          {contact && (
            <div className="space-y-4 mb-6 pb-6 border-b dark:border-slate-700 border-slate-200">
              <div>
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>Contact</p>
                <Link
                  href={`/contacts/${contact.id}`}
                  className={`text-sm font-semibold ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {contact.name}
                </Link>
              </div>
            </div>
          )}

          {/* Deal Details */}
          <div className="space-y-3 mb-6">
            <div>
              <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Assigned To</p>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>{deal.assignedTo}</p>
            </div>

            <div>
              <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Lead Source</p>
              <p className={`text-sm capitalize ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>{deal.source.replace(/_/g, ' ')}</p>
            </div>

            <div>
              <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Created</p>
              <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                <Calendar className="w-4 h-4" />
                {createdDate}
              </p>
            </div>

            {scheduledDate && (
              <div>
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Scheduled Date</p>
                <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                  <Calendar className="w-4 h-4" />
                  {scheduledDate}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleMoveToNextStage}
              disabled={stageIndex >= PIPELINE_STAGES.length - 1}
              className={`w-full py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                stageIndex >= PIPELINE_STAGES.length - 1
                  ? isDark
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              Move to Next Stage
            </button>

            <button onClick={handleMarkAsWon} className="w-full py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors bg-emerald-600 hover:bg-emerald-700 text-white">
              <Trophy className="w-4 h-4" />
              Mark as Won
            </button>

            <button onClick={handleMarkAsLost} className="w-full py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors bg-red-600 hover:bg-red-700 text-white">
              <XCircle className="w-4 h-4" />
              Mark as Lost
            </button>
          </div>
        </div>

        {/* Right Column - Tabbed Content */}
        <div
          className={`lg:col-span-2 xl:col-span-3 ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl shadow-sm border ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          } overflow-hidden flex flex-col`}
        >
          {/* Tab Navigation */}
          <div
            className={`flex flex-wrap gap-0 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} overflow-x-auto`}
          >
            {(['overview', 'activity', 'estimates', 'invoices', 'notes'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? `border-emerald-500 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`
                    : `border-transparent ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Deal Value</p>
                      <DollarSign className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${dealValue.toLocaleString()}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Current Stage</p>
                      <AlertCircle className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {STAGE_LABELS[deal.stage]}
                    </p>
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                {dealActivities.length > 0 && (
                  <div>
                    <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {dealActivities.slice(0, 5).map((activity) => {
                        const IconComponent = ACTIVITY_ICONS[activity.type];
                        return (
                          <div key={activity.id} className="flex gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                              <IconComponent className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {activity.type}
                              </p>
                              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} truncate`}>
                                {activity.description}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mt-1`}>
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

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                {dealActivities.length > 0 ? (
                  dealActivities.map((activity, index) => {
                    const IconComponent = ACTIVITY_ICONS[activity.type];
                    return (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <IconComponent className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                          </div>
                          {index < dealActivities.length - 1 && (
                            <div className={`w-0.5 h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} mt-2`} />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className={`text-sm font-semibold capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {activity.type}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                            {activity.description}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mt-2`}>
                            {new Date(activity.createdAt).toLocaleDateString()}{' '}
                            {new Date(activity.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No activities found
                  </p>
                )}
              </div>
            )}

            {/* Estimates Tab */}
            {activeTab === 'estimates' && (
              <div className="space-y-4">
                {estimates.length > 0 ? (
                  estimates.map((estimate) => (
                    <div
                      key={estimate.id}
                      className={`p-4 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {estimate.service}
                          </h4>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {estimate.number}
                          </p>
                        </div>
                        <span
                          className={`text-sm px-2 py-1 rounded font-medium capitalize ${
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
                          }`}
                        >
                          {estimate.status}
                        </span>
                      </div>
                      {estimate.selectedTier && (
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Tier: {estimate.selectedTier}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No estimates found
                  </p>
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-4">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className={`p-4 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {invoice.number}
                          </h4>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Paid: ${invoice.amountPaid.toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No invoices found
                  </p>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Notes
                  </h3>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      className={`text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
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
                      rows={8}
                      placeholder="Add notes about this deal..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingNotes(false);
                          setNotes(deal.notes || '');
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
                          isDark ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
                        } disabled:opacity-50`}
                      >
                        {isSavingNotes ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`whitespace-pre-wrap text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {notes || 'No notes yet. Click Edit to add notes about this deal.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
