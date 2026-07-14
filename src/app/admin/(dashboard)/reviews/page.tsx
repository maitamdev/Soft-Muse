"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
 IconStar, IconTrash, IconCheck, IconX, IconArchive, IconMessage,
 IconEyeOff, IconPinFilled, IconPin, IconUserCheck
} from '@tabler/icons-react';
import { ReviewService, Review } from '@/lib/services/review.service';
import { EntityDeleteDialog } from '@/components/admin/crud/EntityDialogs';
import { useEventSubscribeMany } from '@/hooks/useEventBus';

import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Button } from '@/components/admin/design-system/Button';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';
import { Badge } from '@/components/admin/design-system/Badge';
import { Modal } from '@/components/admin/design-system/Modal';

const STATUS_LABELS: Record<Review['status'], string> = {
 pending: '',
 approved: '',
 rejected: 'Bị từ chối',
 hidden: ''
};

const STATUS_VARIANTS: Record<Review['status'], 'success' | 'danger' | 'warning' | 'neutral'> = {
 approved: 'success',
 rejected: 'danger',
 pending: 'warning',
 hidden: 'neutral'
};

function StarRating({ rating }: { rating: number }) {
 return (
 <div className="flex items-center gap-0.5">
 {[1, 2, 3, 4, 5].map(s => (
 <IconStar key={s} size={14} className={s <= rating ? 'text-[var(--admin-warning)]' : 'text-[var(--admin-border-strong)]'} fill={s <= rating ? 'currentColor' : 'none'} />
 ))}
 </div>
 );
}

function Avatar({ name, src }: { name: string; src?: string }) {
 const initials = name.split('').map(w => w[0]).join('').slice(0, 2).toUpperCase();
 if (src) return <img src={src} alt={name} className="w-9 h-9 rounded-full object-cover border border-[var(--admin-border-light)]" />;
 return (
 <div className="w-9 h-9 rounded-full bg-[var(--admin-primary-muted)] border border-[var(--admin-primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--admin-primary)]">
 {initials}
 </div>
 );
}

export default function ReviewsPage() {
 const [reviews, setReviews] = useState<Review[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
 const [search, setSearch] = useState('');
 const [statusFilter, setStatusFilter] = useState<'all' | Review['status']>('all');
 const [detailReview, setDetailReview] = useState<Review | null>(null);
 const [replyDraft, setReplyDraft] = useState('');
 const [savingReply, setSavingReply] = useState(false);
 const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
 const [isBulkDeleting, setIsBulkDeleting] = useState(false);

 const loadReviews = async () => {
 setLoading(true);
 try {
 const data = await ReviewService.getReviews();
 setReviews(data);
 } catch (err) {
 toast.error("Đã xảy ra lỗi tảiĐánh giá");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => { loadReviews(); }, []);
 useEventSubscribeMany(['reviews.changed', 'review.submitted', 'review.approved', 'review.rejected'], loadReviews);

 const openDetail = (review: Review) => {
 setDetailReview(review);
 setReplyDraft(review.adminReply ?? '');
 };

 const saveReply = async () => {
 if (!detailReview) return;
 setSavingReply(true);
 try {
 const updated = await ReviewService.updateAdminReply(detailReview.id, replyDraft.trim() || null);
 setDetailReview(updated);
 toast.success('đãLưu ');
 loadReviews();
 } catch {
 toast.error("Đã xảy ra lỗi Lưu ");
 } finally {
 setSavingReply(false);
 }
 };

 const handleStatusChange = async (id: string, status: Review['status']) => {
 try {
 await ReviewService.updateReviewStatus(id, status);
 toast.success(STATUS_LABELS[status]);
 if (detailReview?.id === id) setDetailReview(prev => prev ? { ...prev, status } : null);
 loadReviews();
 } catch { toast.error("Đã xảy ra lỗi"); }
 };

 const toggleFeatured = async (id: string) => {
 try {
 const updated = await ReviewService.toggleFeatured(id);
 if (detailReview?.id === id) setDetailReview(updated);
 loadReviews();
 } catch { toast.error("Đã xảy ra lỗi"); }
 };

 const togglePinned = async (id: string) => {
 try {
 const updated = await ReviewService.togglePinned(id);
 if (detailReview?.id === id) setDetailReview(updated);
 loadReviews();
 } catch { toast.error("Đã xảy ra lỗi"); }
 };

 const handleDeleteSelected = async () => {
 setIsBulkDeleting(true);
 try {
 await Promise.all(selectedIds.map(id => ReviewService.deleteReview(String(id))));
 toast.success("đãXóa Đánh giá");
 setSelectedIds([]);
 loadReviews();
 } catch { toast.error("Đã xảy ra lỗi Xóa"); } finally {
 setIsBulkDeleting(false);
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const confirmRowDelete = async () => {
 if (!deleteDialog.id) return;
 try {
 await ReviewService.deleteReview(deleteDialog.id);
 toast.success("đãXóa ");
 if (detailReview?.id === deleteDialog.id) setDetailReview(null);
 loadReviews();
 } catch { toast.error("Đã xảy ra lỗi Xóa"); } finally {
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const columns: Column<Review>[] = [
 {
 header: 'Khách hàng',
 accessor: 'customerName',
 type: 'custom',
 render: (_, row) => (
 <div className="flex items-center gap-2.5 min-w-[160px]"> <Avatar name={row.customerName} src={row.customerAvatar} /> <div> <p className="font-bold text-sm text-[var(--admin-text-base)]">{row.customerName}</p> <p className="text-[11px] text-[var(--admin-text-subtle)]">{row.customerEmail}</p> </div> </div>
 )
 },
 {
 header: '',
 accessor: 'rating',
 type: 'custom',
 render: (_, row) => (
 <div className="flex flex-col gap-1"> <StarRating rating={row.rating} />
 {row.verifiedPurchase && (
 <span className="flex items-center gap-1 text-[10px] text-[var(--admin-success)] font-medium"> <IconUserCheck size={11} /> </span>
 )}
 </div>
 )
 },
 {
 header: '',
 accessor: 'content',
 type: 'custom',
 render: (_, row) => (
 <div className="max-w-[280px]"> <p className="font-bold text-sm truncate text-[var(--admin-text-base)]">{row.title}</p> <p className="text-xs text-[var(--admin-text-subtle)] truncate mt-0.5">{row.content}</p>
 {row.adminReply && (
 <p className="text-[10px] text-[var(--admin-primary)] mt-1 truncate">↩ </p>
 )}
 </div>
 )
 },
 {
 header: 'sản phẩm',
 accessor: 'productName',
 type: 'custom',
 render: (_, row) => (
 <div className="flex items-center gap-2 min-w-[120px]">
 {row.productImage && (
 <img src={row.productImage} alt="" className="w-8 h-10 object-cover rounded border border-[var(--admin-border-light)] shrink-0" />
 )}
 <p className="text-xs text-[var(--admin-text-base)] line-clamp-2">{row.productName}</p> </div>
 )
 },
 {
 header: 'Trạng thái',
 accessor: 'status',
 type: 'custom',
 render: (_, row) => (
 <Badge variant={STATUS_VARIANTS[row.status]} size="sm" animated>
 {STATUS_LABELS[row.status]}
 </Badge>
 )
 },
 {
 header: '',
 accessor: 'isFeatured',
 type: 'custom',
 render: (_, row) => (
 <div className="flex gap-1.5"> <button onClick={() => toggleFeatured(row.id)} title="AURA" className={`transition-colors ${row.isFeatured ? 'text-[var(--admin-warning)]' : 'text-[var(--admin-border-strong)]'}`}> <IconStar size={18} fill={row.isFeatured ? "currentColor" : "none"} /> </button> <button onClick={() => togglePinned(row.id)} title="AURA" className={`transition-colors ${row.isPinned ? 'text-[var(--admin-primary)]' : 'text-[var(--admin-border-strong)]'}`}>
 {row.isPinned ? <IconPinFilled size={18} /> : <IconPin size={18} />}
 </button> </div>
 )
 },
 {
 header: 'Ngày',
 accessor: 'createdAt',
 type: 'custom',
 render: (_, row) => (
 <span className="text-xs text-[var(--admin-text-subtle)] whitespace-nowrap">
 {new Date(row.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
 </span>
 )
 },
 {
 header: '',
 accessor: 'id',
 type: 'actions',
 align: 'end',
 render: (_, row) => (
 <div className="flex items-center gap-1 justify-end"> <Button variant="ghost" size="icon-sm" title="vàChi tiết" onClick={() => openDetail(row)}> <IconMessage size={16} /> </Button>
 {row.status !== 'approved' && (
 <Button variant="ghost" size="icon-sm" className="text-[var(--admin-success)]" onClick={() => handleStatusChange(row.id, 'approved')}> <IconCheck size={16} /> </Button>
 )}
 {row.status !== 'rejected' && (
 <Button variant="ghost" size="icon-sm" className="text-[var(--admin-danger)]" onClick={() => handleStatusChange(row.id, 'rejected')}> <IconX size={16} /> </Button>
 )}
 {row.status !== 'hidden' && (
 <Button variant="ghost" size="icon-sm" className="text-[var(--admin-text-muted)]" title="AURA" onClick={() => handleStatusChange(row.id, 'hidden')}> <IconEyeOff size={16} /> </Button>
 )}
 <Button variant="ghost" size="icon-sm" className="text-[var(--admin-danger)]" onClick={() => setDeleteDialog({ isOpen: true, id: row.id })}> <IconTrash size={16} /> </Button> </div>
 )
 }
 ];

 const filteredData = reviews.filter(r => {
 const matchesSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) ||
 r.content.toLowerCase().includes(search.toLowerCase()) ||
 r.productName.toLowerCase().includes(search.toLowerCase());
 const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
 return matchesSearch && matchesStatus;
 });

 return (
 <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 fade-in"> <PageHeader title="Quản lý Đánh giá" description="Khách hàng,, vàQuản lý " /> <div className="flex flex-wrap gap-3">
 {(['all', 'pending', 'approved', 'rejected', 'hidden'] as const).map(s => (
 <button
 key={s}
 onClick={() => setStatusFilter(s)}
 className={`px-3 h-9 rounded-[var(--admin-radius-md)] text-xs font-semibold border transition-colors ${
 statusFilter === s
 ? 'bg-[var(--admin-primary)] text-white border-[var(--admin-primary)]'
 : 'bg-[var(--admin-bg-surface)] text-[var(--admin-text-muted)] border-[var(--admin-border-base)] hover:text-[var(--admin-text-base)]'
 }`}
 >
 {s === 'all' ? '' : STATUS_LABELS[s]}
 </button>
 ))}
 </div>

 {selectedIds.length > 0 && (
 <div className="bg-[var(--admin-primary-muted)] border border-[var(--admin-primary)]/20 p-3 px-4 flex items-center justify-between rounded-[var(--admin-radius-xl)]"> <span className="text-sm font-bold text-[var(--admin-primary)]">Đã chọn {selectedIds.length} </span> <Button size="sm" variant="danger" leftIcon={<IconTrash size={16} />} onClick={() => setDeleteDialog({ isOpen: true, id: null })}>
 Xóa mục đã chọn
 </Button> </div>
 )}

 <DataTable
 columns={columns}
 data={filteredData}
 isLoading={loading}
 searchQuery={search}
 onSearchChange={setSearch}
 selectable
 selectedIds={selectedIds}
 onSelectionChange={setSelectedIds}
 pageSize={15}
 emptyState={
 <EmptyState icon={<IconArchive size={48} />} title="Không có " description="Không tìm thấy." />
 }
 />

 {/* Detail + Admin Reply Modal */}
 <Modal
 isOpen={!!detailReview}
 onClose={() => setDetailReview(null)}
 title="Chi tiết "
 size="lg"
 footer={
 <div className="flex items-center justify-between gap-3"> <div className="flex gap-2">
 {detailReview && detailReview.status !== 'approved' && (
 <Button size="sm" variant="secondary" className="text-[var(--admin-success)]" onClick={() => handleStatusChange(detailReview.id, 'approved')}> <IconCheck size={15} className="me-1" /> </Button>
 )}
 {detailReview && detailReview.status !== 'rejected' && (
 <Button size="sm" variant="secondary" className="text-[var(--admin-danger)]" onClick={() => handleStatusChange(detailReview.id, 'rejected')}> <IconX size={15} className="me-1" /> </Button>
 )}
 </div> <Button variant="primary" isLoading={savingReply} onClick={saveReply}>Lưu </Button> </div>
 }
 >
 {detailReview && (
 <div className="space-y-5"> <div className="flex items-start gap-4"> <Avatar name={detailReview.customerName} src={detailReview.customerAvatar} /> <div className="flex-1"> <div className="flex items-center gap-2 flex-wrap"> <p className="font-bold text-[var(--admin-text-base)]">{detailReview.customerName}</p>
 {detailReview.verifiedPurchase && (
 <Badge variant="success" size="sm"><IconUserCheck size={11} className="me-1 inline" /></Badge>
 )}
 <Badge variant={STATUS_VARIANTS[detailReview.status]} size="sm">{STATUS_LABELS[detailReview.status]}</Badge> </div> <p className="text-xs text-[var(--admin-text-subtle)]">{detailReview.customerEmail}</p> <StarRating rating={detailReview.rating} /> </div> <span className="text-xs text-[var(--admin-text-subtle)] shrink-0">
 {new Date(detailReview.createdAt).toLocaleDateString('ar-EG')}
 </span> </div> <div className="p-4 bg-[var(--admin-bg-elevated)] rounded-[var(--admin-radius-lg)] border border-[var(--admin-border-light)]"> <p className="font-bold text-sm text-[var(--admin-text-base)] mb-1">{detailReview.title}</p> <p className="text-sm text-[var(--admin-text-muted)] leading-relaxed">{detailReview.content}</p> </div> <div className="flex items-center gap-3 p-3 bg-[var(--admin-bg-elevated)] rounded-[var(--admin-radius-md)] border border-[var(--admin-border-light)]">
 {detailReview.productImage && (
 <img src={detailReview.productImage} alt="" className="w-10 h-14 object-cover rounded shrink-0" />
 )}
 <div> <p className="text-xs text-[var(--admin-text-muted)]">sản phẩm</p> <p className="text-sm font-semibold text-[var(--admin-text-base)]">{detailReview.productName}</p> </div> </div> <div className="space-y-2"> <label className="text-sm font-bold text-[var(--admin-text-base)]">( trongCửa hàng)</label> <textarea
 rows={4}
 value={replyDraft}
 onChange={(e) => setReplyDraft(e.target.value)}
 placeholder="trên này."
 className="w-full px-3 py-2 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] bg-[var(--admin-bg-base)] outline-none focus:border-[var(--admin-primary)] resize-y text-sm text-[var(--admin-text-base)]"
 />
 {replyDraft.trim() && (
 <button onClick={() => setReplyDraft('')} className="text-xs text-[var(--admin-danger)] hover:underline"></button>
 )}
 </div> <div className="flex items-center gap-4 pt-2 border-t border-[var(--admin-border-light)]"> <label className="flex items-center gap-2 cursor-pointer"> <input type="checkbox" checked={detailReview.isFeatured} onChange={() => toggleFeatured(detailReview.id)} className="w-4 h-4 rounded text-[var(--admin-primary)]" /> <span className="text-sm text-[var(--admin-text-base)]"></span> </label> <label className="flex items-center gap-2 cursor-pointer"> <input type="checkbox" checked={detailReview.isPinned} onChange={() => togglePinned(detailReview.id)} className="w-4 h-4 rounded text-[var(--admin-primary)]" /> <span className="text-sm text-[var(--admin-text-base)]">trong</span> </label> </div> </div>
 )}
 </Modal> <EntityDeleteDialog
 isOpen={deleteDialog.isOpen}
 onClose={() => setDeleteDialog({ isOpen: false, id: null })}
 onConfirm={deleteDialog.id ? confirmRowDelete : handleDeleteSelected}
 title="Xóa "
 description={
 deleteDialog.id
 ? 'Bạn có chắc muốn Xóa nàyvĩnh viễnً؟'
 : `Bạn có chắc muốn Xóa ${selectedIds.length} ؟`
 }
 isProcessing={isBulkDeleting}
 /> </div>
 );
}
