'use client';

import { Modal } from '@/components/admin/design-system/Modal';
import { Button } from '@/components/admin/design-system/Button';
import { Input } from '@/components/admin/design-system/Input';
import React, { useState, useEffect } from 'react';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Liability } from '@/data/mock/business';

interface LiabilityModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSave: (data: Omit<Liability, 'id'>) => Promise<void>;
 initialData?: Liability | null;
}

export function LiabilityModal({ isOpen, onClose, onSave, initialData }: LiabilityModalProps) {
 const [formData, setFormData] = useState<Omit<Liability, 'id'>>({
 name: '',
 type: '',
 amount: 0,
 dueDate: new Date().toISOString().split('T')[0],
 });
 
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState('');

 useEffect(() => {
 if (initialData) {
 setFormData({
 name: initialData.name,
 type: initialData.type,
 amount: initialData.amount,
 dueDate: initialData.dueDate,
 });
 } else {
 setFormData({
 name: '',
 type: '',
 amount: 0,
 dueDate: new Date().toISOString().split('T')[0],
 });
 }
 setError('');
 }, [initialData, isOpen]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 
 if (!formData.name.trim()) return setError('Têncông nợ ');
 if (formData.amount <= 0) return setError('Số tiền từ');

 setIsSubmitting(true);
 try {
 await onSave(formData);
 onClose();
 } catch (err: any) {
 setError(err.message || 'Đã xảy ra lỗi Lưu');
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <Modal 
 isOpen={isOpen} 
 onClose={onClose} 
 title={initialData ? 'Sửa công nợ' : 'Thêm công nợ Mới'} 
 maxWidth="lg"
 > <form onSubmit={handleSubmit} className="space-y-6 pt-2" dir="ltr">
 {error && (
 <div className="p-3 text-sm text-[var(--admin-danger)] bg-[var(--admin-danger)]/10 border border-[var(--admin-danger)]/20 rounded-lg">
 {error}
 </div>
 )}
 
 <div className="grid grid-cols-1 gap-4"> <div> <Input 
 type="text" 
 label="Têncông nợ / *"
 required
 value={formData.name}
 onChange={e => setFormData({ ...formData, name: e.target.value})}
 placeholder=":"
 /> </div> <div className="flex flex-col gap-1"> <label className="text-sm font-medium text-[var(--admin-text-muted)]">*</label> <select 
 value={formData.type}
 onChange={e => setFormData({ ...formData, type: e.target.value as any})}
 className="w-full px-3 py-2 border border-[var(--admin-border-base)] rounded-lg bg-[var(--admin-bg-surface)] text-[var(--admin-text-base)] focus:ring-2 focus:ring-[var(--admin-primary)] focus:border-[var(--admin-primary)] outline-none h-12"
 > <option value=""></option> <option value=""></option> <option value=""></option> </select> </div> <div className="flex flex-col gap-1"> <label className="text-sm font-medium text-[var(--admin-text-muted)]">Số tiền *</label> <div className="flex relative"> <input 
 type="number" 
 required
 min="0"
 value={formData.amount}
 onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0})}
 className="w-full px-3 py-2 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] text-[var(--admin-text-base)] rounded-r-lg focus:ring-2 focus:ring-[var(--admin-primary)] focus:border-[var(--admin-primary)] outline-none h-12"
 /> <span className="inline-flex items-center px-3 border border-r-0 border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-subtle)] rounded-l-lg text-sm h-12">
 đ
 </span> </div> </div> <div> <Input 
 type="date" 
 label="Ngày đến hạn *"
 required
 value={formData.dueDate}
 onChange={e => setFormData({ ...formData, dueDate: e.target.value})}
 /> </div> </div> <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--admin-border-light)] mt-6"> <Button 
 type="button"
 variant="outline"
 onClick={onClose} 
 disabled={isSubmitting}
 >
 Hủy
 </Button> <Button 
 type="submit"
 variant="primary"
 disabled={isSubmitting}
 leftIcon={isSubmitting ? undefined : <IconDeviceFloppy size={16} />}
 >
 {isSubmitting ? 'Lưu.' : 'Lưu '}
 </Button> </div> </form> </Modal>
 );
}
