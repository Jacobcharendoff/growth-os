'use client';

import { Contact, Deal, Estimate, Invoice } from '@/types';
import { LeadSourceBadge } from '@/components/LeadSourceBadge';
import { X, DollarSign, FileText, Briefcase, Baby, PawPrint, Heart, StickyNote } from 'lucide-react';

interface ContactDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  deals: Deal[];
  estimates: Estimate[];
  invoices: Invoice[];
  isDark: boolean;
}

export function ContactDetailPanel({
  isOpen,
  onClose,
  contact,
  deals,
  estimates,
  invoices,
  isDark,
}: ContactDetailPanelProps) {
  if (!isOpen) return null;

  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end justify-end z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`${isDark ? 'bg-slate-800' : 'bg-white'} w-full sm:w-96 h-full overflow-y-auto shadow-xl`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {contact.name}
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {contact.type === 'customer' ? 'Customer' : 'Lead'}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Contact Information
          </h3>
          <div className="space-y-2">
            <div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                {contact.email}
              </a>
            </div>
            <div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phone</p>
              <a
                href={`tel:${contact.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                {contact.phone}
              </a>
            </div>
            <div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Address</p>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                {contact.address}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Source</p>
              <div className="mt-1">
                <LeadSourceBadge source={contact.source} variant="full" />
              </div>
            </div>
            {contact.notes && (
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Notes</p>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                  {contact.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Details */}
        {(contact.occupation || contact.kids || contact.pets || contact.interests || contact.personalNotes) && (
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Personal Details
            </h3>
            <div className="space-y-3">
              {contact.occupation && (
                <div className="flex gap-3">
                  <Briefcase className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Occupation</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                      {contact.occupation}
                    </p>
                  </div>
                </div>
              )}
              {contact.kids && (
                <div className="flex gap-3">
                  <Baby className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Kids</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                      {contact.kids}
                    </p>
                  </div>
                </div>
              )}
              {contact.pets && (
                <div className="flex gap-3">
                  <PawPrint className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pets</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                      {contact.pets}
                    </p>
                  </div>
                </div>
              )}
              {contact.interests && (
                <div className="flex gap-3">
                  <Heart className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Interests</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                      {contact.interests}
                    </p>
                  </div>
                </div>
              )}
              {contact.personalNotes && (
                <div className="flex gap-3">
                  <StickyNote className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Personal Notes</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                      {contact.personalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Deal Value</p>
              </div>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ${totalDealValue.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <FileText className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Invoiced</p>
              </div>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ${totalInvoiced.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Deals */}
        {deals.length > 0 && (
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Linked Deals ({deals.length})
            </h3>
            <div className="space-y-2">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}
                >
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {deal.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {deal.stage}
                    </p>
                    <p className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ${deal.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estimates */}
        {estimates.length > 0 && (
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Estimates ({estimates.length})
            </h3>
            <div className="space-y-2">
              {estimates.map((estimate) => (
                <div
                  key={estimate.id}
                  className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {estimate.number}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        estimate.status === 'approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : estimate.status === 'sent'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {estimate.status}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {estimate.service}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoices */}
        {invoices.length > 0 && (
          <div className={`px-4 sm:px-6 py-3 sm:py-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Invoices ({invoices.length})
            </h3>
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {invoice.number}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : invoice.status === 'overdue'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Total: ${invoice.total.toLocaleString()}
                    </p>
                    <p className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      Paid: ${invoice.amountPaid.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
