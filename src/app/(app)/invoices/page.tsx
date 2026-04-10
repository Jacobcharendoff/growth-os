'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import { Invoice, InvoiceStatus, InvoiceLineItem } from '@/types';
import { useTax } from '@/hooks/useTax';
import { getAllProvinces } from '@/lib/canadian-tax';
import {
  Plus,
  Search,
  Eye,
  Bell,
  DollarSign,
  Download,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
} from 'lucide-react';

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
  sent: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  viewed: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  partial: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  paid: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  overdue: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
};

// Use the Canadian tax engine for all provinces
const PROVINCES = getAllProvinces().map((pr) => ({
  code: pr.provinceCode,
  name: pr.province,
  taxRate: pr.effectiveRate,
  taxType: pr.taxType,
}));

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface ModalState {
  type: 'create' | 'edit' | 'payment' | null;
  invoiceId?: string;
}

export default function InvoicesPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const {
    invoices,
    contacts,
    estimates,
    addInvoice,
    updateInvoice,
    recordPayment,
    deleteInvoice,
    initializeSeedData,
    getEstimatesByContact,
    addActivity,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Modal form state
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>('');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [selectedProvince, setSelectedProvince] = useState<string>('ON');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const currentInvoice = modal.invoiceId ? invoices.find((i) => i.id === modal.invoiceId) : null;

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
    // Set default due date (30 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    setDueDate(futureDate.toISOString().split('T')[0]);
  }, [initializeSeedData]);

  if (!mounted) {
    return (
      <div className={`p-8 ${isDark ? 'dark:text-white' : 'text-slate-900'}`}>
        Loading...
      </div>
    );
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const isOverdue = inv.status !== 'paid' && inv.dueDate < Date.now();
    const matchesStatus = filterStatus === 'all'
      || (filterStatus === 'overdue' ? isOverdue : inv.status === filterStatus);

    return matchesSearch && matchesStatus;
  });

  // Calculate stats — use date-based overdue detection (matches dashboard logic)
  const now = Date.now();
  const overdueInvoices = invoices.filter((i) => i.status !== 'paid' && i.dueDate < now);
  const outstandingInvoices = invoices.filter((i) => (i.status === 'sent' || i.status === 'viewed' || i.status === 'draft') && i.dueDate >= now);
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const partialInvoices = invoices.filter((i) => i.status === 'partial' && i.dueDate >= now);

  const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + (i.total - i.amountPaid), 0);
  const paidThisMonth = paidInvoices
    .filter((i) => {
      const paidDate = new Date(i.paidAt || 0);
      const now = new Date();
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + (i.total - i.amountPaid), 0);

  const totalCollected = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalOutstanding = outstandingAmount + overdueAmount;
  const collectionTotal = totalCollected + totalOutstanding;
  const collectionPercent = collectionTotal > 0 ? Math.round((totalCollected / collectionTotal) * 100) : 0;

  const selectedContact = contacts.find((c) => c.id === selectedContactId);
  const contactEstimates = selectedContactId
    ? getEstimatesByContact(selectedContactId).filter((e) => e.status === 'approved')
    : [];
  const selectedEstimate = selectedEstimateId ? estimates.find((e) => e.id === selectedEstimateId) : null;

  const handleEstimateSelect = (estimateId: string) => {
    setSelectedEstimateId(estimateId);
    const estimate = estimates.find((e) => e.id === estimateId);
    if (estimate && estimate.selectedTier) {
      const tierPrice = estimate.tiers.find((t) => t.name === estimate.selectedTier)?.price || 0;
      setLineItems([
        {
          description: estimate.service,
          quantity: 1,
          unitPrice: tierPrice,
        },
      ]);
    }
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const provinceInfo = PROVINCES.find((p) => p.code === selectedProvince);
  const subtotal = calculateSubtotal();
  const taxRate = provinceInfo?.taxRate || 0.13;
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + taxAmount;

  const handleCreateInvoice = () => {
    if (!selectedContactId || lineItems.length === 0 || !selectedContact) {
      alert('Please fill in all required fields');
      return;
    }

    const invoiceId = addInvoice({
      contactId: selectedContactId,
      estimateId: selectedEstimateId || undefined,
      customerName: selectedContact.name,
      customerEmail: selectedContact.email,
      customerAddress: selectedContact.address,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      amountPaid: 0,
      status: 'draft',
      notes,
      dueDate: new Date(dueDate).getTime(),
      province: selectedProvince,
      taxType: provinceInfo?.taxType || 'HST',
    });

    addActivity({
      type: 'payment',
      description: `Created invoice for ${selectedContact.name}`,
      contactId: selectedContactId,
    });

    setShowSuccessMessage(true);
    setTimeout(() => {
      resetForm();
      setModal({ type: null });
      setShowSuccessMessage(false);
    }, 1200);
  };

  const handleEditInvoice = () => {
    if (!currentInvoice || lineItems.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    updateInvoice(currentInvoice.id, {
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      notes,
      dueDate: new Date(dueDate).getTime(),
      province: selectedProvince,
      taxType: provinceInfo?.taxType || 'HST',
    });

    addActivity({
      type: 'payment',
      description: `Updated invoice ${currentInvoice.number}`,
      contactId: currentInvoice.contactId,
    });

    setShowSuccessMessage(true);
    setTimeout(() => {
      resetForm();
      setModal({ type: null });
      setShowSuccessMessage(false);
    }, 1200);
  };

  const handleRecordPayment = () => {
    if (!currentInvoice || paymentAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    recordPayment(currentInvoice.id, paymentAmount);

    addActivity({
      type: 'payment',
      description: `Recorded payment of $${paymentAmount.toFixed(2)} for invoice ${currentInvoice.number}`,
      contactId: currentInvoice.contactId,
    });

    setPaymentAmount(0);
    setModal({ type: null });
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const invoice = invoices.find((i) => i.id === id);
      if (invoice) {
        addActivity({
          type: 'payment',
          description: `Deleted invoice ${invoice.number}`,
          contactId: invoice.contactId,
        });
      }
      deleteInvoice(id);
    }
  };

  const openEditModal = (invoiceId: string) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    setSelectedContactId(invoice.contactId);
    setLineItems(invoice.lineItems);
    setSelectedProvince(invoice.province);
    setDueDate(new Date(invoice.dueDate).toISOString().split('T')[0]);
    setNotes(invoice.notes);

    setModal({ type: 'edit', invoiceId });
  };

  const openPaymentModal = (invoiceId: string) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    setPaymentAmount(0);
    setModal({ type: 'payment', invoiceId });
  };

  const resetForm = () => {
    setSelectedContactId('');
    setSelectedEstimateId('');
    setLineItems([{ description: '', quantity: 1, unitPrice: 0 }]);
    setSelectedProvince('ON');
    setNotes('');
    setPaymentAmount(0);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    setDueDate(futureDate.toISOString().split('T')[0]);
  };

  const generateInvoiceCSV = (data: typeof filteredInvoices) => {
    const headers = ['Invoice Number', 'Customer', 'Status', 'Subtotal', 'Tax', 'Total', 'Amount Paid', 'Balance Due', 'Issue Date', 'Due Date'];

    const rows = data.map((invoice) => {
      const balanceDue = invoice.total - invoice.amountPaid;
      return [
        `"${invoice.number.replace(/"/g, '""')}"`,
        `"${invoice.customerName.replace(/"/g, '""')}"`,
        invoice.status,
        invoice.subtotal.toFixed(2),
        invoice.taxAmount.toFixed(2),
        invoice.total.toFixed(2),
        invoice.amountPaid.toFixed(2),
        balanceDue.toFixed(2),
        new Date(invoice.createdAt).toLocaleDateString(),
        new Date(invoice.dueDate).toLocaleDateString(),
      ];
    });

    const csvContent = [headers, ...rows.map((row) => row.join(','))].join('\n');
    return csvContent;
  };

  const handleExportInvoicesCSV = () => {
    const csvContent = generateInvoiceCSV(filteredInvoices);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const now = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `staybookt-invoices-${now}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`p-4 sm:p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen`}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
          {t('invoices.title')}
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Manage invoices and track payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3 sm:gap-4 sm:p-6 mb-6 sm:mb-8">
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-4 sm:p-6`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
              {t('invoices.title')}
            </p>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{invoices.length}</p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>All time</p>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-4 sm:p-6`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
              {t('invoices.outstanding')}
            </p>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>
            {outstandingInvoices.length + partialInvoices.length} invoices
          </p>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-4 sm:p-6`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
              {t('invoices.paidThisMonth')}
            </p>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ${paidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>{paidInvoices.length} paid</p>
        </div>

        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-4 sm:p-6`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
              {t('invoices.collectionRate')}
            </p>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{collectionPercent}%</p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>of total invoiced</p>
        </div>
      </div>

      {/* Payment Collection Progress */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-4 sm:p-6 mb-8`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Payment Collection</h3>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{collectionPercent}%</span>
        </div>
        <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-full h-3 overflow-hidden mb-6`}>
          <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all" style={{ width: `${collectionPercent}%` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Collected</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Outstanding</p>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Overdue</p>
            <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
              ${overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-4 sm:p-6 mb-8`}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportInvoicesCSV}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition whitespace-nowrap border ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => {
                resetForm();
                setModal({ type: 'create' });
              }}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {t('invoices.createInvoice')}
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'draft', 'sent', 'paid', 'overdue', 'partial'] as const).map((status) => {
            let count = 0;
            if (status === 'all') count = invoices.length;
            else if (status === 'overdue') count = overdueInvoices.length;
            else count = invoices.filter((i) => i.status === status).length;

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
        {filteredInvoices.length > 0 ? (
          <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => router.push(`/invoices/${invoice.id}`)}
                className={`p-4 cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {invoice.number}
                    </p>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {invoice.customerName}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Due {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[invoice.status]}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                    {invoice.amountPaid > 0 && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ${invoice.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })} paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No invoices found</p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className={`hidden md:block ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} border-b`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Invoice #
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Customer
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Total
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Paid
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Due Date
                </th>
                <th className={`px-6 py-4 text-right text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wide`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onMouseEnter={() => setHoveredRow(invoice.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition cursor-pointer ${
                      hoveredRow === invoice.id ? (isDark ? 'bg-blue-900' : 'bg-blue-50') : ''
                    }`}
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {invoice.number}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {invoice.customerName}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ${invoice.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[invoice.status]}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/invoices/${invoice.id}`);
                          }}
                          className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
                          title="View"
                        >
                          <Eye className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(invoice.id);
                          }}
                          className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
                          title="Edit"
                        >
                          <Edit className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                        </button>

                        {invoice.status !== 'paid' && (
                          <button
                            className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
                            title="Send Reminder"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Bell className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                          </button>
                        )}

                        {invoice.status !== 'paid' && (
                          <button
                            className={`p-2 ${isDark ? 'hover:bg-emerald-900' : 'hover:bg-emerald-50'} rounded-lg transition`}
                            title="Record Payment"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPaymentModal(invoice.id);
                            }}
                          >
                            <DollarSign className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          </button>
                        )}

                        <button
                          className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
                          title="Download PDF"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                        </button>

                        <button
                          className={`p-2 ${isDark ? 'hover:bg-red-900' : 'hover:bg-red-50'} rounded-lg transition`}
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvoice(invoice.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={`px-6 py-12 text-center`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No invoices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Invoice Modal */}
      {(modal.type === 'create' || modal.type === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`sticky top-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b p-4 sm:p-6 flex items-center justify-between`}>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {modal.type === 'create' ? 'Create Invoice' : 'Edit Invoice'}
              </h2>
              <button
                onClick={() => {
                  setModal({ type: null });
                  resetForm();
                }}
                className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
            </div>

            {!showSuccessMessage ? (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Contact Selector */}
                {modal.type === 'create' && (
                  <div>
                    <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                      Contact *
                    </label>
                    <select
                      value={selectedContactId}
                      onChange={(e) => {
                        setSelectedContactId(e.target.value);
                        setSelectedEstimateId('');
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                        isDark
                          ? 'bg-slate-900 border-slate-600 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="">Select a contact...</option>
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Create from Estimate */}
                {modal.type === 'create' && selectedContactId && contactEstimates.length > 0 && (
                  <div>
                    <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                      Create from Estimate (Optional)
                    </label>
                    <select
                      value={selectedEstimateId}
                      onChange={(e) => handleEstimateSelect(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                        isDark
                          ? 'bg-slate-900 border-slate-600 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="">Start from scratch...</option>
                      {contactEstimates.map((estimate) => (
                        <option key={estimate.id} value={estimate.id}>
                          {estimate.number} - {estimate.service}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Line Items *
                    </label>
                    <button
                      onClick={handleAddLineItem}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      + Add Line
                    </button>
                  </div>

                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {lineItems.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                            isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className={`w-20 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                            isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className={`w-24 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                            isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <span className={`w-24 px-3 py-2 rounded-lg text-sm font-medium ${
                          isDark ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'
                        }`}>
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                        {lineItems.length > 1 && (
                          <button
                            onClick={() => handleRemoveLineItem(idx)}
                            className={`p-2 ${isDark ? 'hover:bg-red-900' : 'hover:bg-red-50'} rounded-lg transition`}
                          >
                            <X className="w-4 h-4 text-rose-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Province Selector */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Province *
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark
                        ? 'bg-slate-900 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    {PROVINCES.map((prov) => (
                      <option key={prov.code} value={prov.code}>
                        {prov.name} ({prov.taxType} {(prov.taxRate * 100).toFixed(3)}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing Summary */}
                <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-4 rounded-lg space-y-2`}>
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Subtotal</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      Tax ({provinceInfo?.taxType} {(taxRate * 100).toFixed(3)}%)
                    </span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between text-sm border-t pt-2 ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total</span>
                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark
                        ? 'bg-slate-900 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or terms..."
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none ${
                      isDark
                        ? 'bg-slate-900 border-slate-600 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                  <button
                    onClick={() => {
                      setModal({ type: null });
                      resetForm();
                    }}
                    className={`flex-1 px-4 py-2 ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} border rounded-lg font-medium transition`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modal.type === 'create' ? handleCreateInvoice : handleEditInvoice}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    {modal.type === 'create' ? 'Create Invoice' : 'Save Changes'}
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
                  {modal.type === 'create' ? 'Invoice Created!' : 'Invoice Updated!'}
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {modal.type === 'create'
                    ? 'Your invoice has been created.'
                    : 'Your invoice has been updated.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {modal.type === 'payment' && currentInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg max-w-md w-full`}>
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b p-4 sm:p-6 flex items-center justify-between`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Record Payment</h2>
              <button
                onClick={() => setModal({ type: null })}
                className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} rounded-lg transition`}
              >
                <X className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Invoice</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentInvoice.number}</p>
              </div>

              <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Outstanding Balance</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ${(currentInvoice.total - currentInvoice.amountPaid).toFixed(2)}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                  Payment Amount *
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-2.5 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      isDark ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => setModal({ type: null })}
                  className={`flex-1 px-4 py-2 ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-lg font-medium transition`}
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
