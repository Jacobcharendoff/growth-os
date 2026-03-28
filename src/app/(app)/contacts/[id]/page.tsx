'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { Contact, Deal, Activity } from '@/types';
import { LeadSourceBadge } from '@/components/LeadSourceBadge';
import {
  ChevronLeft,
  Edit,
  DollarSign,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Phone as PhoneIcon,
  FileText,
  MessageSquare,
  CheckSquare,
  Plus,
  Clock,
  User,
} from 'lucide-react';
import Link from 'next/link';

const ACTIVITY_ICONS = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  estimate: FileText,
  payment: DollarSign,
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getContact, getDealsByContact, activities, initializeSeedData, updateContact } = useStore();

  const [mounted, setMounted] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contactActivities, setContactActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, [initializeSeedData]);

  useEffect(() => {
    if (mounted && id) {
      const foundContact = getContact(id);
      setContact(foundContact || null);

      if (foundContact) {
        const relatedDeals = getDealsByContact(id);
        setDeals(relatedDeals);

        const relatedActivities = activities.filter(
          (a) => a.contactId === id
        );
        setContactActivities(relatedActivities.sort((a, b) => b.createdAt - a.createdAt));

        setNotes(foundContact.notes);
      }
    }
  }, [mounted, id, getContact, getDealsByContact, activities]);

  const handleSaveNotes = async () => {
    if (!contact) return;
    setIsSavingNotes(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateContact(contact.id, { notes });
    setEditingNotes(false);
    setIsSavingNotes(false);
  };

  const calculateStats = () => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const avgValue = deals.length > 0 ? totalValue / deals.length : 0;
    const createdDate = contact ? new Date(contact.createdAt) : null;
    const daysAsCustomer = createdDate
      ? Math.floor((Date.now() - contact!.createdAt) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      totalDeals: deals.length,
      totalValue,
      avgValue,
      daysAsCustomer,
    };
  };

  const stats = calculateStats();
  const contactTypeColor =
    contact?.type === 'customer'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-blue-100 text-blue-700';

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!contact) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="px-8 py-6 border-b border-slate-200">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Contacts
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 text-lg">Contact not found</p>
            <Link
              href="/contacts"
              className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              Return to contacts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Contacts
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Edit className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">{contact.name}</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${contactTypeColor}`}>
            {contact.type === 'customer' ? 'Customer' : 'Lead'}
          </span>
        </div>
        <div className="mt-3">
          <LeadSourceBadge source={contact.source} variant="full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-8 py-4 sm:py-6 space-y-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Phone</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Address</p>
                  <p className="text-slate-900 font-medium">{contact.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Member Since</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Total Deals</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalDeals}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Total Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${stats.totalValue.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Avg Deal Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${stats.avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Days as Customer</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.daysAsCustomer}</p>
          </div>
        </div>

        {/* Associated Deals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Associated Deals ({deals.length})</h2>
          {deals.length > 0 ? (
            <div className="space-y-3">
              {deals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/pipeline/${deal.id}`}
                  className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{deal.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {deal.stage.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-medium text-slate-600">
                          {deal.assignedTo}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${deal.value.toLocaleString()}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Updated {new Date(deal.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No deals yet for this contact</p>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h2>
          {contactActivities.length > 0 ? (
            <div className="space-y-4">
              {contactActivities.map((activity) => {
                const IconComponent = ACTIVITY_ICONS[activity.type];
                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1 pb-4 last:pb-0">
                      <p className="text-sm font-semibold text-slate-900 capitalize">
                        {activity.type}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(activity.createdAt).toLocaleDateString()}{' '}
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No activities yet</p>
          )}
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
            {!editingNotes && (
              <button
                onClick={() => setEditingNotes(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {editingNotes ? (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={6}
                placeholder="Add notes about this contact..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingNotes(false);
                    setNotes(contact.notes);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  {isSavingNotes ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-700 whitespace-pre-wrap">{notes || 'No notes yet'}</p>
          )}
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors">
              <Phone className="w-4 h-4" />
              Log Call
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors">
              <Mail className="w-4 h-4" />
              Send Email
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors">
              <FileText className="w-4 h-4" />
              Create Estimate
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors">
              <Plus className="w-4 h-4" />
              Add Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
