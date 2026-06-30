import type { IFinancialReportRepository } from '@/lib/contracts/v2/IFinanceRepository';
import type { FinancialSummary } from '@/types/finance';
export class MockFinancialReportRepository implements IFinancialReportRepository {
  async getSummary(): Promise<FinancialSummary> { return { totalRevenue: 0, totalCOGS: 0, grossProfit: 0, totalExpenses: 0, netProfit: 0, cashFlow: 0, totalAssets: 0, totalLiabilities: 0, totalCapital: 0, inventoryValue: 0, outstandingPayments: 0, supplierCount: 0, poCount: 0 }; }
  async getCashFlow() { return []; }
  async getPnL() { return { revenue: 0, cogs: 0, grossProfit: 0, expenses: 0, netProfit: 0, grossMargin: 0, netMargin: 0 }; }
}
