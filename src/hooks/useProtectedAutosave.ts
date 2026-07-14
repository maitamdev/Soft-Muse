import { useState, useEffect, useCallback, useRef } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutosaveOptions<T> {
 onSave: (data: T) => Promise<void>;
 debounceMs?: number;
}

export function useProtectedAutosave<T>(initialData: T, { onSave, debounceMs = 1000 }: AutosaveOptions<T>) {
 const [data, setData] = useState<T>(initialData);
 const [status, setStatus] = useState<SaveStatus>('idle');
 const [isDirty, setIsDirty] = useState(false);
 const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
 
 // Track offline queue (mock)
 const [offlineQueue, setOfflineQueue] = useState<T[]>([]);
 const isOnline = typeof window !== 'undefined' ? navigator.onLine : true;

 // Before Leave Warning
 useEffect(() => {
 const handleBeforeUnload = (e: BeforeUnloadEvent) => {
 if (isDirty || status === 'saving') {
 e.preventDefault();
 e.returnValue = ''; // Required for Chrome
 }
 };
 
 window.addEventListener('beforeunload', handleBeforeUnload);
 return () => window.removeEventListener('beforeunload', handleBeforeUnload);
 }, [isDirty, status]);

 const executeSave = useCallback(async (dataToSave: T) => {
 if (!isOnline) {
 setOfflineQueue(prev => [...prev, dataToSave]);
 setStatus('error');
 return;
 }

 try {
 setStatus('saving');
 await onSave(dataToSave);
 setStatus('saved');
 setIsDirty(false);
 
 // Reset saved text after a while
 setTimeout(() => setStatus('idle'), 2000);
 } catch (error) {
 console.error('Save failed', error);
 setStatus('error');
 // Simple retry logic could be added here
 }
 }, [onSave, isOnline]);

 const updateData = useCallback((updater: Partial<T> | ((prev: T) => T)) => {
 setData((prev) => {
 const nextData = typeof updater === 'function' ? (updater as any)(prev) : { ...prev, ...updater };
 setIsDirty(true);
 
 if (saveTimeoutRef.current) {
 clearTimeout(saveTimeoutRef.current);
 }

 saveTimeoutRef.current = setTimeout(() => {
 executeSave(nextData);
 }, debounceMs);

 return nextData;
 });
 }, [executeSave, debounceMs]);

 // Sync offline queue when coming back online
 useEffect(() => {
 const handleOnline = () => {
 if (offlineQueue.length > 0) {
 const latestState = offlineQueue[offlineQueue.length - 1];
 executeSave(latestState);
 setOfflineQueue([]);
 }
 };
 
 window.addEventListener('online', handleOnline);
 return () => window.removeEventListener('online', handleOnline);
 }, [offlineQueue, executeSave]);

 return { data, updateData, status, isDirty };
}
