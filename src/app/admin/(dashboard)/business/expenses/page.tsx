'use client';

import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { businessService } from '@/lib/services/business-supabase.service';
import { Expense } from '@/data/mock/business';
import { DataTable } from '@/components/admin/design-system/DataTable';
import { adminAr } from '@/lib/i18n/admin-ar';
import { useEventSubscribeMany } from '@/hooks/useEventBus';
import { REFRESH_EVENTS } from '@/lib/events/refresh-events';
import { toast } from 'sonner';
import { ExpenseModal } from '@/components/admin/business/ExpenseModal';
import { EntityDeleteDialog, EntityArchiveDialog } from '@/components/admin/crud/EntityDialogs';
import { Button } from '@/components/admin/design-system/Button';

interface ExpensesState {
 data: Expense[];
 isLoading: boolean;
 fetchData: () => Promise<void>;
}

const useExpensesStore = create<ExpensesState>((set) => ({
 data: [],
 isLoading: true,
 fetchData: async () => {
 try {
 const data = await businessService.getExpenses();
 set({ data, isLoading: false });
 } catch (e) {
 console.error(e);
 set({ isLoading: false });
 }
 }
}));

export default function ExpensesPage() {
 const { data, isLoading, fetchData } = useExpensesStore();
 const t = adminAr.business.expenses;

 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
 
 const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
 const [archiveDialog, setArchiveDialog] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
 const [isProcessing, setIsProcessing] = useState(false);
 const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

 useEffect(() => {
 fetchData();
 }, [fetchData]);

 useEventSubscribeMany(REFRESH_EVENTS.finance, fetchData);

 const handleSave = async (expenseData: Omit<Expense, 'id'>) => {
 if (editingExpense) {
 await businessService.updateExpense(editingExpense.id, expenseData);
 toast.success('Đã chỉnh sửa thành công', {
 action: { label: 'Hoàn tác', onClick: () => businessService.updateExpense(editingExpense.id, editingExpense).then(fetchData) }
 });
 } else {
 await businessService.createExpense(expenseData);
 toast.success('Đã thêm thành công');
 }
 fetchData();
 };

 const handleDuplicate = async (item: Expense) => {
 const { id, ...rest } = item;
 await businessService.createExpense({ ...rest, name: `${rest.name} (Bản sao)` });
 toast.success('Đã nhân bản thành công');
 fetchData();
 };

 const confirmDelete = async () => {
 if (!deleteDialog.id) return;
 setIsProcessing(true);
 try {
 await businessService.deleteExpense(deleteDialog.id);
 toast.success('Đã xóa thành công');
 fetchData();
 } catch (e: any) {
 toast.error(e.message || 'Đã xảy ra lỗi');
 } finally {
 setIsProcessing(false);
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const confirmArchive = async () => {
 if (!archiveDialog.id) return;
 setIsProcessing(true);
 try {
 await businessService.archiveExpense(archiveDialog.id);
 toast.success('Đã lưu trữ thành công');
 fetchData();
 } catch (e: any) {
 toast.error(e.message || 'Đã xảy ra lỗi');
 } finally {
 setIsProcessing(false);
 setArchiveDialog({ isOpen: false, id: null });
 }
 };

 return (
 <div className="space-y-6" dir="ltr"> <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-[var(--admin-text-base)]">{t.title}</h1> <p className="text-sm text-[var(--admin-text-muted)] mt-1">{t.subtitle}</p> </div> <Button 
 variant="primary"
 onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} 
 >
 + {t.addExpense}
 </Button> </div> <div className="animate-in fade-in slide-in-from-bottom-2"> <DataTable<Expense>
 data={data}
 isLoading={isLoading}
 columns={[
 { accessor: 'name', header: t.expenseName },
 { accessor: 'category', header: t.category },
 { accessor: 'amount', header: t.amount, render: (_, e) => <span className="font-bold text-[var(--admin-danger)] tabular-nums">{e.amount.toLocaleString()} {e.currency}</span> },
 { accessor: 'date', header: t.date, render: (_, e) => new Date(e.date).toLocaleDateString('vi-VN') },
 { accessor: 'status', header: t.status, render: (_, e) => (
 <span className={`px-2 py-1 rounded-[var(--admin-radius-sm)] text-xs font-medium ${
 e.status === 'paid' ? 'bg-[var(--admin-success-muted)] text-[var(--admin-success)]' : 
 e.status === 'cancelled' ? 'bg-[var(--admin-bg-hover)] text-[var(--admin-text-muted)]' :
 'bg-[var(--admin-warning-muted)] text-[var(--admin-warning)]'
 }`}>
 {e.status === 'paid' ? adminAr.status.paid : e.status === 'cancelled' ? 'Đã hủy / lưu trữ' : adminAr.status.pending}
 </span>
 )}
 ]}
 selectable
 selectedIds={selectedIds}
 onSelectionChange={setSelectedIds}
 onEdit={(item) => { setEditingExpense(item); setIsModalOpen(true); }}
 onDuplicate={(item) => handleDuplicate(item)}
 onArchive={(item) => setArchiveDialog({ isOpen: true, id: item.id })}
 onDelete={(item) => setDeleteDialog({ isOpen: true, id: item.id })}
 /> </div> <ExpenseModal 
 isOpen={isModalOpen} 
 onClose={() => setIsModalOpen(false)} 
 onSave={handleSave} 
 initialData={editingExpense} 
 /> <EntityDeleteDialog 
 isOpen={deleteDialog.isOpen} 
 onClose={() => setDeleteDialog({ isOpen: false, id: null })} 
 onConfirm={confirmDelete}
 title="Xóa Việt Nam"
 description="Bạn có chắc muốn Xóa nàyViệt Namvĩnh viễnً؟ Không thể hoàn tác thao tác này."
 isProcessing={isProcessing}
 /> <EntityArchiveDialog 
 isOpen={archiveDialog.isOpen} 
 onClose={() => setArchiveDialog({ isOpen: false, id: null })} 
 onConfirm={confirmArchive}
 title="Lưu trữ Việt Nam"
 description="Bạn có chắc muốn Lưu trữ nàyViệt Nam؟mục này sẽ bị ẩn khỏi danh sách hoạt động và không bị xóa vĩnh viễnً."
 isProcessing={isProcessing}
 /> </div>
 );
}
