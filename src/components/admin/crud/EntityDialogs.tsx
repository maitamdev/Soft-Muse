'use client';

import { IconTrash, IconArchive, IconAlertTriangle } from '@tabler/icons-react';
import { Modal } from '@/components/admin/design-system/Modal';
import { Button } from '@/components/admin/design-system/Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isProcessing?: boolean;
}

export function EntityDeleteDialog({ isOpen, onClose, onConfirm, title, description, isProcessing }: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-6" dir="rtl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--admin-radius-lg)] bg-[var(--admin-danger-muted)]">
            <IconAlertTriangle size={22} className="text-[var(--admin-danger)]" />
          </div>
          <p className="text-sm text-[var(--admin-text-muted)] leading-relaxed pt-1">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--admin-border-light)]">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            إلغاء
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isProcessing}
            leftIcon={<IconTrash size={16} />}
          >
            تأكيد الحذف
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function EntityArchiveDialog({ isOpen, onClose, onConfirm, title, description, isProcessing }: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-6" dir="rtl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--admin-radius-lg)] bg-[var(--admin-warning-muted)]">
            <IconArchive size={22} className="text-[var(--admin-warning)]" />
          </div>
          <p className="text-sm text-[var(--admin-text-muted)] leading-relaxed pt-1">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--admin-border-light)]">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            إلغاء
          </Button>
          <Button
            variant="warning"
            onClick={onConfirm}
            isLoading={isProcessing}
            leftIcon={<IconArchive size={16} />}
          >
            تأكيد الأرشفة
          </Button>
        </div>
      </div>
    </Modal>
  );
}
