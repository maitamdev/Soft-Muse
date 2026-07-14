'use client';

import React, { useEffect } from 'react';
import { create } from 'zustand';
import { businessService } from '@/lib/services/business.service';
import { adminAr } from '@/lib/i18n/admin-ar';
import { IconFileText, IconDownload, IconPrinter } from '@tabler/icons-react';
import { Button } from '@/components/admin/design-system/Button';
import { formatCurrency } from '@/lib/utils/formatters';

interface ReportState {
 summary: any;
 isLoading: boolean;
 fetchData: () => Promise<void>;
}

const useReportStore = create<ReportState>((set) => ({
 summary: null,
 isLoading: true,
 fetchData: async () => {
 try {
 const summary = await businessService.getFinancialSummary();
 set({ summary, isLoading: false });
 } catch (e) {
 console.error(e);
 set({ isLoading: false });
 }
 }
}));

export default function CashFlowPage() {
 const { summary, isLoading, fetchData } = useReportStore();
 const t = adminAr.business.cashFlow;

 useEffect(() => {
 fetchData();
 }, [fetchData]);

 if (isLoading || !summary) {
 return (
 <div className="flex items-center justify-center h-[60vh]"> <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /> </div>
 );
 }

 return (
 <div className="space-y-6 max-w-5xl mx-auto" dir="ltr"> <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-[var(--admin-text-base)]">{t.title}</h1> <p className="text-sm text-[var(--admin-text-muted)] mt-1">{t.subtitle}</p> </div> <div className="flex gap-2"> <Button variant="outline"> <IconPrinter size={16} /> In
 </Button> <Button variant="outline"> <IconDownload size={16} /> Xuất PDF
 </Button> </div> </div>

 {/* Date Filter Mock */}
 <div className="flex gap-4 p-4 bg-[var(--admin-bg-surface)] border border-[var(--admin-border-base)] rounded-xl"> <div className="flex flex-col gap-1"> <span className="text-xs text-[var(--admin-text-muted)]">Từ ngày</span> <input type="date" className="border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] px-3 py-1.5 text-sm outline-none focus:border-[var(--admin-primary)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)]" /> </div> <div className="flex flex-col gap-1"> <span className="text-xs text-[var(--admin-text-muted)]">Đến ngày</span> <input type="date" className="border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] px-3 py-1.5 text-sm outline-none focus:border-[var(--admin-primary)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)]" /> </div> <div className="flex items-end"> <Button variant="primary" className="py-1.5">Áp dụng</Button> </div> </div> <div className="bg-[var(--admin-bg-surface)] border border-[var(--admin-border-base)] rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2"> <div className="p-6 bg-[var(--admin-bg-base)] border-b border-[var(--admin-border-base)]"> <h2 className="text-xl font-bold text-[var(--admin-text-base)]">Báo cáo lưu chuyển tiền tệ (Cash Flow Statement)</h2> <p className="text-sm text-[var(--admin-text-muted)]">Cho kỳ kết thúc vào {new Date().toLocaleDateString('vi-VN')}</p> </div> <div className="p-6 space-y-6">
 {/* Operating Activities */}
 <div> <h3 className="font-bold text-lg border-b border-[var(--admin-border-base)] pb-2 mb-4 text-[var(--admin-text-base)]">từHoạt động</h3> <div className="flex justify-between py-2 text-[var(--admin-text-subtle)]"> <span>Tiền thu từ khách hàng</span> <span>{formatCurrency(summary.totalRevenue)}</span> </div> <div className="flex justify-between py-2 text-[var(--admin-text-subtle)]"> <span>Tiền trả nhà cung cấp</span> <span>({formatCurrency(summary.totalCOGS)})</span> </div> <div className="flex justify-between py-2 text-[var(--admin-text-subtle)]"> <span>Tiền trả chi phí vận hành</span> <span>({formatCurrency(summary.totalExpenses)})</span> </div> <div className="flex justify-between py-2 font-bold border-t border-[var(--admin-border-light)] mt-2 pt-2 bg-[var(--admin-bg-base)] px-2 rounded"> <span className="text-[var(--admin-text-base)]">ròngDòng tiền từHoạt động</span> <span className={summary.netProfit > 0 ? "text-[var(--admin-success)]" : "text-[var(--admin-danger)]"}>{formatCurrency(summary.netProfit)}</span> </div> </div>

 {/* Investing Activities */}
 <div> <h3 className="font-bold text-lg border-b border-[var(--admin-border-base)] pb-2 mb-4 text-[var(--admin-text-base)]">từHoạt động</h3> <div className="flex justify-between py-2 text-[var(--admin-text-subtle)]"> <span>Mua tài sản cố định</span> <span>({formatCurrency(summary.totalAssets)})</span> </div> <div className="flex justify-between py-2 font-bold border-t border-[var(--admin-border-light)] mt-2 pt-2 bg-[var(--admin-bg-base)] px-2 rounded"> <span className="text-[var(--admin-text-base)]">ròngDòng tiền từHoạt động</span> <span className="text-[var(--admin-danger)]">({formatCurrency(summary.totalAssets)})</span> </div> </div>

 {/* Financing Activities */}
 <div> <h3 className="font-bold text-lg border-b border-[var(--admin-border-base)] pb-2 mb-4 text-[var(--admin-text-base)]">từHoạt động</h3> <div className="flex justify-between py-2 text-[var(--admin-text-subtle)]"> <span>trongVốn</span> <span>{formatCurrency(summary.totalCapital)}</span> </div> <div className="flex justify-between py-2 text-[var(--admin-text-subtle)]"> <span>Công nợ (/Mới)</span> <span>{formatCurrency(summary.totalLiabilities)}</span> </div> <div className="flex justify-between py-2 font-bold border-t border-[var(--admin-border-light)] mt-2 pt-2 bg-[var(--admin-bg-base)] px-2 rounded"> <span className="text-[var(--admin-text-base)]">ròngDòng tiền từHoạt động</span> <span className="text-[var(--admin-success)]">{formatCurrency(summary.totalCapital + summary.totalLiabilities)}</span> </div> </div>

 {/* Net Cash Flow */}
 <div className="mt-8"> <div className="flex justify-between py-4 text-xl font-bold border-y-2 border-[var(--admin-border-strong)] bg-[var(--admin-bg-base)] px-4 rounded"> <span className="text-[var(--admin-text-base)]">Số dư tiền cuối kỳ</span> <span className={summary.cashFlow > 0 ? "text-[var(--admin-success)]" : "text-[var(--admin-danger)]"}>
 {formatCurrency(summary.cashFlow)}
 </span> </div> </div> </div> </div> </div>
 );
}
