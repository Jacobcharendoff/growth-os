'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import {
  ArrowLeft,
  Send,
  DollarSign,
  Download,
  Trash2,
  X,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-800 border-slate-300',
  sent: 'bg-blue-100 text-blue-800 border-blue-300',
  viewed: 'bg-amber-100 text-amber-800 border-amber-300',
  partial: 'bg-amber-100 text-amber-800 border-amber-300',
  paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  overdue: 'bg-rose-100 text-rose-800 border-rose-300',
};

const PAYMENT_METHODS = [
  'Interac e-Transfer',
  'Credit Card',
  'Cheque',
  'Cash',
];

interface RecordPaymentForm {
  amount: string;
  method: string;
  date: string;
  notes: string;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { getInvoice, recordPayment, deleteInvoice, updateInvoice } = useStore();
  const invoice = getInvoice(id);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState<RecordPaymentForm>({
    amount: invoice ? (invoice.total - invoice.amountPaid).toFixed(2) : '0.00',
    method: 'Interac e-Transfer',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
        <Link href="/invoices" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invoice Not Found</h1>
          <p className="text-slate-600">The invoice you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const percentPaid = Math.round((invoice.amountPaid / invoice.total) * 100);
  const remainingBalance = invoice.total - invoice.amountPaid;
  const isPaid = invoice.status === 'paid';

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentForm.amount);
    if (amount <= 0 || amount > remainingBalance) {
      alert('Please enter a valid payment amount');
      return;
    }

    recordPayment(id, amount);

    // Update status if fully paid
    if (amount >= remainingBalance) {
      updateInvoice(id, {
        status: 'paid',
        paidAt: Date.now(),
      });
    } else {
      updateInvoice(id, {
        status: 'partial',
      });
    }

    setShowPaymentModal(false);
    setPaymentForm({
      amount: '0.00',
      method: 'Interac e-Transfer',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleDeleteInvoice = () => {
    if (confirm('Are you sure you want to delete this invoice? This cannot be undone.')) {
      deleteInvoice(id);
      router.push('/invoices');
    }
  };

  const handleSendInvoice = () => {
    if (invoice.status === 'draft') {
      updateInvoice(id, {
        status: 'sent',
        sentAt: Date.now(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/invoices" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{invoice.number}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                  STATUS_COLORS[invoice.status]
                }`}
              >
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Created {new Date(invoice.createdAt).toLocaleDateString('en-US')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {invoice.status === 'draft' && (
              <button
                onClick={handleSendInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <Send className="w-4 h-4" />
                Send Invoice
              </button>
            )}

            {invoice.status !== 'paid' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
              >
                <DollarSign className="w-4 h-4" />
                Record Payment
              </button>
            )}

            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>

            <button
              onClick={handleDeleteInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 text-rose-600 font-medium transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Card */}
          <div className="bg-white rounded-xl p-4 sm:p-8 shadow-sm border border-slate-200">
            {/* Company Header */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Your Company</h2>
              <p className="text-slate-600 text-sm mt-4">Tax Registration #: [Your Tax ID]</p>
            </div>

            {/* Bill To and Invoice Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Bill To</h3>
                <p className="font-semibold text-slate-900">{invoice.customerName}</p>
                <p className="text-sm text-slate-600 mt-2">{invoice.customerAddress}</p>
                <p className="text-sm text-slate-600">{invoice.customerEmail}</p>
              </div>
              <div className="text-right text-sm">
                <div className="mb-4">
                  <p className="text-slate-500">Invoice #</p>
                  <p className="font-semibold text-slate-900 text-base">{invoice.number}</p>
                </div>
                <div className="mb-4">
                  <p className="text-slate-500">Invoice Date</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-slate-500">Due Date</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Province</p>
                  <p className="font-semibold text-slate-900">{invoice.province}</p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Unit Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-900">{item.description}</td>
                      <td className="text-right py-3 px-4 text-slate-600">{item.quantity}</td>
                      <td className="text-right py-3 px-4 text-slate-600">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-slate-900">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Breakdown */}
            <div className="flex justify-end mb-8">
              <div className="w-72 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ${invoice.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {invoice.taxType} ({(invoice.taxRate * 100).toFixed(3)}%)
                  </span>
                  <span className="font-medium text-slate-900">
                    ${invoice.taxAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-lg text-slate-900">
                    ${invoice.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Notes</h4>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Payment Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Progress</h3>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">{percentPaid}% Paid</span>
                <span className="text-sm font-medium text-slate-900">
                  ${invoice.amountPaid.toFixed(2)} of ${invoice.total.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                  style={{ width: `${percentPaid}%` }}
                />
              </div>
            </div>

            {!isPaid && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-900">
                  Remaining Balance: ${remainingBalance.toFixed(2)}
                </p>
              </div>
            )}

            {isPaid && invoice.paidAt && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Paid in Full</p>
                  <p className="text-xs text-emerald-700">
                    Paid on{' '}
                    {new Date(invoice.paidAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <p className="text-sm text-blue-900 font-medium mb-2">Invoice Total</p>
            <p className="text-2xl sm:text-4xl font-bold text-blue-900">
              ${invoice.total.toFixed(2)}
            </p>
            <p className="text-xs text-blue-700 mt-3">
              Due {new Date(invoice.dueDate).toLocaleDateString('en-US')}
            </p>
          </div>

          {!isPaid && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Record Payment</h3>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Amount
                </label>
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  ${remainingBalance.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500">Remaining balance</p>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Record Payment
              </button>
            </div>
          )}

          {/* Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Status Details</h3>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-600 mb-1">Current Status</p>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                    STATUS_COLORS[invoice.status]
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </div>
              </div>

              {invoice.sentAt && (
                <div>
                  <p className="text-slate-600 mb-1">Sent On</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(invoice.sentAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              )}

              {invoice.paidAt && (
                <div>
                  <p className="text-slate-600 mb-1">Paid On</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(invoice.paidAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              )}

              <div>
                <p className="text-slate-600 mb-1">Tax Information</p>
                <p className="text-slate-900 font-medium">
                  {invoice.taxType} ({(invoice.taxRate * 100).toFixed(3)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Record Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-600">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={remainingBalance}
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Max: ${remainingBalance.toFixed(2)}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentForm.method}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, method: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Notes
                </label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, notes: e.target.value })
                  }
                  placeholder="Reference number, check number, etc."
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecordPayment}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
