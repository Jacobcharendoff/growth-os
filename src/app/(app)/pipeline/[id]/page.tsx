'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { Deal, Contact, Activity, PipelineStage } from '@/types';
import { LeadSourceBadge } from '@/components/LeadSourceBadge';
import {
  ChevronLeft,
  Edit,
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  FileText,
  CheckSquare,
  TrendingUp,
  Flag,
  User,
  ArrowRight,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const STAGE_ORDER: PipelineStage[] = [
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
  estimate_scheduled: 'Estimate Scheduled',
  estimate_sent: 'Estimate Sent',
  booked: 'Booked',
  in_progress: 'In Progress',
  completed: 'Completed',
  invoiced: 'Invoiced',
};

const ACTIVITY_ICONS = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  estimate: FileText,
  payment: DollarSign,
};

const PRIORITY_LEVELS = {
  high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Medium' },
  low: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Low' },
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getDeal, getContact, activities, initializeSeedData, updateDeal } = useStore();

  const [mounted, setMounted] = useState(false);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [dealActivities, setDealActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

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

        const relatedActivities = activities.filter(
          (a) => a.dealId === id
        );
        setDealActivities(relatedActivities.sort((a, b) => b.createdAt - a.createdAt));

        setNotes(foundDeal.notes);
      }
    }
  }, [mounted, id, getDeal, getContact, activities]);

  const handleSaveNotes = async () => {
    if (!deal) return;
    setIsSavingNotes(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateDeal(deal.id, { notes });
    setEditingNotes(false);
    setIsSavingNotes(false);
  };

  const handleStageChange = (newStage: PipelineStage) => {
    if (!deal) return;
    updateDeal(deal.id, { stage: newStage });
    setDeal({ ...deal, stage: newStage });
  };

  const getCurrentStageIndex = () => {
    if (!deal) return 0;
    return STAGE_ORDER.indexOf(deal.stage);
  };

  const getDaysInStage = () => {
    if (!deal) return 0;
    return Math.floor((Date.now() - deal.updatedAt) / (1000 * 60 * 60 * 24));
  };

  const getNextStage = (): PipelineStage | null => {
    const currentIndex = getCurrentStageIndex();
    return currentIndex < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentIndex + 1] : null;
  };

  const getPreviousStage = (): PipelineStage | null => {
    const currentIndex = getCurrentStageIndex();
    return currentIndex > 0 ? STAGE_ORDER[currentIndex - 1] : null;
  };

  const stageIndex = getCurrentStageIndex();

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!deal) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="px-8 py-6 border-b border-slate-200">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Pipeline
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 text-lg">Deal not found</p>
            <Link
              href="/pipeline"
              className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              Return to pipeline
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextStage = getNextStage();
  const prevStage = getPreviousStage();
  const daysInStage = getDaysInStage();
  const priorityStyle = PRIORITY_LEVELS[priority];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Pipeline
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Edit className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">{deal.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
            {priorityStyle.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold text-slate-900">
            ${deal.value.toLocaleString()}
          </span>
          <span className="text-sm text-slate-600">
            Assigned to <span className="font-semibold text-slate-900">{deal.assignedTo}</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-8 py-4 sm:py-6 space-y-6">
        {/* Stage Progress Tracker */}
        <div className="bg-white rounded-xl p-4 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-slate-900">Pipeline Progress</h2>
            <span className="text-sm text-slate-600 font-medium">
              {daysInStage} day{daysInStage !== 1 ? 's' : ''} in current stage
            </span>
          </div>

          {/* Stage Track */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {STAGE_ORDER.map((stage, index) => {
              const isCompleted = index < stageIndex;
              const isCurrent = index === stageIndex;
              const bgColor = isCompleted
                ? 'bg-emerald-500'
                : isCurrent
                  ? 'bg-blue-600'
                  : 'bg-slate-200';
              const textColor = isCompleted || isCurrent ? 'text-white' : 'text-slate-600';

              return (
                <div key={stage} className="flex items-center gap-3 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${bgColor} ${textColor}`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < STAGE_ORDER.length - 1 && (
                    <div
                      className={`w-8 h-1 transition-all ${
                        isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Stage Labels */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {STAGE_ORDER.map((stage) => (
              <div key={stage} className="text-center">
                <p className="text-xs text-slate-600 font-medium leading-tight">
                  {STAGE_LABELS[stage]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Deal Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Deal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Service Type</p>
                  <p className="text-slate-900 font-medium capitalize">
                    {deal.title}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Location</p>
                  <p className="text-slate-900 font-medium">
                    {contact?.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Created</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(deal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Last Updated</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(deal.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600 uppercase font-semibold">Source</p>
                <div className="mt-2">
                  <LeadSourceBadge source={deal.source} variant="full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        {contact && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
            <Link
              href={`/contacts/${contact.id}`}
              className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-lg">{contact.name}</p>
                <div className="flex items-center gap-4 mt-3">
                  <a
                    href={`tel:${contact.phone}`}
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{contact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{contact.email}</span>
                  </a>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
            </Link>
          </div>
        )}

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Deal Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${deal.value.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Estimated Profit</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              ${Math.floor(deal.value * 0.35).toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 mt-2">35% margin</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Status</p>
            <p className="text-lg font-bold text-slate-900 mt-2 capitalize">
              {STAGE_LABELS[deal.stage]}
            </p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h2>
          {dealActivities.length > 0 ? (
            <div className="space-y-4">
              {dealActivities.map((activity) => {
                const IconComponent = ACTIVITY_ICONS[activity.type];
                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1 pb-4 last:pb-0">
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {activity.type}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(activity.createdAt).toLocaleDateString()}{' '}
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No activities yet</p>
          )}
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
            {!editingNotes && (
              <button
                onClick={() => setEditingNotes(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={6}
                placeholder="Add notes about this deal..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingNotes(false);
                    setNotes(deal.notes);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  {isSavingNotes ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-700 whitespace-pre-wrap">{notes || 'No notes yet'}</p>
          )}
        </div>

        {/* Stage Navigation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Stage Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {prevStage && (
              <button
                onClick={() => handleStageChange(prevStage)}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Move Back
              </button>
            )}

            {nextStage && (
              <button
                onClick={() => handleStageChange(nextStage)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
              >
                Advance to {STAGE_LABELS[nextStage]}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {deal.stage === 'completed' && (
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors">
                <FileText className="w-4 h-4" />
                Generate Invoice
              </button>
            )}

            {deal.stage !== 'invoiced' && deal.stage !== 'completed' && (
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors">
                <CheckSquare className="w-4 h-4" />
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
