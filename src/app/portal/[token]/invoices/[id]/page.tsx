'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Invoice, InvoiceLineItem } from '@/types';

interface InvoiceData {
  contact: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  invoice: Invoice;
}

interface ApiResponse {
  success: boolean;
  data?: InvoiceData;
  error?: string;
}

export default function InvoicePage() {
  const params = useParams();
  const token = params.token as string;
  const id = params.id as string;

  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/portal/${token}`);
        const json: ApiResponse = await response.json();

        if (!json.success) {
          setError(json.error || 'Failed to load invoice');
          setLoading(false);
          return;
        }

        if (json.data) {
          const invoice = json.data.invoice || json.data;
          setData({
            contact: json.data.contact,
            invoice: invoice as Invoice,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInvoice();
    }
  }, [token]);

  const handlePayment = async (method: 'stripe' | 'bank_transfer') => {
    if (!data) return;

    setPaymentLoading(true);
    setPaymentMessage(null);

    const balanceDue = data.invoice.total - data.invoice.amountPaid;

    try {
      const response = await fetch(
        `/api/portal/${token}/invoices/${id}/pay`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: balanceDue,
            paymentMethod: method,
          }),
        }
      );

      const json = await response.json();

      if (!json.success) {
        setPaymentMessage({
          type: 'error',
          text: json.error || 'Failed to process payment',
        });
        return;
      }

      setPaymentMessage({
        type: 'success',
        text: json.data?.message || 'Payment initiated. Please check your email for details.',
      });
    } catch (err) {
      setPaymentMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to process payment',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Link
          href={`/portal/${token}`}
          className="text-green-600 hover:text-green-700 text-sm font-semibold mb-6 inline-block"
        >
          ← Back to Portal
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700">{error || 'Invoice not found'}</p>
        </div>
      </div>
    );
  }

  const { invoice, contact } = data;
  const balanceDue = invoice.total - invoice.amountPaid;

  return (
    <div>
      <Link
        href={`/portal/${token}`}
        className="text-green-600 hover:text-green-700 text-sm font-semibold mb-8 inline-block"
      >
        ← Back to Portal
      </Link>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Invoice #{invoice.number}
            </h1>
            <p className="text-gray-600 mt-2">
              Due {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            invoice.status === 'paid'
              ? 'bg-green-100 text-green-800'
              : balanceDue > 0
              ? 'bg-orange-100 text-orange-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {balanceDue > 0 ? `$${balanceDue.toFixed(2)} Due` : 'Paid'}
          </span>
        </div>
      </div>

      {/* Message */}
      {paymentMessage && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            paymentMessage.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {paymentMessage.text}
        </div>
      )}

      {/* Invoice Details */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">
              From
            </h3>
            <div className="mt-2 text-gray-900">
              <p className="font-semibold">Staybookt Service</p>
              <p className="text-sm">Professional Service Provider</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">
              Bill To
            </h3>
            <div className="mt-2 text-gray-900">
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm">{contact.email}</p>
              <p className="text-sm">{contact.address}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">
              Details
            </h3>
            <div className="mt-2 text-gray-900">
              <p className="text-sm">
                <span className="text-gray-600">Invoice Date:</span>{' '}
                {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Due Date:</span>{' '}
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="border-t border-gray-200 pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-600 font-semibold">
                  Description
                </th>
                <th className="text-right py-3 text-gray-600 font-semibold">
                  Qty
                </th>
                <th className="text-right py-3 text-gray-600 font-semibold">
                  Unit Price
                </th>
                <th className="text-right py-3 text-gray-600 font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems?.map((item: InvoiceLineItem, idx: number) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-4 text-gray-900">{item.description}</td>
                  <td className="text-right py-4 text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="text-right py-4 text-gray-900">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="text-right py-4 text-gray-900 font-semibold">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div></div>
        <div></div>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-semibold">
                ${invoice.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Tax ({(invoice.taxRate * 100).toFixed(0)}%)
              </span>
              <span className="text-gray-900 font-semibold">
                ${invoice.taxAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">
                ${invoice.total.toFixed(2)}
              </span>
            </div>
          </div>

          {invoice.amountPaid > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-gray-900 font-semibold">
                  -${invoice.amountPaid.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {balanceDue > 0 && (
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold text-orange-900">
                  Balance Due
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  ${balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Notes</h3>
          <p className="text-blue-800 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Payment History */}
      {invoice.amountPaid > 0 && (
        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            Payment History
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-800">Payment Received</span>
              <span className="text-green-900 font-semibold">
                ${invoice.amountPaid.toFixed(2)}
              </span>
            </div>
            {invoice.paidAt && (
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Date</span>
                <span className="text-green-700">
                  {new Date(invoice.paidAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {balanceDue > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Options
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => handlePayment('stripe')}
              disabled={paymentLoading}
              className="w-full px-4 sm:px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition text-left"
            >
              <div className="flex items-center justify-between">
                <span>
                  {paymentLoading ? 'Processing...' : 'Pay with Credit Card'}
                </span>
                <span className="text-lg font-bold">
                  ${balanceDue.toFixed(2)}
                </span>
              </div>
            </button>

            <button
              onClick={() => handlePayment('bank_transfer')}
              disabled={paymentLoading}
              className="w-full px-4 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition text-left"
            >
              <div className="flex items-center justify-between">
                <span>
                  {paymentLoading ? 'Processing...' : 'Bank Transfer'}
                </span>
                <span className="text-lg font-bold">
                  ${balanceDue.toFixed(2)}
                </span>
              </div>
            </button>

            <p className="text-xs text-gray-600 pt-2">
              Choose a payment method. You'll receive payment details via email.
            </p>
          </div>
        </div>
      )}

      {/* Paid Status */}
      {balanceDue <= 0 && (
        <div className="border-t border-gray-200 pt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-semibold text-green-900">
                Invoice Paid
              </h3>
            </div>
            <p className="text-green-800">
              Thank you! This invoice has been fully paid.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
