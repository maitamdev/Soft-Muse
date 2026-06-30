"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  IconShieldCheck, IconPlus, IconEdit, IconTrash,
  IconChevronRight, IconLock, IconCheck, IconX,
} from '@tabler/icons-react';
import { UsersService, MockRole, PERMISSION_MODULES_AR } from '@/lib/services/users.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/design-system/Card';
import { Badge } from '@/components/admin/design-system/Badge';
import { Button } from '@/components/admin/design-system/Button';
import { Modal } from '@/components/admin/design-system/Modal';
import { Input } from '@/components/admin/design-system/Input';
import { TextArea } from '@/components/admin/design-system/TextArea';
import { PageHeader } from '@/components/admin/design-system/Layout';
import { adminAr } from '@/lib/i18n/admin-ar';
import { StaggerContainer, StaggerItem } from '@/components/admin/ui/motion';
import { cn } from '@/utils/cn';

const COLOR_CLASSES: Record<string, string> = {
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  blue:   'bg-blue-500/10   text-blue-500   border-blue-500/20',
  emerald:'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  pink:   'bg-pink-500/10   text-pink-500   border-pink-500/20',
  cyan:   'bg-cyan-500/10   text-cyan-500   border-cyan-500/20',
  slate:  'bg-slate-500/10  text-slate-500  border-slate-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
};

const PERM_KEYS = Object.keys(PERMISSION_MODULES_AR);

function PermissionCell({ value }: { value: boolean }) {
  return value
    ? <IconCheck size={14} className="text-[var(--admin-success)] mx-auto" />
    : <IconX    size={14} className="text-[var(--admin-danger)] opacity-30 mx-auto" />;
}

interface RoleFormData {
  nameAr: string;
  descriptionAr: string;
  color: string;
  permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>;
}

const DEFAULT_PERMS = () =>
  Object.fromEntries(PERM_KEYS.map(k => [k, { read: false, write: false, delete: false }]));

const COLORS = ['purple', 'blue', 'emerald', 'orange', 'pink', 'cyan', 'slate', 'indigo'];

export default function RolesPage() {
  const t = adminAr.roles;
  const [roles, setRoles] = useState<MockRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<MockRole | null>(null);
  const [modal, setModal] = useState<{ open: boolean; editing?: MockRole }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<MockRole | null>(null);
  const [form, setForm] = useState<RoleFormData>({ nameAr: '', descriptionAr: '', color: 'blue', permissions: DEFAULT_PERMS() });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await UsersService.getRoles();
      setRoles(r);
      if (!selectedRole && r.length > 0) setSelectedRole(r[0]);
    } catch {
      toast.error(adminAr.toasts.unexpectedError);
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ nameAr: '', descriptionAr: '', color: 'blue', permissions: DEFAULT_PERMS() });
    setModal({ open: true });
  };

  const openEdit = (role: MockRole) => {
    setForm({ nameAr: role.nameAr, descriptionAr: role.descriptionAr, color: role.color, permissions: { ...DEFAULT_PERMS(), ...role.permissions } });
    setModal({ open: true, editing: role });
  };

  const togglePerm = (module: string, key: 'read' | 'write' | 'delete') => {
    setForm(f => ({
      ...f,
      permissions: {
        ...f.permissions,
        [module]: { ...f.permissions[module], [key]: !f.permissions[module]?.[key] },
      },
    }));
  };

  const handleSave = async () => {
    if (!form.nameAr.trim()) { toast.error('أدخل اسم الدور'); return; }
    setSaving(true);
    try {
      if (modal.editing) {
        await UsersService.updateRole(modal.editing.id, { nameAr: form.nameAr, descriptionAr: form.descriptionAr, color: form.color, permissions: form.permissions });
        toast.success('تم تحديث الدور بنجاح');
      } else {
        await UsersService.createRole({ nameAr: form.nameAr, nameKey: form.nameAr.toLowerCase().replace(/\s+/g, '_'), descriptionAr: form.descriptionAr, color: form.color, permissions: form.permissions });
        toast.success('تم إنشاء الدور بنجاح');
      }
      setModal({ open: false });
      load();
    } catch (err: any) {
      toast.error(err?.message ?? adminAr.toasts.unexpectedError);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await UsersService.deleteRole(deleteTarget.id);
      toast.success(adminAr.toasts.itemDeleted);
      setDeleteTarget(null);
      if (selectedRole?.id === deleteTarget.id) setSelectedRole(null);
      load();
    } catch (err: any) {
      toast.error(err?.message ?? adminAr.toasts.unexpectedError);
    } finally {
      setSaving(false);
    }
  };

  const displayRole = selectedRole ?? roles[0];

  return (
    <StaggerContainer className="space-y-6 pb-12">
      <StaggerItem>
        <div className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)] mb-2">
          <Link href="/admin/users" className="hover:text-[var(--admin-primary)] transition-colors">المستخدمون</Link>
          <IconChevronRight size={14} />
          <span className="text-[var(--admin-text-base)] font-medium">{adminAr.sidebar.roles}</span>
        </div>
        <PageHeader
          title={t.title}
          description={t.subtitle}
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={18} />} onClick={openCreate}>
              {t.addRole}
            </Button>
          }
        />
      </StaggerItem>

      <StaggerItem className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-[var(--admin-primary)] border-t-transparent animate-spin" />
            </div>
          ) : roles.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "w-full text-start p-4 rounded-[var(--admin-radius-xl)] border transition-all",
                displayRole?.id === role.id
                  ? "border-[var(--admin-primary)] bg-[var(--admin-primary-muted)] shadow-[var(--admin-shadow-md)]"
                  : "border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] hover:border-[var(--admin-border-strong)] hover:shadow-[var(--admin-shadow-sm)]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn("w-3 h-3 rounded-full shrink-0", `bg-${role.color}-500`)} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[var(--admin-text-base)] truncate">{role.nameAr}</p>
                    <p className="text-xs text-[var(--admin-text-muted)] truncate mt-0.5">{role.descriptionAr}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {role.isSystem && (
                    <div className="flex items-center gap-1 text-xs text-[var(--admin-text-subtle)]">
                      <IconLock size={10} />
                      <span>{t.systemRole}</span>
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[var(--admin-text-muted)]">{role.staffCount} موظف</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Permission Matrix */}
        <div className="xl:col-span-2">
          {displayRole ? (
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] pb-4">
                <div className="flex items-center gap-3">
                  <IconShieldCheck size={20} className="text-[var(--admin-primary)]" />
                  <div>
                    <CardTitle>{displayRole.nameAr}</CardTitle>
                    <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">{displayRole.descriptionAr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" leftIcon={<IconEdit size={14} />} onClick={() => openEdit(displayRole)}>
                    {t.editRole}
                  </Button>
                  {!displayRole.isSystem && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-[var(--admin-danger)] hover:bg-[var(--admin-danger-muted)]"
                      onClick={() => setDeleteTarget(displayRole)}
                    >
                      <IconTrash size={15} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)]">
                        <th className="text-start px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider">{t.module}</th>
                        <th className="text-center px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider w-20">{t.read}</th>
                        <th className="text-center px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider w-20">{t.write}</th>
                        <th className="text-center px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider w-20">{t.delete}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--admin-border-light)]">
                      {PERM_KEYS.map(module => {
                        const p = displayRole.permissions[module] ?? { read: false, write: false, delete: false };
                        return (
                          <tr key={module} className="hover:bg-[var(--admin-bg-hover)] transition-colors">
                            <td className="px-4 py-3 font-medium text-[var(--admin-text-base)]">
                              {PERMISSION_MODULES_AR[module]}
                            </td>
                            <td className="px-4 py-3 text-center"><PermissionCell value={p.read} /></td>
                            <td className="px-4 py-3 text-center"><PermissionCell value={p.write} /></td>
                            <td className="px-4 py-3 text-center"><PermissionCell value={p.delete} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--admin-text-muted)] p-12">
              <div className="text-center">
                <IconShieldCheck size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">اختر دوراً لعرض صلاحياته</p>
              </div>
            </div>
          )}
        </div>
      </StaggerItem>

      {/* Create / Edit Role Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.editing ? t.editRole : t.addRole}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal({ open: false })}>{adminAr.common.cancel}</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving} isLoading={saving}>{adminAr.common.save}</Button>
          </div>
        }
      >
        <div className="space-y-5 py-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.roleName}
              placeholder="مثال: مدير المنتجات"
              value={form.nameAr}
              onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-semibold text-[var(--admin-text-base)] mb-1.5">اللون</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={cn(
                      `w-7 h-7 rounded-full border-2 transition-all bg-${c}-500`,
                      form.color === c ? 'border-[var(--admin-text-base)] scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <TextArea
            label={t.description}
            placeholder="وصف دور المستخدم..."
            value={form.descriptionAr}
            onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))}
            rows={2}
          />

          {/* Permission matrix in modal */}
          <div>
            <p className="text-sm font-semibold text-[var(--admin-text-base)] mb-3">{t.permissions}</p>
            <div className="overflow-x-auto rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--admin-bg-elevated)] border-b border-[var(--admin-border-light)]">
                    <th className="text-start px-4 py-2.5 text-xs font-semibold text-[var(--admin-text-subtle)] uppercase tracking-wider">{t.module}</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-[var(--admin-text-subtle)] uppercase tracking-wider w-20">{t.read}</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-[var(--admin-text-subtle)] uppercase tracking-wider w-20">{t.write}</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-[var(--admin-text-subtle)] uppercase tracking-wider w-20">{t.delete}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--admin-border-light)]">
                  {PERM_KEYS.map(module => {
                    const p = form.permissions[module] ?? { read: false, write: false, delete: false };
                    return (
                      <tr key={module} className="hover:bg-[var(--admin-bg-hover)] transition-colors">
                        <td className="px-4 py-2.5 font-medium text-[var(--admin-text-base)] text-sm">
                          {PERMISSION_MODULES_AR[module]}
                        </td>
                        {(['read', 'write', 'delete'] as const).map(key => (
                          <td key={key} className="px-4 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => togglePerm(module, key)}
                              className={cn(
                                "w-6 h-6 rounded-md border mx-auto flex items-center justify-center transition-colors",
                                p[key]
                                  ? "bg-[var(--admin-success)] border-[var(--admin-success)] text-white"
                                  : "bg-[var(--admin-bg-elevated)] border-[var(--admin-border-base)] hover:border-[var(--admin-border-strong)]"
                              )}
                            >
                              {p[key] && <IconCheck size={12} />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t.deleteRole}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{adminAr.common.cancel}</Button>
            <Button variant="danger" onClick={handleDelete} disabled={saving} isLoading={saving}>{adminAr.common.delete}</Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--admin-text-muted)] py-2">
          {deleteTarget?.isSystem
            ? <span className="text-[var(--admin-danger)] font-semibold">{t.cannotDeleteSystem}</span>
            : <>{adminAr.common.confirmDelete} <strong className="text-[var(--admin-text-base)]">{deleteTarget?.nameAr}</strong>؟</>
          }
        </p>
      </Modal>
    </StaggerContainer>
  );
}
