'use client';

import { Modal } from '@/components/admin/design-system/Modal';
import { Button } from '@/components/admin/design-system/Button';
import { Input } from '@/components/admin/design-system/Input';
import { TextArea } from '@/components/admin/design-system/TextArea';
import React, { useState, useEffect } from 'react';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Asset } from '@/data/mock/business';

interface AssetModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSave: (data: Omit<Asset, 'id'>) => Promise<void>;
 initialData?: Asset | null;
}

export function AssetModal({ isOpen, onClose, onSave, initialData }: AssetModalProps) {
 const [formData, setFormData] = useState<Omit<Asset, 'id' | 'status'>>({
 name: '',
 type: '',
 purchaseValue: 0,
 currentValue: 0,
 purchaseDate: new Date().toISOString().split('T')[0],
 depreciationRate: 0,
 });
 
 const [status, setStatus] = useState<Asset['status']>('active');
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState('');

 useEffect(() => {
 if (initialData) {
 setFormData({
 name: initialData.name,
 type: initialData.type,
 purchaseValue: initialData.purchaseValue,
 currentValue: initialData.currentValue,
 purchaseDate: initialData.purchaseDate,
 depreciationRate: initialData.depreciationRate,
 });
 setStatus(initialData.status);
 } else {
 setFormData({
 name: '',
 type: '',
 purchaseValue: 0,
 currentValue: 0,
 purchaseDate: new Date().toISOString().split('T')[0],
 depreciationRate: 0,
 });
 setStatus('active');
 }
 setError('');
 }, [initialData, isOpen]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 
 if (!formData.name.trim()) return setError('Têntài sản ');
 if ((formData.purchaseValue ?? 0) <= 0) return setError('từ');
 if (formData.currentValue < 0) return setError('Giá trị hiện tại không');

 setIsSubmitting(true);
 try {
 await onSave({ ...formData, status });
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
 title={initialData ? 'Sửa ' : 'Thêm tài sản Mới'} 
 maxWidth="2xl"
 > <form onSubmit={handleSubmit} className="space-y-6 pt-2" dir="ltr">
 {error && (
 <div className="p-3 text-sm text-[var(--admin-danger)] bg-[var(--admin-danger)]/10 border border-[var(--admin-danger)]/20 rounded-lg">
 {error}
 </div>
 )}
 
 <div className="grid grid-cols-2 gap-4"> <div className="col-span-2"> <Input 
 label="Têntài sản *"
 required
 value={formData.name}
 onChange={e => setFormData({ ...formData, name: e.target.value})}
 placeholder=":Quản lý"
 /> </div> <div className="flex flex-col gap-1"> <label className="text-sm font-medium text-[var(--admin-text-muted)]">*</label> <select 
 value={formData.type}
 onChange={e => setFormData({ ...formData, type: e.target.value as any})}
 className="w-full px-3 py-2 border border-[var(--admin-border-base)] rounded-lg bg-[var(--admin-bg-surface)] text-[var(--admin-text-base)] focus:ring-2 focus:ring-[var(--admin-primary)] focus:border-[var(--admin-primary)] outline-none h-12"
 > <option value=""></option> <option value=""></option> <option value=""></option> <option value=""></option> <option value=""></option> <option value=""></option> </select> </div> <div> <Input 
 type="date" 
 label="Ngày mua *"
 required
 value={formData.purchaseDate}
 onChange={e => setFormData({ ...formData, purchaseDate: e.target.value})}
 /> </div> <div> <Input 
 type="number" 
 label="*"
 required
 min={0}
 value={formData.purchaseValue}
 onChange={e => setFormData({ ...formData, purchaseValue: parseFloat(e.target.value) || 0})}
 /> </div> <div> <Input 
 type="number" 
 label="Giá trị hiện tại *"
 required
 min={0}
 value={formData.currentValue}
 onChange={e => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0})}
 /> </div> <div> <Input 
 type="number" 
 label="(%)"
 min={0}
 max={100}
 value={formData.depreciationRate}
 onChange={e => setFormData({ ...formData, depreciationRate: parseFloat(e.target.value) || 0})}
 /> </div> <div className="col-span-2 flex flex-col gap-1"> <label className="text-sm font-medium text-[var(--admin-text-muted)]">Trạng thái</label> <select 
 value={status}
 onChange={e => setStatus(e.target.value as any)}
 className="w-full px-3 py-2 border border-[var(--admin-border-base)] rounded-lg bg-[var(--admin-bg-surface)] text-[var(--admin-text-base)] focus:ring-2 focus:ring-[var(--admin-primary)] focus:border-[var(--admin-primary)] outline-none h-12"
 > <option value="active">Hoạt động</option> <option value="maintenance">Đang bảo trì</option> <option value="written_off">(đã )</option> </select> </div> </div> <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--admin-border-light)] mt-6"> <Button 
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
