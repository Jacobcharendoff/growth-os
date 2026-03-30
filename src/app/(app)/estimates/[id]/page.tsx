'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { Estimate, Contact, Deal } from '@/types';
import {
  ChevronLeft,
  Send,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Edit2,
  Trash2,
  Copy,
  MoreVertical,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-500',
  sent: 'bg-blue-500',
  viewed: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
  expired: 'bg-slate-600',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  approved: 'Approved',
  rejected: 'Declined',
  expired: 'Expired',
};

export default function EstimateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    getEstimate,
    getContact,
    getDeal,
    updateEstimateStatus,
    deleteEstimate,
    addInvoice,
    settings,
    initializeSeedData,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [showActions, setShowActions] = useState(false);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, [initializeSeedData]);

  useEffect(() => {
    if (mounted && id) {
      const foundEstimate = getEstimate(id);
      setEstimate(foundEstimate || null);

      if (foundEstimate) {
        const relatedContact = getContact(foundEstimate.contactId);
        setContact(relatedContact || null);

        if (foundEstimate.dealId) {
          const relatedDeal = getDeal(foundEstimate.dealId);
          setDeal(relatedDeal || null);
        }
      }
    }
  }, [mounted, id, getEstimate, getContact, getDeal]);

  const handleSend = () => {
    if (!estimate) return;
    updateEstimateStatus(estimate.id, 'sent');
    setEstimate({ ...estimate, status: 'sent', sentAt: Date.now() });
  };

  const handleApprove = () => {
    if (!estimate) return;
    updateEstimateStatus(estimate.id, 'approved');
    setEstimate({ ...estimate, status: 'approved', respondedAt: Date.now() });
  };

  const handleDecline = () => {
    if (!estimate) return;
    updateEstimateStatus(estimate.id, 'rejected');
    setEstimate({ ...estimate, status: 'rejected', respondedAt: Date.now() });
  };

  const handleConvertToInvoice = () => {
    if (!estimate || !contact) return;
    const taxRate = 0.13; // HST
    const subtotal = estimate.selectedTier
      ? estimate.tiers.find((t) => t.name === estimate.selectedTier)?.price || 0
      : 0;
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = subtotal + taxAmount;

    addInvoice({
      contactId: contact.id,
      dealId: estimate.dealId,
      customerName: contact.name,
      customerEmail: contact.email,
      customerAddress: contact.address || '',
      lineItems: [{ description: estimate.service, quantity: 1, unitPrice: subtotal }],
      subtotal,
      taxRate,
      taxAmount,
      total,
      amountPaid: 0,
      status: 'sent',
      notes: estimate.notes,
      dueDate: Date.now() + 30 * 86400000,
      province: 'ON',
      taxType: 'HST',
      sentAt: Date.now(),
    });

    router.push('/invoices');
  };

  const handleDelete = () => {
    if (!estimate || !window.confirm('Delete this estimate?')) return;
    deleteEstimate(estimate.id);
    router.push('/estimates');
  };

  const handleDownloadPDF = () => {
    alert('PDF download simulated - in production this would generate and download an actual PDF');
  };

  if (!mounted) {
    return (
      <div className={`p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} animate-pulse`}>
        <div className={`h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded w-48 mb-4`}></div>
      </div>
    );
  }

  if (!estimate || !contact) {
    return (
      <div className={`h-full flex flex-col ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className={`px-4 sm:px-8 py-4 sm:py-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 mb-4 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Estimates
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Estimate not found</p>
            <Link
              href="/estimates"
              className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} mt-2 inline-block`}
            >
              Return to Estimates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedTierData = estimate.selectedTier
    ? estimate.tiers.find((t) => t.name === estimate.selectedTier)
    : null;
  const subtotal = selectedTierData?.price || 0;
  const taxRate = 0.13; // HST
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + taxAmount;
  const validUntilDate = new Date(estimate.createdAt + estimate.validDays * 86400000);

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Status Banner */}
      <div className={`${STATUS_COLORS[estimate.status]} text-white px-4 sm:px-8 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Estimate {estimate.number}</p>
            <p className="text-2xl sm:text-3xl font-bold">{contact.name}</p>
            <p className="text-sm opacity-90 mt-1">
              {new Date(estimate.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="px-4 py-2 rounded-full text-sm font-bold bg-white text-slate-900">
            {STATUS_LABELS[estimate.status]}
          </span>
        </div>
      </div>

      {/* Header with Actions */}
      <div className={`sticky top-0 px-4 sm:px-8 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} z-10`}>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 whitespace-nowrap ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-2 flex-wrap justify-end">
            {estimate.status === 'draft' && (
              <button
                onClick={handleSend}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap text-sm"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            )}

            {(estimate.status === 'sent' || estimate.status === 'viewed') && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleDecline}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Decline
                </button>
              </>
            )}

            {estimate.status === 'approved' && (
              <button
                onClick={handleConvertToInvoice}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap text-sm"
              >
                <FileText className="w-4 h-4" />
                Invoice
              </button>
            )}

            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showActions && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                    isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  } z-20`}
                >
                  <button
                    onClick={() => {
                      router.push(`/estimates/${id}/edit`);
                      setShowActions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                      isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowActions(false)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                      isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowActions(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                      isDark ? 'hover:bg-slate-800 text-red-400' : 'hover:bg-slate-50 text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto px-4 sm:px-8 py-6 grid gap-6 lg:grid-cols-4`}>
        {/* Document Preview */}
        <div className={`lg:col-span-3 ${isDark ? 'bg-white text-slate-900' : 'bg-white'} rounded-xl shadow-sm p-8 sm:p-12`}>
          {/* Company Header */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{settings.companyName}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">{settings.companyAddress}</p>
                <p>{settings.companyPhone}</p>
                <p>{settings.companyEmail}</p>
              </div>
            </div>
          </div>

          {/* Estimate Title and Number */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">ESTIMATE</h1>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-slate-600">Estimate Number</p>
                <p className="text-lg font-bold text-slate-900">{estimate.number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Date</p>
                <p className="text-lg font-bold text-slate-900">{new Date(estimate.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-600 mb-3 uppercase">Bill To</p>
            <div>
              <p className="text-lg font-bold text-slate-900">{contact.name}</p>
              <p className="text-slate-600">{contact.address}</p>
              <p className="text-slate-600">{contact.email}</p>
              <p className="text-slate-600">{contact.phone}</p>
            </div>
          </div>

          {/* Service Description */}
          {estimate.service && (
            <div className="mb-12 pb-8 border-b border-slate-200">
              <p className="text-sm font-semibold text-slate-600 mb-3 uppercase">Scope of Work</p>
              <p className="text-base text-slate-900 font-medium mb-2">{estimate.service}</p>
              {estimate.description && <p className="text-slate-600">{estimate.description}</p>}
            </div>
          )}

          {/* Line Items / Tiers */}
          {estimate.tiers.length > 0 && (
            <div className="mb-12">
              <p className="text-sm font-semibold text-slate-600 mb-4 uppercase">Pricing Options</p>
              <div className="space-y-4">
                {estimate.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      estimate.selectedTier === tier.name
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-slate-900">{tier.name}</p>
                        <p className="text-sm text-slate-600">{tier.description}</p>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">${tier.price.toLocaleString()}</p>
                    </div>
                    {tier.features.length > 0 && (
                      <ul className="text-sm text-slate-600 space-y-1">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="mb-12">
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between text-slate-600 border-b border-slate-200 pb-3">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 border-b border-slate-200 pb-3">
                  <span>Tax (HST)</span>
                  <span className="font-medium">${taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          {estimate.notes && (
            <div className="pt-8 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-600 mb-3 uppercase">Terms & Conditions</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{estimate.notes}</p>
            </div>
          )}

          {/* Valid Until */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900">
              This estimate is valid until <span className="font-bold">{validUntilDate.toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6 h-fit">
          {/* Timeline */}
          <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${STATUS_COLORS[estimate.status]}`} />
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{STATUS_LABELS[estimate.status]}</p>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {new Date(estimate.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {estimate.sentAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 bg-blue-500" />
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Sent</p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {new Date(estimate.sentAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {estimate.viewedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 bg-amber-500" />
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Viewed</p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {new Date(estimate.viewedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {estimate.respondedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 bg-emerald-500" />
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{STATUS_LABELS[estimate.status]}</p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {new Date(estimate.respondedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Deal */}
          {deal && (
            <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Related Deal</h3>
              <Link
                href={`/pipeline/${deal.id}`}
                className={`block text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {deal.title}
              </Link>
              <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                ${deal.value.toLocaleString()}
              </p>
            </div>
          )}

          {/* Customer Card */}
          <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Customer</h3>
            <div className="space-y-3">
              <div>
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Name</p>
                <Link
                  href={`/contacts/${contact.id}`}
                  className={`text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {contact.name}
                </Link>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email</p>
                <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phone</p>
                <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
