'use client';

/**
 * DataSyncProvider — Wraps the app layout to sync store with the database.
 *
 * When authenticated: Fetches data from API, populates the store.
 * When not authenticated: Falls back to localStorage seed data (demo mode).
 */

import { useEffect, useState, useCallback, ReactNode } from 'react';
import { useStore } from '@/store';
import { DataSyncContext, checkAuth, hydrateStoreFromApi } from '@/lib/use-data-sync';

export function DataSyncProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  const store = useStore.getState();

  const refetch = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      await hydrateStoreFromApi(store);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  }, [store]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const auth = await checkAuth();
        if (cancelled) return;

        if (auth?.orgId) {
          // User is authenticated with a real org — sync from API
          setUserId(auth.userId);
          setOrgId(auth.orgId);
          setIsOnline(true);
          await hydrateStoreFromApi(store);
        } else {
          // No auth or no org — fall back to localStorage / seed data
          setIsOnline(false);
          // Initialize seed data if store is empty (demo mode)
          if (store.contacts.length === 0) {
            store.initializeSeedData();
          }
        }
      } catch {
        // Supabase not configured or network error — use localStorage
        setIsOnline(false);
        if (store.contacts.length === 0) {
          store.initializeSeedData();
        }
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DataSyncContext.Provider value={{ isOnline, isSyncing, syncError, userId, orgId, refetch }}>
      {children}
    </DataSyncContext.Provider>
  );
}
