'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store';
import { Estimate, EstimateTier } from '@/types';
import {
  ArrowLeft,
  Send,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  User,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Star,
  ChevronRight,
} from 'lucide-react';

interface EstimateDetailPageProps {
  params: Promise<{ id: string }>;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    viewed: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
  };

  const labels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    viewed: 'Viewed',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.draft}`}>
      {labels[status] || status}
    </span>
  );
};

const TierCard = ({
  tier,
  isSelected,
  onSelect,
  isDraft,
}: {
  tier: EstimateTier;
  isSelected: boolean;
  onSelect: () => void;
  isDraft: boolean;
}) => {
  const isRecommended = tier.name === 'Better';

  return (
    <div
      className={`rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      } shadow-sm overflow-hidden cursor-pointer`}
      onClick={() => isDraft && onSelect()}
    >
      <div className="p-6">
        {/* Tier Name & Recommended Badge */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
          {isRecommended && (
            <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Recommended</span>
            </div>
          )}
        </div>

        {/* Selected Badge */}
        {isSelected && (
          <div className="flex items-center gap-1 mb-4 text-blue-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Selected</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4">{tier.description}</p>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <DollarSign className="w-5 h-5 text-slate-700" />
            <span className="text-4xl font-bold text-slate-900">{tier.price.toLocaleString()}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">One-time investment</p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">Includes:</p>
          <ul className="space-y-2">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Click to Select (Draft Only) */}
        {isDraft && (
          <button
            onClick={() => onSelect()}
            className={`w-full mt-6 py-2 px-4 rounded-lg font-medium transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isSelected ? 'Selected' : 'Select this tier'}
          </button>
        )}
      </div>
    </div>
  );
};

export default function EstimateDetailPage({ params }: EstimateDetailPageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const store = useStore();
  const estimate = store.getEstimate(id);

  const [selectedTier, setSelectedTier] = React.useState<string | null>(
    estimate?.selectedTier || null
  );

  React.useEffect(() => {
    if (estimate) {
      setSelectedTier(estimate.selectedTier || null);
    }
  }, [estimate]);

  if (!estimate) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
          <Link
            href="/estimates"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Estimates
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Estimate not found</h1>
            <p className="text-slate-600 mb-6">The estimate you're looking for doesn't exist.</p>
            <Link
              href="/estimates"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Return to Estimates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectTier = (tierName: string) => {
    if (estimate.status === 'draft') {
      setSelectedTier(tierName);
      store.updateEstimate(id, { selectedTier: tierName as 'Good' | 'Better' | 'Best' });
    }
  };

  const handleSendEstimate = () => {
    store.updateEstimate(id, { status: 'sent', sentAt: Date.now() });
  };

  const handleMarkViewed = () => {
    store.updateEstimate(id, { status: 'viewed', viewedAt: Date.now() });
  };

  const handleApprove = () => {
    store.updateEstimate(id, { status: 'approved', respondedAt: Date.now() });
  };

  const handleReject = () => {
    store.updateEstimate(id, { status: 'rejected', respondedAt: Date.now() });
  };

  const handleDelete = () => {
    if (confirm('Are you sure? This cannot be undone.')) {
      store.deleteEstimate(id);
      window.location.href = '/estimates';
    }
  };

  const selectedTierData = estimate.tiers.find((t) => t.name === selectedTier);
  const selectedPrice = selectedTierData?.price || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link
                href="/estimates"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Estimates
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Estimate #{estimate.number}</h1>
            </div>
            <StatusBadge status={estimate.status} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {estimate.status === 'draft' && (
              <button
                onClick={handleSendEstimate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Estimate
              </button>
            )}

            {estimate.status === 'sent' && (
              <button
                onClick={handleMarkViewed}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Mark as Viewed
              </button>
            )}

            {estimate.status === 'viewed' && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
                >
                  Reject
                </button>
              </>
            )}

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Customer Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={`/contacts/${estimate.contactId}`}
              className="flex items-start gap-3 hover:bg-slate-50 p-4 rounded-lg transition-colors group"
            >
              <User className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5 group-hover:text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Contact</p>
                <p className="font-semibold text-slate-900 group-hover:text-blue-600">{estimate.customerName}</p>
              </div>
            </Link>
            <a
              href={`mailto:${estimate.customerEmail}`}
              className="flex items-start gap-3 hover:bg-slate-50 p-4 rounded-lg transition-colors group"
            >
              <Mail className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5 group-hover:text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-semibold text-slate-900 group-hover:text-blue-600">{estimate.customerEmail}</p>
              </div>
            </a>
            {estimate.customerPhone && (
              <a
                href={`tel:${estimate.customerPhone}`}
                className="flex items-start gap-3 hover:bg-slate-50 p-4 rounded-lg transition-colors group"
              >
                <Phone className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5 group-hover:text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-semibold text-slate-900 group-hover:text-blue-600">{estimate.customerPhone}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Pricing Tiers - Main Feature */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing Options</h2>
          {estimate.status === 'draft' && (
            <p className="text-sm text-slate-600 mb-4">Click on a tier to select it for this estimate.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {estimate.tiers.map((tier) => (
              <TierCard
                key={tier.name}
                tier={tier}
                isSelected={selectedTier === tier.name}
                onSelect={() => handleSelectTier(tier.name)}
                isDraft={estimate.status === 'draft'}
              />
            ))}
          </div>
        </div>

        {/* Approved State */}
        {estimate.status === 'approved' && selectedTierData && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <h3 className="text-2xl font-bold text-emerald-900">Estimate Approved!</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-emerald-700 mb-2">Selected Package</p>
                <p className="text-2xl font-bold text-emerald-900">{selectedTierData.name}</p>
              </div>
              <div>
                <p className="text-sm text-emerald-700 mb-2">Total Investment</p>
                <p className="text-2xl font-bold text-emerald-900">${selectedPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estimate Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Estimate Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-slate-600 mb-2">Service Description</p>
              <p className="text-slate-900 font-medium">{estimate.description}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Valid for</p>
              <div className="flex items-center gap-2 text-slate-900 font-medium">
                <Clock className="w-4 h-4 text-slate-500" />
                {estimate.validDays} days
              </div>
            </div>
          </div>

          {estimate.notes && (
            <div className="mb-8 pb-8 border-b border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Notes</p>
              <p className="text-slate-900 whitespace-pre-wrap">{estimate.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-600 mb-1 uppercase font-semibold">Created</p>
              <p className="text-sm text-slate-900">
                {new Date(estimate.createdAt).toLocaleDateString()}
              </p>
            </div>

            {estimate.sentAt && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 mb-1 uppercase font-semibold">Sent</p>
                <p className="text-sm text-blue-900">
                  {new Date(estimate.sentAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {estimate.viewedAt && (
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-xs text-amber-600 mb-1 uppercase font-semibold">Viewed</p>
                <p className="text-sm text-amber-900">
                  {new Date(estimate.viewedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {estimate.respondedAt && (
              <div className={`rounded-lg p-4 ${estimate.status === 'approved' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                <p className={`text-xs mb-1 uppercase font-semibold ${estimate.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {estimate.status === 'approved' ? 'Approved' : 'Rejected'}
                </p>
                <p className={`text-sm ${estimate.status === 'approved' ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {new Date(estimate.respondedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
