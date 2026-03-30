'use client';

/**
 * useDataSync — Hydrates the Zustand store from the API when authenticated.
 *
 * This is the bridge that lets us gradually migrate from localStorage to Supabase.
 * When a user is authenticated:
 *   1. On mount, fetch all data from the API and populate the store
 *   2. Write operations go through the API first, then update the store
 *
 * When not authenticated (no session):
 *   - Falls back to localStorage (the existing behavior)
 *   - This keeps the demo/beta experience working
 *
 * Usage: Place <DataSyncProvider> in the app layout, above any pages that use the store.
 */

import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { useStore } from '@/store';
import { dataService } from '@/lib/data-service';
import { getSupabase } from '@/lib/supabase';

interface DataSyncContextValue {
  isOnline: boolean;       // True if connected to real database
  isSyncing: boolean;      // True during initial hydration
  syncError: string | null;
  userId: string | null;
  orgId: string | null;
  refetch: () => Promise<void>;
}

const DataSyncContext = createContext<DataSyncContextValue>({
  isOnline: false,
  isSyncing: false,
  syncError: null,
  userId: null,
  orgId: null,
  refetch: async () => {},
});

export function useDataSync() {
  return useContext(DataSyncContext);
}

/**
 * Check if we have a valid Supabase session
 */
async function checkAuth(): Promise<{ userId: string; orgId: string } | null> {
  try {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    // Try to get org_id from the API
    const userData = await dataService.getCurrentUser();
    return {
      userId: userData.user?.id || session.user.id,
      orgId: userData.org?.id || null,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch all data from API and populate the store
 */
async function hydrateStoreFromApi(store: ReturnType<typeof useStore.getState>): Promise<void> {
  // Fetch all entity types in parallel
  const [contactsRes, dealsRes, activitiesRes, estimatesRes, invoicesRes] = await Promise.all([
    dataService.getContacts({ limit: 500 }),
    dataService.getDeals({ limit: 500 }),
    dataService.getActivities({ limit: 500 }),
    dataService.getEstimates({ limit: 500 }),
    dataService.getInvoices({ limit: 500 }),
  ]);

  // Replace store state with API data
  // We use the store's internal set method via direct state manipulation
  useStore.setState({
    contacts: contactsRes.data,
    deals: dealsRes.data,
    activities: activitiesRes.data,
    estimates: estimatesRes.data,
    invoices: invoicesRes.data,
  });
}

export { DataSyncContext, checkAuth, hydrateStoreFromApi };
