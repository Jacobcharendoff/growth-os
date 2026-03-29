'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import { Estimate, EstimateStatus, EstimateTier } from '@/types';
import {
  Plus,
  Search,
  Eye,
  Send,
  Trash2,
  TrendingUp,
  FileText,
  Clock,
  X,
  ChevronDown,
  DollarSign,
} from 'lucide-react';

const STATUS_COLORS: Record<EstimateStatus, string> = {
  draft: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
  sent: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  viewed: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  approved: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  rejected: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
  expired: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-400 dark:border-slate-600',
};

interface CreateEstimateForm {
  contactId: string;
  service: string;
  description: string;
  tiers: EstimateTier[];
  notes: string;
  validDays: number;
}

interface CreateFeatureState {
  [tierIndex: number]: string;
}

export default function EstimatesPage() {
  const { t } = useLanguage();
  const { estimates, contacts, addEstimate, updateEstimateStatus, deleteEstimate, initializeSeedData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<EstimateStatus | 'all'>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newFeatureInputs, setNewFeatureInputs] = useState<CreateFeatureState>({});

  const [formData, setFormData] = useState<CreateEstimateForm>({
    contactId: '',
    service: '',
    description: '',
    tiers: [
      { name: 'Good', description: '', price: 0, features: [] },
      { name: 'Better', description: '', price: 0, features: [] },
      { name: 'Best', description: '', price: 0, features: [] },
    ],
    notes: '',
    validDays: 30,
  });

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, [initializeSeedData]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl h-28 shadow-sm"></div>)}
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalEstimates = estimates.length;
  const pendingApproval = estimates.filter(
    (e) => e.status === 'sent' || e.status === 'viewed'
  ).length;
  const currentMonth = new Date();
  const approvedThisMonth = estimates.filter(
    (e) =>
      e.status === 'approved' &&
      e.createdAt >= new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getTime()
  ).length;
  const totalApproved = estimates.filter((e) => e.status === 'approved').length;
  const conversionRate = totalEstimates > 0 ? Math.round((totalApproved / totalEstimates) * 100) : 0;

  const filteredEstimates = estimates.filter((est) => {
    const matchesSearch =
      est.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || est.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateEstimate = () => {
    if (!formData.contactId || !formData.service) {
      alert('Please fill in all required fields');
      return;
    }

    const contact = contacts.find((c) => c.id === formData.contactId);
    if (!contact) {
      alert('Contact not found');
      return;
    }

    addEstimate({
      contactId: formData.contactId,
      customerName: contact.name,
      customerEmail: contact.email,
      customerPhone: contact.phone,
      service: formData.service,
      description: formData.description,
      tiers: formData.tiers,
      status: 'draft',
      notes: formData.notes,
      validDays: formData.validDays,
    });

    // Show success state
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowCreateModal(false);
      setShowSuccessMessage(false);
      resetForm();
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      contactId: '',
      service: '',
      description: '',
      tiers: [
        { name: 'Good', description: '', price: 0, features: [] },
        { name: 'Better', description: '', price: 0, features: [] },
        { name: 'Best', description: '', price: 0, features: [] },
      ],
      notes: '',
      validDays: 30,
    });
    setNewFeatureInputs({});
  };

  const handleTierChange = (tierIndex: number, field: string, value: any) => {
    setFormData((prev) => {
      const newTiers = [...prev.tiers];
      newTiers[tierIndex] = { ...newTiers[tierIndex], [field]: value };
      return { ...prev, tiers: newTiers };
    });
  };

  const addFeatureToTier = (tierIndex: number) => {
    const featureText = newFeatureInputs[tierIndex]?.trim() || '';
    if (!featureText) return;

    setFormData((prev) => {
      const newTiers = [...prev.tiers];
      newTiers[tierIndex].features = [...(newTiers[tierIndex].features || []), featureText];
      return { ...prev, tiers: newTiers };
    });

    setNewFeatureInputs((prev) => ({ ...prev, [tierIndex]: '' }));
  };

  const removeFeatureFromTier = (tierIndex: number, featureIndex: number) => {
    setFormData((prev) => {
      const newTiers = [...prev.tiers];
      newTiers[tierIndex].features = newTiers[tierIndex].features.filter(
        (_, i) => i !== featureIndex
      );
      return { ...prev, tiers: newTiers };
    });
  };

  const getDisplayAmount = (estimate: Estimate): number => {
    if (estimate.selectedTier) {
      const tier = estimate.tiers.find((t) => t.name === estimate.selectedTier);
      return tier?.price || estimate.tiers[1]?.price || 0;
    }
    return estimate.tiers[1]?.price || 0;
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('estimates.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400">Create and track customer estimates</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{t('estimates.totalEstimates')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalEstimates}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-100 dark:text-blue-900" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{t('estimates.pendingApproval')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingApproval}</p>
            </div>
            <Clock className="w-12 h-12 text-amber-100 dark:text-amber-900" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{t('estimates.approvedThisMonth')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{approvedThisMonth}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-emerald-100 dark:text-emerald-900" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">{t('estimates.conversionRate')}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{conversionRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
              <span className="text-xl font-bold text-rose-600">↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {t('estimates.createEstimate')}
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'draft', 'sent', 'viewed', 'approved', 'rejected'] as const).map((status) => {
            const count =
              status === 'all' ? totalEstimates : estimates.filter((e) => e.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {status === 'all' ? 'All' : status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Estimate #
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide hidden md:table-cell">
                  Service
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide hidden md:table-cell">
                  Created
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredEstimates.length > 0 ? (
                filteredEstimates.map((estimate) => (
                  <tr
                    key={estimate.id}
                    onMouseEnter={() => setHoveredRow(estimate.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition ${hoveredRow === estimate.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                      <Link href={`/estimates/${estimate.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {estimate.number}
                      </Link>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                      {estimate.customerName}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
                      {estimate.service}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                      ${getDisplayAmount(estimate).toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                          STATUS_COLORS[estimate.status]
                        }`}
                      >
                        {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
                      {new Date(estimate.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/estimates/${estimate.id}`}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </Link>
                        {estimate.status === 'draft' && (
                          <button
                            onClick={() => updateEstimateStatus(estimate.id, 'sent')}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            title="Send"
                          >
                            <Send className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteEstimate(estimate.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 sm:px-6 py-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No estimates found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Estimate Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Estimate</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {!showSuccessMessage ? (
              <div className="p-6 space-y-6">
                {/* Contact Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Select Contact *
                  </label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="">-- Choose a contact --</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} - {contact.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Service Description *
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="e.g., Water Heater Replacement"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the work in detail..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Pricing Tiers */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pricing Tiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {formData.tiers.map((tier, tierIndex) => (
                      <div key={tierIndex} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 dark:bg-slate-700">
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
                          {tier.name}
                        </h4>

                        {/* Tier Description */}
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={tier.description}
                            onChange={(e) =>
                              handleTierChange(tierIndex, 'description', e.target.value)
                            }
                            placeholder={`${tier.name} service description`}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Tier Price */}
                        <div className="mb-4">
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                              type="number"
                              value={tier.price}
                              onChange={(e) =>
                                handleTierChange(tierIndex, 'price', parseInt(e.target.value) || 0)
                              }
                              placeholder="0"
                              className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Features
                          </label>
                          <div className="space-y-2 mb-3">
                            {tier.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-center justify-between bg-slate-50 dark:bg-slate-600 px-3 py-2 rounded-lg"
                              >
                                <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                                <button
                                  onClick={() => removeFeatureFromTier(tierIndex, featureIndex)}
                                  className="text-rose-600 hover:text-rose-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add Feature Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFeatureInputs[tierIndex] || ''}
                              onChange={(e) =>
                                setNewFeatureInputs({
                                  ...newFeatureInputs,
                                  [tierIndex]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addFeatureToTier(tierIndex);
                                }
                              }}
                              placeholder="Add feature..."
                              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                            />
                            <button
                              onClick={() => addFeatureToTier(tierIndex)}
                              className="px-3 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Valid For */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Valid For (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.validDays}
                    onChange={(e) => setFormData({ ...formData, validDays: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-6 border-t border-slate-200 dark:border-slate-600">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateEstimate}
                    className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                  >
                    Create Estimate
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  Estimate Created!
                </h3>
                <p className="text-slate-600 dark:text-slate-400">Your estimate has been saved as draft.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
