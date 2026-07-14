import { createClient } from '@/lib/supabase/client';

type EventType = 'page_view' | 'product_view' | 'add_to_cart' | 'checkout_start' | 'purchase';

function sessionId(): string | null {
 if (typeof window === 'undefined' || navigator.doNotTrack === '1') return null;
 const key = 'soft_muse_analytics_session';
 let value = window.sessionStorage.getItem(key);
 if (!value) { value = crypto.randomUUID(); window.sessionStorage.setItem(key, value); }
 return value;
}

function device() {
 if (typeof window === 'undefined') return 'desktop';
 if (window.innerWidth < 768) return 'mobile';
 if (window.innerWidth < 1100) return 'tablet';
 return 'desktop';
}

async function track(eventType: EventType, metadata: Record<string, unknown> = {}, path?: string) {
 const session = sessionId();
 if (!session) return;
 try {
  await createClient().from('analytics_events').insert({ event_type: eventType, session_id: session,
   path: path ?? window.location.pathname, device: device(), metadata });
 } catch {
  // Analytics must never block the storefront transaction or navigation.
 }
}

export const analytics = {
 trackPageView: (path: string) => { void track('page_view', {}, path); },
 trackProductView: (id: string, title: string, price: number) => { void track('product_view', { productId: id, title, price }); },
 trackAddToCart: (id: string, title: string, price: number, size: string, color: string, quantity: number) => { void track('add_to_cart', { productId: id, title, price, size, color, quantity }); },
 trackCheckoutStart: (cartLength: number, subtotal: number) => { void track('checkout_start', { cartLength, subtotal }); },
 trackPurchaseSuccess: (orderId: string, cartItems: { title: string; color?: string; size?: string; quantity: number }[], subtotal: number, paymentMethod: string) => { void track('purchase', { orderId, itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0), subtotal, paymentMethod }); },
};
