'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Estimate } from '@/types';

interface EstimateData {
  contact: {
    id: string;
    name: string;
    email: string;
  };
  estimate: Estimate;
}

interface ApiResponse {
  success: boolean;
  data?: EstimateData;
  error?: string;
}

export default function EstimatePage() {
  const params = useParams();
  const token = params.token as string;
  const id = params.id as string;

  const [data, setData] = useState<EstimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const response = await fetch(`/api/portal/${token}`);
        const json = await response.json();

        if (!json.success) {
          setError(json.error || 'Failed to load estimate');
          setLoading(false);
          return;
        }

        if (json.data) {
          // Find the specific estimate from the array by ID
          const estimates = json.data.estimates || [];
          const estimate = estimates.find((e: Estimate) => e.id === id);

          if (!estimate) {
            setError('Estimate not found');
            setLoading(false);
            return;
          }

          setData({
            contact: json.data.contact,
            estimate: estimate as Estimate,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load estimate');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchEstimate();
    }
  }, [token, id]);

  const handleApprove = async () => {
    setActionLoading(true);
    setActionMessage(null);

    try {
      const response = await fetch(`/api/portal/${token}/estimates/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (!json.success) {
        setActionMessage({
          type: 'error',
          text: json.error || 'Failed to approve estimate',
        });
        return;
      }

      setActionMessage({
        type: 'success',
        text: 'Estimate approved! The business will contact you soon.',
      });

      if (data) {
        setData({
          ...data,
          estimate: {
            ...data.estimate,
            status: 'approved',
          },
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to approve estimate',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!changeMessage.trim()) {
      setActionMessage({
        type: 'error',
        text: 'Please enter a message',
      });
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(
        `/api/portal/${token}/estimates/${id}/request-changes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: changeMessage,
          }),
        }
      );

      const json = await response.json();

      if (!json.success) {
        setActionMessage({
          type: 'error',
          text: json.error || 'Failed to send request',
        });
        return;
      }

      setActionMessage({
        type: 'success',
        text: 'Change request sent! The business will contact you soon.',
      });

      setChangeMessage('');
      setRequestChangesOpen(false);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send request',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading estimate...</p>
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
          <p className="text-red-700">{error || 'Estimate not found'}</p>
        </div>
      </div>
    );
  }

  const { estimate, contact } = data;
  const selectedTier = estimate.selectedTier || 'Good';
  const selectedPrice =
    estimate.tiers.find((t) => t.name === selectedTier)?.price || 0;
  const subtotal = selectedPrice;
  const tax = subtotal * 0.13; // Assuming 13% HST, should come from estimate data
  const total = subtotal + tax;

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
              Estimate #{estimate.number}
            </h1>
            <p className="text-gray-600 mt-2">{estimate.service}</p>
          </div>
          <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${
            estimate.status === 'approved'
              ? 'bg-green-100 text-green-800'
              : estimate.status === 'sent' || estimate.status === 'viewed'
              ? 'bg-blue-100 text-blue-800'
              : estimate.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Message */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            actionMessage.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Estimate Details */}
      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">
              From
            </h3>
            <div className="mt-2 text-gray-900">
              <p className="font-semibold">GrowthOS Service</p>
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
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase">
              Details
            </h3>
            <div className="mt-2 text-gray-900">
              <p className="text-sm">
                <span className="text-gray-600">Created:</span>{' '}
                {new Date(estimate.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Valid for:</span>{' '}
                {estimate.validDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Service Options
          </h3>
          <div className="space-y-3">
            {estimate.tiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedTier === tier.name
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{tier.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {tier.description}
                    </p>
                    {tier.features && tier.features.length > 0 && (
                      <ul className="mt-2 ml-4 text-xs text-gray-600 list-disc">
                        {tier.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${tier.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div></div>
        <div></div>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (13%)</span>
              <span className="text-gray-900 font-semibold">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {estimate.description && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {estimate.description}
          </p>
        </div>
      )}

      {/* Notes */}
      {estimate.notes && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Notes</h3>
          <p className="text-blue-800 whitespace-pre-wrap">{estimate.notes}</p>
        </div>
      )}

      {/* Actions */}
      {estimate.status !== 'approved' && estimate.status !== 'rejected' && (
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What would you like to do?
          </h3>

          <div className="space-y-4">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {actionLoading ? 'Processing...' : 'Approve Estimate'}
            </button>

            <button
              onClick={() => setRequestChangesOpen(!requestChangesOpen)}
              disabled={actionLoading}
              className="w-full md:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition ml-0 md:ml-3"
            >
              Request Changes
            </button>
          </div>

          {/* Request Changes Form */}
          {requestChangesOpen && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">
                What would you like to change?
              </h4>
              <textarea
                value={changeMessage}
                onChange={(e) => setChangeMessage(e.target.value)}
                placeholder="Describe the changes you'd like us to make..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRequestChanges}
                  disabled={actionLoading || !changeMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {actionLoading ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  onClick={() => {
                    setRequestChangesOpen(false);
                    setChangeMessage('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
