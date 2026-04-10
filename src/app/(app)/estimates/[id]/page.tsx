'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { Estimate, Contact, Deal } from '@/types';
import { useTax } from '@/hooks/useTax';
import { TaxBreakdownInline } from '@/components/TaxBreakdown';
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

  // IMPORTANT: useTax must be called before any conditional returns (Rules of Hooks)
  const companyProvince = settings.companyProvince || 'AB';
  const { calculateTax } = useTax(companyProvince);

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

  const handlePrint = () => {
    if (!estimate) return;
    const element = document.getElementById('estimate-document');
    if (element) {
      const printWindow = window.open('', '', 'width=900,height=1200');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>${estimate.number}</title>
            <style>
              @media print {
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
                  background: white;
                  color: #1f2937;
                  line-height: 1.6;
                }
                .print-container {
                  max-width: 8.5in;
                  width: 100%;
                  height: 11in;
                  margin: 0 auto;
                  padding: 0.5in;
                  background: white;
                }
              }
              body {
                margin: 0;
                padding: 20px;
                background: #f5f5f5;
              }
              .print-container {
                max-width: 8.5in;
                margin: 0 auto;
                background: white;
                padding: 0.75in;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .company-header {
                margin-bottom: 2rem;
                padding-bottom: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
              }
              .company-name {
                font-size: 1.5rem;
                font-weight: bold;
                color: #111827;
                margin-bottom: 0.5rem;
              }
              .company-info {
                font-size: 0.875rem;
                color: #4b5563;
                line-height: 1.5;
              }
              .estimate-title {
                font-size: 2.25rem;
                font-weight: bold;
                color: #111827;
                margin-bottom: 1rem;
                margin-top: 1.5rem;
              }
              .estimate-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
              }
              .detail-group {
                font-size: 0.875rem;
              }
              .detail-label {
                font-weight: 600;
                color: #4b5563;
                margin-bottom: 0.25rem;
                text-transform: uppercase;
                font-size: 0.75rem;
              }
              .detail-value {
                font-weight: 600;
                color: #111827;
                font-size: 1rem;
              }
              .section-divider {
                border-top: 1px solid #e5e7eb;
                margin: 2rem 0;
                padding-top: 1.5rem;
              }
              .section-label {
                font-size: 0.75rem;
                font-weight: 700;
                color: #4b5563;
                text-transform: uppercase;
                margin-bottom: 0.75rem;
              }
              .customer-section {
                margin-bottom: 2rem;
              }
              .customer-name {
                font-size: 1.125rem;
                font-weight: bold;
                color: #111827;
              }
              .customer-info {
                font-size: 0.875rem;
                color: #4b5563;
                margin-top: 0.5rem;
              }
              .scope-section {
                margin-bottom: 2rem;
              }
              .service-title {
                font-weight: 600;
                color: #111827;
                margin-bottom: 0.5rem;
              }
              .service-desc {
                font-size: 0.875rem;
                color: #4b5563;
              }
              .tiers-section {
                margin-bottom: 2rem;
              }
              .tier {
                border: 2px solid #e5e7eb;
                border-radius: 0.5rem;
                padding: 1rem;
                margin-bottom: 1rem;
                page-break-inside: avoid;
              }
              .tier-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.75rem;
              }
              .tier-name {
                font-weight: 600;
                color: #111827;
              }
              .tier-description {
                font-size: 0.875rem;
                color: #4b5563;
              }
              .tier-price {
                font-size: 1.5rem;
                font-weight: bold;
                color: #059669;
              }
              .tier-features {
                list-style: none;
                font-size: 0.875rem;
                color: #4b5563;
                margin-top: 0.5rem;
              }
              .tier-features li {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.25rem;
              }
              .tier-features li::before {
                content: "•";
                color: #059669;
                font-weight: bold;
              }
              .totals {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 2rem;
                margin-top: 2rem;
              }
              .totals-box {
                width: 100%;
                max-width: 320px;
              }
              .total-row {
                display: flex;
                justify-content: space-between;
                padding: 0.75rem 0;
                border-bottom: 1px solid #e5e7eb;
                font-size: 0.875rem;
                color: #4b5563;
              }
              .total-row.final {
                border-bottom: none;
                padding-top: 1rem;
                font-weight: bold;
                color: #111827;
                font-size: 1rem;
              }
              .terms-section {
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e5e7eb;
              }
              .terms-label {
                font-size: 0.75rem;
                font-weight: 700;
                color: #4b5563;
                text-transform: uppercase;
                margin-bottom: 0.75rem;
              }
              .terms-text {
                font-size: 0.875rem;
                color: #4b5563;
                white-space: pre-wrap;
              }
              .valid-until {
                margin-top: 1.5rem;
                padding: 1rem;
                background-color: #fffbeb;
                border: 1px solid #fcd34d;
                border-radius: 0.5rem;
              }
              .valid-until-text {
                font-size: 0.875rem;
                color: #78350f;
              }
              .valid-until-text strong {
                font-weight: 600;
              }
              .signature-line {
                margin-top: 3rem;
                padding-top: 1rem;
                border-top: 1px solid #e5e7eb;
              }
              .signature-label {
                font-size: 0.75rem;
                font-weight: 700;
                color: #4b5563;
                text-transform: uppercase;
                margin-bottom: 3rem;
              }
              @media print {
                body {
                  background: white;
                  padding: 0;
                  margin: 0;
                }
                .print-container {
                  max-width: 100%;
                  box-shadow: none;
                  padding: 0.5in;
                  margin: 0;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${element.innerHTML}
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
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

  const taxBreakdown = calculateTax(subtotal);
  const total = taxBreakdown.total;

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
              onClick={handlePrint}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
              }`}
            >
              <Download className="w-4 h-4" />
              Print / PDF
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
      <div className={`flex-1 overflow-y-auto px-4 sm:px-8 py-6 grid gap-3 sm:gap-4 sm:p-6 lg:grid-cols-4 print:grid-cols-1 print:gap-0 print:px-0 print:py-0`}>
        {/* Document Preview */}
        <div id="estimate-document" className={`lg:col-span-3 print:col-span-1 print:shadow-none print:rounded-none print:p-0 ${isDark ? 'bg-white text-slate-900' : 'bg-white'} rounded-xl shadow-sm p-4 sm:p-6 md:p-8 lg:p-12`}>
          {/* Company Header */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{settings.companyName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-900">{settings.companyAddress}</p>
                <p>{settings.companyPhone}</p>
                <p>{settings.companyEmail}</p>
              </div>
            </div>
          </div>

          {/* Estimate Title and Number */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">ESTIMATE</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
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
              <div className="w-full sm:w-80">
                <TaxBreakdownInline breakdown={taxBreakdown} />
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
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200 print:bg-amber-50 print:border-amber-200">
            <p className="text-sm text-amber-900">
              This estimate is valid until <span className="font-bold">{validUntilDate.toLocaleDateString()}</span>
            </p>
          </div>

          {/* Signature Line (Print Only) */}
          <div className="mt-12 pt-8 border-t border-slate-200 print:block hidden sm:print:block">
            <div className="grid grid-cols-2 gap-8 max-w-lg">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-8">Authorized By</p>
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-sm text-slate-600">{settings.companyName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-8">Client Signature</p>
                <div className="border-t border-slate-300 pt-2">
                  <p className="text-sm text-slate-600">Date: _________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 print:hidden space-y-6 h-fit">
          {/* Timeline */}
          <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl p-4 sm:p-6 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
            <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl p-4 sm:p-6 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
          <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-xl p-4 sm:p-6 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
