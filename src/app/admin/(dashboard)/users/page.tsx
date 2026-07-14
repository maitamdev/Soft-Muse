"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
 IconUserPlus, IconEdit, IconTrash, IconShieldCheck,
 IconClock, IconArrowUpRight, IconUser, IconMail, IconPhone, IconPower,
} from '@tabler/icons-react';
import { SupabaseUsersService as UsersService } from '@/lib/services/users-supabase.service';
import type { MockStaffMember, MockRole } from '@/lib/services/users.service';
import { KpiCard } from '@/components/admin/design-system/KpiCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/design-system/Card';
import { Badge } from '@/components/admin/design-system/Badge';
import { Button } from '@/components/admin/design-system/Button';
import { Modal } from '@/components/admin/design-system/Modal';
import { Input } from '@/components/admin/design-system/Input';
import { PageHeader } from '@/components/admin/design-system/Layout';
import { adminAr } from '@/lib/i18n/admin-ar';
import { StaggerContainer, StaggerItem } from '@/components/admin/ui/motion';

const ROLE_BADGE: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
 purple: 'primary', blue: 'info', emerald: 'success', orange: 'warning', pink: 'danger', cyan: 'info',
};

function Avatar({ name, superAdmin }: { name: string; superAdmin: boolean }) {
 return (
 <div className="relative shrink-0"> <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${superAdmin ? 'bg-[var(--admin-primary)]' : 'bg-[var(--admin-bg-elevated)] text-[var(--admin-text-base)] border border-[var(--admin-border-base)]'}`}>
 {name.charAt(0)}
 </div>
 {superAdmin && (
 <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full border-2 border-[var(--admin-bg-surface)] flex items-center justify-center"> <IconShieldCheck size={9} className="text-yellow-900" /> </div>
 )}
 </div>
 );
}

function formatLastLogin(dt: string | null): string {
 if (!dt) return adminAr.users.neverLoggedIn;
 const diff = Date.now() - new Date(dt).getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 2) return '';
 if (mins < 60) return `${mins} `;
 const hrs = Math.floor(mins / 60);
 if (hrs < 24) return `${hrs} `;
 const days = Math.floor(hrs / 24);
 return `${days} `;
}

interface UserFormData {
 nameAr: string;
 username: string;
 email: string;
 phone: string;
 password: string;
 confirmPassword: string;
 avatarUrl: string;
 roleId: string;
 status: 'active' | 'inactive';
}

const EMPTY_FORM: UserFormData = { nameAr: '', username: '', email: '', phone: '', password: '', confirmPassword: '', avatarUrl: '', roleId: '', status: 'active' };

export default function UsersPage() {
 const t = adminAr.users;
 const [staff, setStaff] = useState<MockStaffMember[]>([]);
 const [roles, setRoles] = useState<MockRole[]>([]);
 const [loading, setLoading] = useState(true);
 const [modal, setModal] = useState<{ open: boolean; editing?: MockStaffMember }>({ open: false });
 const [deleteTarget, setDeleteTarget] = useState<MockStaffMember | null>(null);
 const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
 const [saving, setSaving] = useState(false);

 const load = useCallback(async () => {
 setLoading(true);
 try {
 const [s, r] = await Promise.all([UsersService.getStaff(), UsersService.getRoles()]);
 setStaff(s);
 setRoles(r);
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => { load(); }, [load]);

 const openCreate = () => {
 setForm({ ...EMPTY_FORM, roleId: roles[0]?.id ?? '' });
 setModal({ open: true });
 };

 const openEdit = (member: MockStaffMember) => {
 setForm({ nameAr: member.nameAr, username: member.username, email: member.email, phone: member.phone ?? '', password: '', confirmPassword: '', avatarUrl: member.avatarUrl ?? '', roleId: member.roleId, status: member.status });
 setModal({ open: true, editing: member });
 };

 const handleSave = async () => {
 if (!form.nameAr.trim()) { toast.error('Tên'); return; }
 if (!form.username.trim()) { toast.error('mã '); return; }
 if (!form.email.trim()) { toast.error('Email'); return; }
 if (!form.roleId) { toast.error('Vai trò'); return; }
 // Password required when creating; optional on edit (only when changing).
 if (!modal.editing && !form.password) { toast.error('Mật khẩu '); return; }
 if (form.password) {
 if (form.password.length < 6) { toast.error('Mật khẩu 6 trên'); return; }
 if (form.password !== form.confirmPassword) { toast.error('Mật khẩu không khớp khớp'); return; }
 }
 setSaving(true);
 try {
 if (modal.editing) {
 await UsersService.updateStaff(modal.editing.id, { nameAr: form.nameAr, username: form.username, phone: form.phone || null, roleId: form.roleId, status: form.status, avatarUrl: form.avatarUrl || null });
 if (form.password) await UsersService.setPassword(modal.editing.id, form.password);
 toast.success('đã');
 } else {
 await UsersService.createStaff(
 { nameAr: form.nameAr, username: form.username, email: form.email, phone: form.phone || null, roleId: form.roleId, roleNameAr: '', roleColor: '', avatarUrl: form.avatarUrl || null, isSuperAdmin: false, status: form.status },
 form.password
 );
 toast.success('đã thành công');
 }
 setModal({ open: false });
 load();
 } catch (err: any) {
 toast.error(err?.message ?? adminAr.toasts.unexpectedError);
 } finally {
 setSaving(false);
 }
 };

 const handleToggleStatus = async (member: MockStaffMember) => {
 const next = member.status === 'active' ? 'inactive' : 'active';
 try {
 await UsersService.updateStaff(member.id, { status: next });
 toast.success(next === 'active' ? 'đã' : 'đã');
 load();
 } catch (err: any) {
 toast.error(err?.message ?? adminAr.toasts.unexpectedError);
 }
 };

 const handleDelete = async () => {
 if (!deleteTarget) return;
 setSaving(true);
 try {
 await UsersService.deleteStaff(deleteTarget.id);
 toast.success(adminAr.toasts.itemDeleted);
 setDeleteTarget(null);
 load();
 } catch (err: any) {
 toast.error(err?.message ?? adminAr.toasts.unexpectedError);
 } finally {
 setSaving(false);
 }
 };

 const activeCount = staff.filter(s => s.status === 'active').length;
 const inactiveCount = staff.filter(s => s.status === 'inactive').length;
 const superAdmins = staff.filter(s => s.isSuperAdmin).length;

 return (
 <StaggerContainer className="space-y-6 pb-12"> <StaggerItem> <PageHeader
 title={t.title}
 description={t.subtitle}
 actions={
 <div className="flex items-center gap-3"> <Link href="/admin/users/roles"> <Button variant="secondary" size="md" leftIcon={<IconShieldCheck size={18} />}>
 {adminAr.sidebar.roles}
 </Button> </Link> <Button variant="primary" size="md" leftIcon={<IconUserPlus size={18} />} onClick={openCreate}>
 {t.addUser}
 </Button> </div>
 }
 /> </StaggerItem>

 {/* KPI Cards */}
 <StaggerItem className="grid grid-cols-2 xl:grid-cols-4 gap-4"> <KpiCard title="tổng" value={staff.length} icon={<IconUser stroke={2} />} accentColor="blue" /> <KpiCard title="Hoạt động" value={activeCount} icon={<IconUser stroke={2} />} accentColor="emerald" /> <KpiCard title="Tạm khóa" value={inactiveCount} icon={<IconUser stroke={2} />} accentColor="orange" /> <KpiCard title="AURA" value={superAdmins} icon={<IconShieldCheck stroke={2} />} accentColor="purple" /> </StaggerItem>

 {/* Staff Table */}
 <StaggerItem> <Card> <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] pb-4"> <CardTitle></CardTitle> <Link href="/admin/users/roles"> <Button variant="ghost" size="sm" rightIcon={<IconArrowUpRight size={16} />}>
 Quản lý </Button> </Link> </CardHeader> <CardContent className="p-0">
 {loading ? (
 <div className="p-8 flex justify-center"> <div className="w-8 h-8 rounded-full border-4 border-[var(--admin-primary)] border-t-transparent animate-spin" /> </div>
 ) : (
 <div className="divide-y divide-[var(--admin-border-light)]">
 {staff.map(member => (
 <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--admin-bg-hover)] transition-colors group"> <Avatar name={member.nameAr} superAdmin={member.isSuperAdmin} /> <div className="min-w-0 flex-1"> <div className="flex items-center gap-2 flex-wrap"> <p className="font-bold text-[var(--admin-text-base)] text-sm">{member.nameAr}</p>
 {member.isSuperAdmin && (
 <Badge variant="warning" size="sm">{t.superAdmin}</Badge>
 )}
 <Badge
 variant={member.status === 'active' ? 'success' : 'warning'}
 size="sm"
 >
 {member.status === 'active' ? t.active : t.inactive}
 </Badge> </div> <div className="flex items-center gap-4 mt-1 flex-wrap"> <span className="flex items-center gap-1 text-xs text-[var(--admin-text-muted)]"> <IconMail size={12} />
 {member.email}
 </span>
 {member.phone && (
 <span className="flex items-center gap-1 text-xs text-[var(--admin-text-muted)]"> <IconPhone size={12} />
 {member.phone}
 </span>
 )}
 </div> </div> <div className="hidden md:flex flex-col items-end gap-1 shrink-0"> <Badge
 variant={(ROLE_BADGE[member.roleColor] ?? 'primary')}
 size="sm"
 className="font-semibold"
 >
 {member.roleNameAr}
 </Badge> <span className="flex items-center gap-1 text-xs text-[var(--admin-text-muted)]"> <IconClock size={11} />
 {formatLastLogin(member.lastLoginAt)}
 </span> </div> <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
 {!member.isSuperAdmin && (
 <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => handleToggleStatus(member)}
 title={member.status === 'active' ? t.inactive : t.active}
 className={member.status === 'active' ? 'text-[var(--admin-warning)]' : 'text-[var(--admin-success)]'}
 > <IconPower size={15} /> </Button>
 )}
 <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => openEdit(member)}
 title={t.editUser}
 > <IconEdit size={15} /> </Button>
 {!member.isSuperAdmin && (
 <Button
 variant="ghost"
 size="icon-sm"
 className="text-[var(--admin-danger)] hover:bg-[var(--admin-danger-muted)]"
 onClick={() => setDeleteTarget(member)}
 title={t.deleteUser}
 > <IconTrash size={15} /> </Button>
 )}
 </div> </div>
 ))}
 </div>
 )}
 </CardContent> </Card> </StaggerItem>

 {/* Create / Edit Modal */}
 <Modal
 isOpen={modal.open}
 onClose={() => setModal({ open: false })}
 title={modal.editing ? t.editUser : t.addUser}
 size="md"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setModal({ open: false })}>{adminAr.common.cancel}</Button> <Button variant="primary" onClick={handleSave} disabled={saving} isLoading={saving}>{adminAr.common.save}</Button> </div>
 }
 > <div className="space-y-4 py-1"> <Input
 label={t.name}
 placeholder="Tên"
 value={form.nameAr}
 onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
 /> <Input
 label="mã "
 placeholder="username"
 dir="ltr"
 value={form.username}
 onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
 /> <Input
 label={t.email}
 type="email"
 placeholder="email@example.com"
 value={form.email}
 onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
 disabled={!!modal.editing}
 /> <Input
 label={t.phone}
 placeholder="+20 100 000 0000"
 value={form.phone}
 onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
 /> <Input
 label="Hình ảnh()"
 placeholder="https://."
 dir="ltr"
 value={form.avatarUrl}
 onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
 /> <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> <Input
 label={modal.editing ? 'Mới()' : 'Mật khẩu'}
 type="password"
 autoComplete="new-password"
 placeholder="••••••"
 value={form.password}
 onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
 /> <Input
 label="Mật khẩu"
 type="password"
 autoComplete="new-password"
 placeholder="••••••"
 value={form.confirmPassword}
 onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
 /> </div> <div> <label className="block text-sm font-semibold text-[var(--admin-text-base)] mb-1.5">{t.role}</label> <select
 value={form.roleId}
 onChange={e => setForm(f => ({ ...f, roleId: e.target.value }))}
 className="w-full h-10 px-3 rounded-[var(--admin-radius-md)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-elevated)] text-sm text-[var(--admin-text-base)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
 > <option value="">— —</option>
 {roles.map(r => (
 <option key={r.id} value={r.id}>{r.nameAr}</option>
 ))}
 </select> </div> <div> <label className="block text-sm font-semibold text-[var(--admin-text-base)] mb-1.5">{t.status}</label> <div className="flex gap-3">
 {(['active', 'inactive'] as const).map(s => (
 <button
 key={s}
 type="button"
 onClick={() => setForm(f => ({ ...f, status: s }))}
 className={`flex-1 py-2 text-sm font-semibold rounded-[var(--admin-radius-md)] border transition-colors ${
 form.status === s
 ? 'border-[var(--admin-primary)] bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]'
 : 'border-[var(--admin-border-base)] bg-[var(--admin-bg-elevated)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)]'
 }`}
 >
 {s === 'active' ? t.active : t.inactive}
 </button>
 ))}
 </div> </div> </div> </Modal>

 {/* Delete Confirm Modal */}
 <Modal
 isOpen={!!deleteTarget}
 onClose={() => setDeleteTarget(null)}
 title={t.deleteUser}
 size="sm"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{adminAr.common.cancel}</Button> <Button variant="danger" onClick={handleDelete} disabled={saving} isLoading={saving}>{adminAr.common.delete}</Button> </div>
 }
 > <p className="text-sm text-[var(--admin-text-muted)] py-2">
 {t.confirmDelete}
 <span className="font-bold text-[var(--admin-text-base)]"> {deleteTarget?.nameAr}</span>؟
 <br /> <span className="text-[var(--admin-danger)]">{adminAr.common.thisActionCannotBeUndone}</span> </p> </Modal> </StaggerContainer>
 );
}
