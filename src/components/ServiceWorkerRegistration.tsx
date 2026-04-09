'use client';

import { useEffect, useState } from 'react';
import { useToast } from './Toast';

export default function ServiceWorkerRegistration() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only register in browser environment
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        setRegistration(reg);

        // Check for updates periodically
        const updateInterval = setInterval(() => {
          reg.update();
        }, 60000); // Check every minute

        // Listen for new service worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is ready
                setUpdateAvailable(true);
                toast.info('Staybookt has been updated. Reload to see the latest version.');
              }
            });
          }
        });

        return () => clearInterval(updateInterval);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();

    // Handle messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setUpdateAvailable(true);
        toast.info('Staybookt has been updated. Reload to see the latest version.');
      }
    });
  }, [toast]);

  useEffect(() => {
    if (!updateAvailable || !registration) return;

    // Listen for the control change and reload
    const handleControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, [updateAvailable, registration]);

  // This component handles registration silently
  return null;
}
