'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { Contact, LeadSource, ContactType } from '@/types';
import { Modal } from '@/components/Modal';
import { LeadSourceBadge } from '@/components/LeadSourceBadge';
import { Plus, X, Download, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';
import { ContactMobileCard } from '@/components/contacts/ContactMobileCard';
import { ContactTableRow } from '@/components/contacts/ContactTableRow';
import { ContactFilters } from '@/components/contacts/ContactFilters';
import { ContactDetailPanel } from '@/components/contacts/ContactDetailPanel';

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
  occupation?: string;
  kids?: string;
  pets?: string;
  interests?: string;
  personalNotes?: string;
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
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

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

  const toggleContactSelection = (contactId: string) => {
    const newSelected = new Set(selectedContactIds);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContactIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedContactIds.size === filteredContacts.length) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const clearSelection = () => {
    setSelectedContactIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedContactIds.size === 0) return;

    const selectedList = filteredContacts.filter((c) =>
      selectedContactIds.has(c.id)
    );

    const contactsWithDeals = selectedList.filter((c) => {
      const linkedDeals = getDealsByContact(c.id);
      return linkedDeals.length > 0;
    });

    if (contactsWithDeals.length > 0) {
      alert(
        `Cannot delete ${contactsWithDeals.length} contact(s) because they have linked deals. Please delete or reassign those deals first.`
      );
      return;
    }

    setIsBulkDeleteConfirmOpen(true);
  };

  const confirmBulkDelete = () => {
    selectedContactIds.forEach((id) => {
      const contact = contacts.find((c) => c.id === id);
      if (contact) {
        deleteContact(id);
        addActivity({
          type: 'note',
          description: `Deleted contact: ${contact.name}`,
        });
      }
    });
    setSelectedContactIds(new Set());
    setIsBulkDeleteConfirmOpen(false);
  };

  const handleBulkExportCSV = () => {
    if (selectedContactIds.size === 0) return;
    const selectedContacts = filteredContacts.filter((c) =>
      selectedContactIds.has(c.id)
    );
    const csvContent = generateCSV(selectedContacts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const now = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `staybookt-contacts-selected-${now}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      occupation: contact.occupation,
      kids: contact.kids,
      pets: contact.pets,
      interests: contact.interests,
      personalNotes: contact.personalNotes,
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

  const generateCSV = (data: Contact[]) => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Source', 'Address', 'Created Date'];

    const rows = data.map((contact) => [
      `"${contact.name.replace(/"/g, '""')}"`,
      `"${contact.email.replace(/"/g, '""')}"`,
      `"${contact.phone.replace(/"/g, '""')}"`,
      contact.type,
      getSourceLabel(contact.source),
      `"${contact.address.replace(/"/g, '""')}"`,
      new Date(contact.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows.map((row) => row.join(','))].join('\n');
    return csvContent;
  };

  const handleExportCSV = () => {
    const csvContent = generateCSV(filteredContacts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const now = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `staybookt-contacts-${now}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'} relative`}>
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium border ${
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
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
        </div>

        {/* Search and Filters */}
        <ContactFilters
          isDark={isDark}
          searchQuery={searchQuery}
          filterType={filterType}
          filterSource={filterSource}
          onSearchChange={setSearchQuery}
          onTypeFilterChange={setFilterType}
          onSourceFilterChange={setFilterSource}
          leadSources={LEAD_SOURCES}
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactMobileCard
              key={contact.id}
              contact={contact}
              isDark={isDark}
              dealCount={getDealCount(contact.id)}
              onOpenDetailView={openDetailView}
            />
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              {searchQuery || filterType !== 'all' || filterSource !== 'all'
                ? t('contacts.notFound')
                : t('contacts.noContacts')}
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b sticky top-0`}>
            <tr>
              <th className={`px-3 sm:px-4 py-3 sm:py-4 text-center text-sm font-semibold w-12 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={selectedContactIds.size > 0 && selectedContactIds.size === filteredContacts.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded cursor-pointer"
                  aria-label="Select all contacts"
                />
              </th>
              <th className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.nameAddress')}
              </th>
              <th className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm font-semibold hidden sm:table-cell ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.type')}
              </th>
              <th className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm font-semibold hidden sm:table-cell ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.source')}
              </th>
              <th className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.contact')}
              </th>
              <th className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('contacts.deals')}
              </th>
              <th className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactTableRow
                  key={contact.id}
                  contact={contact}
                  isDark={isDark}
                  isSelected={selectedContactIds.has(contact.id)}
                  dealCount={getDealCount(contact.id)}
                  onToggleSelect={toggleContactSelection}
                  onOpenDetailView={openDetailView}
                  onOpenEditModal={openEditModal}
                  onOpenDeleteConfirm={openDeleteConfirm}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className={`px-6 py-8 text-center`}>
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

      {/* Bulk Actions Bar */}
      {selectedContactIds.size > 0 && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 border-t transition-all duration-300 ease-out ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          } shadow-lg`}
        >
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedContactIds.size} {selectedContactIds.size === 1 ? 'contact' : 'contacts'} selected
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleBulkExportCSV}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium border text-sm ${
                  isDark
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={clearSelection}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  isDark
                    ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

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
        <ContactDetailPanel
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

      {/* Bulk Delete Confirmation Dialog */}
      {isBulkDeleteConfirmOpen && (
        <BulkDeleteConfirmDialog
          isOpen={isBulkDeleteConfirmOpen}
          onClose={() => setIsBulkDeleteConfirmOpen(false)}
          onConfirm={confirmBulkDelete}
          count={selectedContactIds.size}
          isDark={isDark}
        />
      )}

      {/* Spacing for bulk actions bar */}
      {selectedContactIds.size > 0 && <div className="h-24" />}
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
    occupation: '',
    kids: '',
    pets: '',
    interests: '',
    personalNotes: '',
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
      occupation: '',
      kids: '',
      pets: '',
      interests: '',
      personalNotes: '',
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <PersonalDetailsSection
            formData={formData}
            setFormData={setFormData}
            isDark={isDark}
          />

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

interface PersonalDetailsSectionProps {
  formData: ContactFormData;
  setFormData: (data: ContactFormData) => void;
  isDark: boolean;
}

function PersonalDetailsSection({
  formData,
  setFormData,
  isDark,
}: PersonalDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`border rounded-lg ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between ${
          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
        } transition-colors`}
      >
        <span className={`font-medium text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Personal Details
        </span>
        <span className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className={`px-4 py-4 space-y-4 border-t ${isDark ? 'border-slate-600 bg-slate-700/50' : 'border-slate-300 bg-slate-50'}`}>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Occupation
            </label>
            <input
              type="text"
              value={formData.occupation || ''}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              placeholder="e.g., Architect, Engineer"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Kids
            </label>
            <input
              type="text"
              value={formData.kids || ''}
              onChange={(e) => setFormData({ ...formData, kids: e.target.value })}
              placeholder="e.g., 2 boys - Jake 8, Liam 5"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Pets
            </label>
            <input
              type="text"
              value={formData.pets || ''}
              onChange={(e) => setFormData({ ...formData, pets: e.target.value })}
              placeholder="e.g., Golden retriever named Max"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Interests
            </label>
            <input
              type="text"
              value={formData.interests || ''}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="e.g., Soccer, golf, wine collecting"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Personal Notes
            </label>
            <textarea
              value={formData.personalNotes || ''}
              onChange={(e) => setFormData({ ...formData, personalNotes: e.target.value })}
              placeholder="Add personal context for building relationships..."
              rows={2}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>
      )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <PersonalDetailsSection
            formData={formData}
            setFormData={setFormData}
            isDark={isDark}
          />

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

interface BulkDeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isDark: boolean;
}

function BulkDeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  count,
  isDark,
}: BulkDeleteConfirmDialogProps) {
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
            Delete Contacts
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
            Are you sure you want to delete <strong>{count} {count === 1 ? 'contact' : 'contacts'}</strong>? This action cannot be undone.
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
