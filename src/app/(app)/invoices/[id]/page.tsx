'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import {
  ArrowLeft,
  Download,
  Printer,
  Send,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const invoiceId = typeof params?.id === 'string' ? params.id : '';

  const { getInvoice, getContact, recordPayment, settings } = useStore();
  const invoice = getInvoice(invoiceId);
  const customer = invoice ? getContact(invoice.contactId) : null;

  const [mounted, setMounted] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<string>('e-transfer');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!invoice || !customer) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-4 sm:p-6`}>
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 mb-6 ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeft size={18} />
          Back to Invoices
        </button>
        <div className={`text-center py-12 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg`}>
          <AlertCircle
            size={48}
            className={`mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          />
          <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            Invoice not found
          </h2>
          <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            The invoice you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const balanceDue = Math.max(0, invoice.total - invoice.amountPaid);
  const isOverdue =
    invoice.status === 'overdue' || (balanceDue > 0 && Date.now() > invoice.dueDate);

  const getStatusColor = () => {
    switch (invoice.status) {
      case 'draft':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
      case 'sent':
      case 'viewed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
      case 'partial':
        return 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300';
      case 'paid':
        return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300';
      case 'overdue':
        return 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700';
    }
  };

  const getStatusIcon = () => {
    switch (invoice.status) {
      case 'paid':
        return <CheckCircle size={20} />;
      case 'overdue':
        return <AlertCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0 && amount <= balanceDue) {
      recordPayment(invoiceId, amount);
      setPaymentAmount('');
      setShowPaymentForm(false);
    }
  };

  const handlePrintInvoice = () => {
    const element = document.getElementById('invoice-document');
    if (element) {
      const printWindow = window.open('', '', 'width=900,height=600');
      if (printWindow) {
        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice ${invoice.number}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.5;
                color: #1f2937;
                background: white;
              }

              .invoice-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 40px;
                background: white;
              }

              .company-header {
                margin-bottom: 32px;
              }

              .company-header h1 {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
                color: #111827;
              }

              .company-header p {
                font-size: 13px;
                color: #6b7280;
              }

              .invoice-title-section {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 32px;
                padding-bottom: 32px;
                border-bottom: 2px solid #e5e7eb;
              }

              .invoice-title-section h2 {
                font-size: 28px;
                font-weight: bold;
                color: #111827;
              }

              .invoice-details {
                text-align: right;
                font-size: 13px;
                color: #6b7280;
              }

              .invoice-details p {
                margin-bottom: 4px;
              }

              .invoice-details strong {
                font-weight: 600;
              }

              .bill-to {
                margin-bottom: 32px;
              }

              .bill-to-label {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                color: #6b7280;
                margin-bottom: 8px;
              }

              .bill-to-content {
                font-size: 13px;
                color: #374151;
              }

              .bill-to-content p:first-child {
                font-weight: 600;
                margin-bottom: 4px;
              }

              .bill-to-content p {
                margin-bottom: 2px;
              }

              table {
                width: 100%;
                margin-bottom: 32px;
                border-collapse: collapse;
              }

              thead tr {
                border-bottom: 2px solid #d1d5db;
              }

              th {
                padding: 12px 8px;
                font-weight: 600;
                font-size: 13px;
                color: #374151;
                text-align: left;
              }

              th:nth-child(2),
              th:nth-child(3),
              th:nth-child(4) {
                text-align: right;
              }

              td {
                padding: 12px 8px;
                font-size: 13px;
                border-bottom: 1px solid #f3f4f6;
                color: #374151;
              }

              td:nth-child(2),
              td:nth-child(3),
              td:nth-child(4) {
                text-align: right;
              }

              .totals-section {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 32px;
              }

              .totals {
                width: 280px;
              }

              .total-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 13px;
                color: #374151;
              }

              .total-row.tax {
                color: #374151;
              }

              .total-row.grand-total {
                background: #f3f4f6;
                padding: 12px;
                margin-top: 8px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 14px;
                color: #111827;
              }

              .amount-paid-section {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 32px;
              }

              .amount-paid {
                width: 280px;
              }

              .paid-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 13px;
                color: #374151;
              }

              .balance-due-row {
                display: flex;
                justify-content: space-between;
                padding: 12px;
                margin-top: 8px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 14px;
                color: #fff;
                background: #10b981;
              }

              .balance-due-row.has-balance {
                background: #ef4444;
              }

              .notes-section {
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
              }

              .notes-label {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                color: #6b7280;
                margin-bottom: 8px;
              }

              .notes-content {
                font-size: 13px;
                color: #374151;
              }

              .footer {
                text-align: center;
                margin-top: 48px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
                font-size: 13px;
                color: #6b7280;
              }

              @media print {
                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                }
                .invoice-container {
                  padding: 20px;
                  margin: 0;
                }
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <!-- Company Header -->
              <div class="company-header">
                <h1>${settings.companyName}</h1>
                <p>${settings.companyAddress}</p>
                <p>${settings.companyPhone} • ${settings.companyEmail}</p>
              </div>

              <!-- Invoice Title & Details -->
              <div class="invoice-title-section">
                <h2>INVOICE</h2>
                <div class="invoice-details">
                  <p><strong>Number:</strong> ${invoice.number}</p>
                  <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                  <p><strong>Due:</strong> ${new Date(invoice.dueDate).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              </div>

              <!-- Bill To -->
              <div class="bill-to">
                <div class="bill-to-label">Bill To</div>
                <div class="bill-to-content">
                  <p>${invoice.customerName}</p>
                  <p>${invoice.customerEmail}</p>
                  <p>${invoice.customerAddress}</p>
                </div>
              </div>

              <!-- Line Items Table -->
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="width: 80px;">Qty</th>
                    <th style="width: 112px;">Unit Price</th>
                    <th style="width: 112px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.lineItems.map((item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td>${new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                      }).format(item.unitPrice)}</td>
                      <td>${new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                      }).format(item.quantity * item.unitPrice)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <!-- Totals -->
              <div class="totals-section">
                <div class="totals">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span>${new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    }).format(invoice.subtotal)}</span>
                  </div>
                  <div class="total-row tax">
                    <span>${invoice.taxType} (${(invoice.taxRate * 100).toFixed(1)}%):</span>
                    <span>${new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    }).format(invoice.taxAmount)}</span>
                  </div>
                  <div class="total-row grand-total">
                    <span>Total:</span>
                    <span>${new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    }).format(invoice.total)}</span>
                  </div>
                </div>
              </div>

              <!-- Amount Paid & Balance -->
              <div class="amount-paid-section">
                <div class="amount-paid">
                  <div class="paid-row">
                    <span>Amount Paid:</span>
                    <span>${new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    }).format(invoice.amountPaid)}</span>
                  </div>
                  <div class="balance-due-row ${balanceDue > 0 ? 'has-balance' : ''}">
                    <span>Balance Due:</span>
                    <span>${new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    }).format(balanceDue)}</span>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              ${invoice.notes ? `
                <div class="notes-section">
                  <div class="notes-label">Notes</div>
                  <div class="notes-content">${invoice.notes}</div>
                </div>
              ` : ''}

              <!-- Footer -->
              <div class="footer">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </body>
          </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        // Wait for content to load before printing
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const paymentHistory = [
    ...(invoice.amountPaid > 0
      ? [
          {
            date: invoice.paidAt || invoice.createdAt,
            amount: invoice.amountPaid,
            method: 'Previous payment',
          },
        ]
      : []),
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-4 sm:p-6`}>
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 mb-6 ${
          isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <ArrowLeft size={18} />
        Back to Invoices
      </button>

      {/* Status Banner */}
      <div className={`${getStatusColor()} rounded-lg p-4 mb-6 flex items-start justify-between`}>
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div>
            <h1 className="text-2xl font-bold">{invoice.number}</h1>
            <p className="text-sm mt-1 opacity-90">
              {invoice.customerName} • Issued {formatDate(invoice.createdAt)}
            </p>
            <p className="text-sm opacity-90">
              Due {formatDate(invoice.dueDate)}
              {isOverdue && ' (Overdue)'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice.status === 'draft' && (
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded font-medium text-sm transition">
              <Send size={16} className="inline mr-2" />
              Send
            </button>
          )}
          {balanceDue > 0 && (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded font-medium text-sm transition"
            >
              <DollarSign size={16} className="inline mr-2" />
              Record Payment
            </button>
          )}
          <button
            onClick={handlePrintInvoice}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded font-medium text-sm transition"
          >
            <Printer size={16} className="inline mr-2" />
            Print
          </button>
          <button
            onClick={handlePrintInvoice}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded font-medium text-sm transition"
            title="Use your browser's Save as PDF option when the print dialog opens"
          >
            <Download size={16} className="inline mr-2" />
            PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 sm:p-6">
        {/* Main Section - Invoice Document */}
        <div className="col-span-2">
          <div
            id="invoice-document"
            className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-12 shadow-sm`}
          >
            {/* Company Header */}
            <div className="mb-8">
              <h2 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {settings.companyName}
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2`}>
                {settings.companyAddress} • {settings.companyPhone}
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {settings.companyEmail}
              </p>
            </div>

            {/* Invoice Title & Details */}
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  INVOICE
                </h3>
              </div>
              <div className={`text-right text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>
                  <strong>Number:</strong> {invoice.number}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(invoice.createdAt)}
                </p>
                <p>
                  <strong>Due:</strong> {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-8">
              <div>
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-2`}>
                  Bill To
                </p>
                <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {invoice.customerName}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {invoice.customerEmail}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {invoice.customerAddress}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <th
                    className={`text-left py-3 px-2 font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Description
                  </th>
                  <th
                    className={`text-right py-3 px-2 font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    } w-20`}
                  >
                    Qty
                  </th>
                  <th
                    className={`text-right py-3 px-2 font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    } w-28`}
                  >
                    Unit Price
                  </th>
                  <th
                    className={`text-right py-3 px-2 font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    } w-28`}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                  >
                    <td
                      className={`py-3 px-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      {item.description}
                    </td>
                    <td
                      className={`text-right py-3 px-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      {item.quantity}
                    </td>
                    <td
                      className={`text-right py-3 px-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td
                      className={`text-right py-3 px-2 font-semibold ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}
                    >
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full sm:w-64">
                <div
                  className={`flex justify-between py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div
                  className={`flex justify-between py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  <span>
                    {invoice.taxType} ({(invoice.taxRate * 100).toFixed(1)}%):
                  </span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div
                  className={`flex justify-between py-3 px-3 rounded font-bold text-lg ${
                    isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Amount Paid & Balance */}
            <div className="flex justify-end mb-8">
              <div className="w-full sm:w-64">
                <div
                  className={`flex justify-between py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  <span>Amount Paid:</span>
                  <span>{formatCurrency(invoice.amountPaid)}</span>
                </div>
                <div
                  className={`flex justify-between py-3 px-3 rounded font-bold text-lg ${
                    balanceDue > 0
                      ? isDark
                        ? 'bg-rose-900/30 text-rose-300'
                        : 'bg-rose-100 text-rose-900'
                      : isDark
                        ? 'bg-emerald-900/30 text-emerald-300'
                        : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  <span>Balance Due:</span>
                  <span>{formatCurrency(balanceDue)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className={`pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-2`}>
                  Notes
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Payment History */}
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-sm`}>
            <h3
              className={`font-semibold mb-4 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              Payment History
            </h3>
            {paymentHistory.length > 0 ? (
              <div className="space-y-3">
                {paymentHistory.map((payment, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between text-sm p-2 rounded ${
                      isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                    }`}
                  >
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      {formatDate(payment.date)}
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                No payments recorded
              </p>
            )}
          </div>

          {/* Record Payment Form */}
          {showPaymentForm && balanceDue > 0 && (
            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-sm`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Record Payment
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={balanceDue}
                    step="0.01"
                    className={`w-full px-3 py-2 rounded border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                    Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${
                      isDark
                        ? 'bg-slate-700 border-slate-600 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="e-transfer">E-Transfer</option>
                    <option value="credit-card">Credit Card</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleRecordPayment}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-sm transition"
                  >
                    Record
                  </button>
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className={`flex-1 px-3 py-2 rounded font-medium text-sm transition ${
                      isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customer Card */}
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-sm`}>
            <h3 className={`font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Customer
            </h3>
            <div className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p className="font-medium">{customer.name}</p>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              <p>{customer.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
