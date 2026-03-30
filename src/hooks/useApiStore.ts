'use client';

/**
 * useApiStore — Write-through hook that wraps the Zustand store.
 *
 * When online (authenticated + connected to API):
 *   - Write operations go to API first, then update the local store
 *   - Read operations come from the local store (hydrated from API on mount)
 *
 * When offline (demo mode / no auth):
 *   - Falls back to pure localStorage behavior (existing Zustand behavior)
 *
 * This hook provides the same interface as the store, so existing pages
 * can swap `useStore()` for `useApiStore()` with zero other changes.
 */

import { useCallback } from 'react';
import { useStore } from '@/store';
import { useDataSync } from '@/lib/use-data-sync';
import { dataService } from '@/lib/data-service';
import { Contact, Deal, Activity, Estimate, Invoice, PipelineStage, EstimateStatus, InvoiceStatus } from '@/types';

export function useApiStore() {
  const store = useStore();
  const { isOnline } = useDataSync();

  // ==================== Contacts ====================

  const addContact = useCallback(async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    if (isOnline) {
      try {
        const created = await dataService.createContact(contact);
        // Update local store with the API-generated record
        useStore.setState((state) => ({
          contacts: [...state.contacts, created],
        }));
        return created;
      } catch (err) {
        console.error('API addContact failed, falling back to local:', err);
      }
    }
    // Fallback to local
    store.addContact(contact);
  }, [isOnline, store]);

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>) => {
    if (isOnline) {
      try {
        const updated = await dataService.updateContact(id, updates);
        useStore.setState((state) => ({
          contacts: state.contacts.map((c) => c.id === id ? updated : c),
        }));
        return updated;
      } catch (err) {
        console.error('API updateContact failed, falling back to local:', err);
      }
    }
    store.updateContact(id, updates);
  }, [isOnline, store]);

  const deleteContact = useCallback(async (id: string) => {
    if (isOnline) {
      try {
        await dataService.deleteContact(id);
        useStore.setState((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }));
        return;
      } catch (err) {
        console.error('API deleteContact failed, falling back to local:', err);
      }
    }
    store.deleteContact(id);
  }, [isOnline, store]);

  // ==================== Deals ====================

  const addDeal = useCallback(async (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (isOnline) {
      try {
        const created = await dataService.createDeal(deal);
        useStore.setState((state) => ({
          deals: [...state.deals, created],
        }));
        // Still fire notification locally
        store.addNotification({
          type: 'deal_created',
          title: `New job created: ${deal.title}`,
          description: `Job value: $${deal.value}`,
          linkTo: '/pipeline',
        });
        return created;
      } catch (err) {
        console.error('API addDeal failed, falling back to local:', err);
      }
    }
    store.addDeal(deal);
  }, [isOnline, store]);

  const updateDeal = useCallback(async (id: string, updates: Partial<Deal>) => {
    if (isOnline) {
      try {
        const oldDeal = store.getDeal(id);
        const updated = await dataService.updateDeal(id, updates);
        useStore.setState((state) => ({
          deals: state.deals.map((d) => d.id === id ? updated : d),
        }));
        // Fire notification if stage changed
        if (updates.stage && oldDeal && oldDeal.stage !== updates.stage) {
          store.addNotification({
            type: 'deal_moved',
            title: `Job moved to ${updates.stage.replace(/_/g, ' ')}`,
            description: oldDeal.title,
            linkTo: '/pipeline',
          });
        }
        return updated;
      } catch (err) {
        console.error('API updateDeal failed, falling back to local:', err);
      }
    }
    store.updateDeal(id, updates);
  }, [isOnline, store]);

  const deleteDeal = useCallback(async (id: string) => {
    if (isOnline) {
      try {
        await dataService.deleteDeal(id);
        useStore.setState((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
        }));
        return;
      } catch (err) {
        console.error('API deleteDeal failed, falling back to local:', err);
      }
    }
    store.deleteDeal(id);
  }, [isOnline, store]);

  // ==================== Activities ====================

  const addActivity = useCallback(async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    if (isOnline) {
      try {
        const created = await dataService.createActivity(activity);
        useStore.setState((state) => ({
          activities: [created, ...state.activities],
        }));
        return created;
      } catch (err) {
        console.error('API addActivity failed, falling back to local:', err);
      }
    }
    store.addActivity(activity);
  }, [isOnline, store]);

  // ==================== Estimates ====================

  const addEstimate = useCallback(async (estimate: Omit<Estimate, 'id' | 'number' | 'createdAt'>) => {
    if (isOnline) {
      try {
        const created = await dataService.createEstimate(estimate);
        useStore.setState((state) => ({
          estimates: [...state.estimates, created],
        }));
        return created.id;
      } catch (err) {
        console.error('API addEstimate failed, falling back to local:', err);
      }
    }
    return store.addEstimate(estimate);
  }, [isOnline, store]);

  const updateEstimate = useCallback(async (id: string, updates: Partial<Estimate>) => {
    if (isOnline) {
      try {
        const updated = await dataService.updateEstimate(id, updates);
        useStore.setState((state) => ({
          estimates: state.estimates.map((e) => e.id === id ? updated : e),
        }));
        return updated;
      } catch (err) {
        console.error('API updateEstimate failed, falling back to local:', err);
      }
    }
    store.updateEstimate(id, updates);
  }, [isOnline, store]);

  const deleteEstimate = useCallback(async (id: string) => {
    if (isOnline) {
      try {
        await dataService.deleteEstimate(id);
        useStore.setState((state) => ({
          estimates: state.estimates.filter((e) => e.id !== id),
        }));
        return;
      } catch (err) {
        console.error('API deleteEstimate failed, falling back to local:', err);
      }
    }
    store.deleteEstimate(id);
  }, [isOnline, store]);

  const updateEstimateStatus = useCallback(async (id: string, status: EstimateStatus) => {
    if (isOnline) {
      try {
        const updated = await dataService.updateEstimate(id, { status });
        useStore.setState((state) => ({
          estimates: state.estimates.map((e) => e.id === id ? updated : e),
        }));
        // Fire notification if sent
        if (status === 'sent') {
          const estimate = store.getEstimate(id);
          if (estimate) {
            store.addNotification({
              type: 'estimate_sent',
              title: `Estimate sent to ${estimate.customerName}`,
              description: `${estimate.service} - ${estimate.number}`,
              linkTo: '/estimates',
            });
          }
        }
        return updated;
      } catch (err) {
        console.error('API updateEstimateStatus failed, falling back to local:', err);
      }
    }
    store.updateEstimateStatus(id, status);
  }, [isOnline, store]);

  // ==================== Invoices ====================

  const addInvoice = useCallback(async (invoice: Omit<Invoice, 'id' | 'number' | 'createdAt'>) => {
    if (isOnline) {
      try {
        const created = await dataService.createInvoice(invoice);
        useStore.setState((state) => ({
          invoices: [...state.invoices, created],
        }));
        return created.id;
      } catch (err) {
        console.error('API addInvoice failed, falling back to local:', err);
      }
    }
    return store.addInvoice(invoice);
  }, [isOnline, store]);

  const updateInvoice = useCallback(async (id: string, updates: Partial<Invoice>) => {
    if (isOnline) {
      try {
        const updated = await dataService.updateInvoice(id, updates);
        useStore.setState((state) => ({
          invoices: state.invoices.map((inv) => inv.id === id ? updated : inv),
        }));
        return updated;
      } catch (err) {
        console.error('API updateInvoice failed, falling back to local:', err);
      }
    }
    store.updateInvoice(id, updates);
  }, [isOnline, store]);

  const deleteInvoice = useCallback(async (id: string) => {
    if (isOnline) {
      try {
        await dataService.deleteInvoice(id);
        useStore.setState((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        }));
        return;
      } catch (err) {
        console.error('API deleteInvoice failed, falling back to local:', err);
      }
    }
    store.deleteInvoice(id);
  }, [isOnline, store]);

  const recordPayment = useCallback(async (id: string, amount: number) => {
    if (isOnline) {
      try {
        const updated = await dataService.recordPayment(id, amount);
        useStore.setState((state) => ({
          invoices: state.invoices.map((inv) => inv.id === id ? updated : inv),
        }));
        const invoice = store.getInvoice(id);
        if (invoice) {
          store.addNotification({
            type: 'payment_received',
            title: `Payment of $${amount} received`,
            description: `From ${invoice.customerName} - ${invoice.number}`,
            linkTo: '/invoices',
          });
        }
        return updated;
      } catch (err) {
        console.error('API recordPayment failed, falling back to local:', err);
      }
    }
    store.recordPayment(id, amount);
  }, [isOnline, store]);

  // ==================== Settings ====================

  const updateSettings = useCallback(async (updates: Parameters<typeof store.updateSettings>[0]) => {
    if (isOnline) {
      try {
        await dataService.updateSettings(updates);
      } catch (err) {
        console.error('API updateSettings failed, falling back to local:', err);
      }
    }
    store.updateSettings(updates);
  }, [isOnline, store]);

  // Return the same interface as the store, but with write-through operations
  return {
    // Read-only properties (from local store — hydrated from API on mount)
    contacts: store.contacts,
    deals: store.deals,
    activities: store.activities,
    estimates: store.estimates,
    invoices: store.invoices,
    settings: store.settings,
    notifications: store.notifications,
    activePlaybooks: store.activePlaybooks,
    simulatedActions: store.simulatedActions,

    // Read-only methods (from local store)
    getContact: store.getContact,
    getDeal: store.getDeal,
    getDealsByStage: store.getDealsByStage,
    getDealsByContact: store.getDealsByContact,
    getEstimate: store.getEstimate,
    getEstimatesByContact: store.getEstimatesByContact,
    getInvoice: store.getInvoice,
    getInvoicesByContact: store.getInvoicesByContact,
    getActivities: store.getActivities,
    getUnreadCount: store.getUnreadCount,
    getActivePlaybookIds: store.getActivePlaybookIds,
    getSimulatedActions: store.getSimulatedActions,

    // Write-through operations (API → then local)
    addContact,
    updateContact,
    deleteContact,
    addDeal,
    updateDeal,
    deleteDeal,
    addActivity,
    addEstimate,
    updateEstimate,
    deleteEstimate,
    updateEstimateStatus,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    recordPayment,
    updateSettings,

    // Local-only operations (not persisted to API)
    addNotification: store.addNotification,
    markNotificationRead: store.markNotificationRead,
    markAllNotificationsRead: store.markAllNotificationsRead,
    togglePlaybook: store.togglePlaybook,
    activateAllPlaybooks: store.activateAllPlaybooks,
    deactivateAllPlaybooks: store.deactivateAllPlaybooks,
    addSimulatedAction: store.addSimulatedAction,
    clearSimulatedActions: store.clearSimulatedActions,
    initializeSeedData: store.initializeSeedData,
  };
}
