import type { Expense, ExpenseCreateDTO, ExpenseUpdateDTO, ExpenseCategoryType, Asset, AssetCreateDTO, AssetUpdateDTO, Liability, LiabilityCreateDTO, LiabilityUpdateDTO, Capital, CapitalCreateDTO, CapitalUpdateDTO, FinancialSummary } from '@/types/finance';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface IExpenseRepository
 extends IBaseRepository<Expense, ExpenseCreateDTO, ExpenseUpdateDTO> {
 getByCategory(category: ExpenseCategoryType, options?: QueryOptions): Promise<PaginatedResult<Expense>>;
 getByDateRange(from: string, to: string, options?: QueryOptions): Promise<PaginatedResult<Expense>>;
 getTotalByCategory(category: ExpenseCategoryType, from?: string, to?: string): Promise<number>;
}

export interface IAssetRepository
 extends IBaseRepository<Asset, AssetCreateDTO, AssetUpdateDTO> {
 getTotalValue(): Promise<number>;
 getByWarehouse(warehouseId: string): Promise<Asset[]>;
}

export interface ILiabilityRepository
 extends IBaseRepository<Liability, LiabilityCreateDTO, LiabilityUpdateDTO> {
 getOverdue(): Promise<Liability[]>;
 getTotalOutstanding(): Promise<number>;
}

export interface ICapitalRepository
 extends IBaseRepository<Capital, CapitalCreateDTO, CapitalUpdateDTO> {
 getTotalCapital(): Promise<number>;
 getByType(type: 'increase' | 'withdrawal'): Promise<Capital[]>;
}

export interface IFinancialReportRepository {
 getSummary(from?: string, to?: string): Promise<FinancialSummary>;
 getCashFlow(from: string, to: string): Promise<{ date: string; in: number; out: number; net: number }[]>;
 getPnL(from: string, to: string): Promise<{
 revenue: number;
 cogs: number;
 grossProfit: number;
 expenses: number;
 netProfit: number;
 grossMargin: number;
 netMargin: number;
 }>;
}
