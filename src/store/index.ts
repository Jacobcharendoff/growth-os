'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact, Deal, Activity, Estimate, Invoice, LeadSource, PipelineStage, EstimateStatus, InvoiceStatus } from '@/types';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

interface PipelineStageSetting {
  id: string;
  name: string;
  color: string;
}

interface AppSettings {
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  industry: string;
  timezone: string;
  teamMembers: TeamMember[];
  pipelineStages: PipelineStageSetting[];
}

interface AppNotification {
  id: string;
  type: 'deal_created' | 'deal_moved' | 'estimate_sent' | 'invoice_paid' | 'contact_added' | 'payment_received' | 'system';
  title: string;
  description: string;
  read: boolean;
  createdAt: number;
  linkTo?: string;
}

interface GrowthOSStore {
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  estimates: Estimate[];
  invoices: Invoice[];
  settings: AppSettings;
  notifications: AppNotification[];

  // Contact operations
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;

  // Deal operations
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  getDeal: (id: string) => Deal | undefined;
  getDealsByStage: (stage: PipelineStage) => Deal[];
  getDealsByContact: (contactId: string) => Deal[];

  // Estimate operations
  addEstimate: (estimate: Omit<Estimate, 'id' | 'number' | 'createdAt'>) => string;
  updateEstimate: (id: string, updates: Partial<Estimate>) => void;
  deleteEstimate: (id: string) => void;
  getEstimate: (id: string) => Estimate | undefined;
  getEstimatesByContact: (contactId: string) => Estimate[];
  updateEstimateStatus: (id: string, status: EstimateStatus) => void;

  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id' | 'number' | 'createdAt'>) => string;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  getInvoicesByContact: (contactId: string) => Invoice[];
  recordPayment: (id: string, amount: number) => void;

  // Activity operations
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  getActivities: (limit?: number) => Activity[];

  // Settings operations
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Notification operations
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;

  // Initialize seed data
  initializeSeedData: () => void;
}

const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);

const DEFAULT_SETTINGS: AppSettings = {
  companyName: 'ProPlumbers Inc.',
  companyPhone: '(720) 555-0123',
  companyEmail: 'info@proplumbers.com',
  companyAddress: '1234 Main St, Denver, CO 80202',
  industry: 'plumbing',
  timezone: 'America/Denver',
  teamMembers: [
    { id: '1', name: 'Alex Johnson', role: 'owner', color: 'bg-blue-500' },
    { id: '2', name: 'Marcus Thompson', role: 'manager', color: 'bg-emerald-500' },
    { id: '3', name: 'Sarah Williams', role: 'technician', color: 'bg-purple-500' },
    { id: '4', name: 'James Rodriguez', role: 'technician', color: 'bg-orange-500' },
  ],
  pipelineStages: [
    { id: '1', name: 'New Lead', color: 'blue' },
    { id: '2', name: 'Contacted', color: 'slate' },
    { id: '3', name: 'Estimate Scheduled', color: 'purple' },
    { id: '4', name: 'Estimate Sent', color: 'indigo' },
    { id: '5', name: 'Booked', color: 'cyan' },
    { id: '6', name: 'In Progress', color: 'amber' },
    { id: '7', name: 'Completed', color: 'emerald' },
    { id: '8', name: 'Invoiced', color: 'green' },
  ],
};

const SEED_DATA = {
  contacts: [
    {
      name: 'John Martinez',
      email: 'j.martinez@email.com',
      phone: '(555) 123-4567',
      address: '1247 Oak Street, Denver, CO 80202',
      type: 'customer' as const,
      source: 'existing_customer' as const,
      notes: 'Regular customer, main line issues',
    },
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '(555) 234-5678',
      address: '3521 Maple Avenue, Denver, CO 80203',
      type: 'lead' as const,
      source: 'referral' as const,
      notes: 'Referred by John Martinez',
    },
    {
      name: 'Michael O\'Brien',
      email: 'mobrien@email.com',
      phone: '(555) 345-6789',
      address: '5832 Pine Road, Denver, CO 80204',
      type: 'customer' as const,
      source: 'google_lsa' as const,
      notes: 'Kitchen faucet replacement, high-value',
    },
    {
      name: 'Jennifer Williams',
      email: 'j.williams@email.com',
      phone: '(555) 456-7890',
      address: '2104 Elm Court, Denver, CO 80205',
      type: 'lead' as const,
      source: 'review' as const,
      notes: 'Found us on Google reviews',
    },
    {
      name: 'David Rodriguez',
      email: 'd.rodriguez@email.com',
      phone: '(555) 567-8901',
      address: '4756 Birch Lane, Denver, CO 80206',
      type: 'customer' as const,
      source: 'neighborhood' as const,
      notes: 'Multiple bathroom remodels',
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '(555) 678-9012',
      address: '6321 Willow Drive, Denver, CO 80207',
      type: 'lead' as const,
      source: 'seo' as const,
      notes: 'Water heater needs replacement',
    },
    {
      name: 'Robert Thompson',
      email: 'r.thompson@email.com',
      phone: '(555) 789-0123',
      address: '7890 Cedar Street, Denver, CO 80208',
      type: 'customer' as const,
      source: 'reactivation' as const,
      notes: 'Previous customer, new project',
    },
    {
      name: 'Patricia King',
      email: 'p.king@email.com',
      phone: '(555) 890-1234',
      address: '1432 Spruce Avenue, Denver, CO 80209',
      type: 'lead' as const,
      source: 'gbp' as const,
      notes: 'Found on Google Business Profile',
    },
    {
      name: 'James Davis',
      email: 'j.davis@email.com',
      phone: '(555) 901-2345',
      address: '2567 Ash Court, Denver, CO 80210',
      type: 'customer' as const,
      source: 'existing_customer' as const,
      notes: 'Sewer line repair, repeat customer',
    },
    {
      name: 'Michelle Jackson',
      email: 'm.jackson@email.com',
      phone: '(555) 012-3456',
      address: '3698 Poplar Lane, Denver, CO 80211',
      type: 'lead' as const,
      source: 'referral' as const,
      notes: 'Referred by David Rodriguez',
    },
    {
      name: 'Christopher Lee',
      email: 'c.lee@email.com',
      phone: '(555) 111-2222',
      address: '4789 Oak Ridge, Denver, CO 80212',
      type: 'customer' as const,
      source: 'cross_sell' as const,
      notes: 'Previous water softener install, needs plumbing',
    },
    {
      name: 'Amanda White',
      email: 'a.white@email.com',
      phone: '(555) 222-3333',
      address: '5876 Maple Drive, Denver, CO 80213',
      type: 'lead' as const,
      source: 'neighborhood' as const,
      notes: 'Local to John Martinez area',
    },
    {
      name: 'Kevin Harris',
      email: 'k.harris@email.com',
      phone: '(555) 333-4444',
      address: '6945 Pine Avenue, Denver, CO 80214',
      type: 'customer' as const,
      source: 'google_lsa' as const,
      notes: 'Toilet replacement and leak repair',
    },
    {
      name: 'Rachel Green',
      email: 'r.green@email.com',
      phone: '(555) 444-5555',
      address: '7012 Elm Street, Denver, CO 80215',
      type: 'lead' as const,
      source: 'review' as const,
      notes: 'Excellent plumber reviews, considering work',
    },
    {
      name: 'Daniel Brown',
      email: 'd.brown@email.com',
      phone: '(555) 555-6666',
      address: '8123 Birch Road, Denver, CO 80216',
      type: 'customer' as const,
      source: 'seo' as const,
      notes: 'Comprehensive bathroom remodel rough-in',
    },
  ],

  deals: [
    {
      contactId: 0,
      title: 'Main Line Repair',
      value: 3500,
      stage: 'invoiced' as PipelineStage,
      source: 'existing_customer' as LeadSource,
      assignedTo: 'Team',
      notes: 'Main sewer line repair completed',
    },
    {
      contactId: 1,
      title: 'Kitchen Faucet Installation',
      value: 850,
      stage: 'estimate_scheduled' as PipelineStage,
      source: 'referral' as LeadSource,
      assignedTo: 'Marcus',
      notes: 'High-end faucet, needs precise installation',
    },
    {
      contactId: 2,
      title: 'Water Heater Replacement',
      value: 2200,
      stage: 'booked' as PipelineStage,
      source: 'google_lsa' as LeadSource,
      assignedTo: 'James',
      notes: '50 gallon tank installation scheduled',
      scheduledDate: Date.now() + 3 * 86400000 + 14 * 3600000, // 3 days, 2 PM
    },
    {
      contactId: 3,
      title: 'Bathroom Remodel Rough-In',
      value: 5600,
      stage: 'contacted' as PipelineStage,
      source: 'review' as LeadSource,
      assignedTo: 'Team',
      notes: 'Complete bathroom rough-in including plumbing',
    },
    {
      contactId: 4,
      title: 'Bathroom Fixture Installation',
      value: 3200,
      stage: 'in_progress' as PipelineStage,
      source: 'neighborhood' as LeadSource,
      assignedTo: 'Marcus',
      notes: 'Final phase of bathroom remodel',
      scheduledDate: Date.now() + 5 * 86400000 + 10 * 3600000, // 5 days, 10 AM
    },
    {
      contactId: 5,
      title: 'Water Heater Inspection',
      value: 1200,
      stage: 'new_lead' as PipelineStage,
      source: 'seo' as LeadSource,
      assignedTo: 'James',
      notes: 'Old unit showing signs of failure',
    },
    {
      contactId: 6,
      title: 'Sewer Line Replacement',
      value: 8900,
      stage: 'estimate_sent' as PipelineStage,
      source: 'reactivation' as LeadSource,
      assignedTo: 'Team',
      notes: 'Full sewer line from house to street',
    },
    {
      contactId: 7,
      title: 'Toilet Replacement',
      value: 650,
      stage: 'completed' as PipelineStage,
      source: 'gbp' as LeadSource,
      assignedTo: 'James',
      notes: 'High-efficiency toilet, water-saving model',
    },
    {
      contactId: 8,
      title: 'Leak Repair and Inspection',
      value: 2100,
      stage: 'invoiced' as PipelineStage,
      source: 'existing_customer' as LeadSource,
      assignedTo: 'Marcus',
      notes: 'Found and repaired main water leak',
    },
    {
      contactId: 9,
      title: 'Pipe Insulation Installation',
      value: 1800,
      stage: 'new_lead' as PipelineStage,
      source: 'referral' as LeadSource,
      assignedTo: 'Team',
      notes: 'Basement pipes need freeze protection',
    },
    {
      contactId: 10,
      title: 'Sump Pump Installation',
      value: 4500,
      stage: 'estimate_scheduled' as PipelineStage,
      source: 'cross_sell' as LeadSource,
      assignedTo: 'James',
      notes: 'Basement flooding concerns',
    },
    {
      contactId: 11,
      title: 'Outdoor Faucet Repair',
      value: 450,
      stage: 'contacted' as PipelineStage,
      source: 'neighborhood' as LeadSource,
      assignedTo: 'Marcus',
      notes: 'Year-round outdoor fixtures',
    },
    {
      contactId: 12,
      title: 'Whole House Repipe',
      value: 12500,
      stage: 'estimate_sent' as PipelineStage,
      source: 'google_lsa' as LeadSource,
      assignedTo: 'Team',
      notes: 'Original copper pipes showing corrosion',
    },
    {
      contactId: 13,
      title: 'Drain Cleaning Service',
      value: 550,
      stage: 'new_lead' as PipelineStage,
      source: 'review' as LeadSource,
      assignedTo: 'James',
      notes: 'Kitchen and bathroom drains slow',
    },
    {
      contactId: 14,
      title: 'Complete Master Bath Renovation',
      value: 7800,
      stage: 'booked' as PipelineStage,
      source: 'seo' as LeadSource,
      assignedTo: 'Team',
      notes: 'Includes new fixtures, plumbing, ventilation',
      scheduledDate: Date.now() + 7 * 86400000 + 11 * 3600000, // 7 days, 11 AM
    },
  ],

  activities: [
    {
      dealId: '0',
      contactId: '0',
      type: 'call' as const,
      description: 'Called to confirm main line repair completion',
    },
    {
      dealId: '1',
      contactId: '1',
      type: 'email' as const,
      description: 'Sent estimate for kitchen faucet installation',
    },
    {
      dealId: '2',
      contactId: '2',
      type: 'meeting' as const,
      description: 'Met on-site to assess water heater location',
    },
    {
      dealId: '3',
      contactId: '3',
      type: 'note' as const,
      description: 'Initial consultation for bathroom remodel',
    },
    {
      dealId: '4',
      contactId: '4',
      type: 'call' as const,
      description: 'Progress update on bathroom fixtures',
    },
  ],
};

export const useStore = create<GrowthOSStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      deals: [],
      activities: [],
      estimates: [],
      invoices: [],
      settings: DEFAULT_SETTINGS,
      notifications: [],

      // Contact operations
      addContact: (contact) =>
        set((state) => ({
          contacts: [
            ...state.contacts,
            {
              id: generateId(),
              createdAt: Date.now(),
              ...contact,
            },
          ],
        })),

      updateContact: (id, updates) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),

      getContact: (id) => get().contacts.find((c) => c.id === id),

      // Deal operations
      addDeal: (deal) => {
        const id = generateId();
        set((state) => ({
          deals: [
            ...state.deals,
            {
              id,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              ...deal,
            },
          ],
        }));
        // Add notification
        get().addNotification({
          type: 'deal_created',
          title: `New job created: ${deal.title}`,
          description: `Job value: $${deal.value}`,
          linkTo: '/pipeline',
        });
      },

      updateDeal: (id, updates) => {
        const oldDeal = get().getDeal(id);
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id
              ? { ...d, ...updates, updatedAt: Date.now() }
              : d
          ),
        }));
        // Add notification if stage changed
        if (updates.stage && oldDeal && oldDeal.stage !== updates.stage) {
          get().addNotification({
            type: 'deal_moved',
            title: `Job moved to ${updates.stage.replace(/_/g, ' ')}`,
            description: oldDeal.title,
            linkTo: '/pipeline',
          });
        }
      },

      deleteDeal: (id) =>
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
        })),

      getDeal: (id) => get().deals.find((d) => d.id === id),

      getDealsByStage: (stage) =>
        get().deals.filter((d) => d.stage === stage),

      getDealsByContact: (contactId) =>
        get().deals.filter((d) => d.contactId === contactId),

      // Activity operations
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            ...state.activities,
            {
              id: generateId(),
              createdAt: Date.now(),
              ...activity,
            },
          ],
        })),

      getActivities: (limit = 10) =>
        get()
          .activities.sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, limit),

      // Estimate operations
      addEstimate: (estimate) => {
        const id = generateId();
        const estNumber = `EST-${new Date().getFullYear()}-${String(get().estimates.length + 1).padStart(3, '0')}`;
        set((state) => ({
          estimates: [
            ...state.estimates,
            { id, number: estNumber, createdAt: Date.now(), ...estimate },
          ],
        }));
        return id;
      },

      updateEstimate: (id, updates) =>
        set((state) => ({
          estimates: state.estimates.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      deleteEstimate: (id) =>
        set((state) => ({
          estimates: state.estimates.filter((e) => e.id !== id),
        })),

      getEstimate: (id) => get().estimates.find((e) => e.id === id),

      getEstimatesByContact: (contactId) =>
        get().estimates.filter((e) => e.contactId === contactId),

      updateEstimateStatus: (id, status) => {
        const estimate = get().getEstimate(id);
        const now = Date.now();
        const updates: Partial<Estimate> = { status };
        if (status === 'sent') updates.sentAt = now;
        if (status === 'viewed') updates.viewedAt = now;
        if (status === 'approved' || status === 'rejected') updates.respondedAt = now;
        set((state) => ({
          estimates: state.estimates.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
        // Add notification if sent
        if (status === 'sent' && estimate) {
          get().addNotification({
            type: 'estimate_sent',
            title: `Estimate sent to ${estimate.customerName}`,
            description: `${estimate.service} - ${estimate.number}`,
            linkTo: '/estimates',
          });
        }
      },

      // Invoice operations
      addInvoice: (invoice) => {
        const id = generateId();
        const invNumber = `INV-${new Date().getFullYear()}-${String(get().invoices.length + 1).padStart(3, '0')}`;
        set((state) => ({
          invoices: [
            ...state.invoices,
            { id, number: invNumber, createdAt: Date.now(), ...invoice },
          ],
        }));
        return id;
      },

      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),

      getInvoice: (id) => get().invoices.find((inv) => inv.id === id),

      getInvoicesByContact: (contactId) =>
        get().invoices.filter((inv) => inv.contactId === contactId),

      recordPayment: (id, amount) => {
        const invoice = get().getInvoice(id);
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id !== id) return inv;
            const newPaid = inv.amountPaid + amount;
            const newStatus: InvoiceStatus = newPaid >= inv.total ? 'paid' : 'partial';
            return { ...inv, amountPaid: newPaid, status: newStatus, paidAt: newPaid >= inv.total ? Date.now() : inv.paidAt };
          }),
        }));
        // Add notification
        if (invoice) {
          get().addNotification({
            type: 'payment_received',
            title: `Payment of $${amount} received`,
            description: `From ${invoice.customerName} - ${invoice.number}`,
            linkTo: '/invoices',
          });
        }
      },

      // Settings operations
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // Notification operations
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              id: generateId(),
              createdAt: Date.now(),
              read: false,
              ...notification,
            },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      getUnreadCount: () =>
        get().notifications.filter((n) => !n.read).length,

      // Seed data
      initializeSeedData: () => {
        const state = get();
        if (state.contacts.length > 0) return; // Already initialized

        const contactIds: Record<number, string> = {};

        // Add contacts
        SEED_DATA.contacts.forEach((contact, index) => {
          const prevLength = get().contacts.length;
          get().addContact(contact);
          const newContact = get().contacts[prevLength];
          contactIds[index] = newContact?.id || '';
        });

        // Add deals with correct contactIds
        SEED_DATA.deals.forEach((deal) => {
          const contactIndex = typeof deal.contactId === 'number' ? deal.contactId : 0;
          const actualContactId = contactIds[contactIndex];
          get().addDeal({
            ...deal,
            contactId: actualContactId,
          });
        });

        // Add activities
        SEED_DATA.activities.forEach((activity) => {
          get().addActivity(activity);
        });

        // Add seed estimates (linked to contacts/deals)
        const deals = get().deals;
        const contacts = get().contacts;
        const seedEstimates = [
          { dealIdx: 0, status: 'approved' as const, daysAgo: 8, tier: 'Better' as const },
          { dealIdx: 1, status: 'sent' as const, daysAgo: 3, tier: undefined },
          { dealIdx: 2, status: 'approved' as const, daysAgo: 5, tier: 'Good' as const },
          { dealIdx: 3, status: 'draft' as const, daysAgo: 0, tier: undefined },
          { dealIdx: 4, status: 'approved' as const, daysAgo: 6, tier: 'Best' as const },
          { dealIdx: 5, status: 'sent' as const, daysAgo: 1, tier: undefined },
          { dealIdx: 6, status: 'sent' as const, daysAgo: 2, tier: undefined },
          { dealIdx: 7, status: 'approved' as const, daysAgo: 15, tier: 'Good' as const },
          { dealIdx: 8, status: 'approved' as const, daysAgo: 9, tier: 'Better' as const },
          { dealIdx: 9, status: 'viewed' as const, daysAgo: 4, tier: undefined },
        ];

        seedEstimates.forEach((se) => {
          const deal = deals[se.dealIdx];
          if (!deal) return;
          const contact = contacts.find(c => c.id === deal.contactId);
          if (!contact) return;
          const basePrice = deal.value;
          get().addEstimate({
            contactId: contact.id,
            dealId: deal.id,
            customerName: contact.name,
            customerEmail: contact.email,
            customerPhone: contact.phone,
            service: deal.title,
            description: deal.notes,
            tiers: [
              { name: 'Good', description: 'Standard service', price: Math.round(basePrice * 0.7), features: ['Basic materials', 'Standard warranty (30 days)', 'Scheduled service'] },
              { name: 'Better', description: 'Upgraded service + warranty', price: basePrice, features: ['Premium materials', '1-year warranty', 'Priority scheduling', 'Post-job inspection'] },
              { name: 'Best', description: 'Full premium package', price: Math.round(basePrice * 1.4), features: ['Top-tier materials', 'Lifetime warranty', '24/7 support', 'Free maintenance visits', 'Photo documentation'] },
            ],
            selectedTier: se.tier,
            status: se.status,
            notes: '',
            validDays: 30,
            sentAt: se.status !== 'draft' ? Date.now() - se.daysAgo * 86400000 : undefined,
            viewedAt: se.status === 'viewed' || se.status === 'approved' ? Date.now() - (se.daysAgo - 1) * 86400000 : undefined,
            respondedAt: se.status === 'approved' ? Date.now() - (se.daysAgo - 2) * 86400000 : undefined,
          });
        });

        // Add seed invoices (from approved estimates / completed deals)
        const invoiceConfigs = [
          { dealIdx: 0, isPaid: true, daysAgo: 5, dueDaysAgo: -2 }, // paid invoice
          { dealIdx: 7, isPaid: false, daysAgo: 5, dueDaysAgo: 10 }, // overdue invoice (10 days past due)
          { dealIdx: 8, isPaid: false, daysAgo: 3, dueDaysAgo: 25 }, // overdue invoice (25 days past due)
        ];
        invoiceConfigs.forEach((config) => {
          const deal = deals[config.dealIdx];
          if (!deal) return;
          const contact = contacts.find(c => c.id === deal.contactId);
          if (!contact) return;
          const taxRate = 0.13; // Ontario HST
          const subtotal = deal.value;
          const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
          const total = subtotal + taxAmount;
          get().addInvoice({
            contactId: contact.id,
            dealId: deal.id,
            customerName: contact.name,
            customerEmail: contact.email,
            customerAddress: contact.address,
            lineItems: [{ description: deal.title, quantity: 1, unitPrice: subtotal }],
            subtotal,
            taxRate,
            taxAmount,
            total,
            amountPaid: config.isPaid ? total : 0,
            status: config.isPaid ? 'paid' : 'sent',
            notes: '',
            dueDate: Date.now() - config.dueDaysAgo * 86400000,
            province: 'ON',
            taxType: 'HST',
            sentAt: Date.now() - config.daysAgo * 86400000,
            paidAt: config.isPaid ? Date.now() - 2 * 86400000 : undefined,
          });
        });
      },
    }),
    {
      name: 'growth-os-storage',
      version: 4,
      migrate: () => ({
        contacts: [],
        deals: [],
        activities: [],
        estimates: [],
        invoices: [],
        settings: DEFAULT_SETTINGS,
        notifications: [],
      }),
    }
  )
);
