import { useEffect, useRef, useCallback } from 'react';
import { eventBus, EventCallback } from '@/lib/events/EventBus';

export function useEventSubscribe<T>(event: string, callback: EventCallback<T>) {
 const savedCallback = useRef(callback);

 useEffect(() => {
 savedCallback.current = callback;
 }, [callback]);

 useEffect(() => {
 const handler = (data: T) => savedCallback.current(data);
 const unsubscribe = eventBus.subscribe<T>(event, handler);
 return () => unsubscribe();
 }, [event]);
}

/**
 * Subscribe a single handler to many EventBus events at once. Bursts of events
 * (e.g. an order completion that emits several events) are coalesced into a
 * single invocation via a short debounce, so pages reload their data only once.
 *
 * This is the canonical "live refresh" primitive every admin list/dashboard uses
 * to stay in sync after any mutation, without page reloads.
 */
export function useEventSubscribeMany(
 events: readonly string[],
 callback: () => void,
 options?: { debounceMs?: number }
) {
 const savedCallback = useRef(callback);
 const debounceMs = options?.debounceMs ?? 120;

 useEffect(() => {
 savedCallback.current = callback;
 }, [callback]);

 // Stable dependency key so identical event lists don't re-subscribe each render.
 const key = events.join('|');

 useEffect(() => {
 let timer: ReturnType<typeof setTimeout> | null = null;
 const handler = () => {
 if (debounceMs <= 0) { savedCallback.current(); return; }
 if (timer) clearTimeout(timer);
 timer = setTimeout(() => savedCallback.current(), debounceMs);
 };
 const unsubs = key.split('|').filter(Boolean).map(e => eventBus.subscribe(e, handler));
 return () => {
 if (timer) clearTimeout(timer);
 unsubs.forEach(u => u());
 };
 }, [key, debounceMs]);
}

export function useEventEmit() {
 return useCallback(<T,>(event: string, payload?: T) => {
 eventBus.emit(event, payload);
 }, []);
}
