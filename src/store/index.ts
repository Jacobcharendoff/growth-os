'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact, Deal, Activity, LeadSource, PipelineStage } from '@/types';

interface GrowthOSStore {
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];

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

  // Activity operations
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  getActivities: (limit?: number) => Activity[];

  // Initialize seed data
  initializeSeedData: () => void;
}

const generateId = () => Math.random().toString(36).substring(7);

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
      addDeal: (deal) =>
        set((state) => ({
          deals: [
            ...state.deals,
            {
              id: generateId(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              ...deal,
            },
          ],
        })),

      updateDeal: (id, updates) =>
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id
              ? { ...d, ...updates, updatedAt: Date.now() }
              : d
          ),
        })),

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
      },
    }),
    {
      name: 'growth-os-storage',
      version: 2,
      migrate: () => ({
        contacts: [],
        deals: [],
        activities: [],
      }),
    }
  )
);
