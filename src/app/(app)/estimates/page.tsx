'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import { Estimate, EstimateStatus, EstimateTier, Deal } from '@/types';
import { getAllProvinces } from '@/lib/canadian-tax';
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
  Edit,
  CheckCircle,
  XCircle,
  MoreVertical,
  DollarSign,
  AlertCircle,
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
  dealId?: string;
  service: string;
  description: string;
  tiers: EstimateTier[];
  notes: string;
  validDays: number;
}

interface CreateFeatureState {
  [tierIndex: number]: string;
}

interface ModalState {
  type: 'create' | 'edit' | 'action' | null;
  estimateId?: string;
  actionType?: 'send' | 'viewed' | 'approve' | 'reject' | 'convert' | 'delete';
}

export default function EstimatesPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    estimates,
    contacts,
    deals,
    addEstimate,
    updateEstimate,
    updateEstimateStatus,
    deleteEstimate,
    addInvoice,
    addActivity,
    initializeSeedData,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<EstimateStatus | 'all'>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newFeatureInputs, setNewFeatureInputs] = useState<CreateFeatureState>({});
  const [selectedProvinceForConvert, setSelectedProvinceForConvert] = useState('ON');

  const [formData, setFormData] = useState<CreateEstimateForm>({
    contactId: '',
    dealId: undefined,
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

  // Get the current estimate being edited
  const currentEstimate = modal.estimateId ? estimates.find((e) => e.id === modal.estimateId) : null;
  const contactEstimates = formData.contactId
    ? estimates.filter((e) => e.contactId === formData.contactId)
    : [];
  const dealEstimates = formData.dealId ? estimates.filter((e) => e.dealId === formData.dealId) : [];
  const relatedDeals = formData.contactId ? deals.filter((d) => d.contactId === formData.contactId) : [];

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, [initializeSeedData]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl h-28 shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalEstimates = estimates.length;
  const pendingApproval = estimates.filter((e) => e.status === 'sent' || e.status === 'viewed').length;
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

    // Validate at least one tier has a price
    const hasValidTier = formData.tiers.some((t) => t.price > 0);
    if (!hasValidTier) {
      alert('At least one tier must have a price');
      return;
    }

    const newEstimate = addEstimate({
      contactId: formData.contactId,
      dealId: formData.dealId,
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

    addActivity({
      type: 'estimate',
      description: `Created estimate ${formData.service} for ${contact.name}`,
      contactId: formData.contactId,
      dealId: formData.dealId,
    });

    setShowSuccessMessage(true);
    setTimeout(() => {
      setModal({ type: null });
      setShowSuccessMessage(false);
      resetForm();
    }, 1200);
  };

  const handleUpdateEstimate = () => {
    if (!currentEstimate) return;
    if (!formData.service) {
      alert('Please fill in all required fields');
      return;
    }

    const hasValidTier = formData.tiers.some((t) => t.price > 0);
    if (!hasValidTier) {
      alert('At least one tier must have a price');
      return;
    }

    updateEstimate(currentEstimate.id, {
      service: formData.service,
      description: formData.description,
      tiers: formData.tiers,
      notes: formData.notes,
      validDays: formData.validDays,
      dealId: formData.dealId,
    });

    addActivity({
      type: 'estimate',
      description: `Updated estimate ${formData.service} for ${currentEstimate.customerName}`,
      contactId: currentEstimate.contactId,
      dealId: currentEstimate.dealId,
    });

    setShowSuccessMessage(true);
    setTimeout(() => {
      setModal({ type: null });
      setShowSuccessMessage(false);
      resetForm();
    }, 1200);
  };

  const handleStatusAction = (estimateId: string, action: string) => {
    const estimate = estimates.find((e) => e.id === estimateId);
    if (!estimate) return;

    switch (action) {
      case 'send':
        updateEstimateStatus(estimateId, 'sent');
        addActivity({
          type: 'estimate',
          description: `Sent estimate ${estimate.service} to ${estimate.customerName}`,
          contactId: estimate.contactId,
          dealId: estimate.dealId,
        });
        break;
      case 'viewed':
        updateEstimateStatus(estimateId, 'viewed');
        addActivity({
          type: 'estimate',
          description: `Marked estimate ${estimate.service} as viewed`,
          contactId: estimate.contactId,
          dealId: estimate.dealId,
        });
        break;
      case 'approve':
        updateEstimateStatus(estimateId, 'approved');
        addActivity({
          type: 'estimate',
          description: `Approved estimate ${estimate.service} from ${estimate.customerName}`,
          contactId: estimate.contactId,
          dealId: estimate.dealId,
        });
        break;
      case 'reject':
        updateEstimateStatus(estimateId, 'rejected');
        addActivity({
          type: 'estimate',
          description: `Rejected estimate ${estimate.service} from ${estimate.customerName}`,
          contactId: estimate.contactId,
          dealId: estimate.dealId,
        });
        break;
      case 'convert':
        handleConvertToInvoice(estimateId);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this estimate?')) {
          deleteEstimate(estimateId);
          addActivity({
            type: 'estimate',
            description: `Deleted estimate ${estimate.service}`,
            contactId: estimate.contactId,
            dealId: estimate.dealId,
          });
        }
        break;
    }
    setModal({ type: null });
  };

  const handleConvertToInvoice = (estimateId: string) => {
    const estimate = estimates.find((e) => e.id === estimateId);
    if (!estimate || !estimate.selectedTier) {
      alert('Please select a tier before converting to invoice');
      return;
    }

    const selectedTier = estimate.tiers.find((t) => t.name === estimate.selectedTier);
    if (!selectedTier) return;

    const provinceConfig = PROVINCES.find((p) => p.code === selectedProvinceForConvert);
    const subtotal = selectedTier.price;
    const taxRate = provinceConfig?.taxRate || 0.13;
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = subtotal + taxAmount;

    const invoiceId = addInvoice({
      contactId: estimate.contactId,
      dealId: estimate.dealId,
      estimateId: estimate.id,
      customerName: estimate.customerName,
      customerEmail: estimate.customerEmail,
      customerAddress: '',
      lineItems: [
        {
          description: `${estimate.service} - ${selectedTier.name}`,
          quantity: 1,
          unitPrice: selectedTier.price,
        },
      ],
      subtotal,
      taxRate,
      taxAmount,
      total,
      amountPaid: 0,
      status: 'draft',
      notes: estimate.notes,
      dueDate: Date.now() + 30 * 86400000,
      province: selectedProvinceForConvert,
      taxType: provinceConfig?.taxType || 'HST',
    });

    addActivity({
      type: 'estimate',
      description: `Converted approved estimate ${estimate.service} to invoice`,
      contactId: estimate.contactId,
      dealId: estimate.dealId,
    });

    setModal({ type: null });
    setSelectedProvinceForConvert('ON');
  };

  const resetForm = () => {
    setFormData({
      contactId: '',
      dealId: undefined,
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

  const openEditModal = (estimateId: string) => {
    const estimate = estimates.find((e) => e.id === estimateId);
    if (!estimate) return;

    setFormData({
      contactId: estimate.contactId,
      dealId: estimate.dealId,
      service: estimate.service,
      description: estimate.description,
      tiers: estimate.tiers,
      notes: estimate.notes,
      validDays: estimate.validDays,
    });

    setModal({ type: 'edit', estimateId });
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
      newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
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
    <div className={`p-4 sm:p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
          {t('estimates.title')}
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Create and track customer estimates</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium mb-1`}>
                {t('estimates.totalEstimates')}
              </p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalEstimates}</p>
            </div>
            <FileText className={`w-12 h-12 ${isDark ? 'text-blue-900' : 'text-blue-100'}`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium mb-1`}>
                {t('estimates.pendingApproval')}
              </p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{pendingApproval}</p>
            </div>
            <Clock className={`w-12 h-12 ${isDark ? 'text-amber-900' : 'text-amber-100'}`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium mb-1`}>
                {t('estimates.approvedThisMonth')}
              </p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{approvedThisMonth}</p>
            </div>
            <TrendingUp className={`w-12 h-12 ${isDark ? 'text-emerald-900' : 'text-emerald-100'}`} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium mb-1`}>
                {t('estimates.conversionRate')}
              </p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{conversionRate}%</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-rose-900' : 'bg-rose-100'} flex items-center justify-center`}>
              <span className="text-xl font-bold text-rose-600">↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-6 mb-8`}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                isDark
                  ? 'bg-slate-900 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              resetForm();
              setModal({ type: 'create' });
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {t('estimates.createEstimate')}
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'draft', 'sent', 'viewed', 'approved', 'rejected'] as const).map((status) => {
            const count = status === 'all' ? totalEstimates : estimates.filter((e) => e.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className={`md:hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {filteredEstimates.length > 0 ? (
          <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
            {filteredEstimates.map((estimate) => (
              <Link
                key={estimate.id}
                href={`/estimates/${estimate.id}`}
                className={`block p-4 transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {estimate.number}
                    </p>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {estimate.customerName}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {estimate.service}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${getDisplayAmount(estimate).toLocaleString()}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[estimate.status]}`}>
                      {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No estimates found</p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className={`hidden md:block ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} border-b`}>
              <tr>
                <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Estimate #
                </th>
                <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Customer
                </th>
                <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide hidden md:table-cell`}>
                  Service
                </th>
                <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Amount
                </th>
                <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Status
                </th>
                <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide hidden md:table-cell`}>
                  Created
                </th>
                <th className={`px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {filteredEstimates.length > 0 ? (
                filteredEstimates.map((estimate) => (
                  <tr
                    key={estimate.id}
                    onMouseEnter={() => setHoveredRow(estimate.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition ${
                      hoveredRow === estimate.id ? (isDark ? 'bg-blue-900' : 'bg-blue-50') : ''
                    }`}
                  >
                    <td className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Link href={`/estimates/${estimate.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {estimate.number}
                      </Link>
                    </td>
                    <td className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {estimate.customerName}
                    </td>
                    <td className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} hidden md:table-cell`}>
                      {estimate.service}
                    </td>
                    <td className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${getDisplayAmount(estimate).toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[estimate.status]}`}>
                        {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} hidden md:table-cell`}>
                      {new Date(estimate.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/estimates/${estimate.id}`}
                          className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
                          title="View"
                        >
                          <Eye className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                        </Link>

                        <button
                          onClick={() => openEditModal(estimate.id)}
                          className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
                          title="Edit"
                        >
                          <Edit className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                        </button>

                        {estimate.status === 'draft' && (
                          <button
                            onClick={() => handleStatusAction(estimate.id, 'send')}
                            className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
                            title="Send"
                          >
                            <Send className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                          </button>
                        )}

                        {estimate.status === 'approved' && (
                          <button
                            onClick={() => setModal({ type: 'action', estimateId: estimate.id, actionType: 'convert' })}
                            className={`p-2 ${isDark ? 'hover:bg-emerald-900' : 'hover:bg-emerald-50'} rounded-lg transition`}
                            title="Convert to Invoice"
                          >
                            <DollarSign className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          </button>
                        )}

                        <button
                          onClick={() => handleStatusAction(estimate.id, 'delete')}
                          className={`p-2 ${isDark ? 'hover:bg-red-900' : 'hover:bg-red-50'} rounded-lg transition`}
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
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No estimates found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Estimate Modal */}
      {(modal.type === 'create' || modal.type === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`sticky top-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b p-6 flex items-center justify-between`}>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {modal.type === 'create' ? 'Create Estimate' : 'Edit Estimate'}
              </h2>
              <button
                onClick={() => {
                  setModal({ type: null });
                  resetForm();
                }}
                className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
              >
                <X className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
            </div>

            {!showSuccessMessage ? (
              <div className="p-6 space-y-6">
                {/* Contact Selector */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Select Contact *
                  </label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => setFormData({ ...formData, contactId: e.target.value, dealId: undefined })}
                    disabled={modal.type === 'edit'}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                    } disabled:opacity-50`}
                  >
                    <option value="">-- Choose a contact --</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} - {contact.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deal Selector */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Link to Deal (Optional)
                  </label>
                  <select
                    value={formData.dealId || ''}
                    onChange={(e) => setFormData({ ...formData, dealId: e.target.value || undefined })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="">No deal linked</option>
                    {relatedDeals.map((deal) => (
                      <option key={deal.id} value={deal.id}>
                        {deal.title} (${deal.value})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Description */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Service Description *
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="e.g., Water Heater Replacement"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the work in detail..."
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-3 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input
                      type="number"
                      value={formData.tiers[0]?.price || 0}
                      onChange={(e) => handleTierChange(0, 'price', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className={`w-full pl-8 pr-3 py-2.5 border rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 ${
                        isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Pricing Tiers Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('pricing-tiers-section');
                      if (el) el.classList.toggle('hidden');
                    }}
                    className={`text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} flex items-center gap-1.5`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Good / Better / Best pricing tiers
                  </button>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Offer three options to anchor customers to the middle tier and increase average ticket size
                  </p>

                  <div id="pricing-tiers-section" className="hidden mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {formData.tiers.map((tier, tierIndex) => (
                        <div
                          key={tierIndex}
                          className={`border rounded-lg p-4 ${isDark ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'}`}
                        >
                          <h4 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-3`}>
                            {tier.name}
                          </h4>

                          <div className="mb-3">
                            <label className={`block text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                              Description
                            </label>
                            <input
                              type="text"
                              value={tier.description}
                              onChange={(e) => handleTierChange(tierIndex, 'description', e.target.value)}
                              placeholder={`${tier.name} service description`}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 ${
                                isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </div>

                          <div className="mb-4">
                            <label className={`block text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                              Price
                            </label>
                            <div className="relative">
                              <DollarSign className={`absolute left-3 top-2.5 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                              <input
                                type="number"
                                value={tier.price}
                                onChange={(e) => handleTierChange(tierIndex, 'price', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                className={`w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 ${
                                  isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                                }`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`block text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                              Features
                            </label>
                            <div className="space-y-2 mb-3">
                              {tier.features.map((feature, featureIndex) => (
                                <div
                                  key={featureIndex}
                                  className={`flex items-center justify-between ${isDark ? 'bg-slate-600' : 'bg-slate-50'} px-3 py-2 rounded-lg`}
                                >
                                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</span>
                                  <button
                                    onClick={() => removeFeatureFromTier(tierIndex, featureIndex)}
                                    className="text-rose-600 hover:text-rose-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
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
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 ${
                                  isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                                }`}
                              />
                              <button
                                onClick={() => addFeatureToTier(tierIndex)}
                                className={`px-3 py-2 ${isDark ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-lg transition text-sm font-medium`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Valid For */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Valid For (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.validDays}
                    onChange={(e) => setFormData({ ...formData, validDays: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-4 justify-end pt-6 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <button
                    onClick={() => {
                      setModal({ type: null });
                      resetForm();
                    }}
                    className={`px-6 py-2 ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-lg font-medium transition`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modal.type === 'create' ? handleCreateEstimate : handleUpdateEstimate}
                    className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                  >
                    {modal.type === 'create' ? 'Create Estimate' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className={`w-16 h-16 ${isDark ? 'bg-emerald-900' : 'bg-emerald-100'} rounded-full flex items-center justify-center mb-4`}>
                  <svg
                    className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>
                  {modal.type === 'create' ? 'Estimate Created!' : 'Estimate Updated!'}
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {modal.type === 'create'
                    ? 'Your estimate has been saved as draft.'
                    : 'Your estimate has been updated.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Convert to Invoice Modal */}
      {modal.type === 'action' && modal.actionType === 'convert' && currentEstimate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg max-w-md w-full`}>
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b p-6 flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Convert to Invoice</h2>
              <button
                onClick={() => setModal({ type: null })}
                className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
              >
                <X className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                  Selected Tier: <span className="font-semibold">{currentEstimate.selectedTier || 'None'}</span>
                </p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ${currentEstimate.selectedTier ? currentEstimate.tiers.find((t) => t.name === currentEstimate.selectedTier)?.price || 0 : 0}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                  Province (for tax calculation)
                </label>
                <select
                  value={selectedProvinceForConvert}
                  onChange={(e) => setSelectedProvinceForConvert(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {PROVINCES.map((prov) => (
                    <option key={prov.code} value={prov.code}>
                      {prov.name} ({prov.taxType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => setModal({ type: null })}
                  className={`flex-1 px-4 py-2 ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-lg font-medium transition`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusAction(currentEstimate.id, 'convert')}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Use the Canadian tax engine for all provinces
const PROVINCES = getAllProvinces().map((pr) => ({
  code: pr.provinceCode,
  name: pr.province,
  taxRate: pr.effectiveRate,
  taxType: pr.taxType,
}));
