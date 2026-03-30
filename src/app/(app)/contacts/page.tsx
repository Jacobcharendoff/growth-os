'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { Contact, LeadSource, ContactType } from '@/types';
import { Modal } from '@/components/Modal';
import { LeadSourceBadge } from '@/components/LeadSourceBadge';
import { Plus, Search, Edit2, Trash2, X, ChevronDown, FileText, DollarSign, Clock, User } from 'lucide-react';
import { FormEvent } from 'react';

const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'existing_customer', label: 'Existing Customer' },
  { value: 'reactivation', label: 'Reactivation' },
  { value: 'cross_sell', label: 'Cross-Sell' },
  { value: 'referral', label: 'Referral' },
  { value: 'review', label: 'Review' },
  { value: 'neighborhood', label: 'Neighborhood' },
  { value: 'google_lsa', label: 'Google LSA' },
  { value: 'seo', label: 'SEO' },
  { value: 'gbp', label: 'Google Business' },
];

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  type: ContactType;
  source: LeadSource;
  notes: string;
}

export default function ContactsPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    contacts,
    deals,
    estimates,
    invoices,
    initializeSeedData,
    addContact,
    updateContact,
    deleteContact,
    addActivity,
    getDealsByContact,
    getEstimatesByContact,
    getInvoicesByContact,
  } = useStore();

  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ContactType | 'all'>('all');
  const [filterSource, setFilterSource] = useState<LeadSource | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editFormData, setEditFormData] = useState<ContactFormData | null>(null);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, [initializeSeedData]);

  if (!mounted) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-8 animate-pulse`}>
        <div className={`h-8 ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded w-48 mb-6`}></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl h-28 shadow-sm`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesSource = filterSource === 'all' || c.source === filterSource;

    return matchesSearch && matchesType && matchesSource;
  });

  const getDealCount = (contactId: string) =>
    deals.filter((d) => d.contactId === contactId).length;

  const handleAddContact = (formData: ContactFormData) => {
    addContact(formData);
    addActivity({
      contactId: selectedContact?.id || '',
      type: 'note',
      description: `Added contact: ${formData.name}`,
    });
    setIsAddContactOpen(false);
  };

  const handleEditContact = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !editFormData) return;

    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    updateContact(selectedContact.id, editFormData);
    addActivity({
      contactId: selectedContact.id,
      type: 'note',
      description: `Updated contact: ${editFormData.name}`,
    });
    setIsEditContactOpen(false);
    setSelectedContact(null);
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;

    const linkedDeals = getDealsByContact(selectedContact.id);
    if (linkedDeals.length > 0) {
      alert(
        `This contact has ${linkedDeals.length} linked deal(s). Please delete or reassign those deals first.`
      );
      return;
    }

    deleteContact(selectedContact.id);
    addActivity({
      type: 'note',
      description: `Deleted contact: ${selectedContact.name}`,
    });
    setIsDeleteConfirmOpen(false);
    setIsDetailViewOpen(false);
    setSelectedContact(null);
  };

  const openDetailView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailViewOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setEditFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      type: contact.type,
      source: contact.source,
      notes: contact.notes,
    });
    setIsEditContactOpen(true);
  };

  const openDeleteConfirm = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteConfirmOpen(true);
  };

  const contactDeals = selectedContact ? getDealsByContact(selectedContact.id) : [];
  const contactEstimates = selectedContact ? getEstimatesByContact(selectedContact.id) : [];
  const contactInvoices = selectedContact ? getInvoicesByContact(selectedContact.id) : [];

  const getSourceLabel = (source: LeadSource) => {
    return LEAD_SOURCES.find((s) => s.value === source)?.label || source;
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-4 sm:px-8 py-4 sm:py-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('contacts.title')}
            </h1>
            <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {contacts.length} {t('contacts.totalContacts')}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedContact(null);
              setEditFormData(null);
              setIsAddContactOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {t('contacts.addContact')}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder={t('contacts.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400'
                  : 'border-slate-300 bg-white text-slate-900'
              }`}
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('customer')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'customer'
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setFilterType('lead')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'lead'
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Leads
            </button>

            <div className="flex-1"></div>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value as LeadSource | 'all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 text-slate-300 border-slate-600'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <option value="all">All Sources</option>
              {LEAD_SOURCES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b sticky top-0`}>
            <tr>
              <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.nameAddress')}
              </th>
              <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold hidden sm:table-cell ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.type')}
              </th>
              <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold hidden sm:table-cell ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.source')}
              </th>
              <th className={`px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.contact')}
              </th>
              <th className={`px-3 sm:px-6 py-3 sm:py-4 text-right text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.deals')}
              </th>
              <th className={`px-3 sm:px-6 py-3 sm:py-4 text-right text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`border-b ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-colors`}
                >
                  <td
                    className={`px-3 sm:px-6 py-4 cursor-pointer`}
                    onClick={() => openDetailView(contact)}
                  >
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {contact.name}
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {contact.address}
                      </p>
                    </div>
                  </td>
                  <td className={`px-3 sm:px-6 py-4 hidden sm:table-cell`}>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        contact.type === 'customer'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {contact.type === 'customer' ? 'Customer' : 'Lead'}
                    </span>
                  </td>
                  <td className={`px-3 sm:px-6 py-4 hidden sm:table-cell`}>
                    <LeadSourceBadge source={contact.source} />
                  </td>
                  <td className={`px-3 sm:px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {contact.email}
                  </td>
                  <td className={`px-3 sm:px-6 py-4 text-right`}>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {getDealCount(contact.id)}
                    </span>
                  </td>
                  <td className={`px-3 sm:px-6 py-4 text-right`}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(contact)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(contact)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? 'hover:bg-red-900 text-red-400 hover:text-red-200'
                            : 'hover:bg-red-100 text-red-600 hover:text-red-900'
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={`px-6 py-8 text-center`}>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {searchQuery || filterType !== 'all' || filterSource !== 'all'
                      ? t('contacts.notFound')
                      : t('contacts.noContacts')}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSubmit={handleAddContact}
        isDark={isDark}
      />

      {/* Edit Contact Modal */}
      {editFormData && (
        <EditContactModal
          isOpen={isEditContactOpen}
          onClose={() => {
            setIsEditContactOpen(false);
            setSelectedContact(null);
            setEditFormData(null);
          }}
          onSubmit={handleEditContact}
          formData={editFormData}
          setFormData={setEditFormData}
          isDark={isDark}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedContact && (
        <DeleteConfirmDialog
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            setIsDeleteConfirmOpen(false);
            setSelectedContact(null);
          }}
          onConfirm={handleDeleteContact}
          contact={selectedContact}
          isDark={isDark}
        />
      )}

      {/* Contact Detail View */}
      {selectedContact && (
        <ContactDetailView
          isOpen={isDetailViewOpen}
          onClose={() => {
            setIsDetailViewOpen(false);
            setSelectedContact(null);
          }}
          contact={selectedContact}
          deals={contactDeals}
          estimates={contactEstimates}
          invoices={contactInvoices}
          isDark={isDark}
        />
      )}
    </div>
  );
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
  isDark: boolean;
}

function AddContactModal({ isOpen, onClose, onSubmit, isDark }: AddContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'lead',
    source: 'referral',
    notes: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'lead',
      source: 'referral',
      notes: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-xl max-w-md w-full mx-4`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Add New Contact
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, Denver, CO 80202"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as ContactType,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="lead">Lead</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source: e.target.value as LeadSource,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {LEAD_SOURCES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this contact..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Contact
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 font-medium py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  formData: ContactFormData;
  setFormData: (data: ContactFormData) => void;
  isDark: boolean;
}

function EditContactModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isDark,
}: EditContactModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-xl max-w-md w-full mx-4`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Edit Contact
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, Denver, CO 80202"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as ContactType,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="lead">Lead</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source: e.target.value as LeadSource,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {LEAD_SOURCES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this contact..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 font-medium py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contact: Contact;
  isDark: boolean;
}

function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  contact,
  isDark,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-xl max-w-md w-full mx-4`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Delete Contact
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Are you sure you want to delete <strong>{contact.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className={`flex-1 font-medium py-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContactDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  deals: any[];
  estimates: any[];
  invoices: any[];
  isDark: boolean;
}

function ContactDetailView({
  isOpen,
  onClose,
  contact,
  deals,
  estimates,
  invoices,
  isDark,
}: ContactDetailViewProps) {
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
        <div className={`sticky top-0 px-6 py-4 border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
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
        <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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

        {/* KPI Cards */}
        <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="grid grid-cols-2 gap-3">
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
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
          <div className={`px-6 py-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
