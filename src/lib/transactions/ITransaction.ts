/**
 * Transaction abstraction — coordinates multi-step operations as one logical unit.
 *
 * Example workflow (Order creation):
 * 1. Create Order record
 * 2. Reserve stock in Inventory
 * 3. Apply Coupon usage
 * 4. Write Order timeline event
 * 5. Emit OrderCreated domain event
 * 6. Send notification
 *
 * In Mock: steps execute sequentially; on any error, previously completed steps
 * are compensated via the registered rollback functions.
 *
 * In Supabase: replace MockTransaction with a Supabase RPC transaction or
 * use Supabase Edge Functions for server-side atomicity.
 */

export interface ITransaction {
 /** Execute a step. Registers a compensation for rollback on failure. */
 step<T>(
 name: string,
 execute: () => Promise<T>,
 compensate?: (result: T) => Promise<void>
 ): Promise<T>;

 /** Commit (no-op in mock, needed for Supabase RPC signaling) */
 commit(): Promise<void>;

 /** Roll back all completed steps in reverse order */
 rollback(): Promise<void>;
}

export interface ITransactionManager {
 /** Run a function within a transaction */
 run<T>(fn: (tx: ITransaction) => Promise<T>): Promise<T>;
}
