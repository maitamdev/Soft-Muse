'use client';

/**
 * Reactive read of the unified catalog for storefront client components.
 *
 * Built on `useSyncExternalStore` so it is:
 *  - hydration-safe — the server snapshot is the pristine seed, identical to the
 *    SSR HTML, so first client paint matches before swapping to the persisted
 *    (localStorage) catalog;
 *  - free of duplicated subscriptions — there is ONE shared EventBus binding for
 *    the whole app; components attach to an in-memory listener set, not the bus;
 *  - loop-free — the client snapshot is memoised and only recomputed when the
 *    live catalog array reference actually changes (admin mutation / inventory).
 *
 * Returns the canonical `Product[]` (published only). Components derive what they
 * need with the helpers in `@/lib/catalog/storefront-catalog`.
 */
import { useSyncExternalStore } from 'react';
import { eventBus } from '@/lib/events/EventBus';
import { getCatalogSeed, getLiveProducts, refreshFromStorage, type Product } from '@/data/mock/products';
import { getPublishedProducts } from '@/lib/catalog/storefront-catalog';

const CATALOG_EVENTS = [
  'product.created',
  'product.updated',
  'product.deleted',
  'products.changed',
  'products.bulk_updated',
  'products.bulk_deleted',
  'inventory.changed',
] as const;

// localStorage key the catalog persists under (mockStorage namespace + key).
const CATALOG_STORAGE_KEY = 'aura_mock_db:products';

const serverSnapshot: Product[] = getPublishedProducts(getCatalogSeed());

let lastSource: Product[] | null = null;
let clientSnapshot: Product[] = serverSnapshot;

function getSnapshot(): Product[] {
  // getLiveProducts() reads the catalog module's own variable, so an admin
  // mutation (which reassigns it) is always observed here.
  const source = getLiveProducts();
  if (source !== lastSource) {
    lastSource = source;
    clientSnapshot = getPublishedProducts(source);
  }
  return clientSnapshot;
}

function getServerSnapshot(): Product[] {
  return serverSnapshot;
}

const listeners = new Set<() => void>();
let busBound = false;

function notify(): void {
  listeners.forEach((l) => l());
}

function bindBus(): void {
  if (busBound) return;
  busBound = true;

  // Same-tab: admin mutations emit on the in-memory EventBus.
  CATALOG_EVENTS.forEach((event) => eventBus.subscribe(event, notify));

  if (typeof window !== 'undefined') {
    // Cross-tab: another tab (e.g. the Admin) wrote the catalog to localStorage.
    window.addEventListener('storage', (e) => {
      if (e.key === CATALOG_STORAGE_KEY && refreshFromStorage()) notify();
    });
    // Returning focus to this tab — re-read in case an edit was missed while hidden.
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && refreshFromStorage()) notify();
    });
  }
}

function subscribe(onStoreChange: () => void): () => void {
  bindBus();
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function useStorefrontProducts(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
