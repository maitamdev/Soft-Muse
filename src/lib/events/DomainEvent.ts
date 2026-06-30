/**
 * Domain Event foundation.
 *
 * Events are initially synchronous (synchronous dispatch via EventBus).
 * The architecture supports async processing: replace DomainEventBus.emit
 * with a queue-backed implementation (BullMQ, Supabase Realtime, etc.)
 * without changing any event producer or consumer code.
 */

export interface DomainEvent<TPayload = unknown> {
  /** Unique event identifier */
  id: string;

  /** Event type — namespaced: "order.created", "inventory.adjusted", etc. */
  type: string;

  /** Event payload — typed per event */
  payload: TPayload;

  /** When the event occurred */
  occurredAt: string;

  /** Which entity triggered this event */
  entityType: string;
  entityId: string;

  /** Who triggered the action */
  triggeredBy: string;

  /** Correlation ID for tracing chains of events */
  correlationId?: string;
}

export type DomainEventHandler<T = unknown> = (event: DomainEvent<T>) => void | Promise<void>;

/**
 * DomainEventBus — typed wrapper over the core EventBus.
 * Produces fully-typed DomainEvent objects with all required metadata.
 */
export class DomainEventBus {
  private static handlers: Map<string, DomainEventHandler[]> = new Map();

  static on<T>(eventType: string, handler: DomainEventHandler<T>): () => void {
    if (!DomainEventBus.handlers.has(eventType)) {
      DomainEventBus.handlers.set(eventType, []);
    }
    DomainEventBus.handlers.get(eventType)!.push(handler as DomainEventHandler);

    return () => DomainEventBus.off(eventType, handler as DomainEventHandler);
  }

  static off(eventType: string, handler: DomainEventHandler): void {
    const existing = DomainEventBus.handlers.get(eventType) ?? [];
    DomainEventBus.handlers.set(
      eventType,
      existing.filter(h => h !== handler)
    );
  }

  static emit<T>(
    eventType: string,
    payload: T,
    meta: { entityType: string; entityId: string; triggeredBy?: string; correlationId?: string }
  ): void {
    const event: DomainEvent<T> = {
      id: crypto.randomUUID(),
      type: eventType,
      payload,
      occurredAt: new Date().toISOString(),
      entityType: meta.entityType,
      entityId: meta.entityId,
      triggeredBy: meta.triggeredBy ?? 'system',
      correlationId: meta.correlationId,
    };

    const handlers = DomainEventBus.handlers.get(eventType) ?? [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`[DomainEventBus] Error in handler for "${eventType}":`, error);
      }
    });
  }

  /** Subscribe to ALL events (useful for audit logging) */
  static onAny(handler: DomainEventHandler): () => void {
    return DomainEventBus.on('*', handler);
  }

  /** Flush all handlers — use in tests */
  static reset(): void {
    DomainEventBus.handlers.clear();
  }
}
