'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { ContactRow } from '@/components/ContactRow';
import { Modal } from '@/components/Modal';
import { AddContactForm } from '@/components/AddContactForm';
import { Plus, Search } from 'lucide-react';

export default function ContactsPage() {
  const { contacts, deals, initializeSeedData } = useStore();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const getDealCount = (contactId: string) =>
    deals.filter((d) => d.contactId === contactId).length;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Contacts</h1>
            <p className="text-slate-600 mt-1">
              {contacts.length} total contacts
            </p>
          </div>
          <button
            onClick={() => setIsAddContactOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Contact
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Name & Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Source
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Contact
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Deals
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  dealCount={getDealCount(contact.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-slate-500">
                    {searchQuery ? 'No contacts found' : 'No contacts yet'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        title="Add New Contact"
      >
        <AddContactForm onClose={() => setIsAddContactOpen(false)} />
      </Modal>
    </div>
  );
}
