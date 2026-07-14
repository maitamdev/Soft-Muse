import type { ITransaction, ITransactionManager } from './ITransaction';

interface CompensationEntry {
 name: string;
 compensate: () => Promise<void>;
}

/**
 * MockTransaction — sequential execution with compensation on failure.
 *
 * When Supabase is integrated, swap this for a SupabaseTransaction
 * that wraps operations in a server-side RPC or Edge Function.
 */
export class MockTransaction implements ITransaction {
 private completedSteps: CompensationEntry[] = [];
 private rolledBack = false;

 async step<T>(
 name: string,
 execute: () => Promise<T>,
 compensate?: (result: T) => Promise<void>
 ): Promise<T> {
 if (this.rolledBack) {
 throw new Error(`[MockTransaction] Transaction already rolled back. Cannot execute step "${name}".`);
 }

 try {
 const result = await execute();

 if (compensate) {
 this.completedSteps.push({
 name,
 compensate: () => compensate(result),
 });
 }

 return result;
 } catch (error) {
 await this.rollback();
 throw error;
 }
 }

 async commit(): Promise<void> {
 // No-op in mock. Supabase implementation signals transaction commit here.
 }

 async rollback(): Promise<void> {
 if (this.rolledBack) return;
 this.rolledBack = true;

 // Execute compensations in reverse order
 const steps = [...this.completedSteps].reverse();
 for (const step of steps) {
 try {
 await step.compensate();
 } catch (error) {
 console.error(`[MockTransaction] Compensation failed for step "${step.name}":`, error);
 }
 }

 this.completedSteps = [];
 }
}

/**
 * MockTransactionManager — creates and manages MockTransaction instances.
 */
export class MockTransactionManager implements ITransactionManager {
 async run<T>(fn: (tx: ITransaction) => Promise<T>): Promise<T> {
 const tx = new MockTransaction();
 try {
 const result = await fn(tx);
 await tx.commit();
 return result;
 } catch (error) {
 // rollback is already called inside MockTransaction.step on error
 // but if the error was thrown outside a step, rollback explicitly:
 await tx.rollback();
 throw error;
 }
 }
}

/** Global transaction manager instance */
export const transactionManager = new MockTransactionManager();
