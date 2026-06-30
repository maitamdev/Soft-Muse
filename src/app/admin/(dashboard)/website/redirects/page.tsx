"use client";

import React, { useState, useEffect } from "react";
import { IconPlus, IconTrash, IconExternalLink } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { DataTable } from "@/components/admin/design-system/DataTable";
import { Badge } from "@/components/admin/design-system/Badge";
import { FadeIn } from "@/components/admin/ui/motion";
import { RedirectService, Redirect } from "@/lib/services/storefront/redirect.service";

export default function RedirectsManager() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);


  async function loadRedirects() {
    try {
      const data = await RedirectService.getAll();
      setRedirects(data);
    } catch (e) {
      toast.error("Failed to load redirects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedirects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await RedirectService.deleteRedirect(id);
      setRedirects(r => r.filter(x => x.id !== id));
      toast.success("Redirect deleted");
    } catch {
      toast.error("Failed to delete redirect");
    }
  };

  const columns = [
    {
      accessor: "oldUrl",
      header: "الرابط القديم",
      render: (val: any) => <span className="font-mono text-sm text-[var(--admin-danger)]">{val}</span>
    },
    {
      accessor: "newUrl",
      header: "التحويل إلى",
      render: (val: any) => (
        <a href={val} target="_blank" className="font-mono text-sm text-[var(--admin-primary)] hover:underline flex items-center gap-1">
          {val} <IconExternalLink size={14} />
        </a>
      )
    },
    {
      accessor: "type",
      header: "النوع",
      render: (val: any) => <Badge variant={val === 301 ? 'primary' : 'neutral'} size="sm">{val} Redirect</Badge>
    },
    { accessor: "hits", header: "الزيارات" },
    {
      accessor: "actions",
      header: "",
      align: "end" as const,
      render: (_: any, row: any) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-[var(--admin-danger-muted)] hover:text-[var(--admin-danger)] p-1"
        >
          <IconTrash size={18} />
        </button>
      )
    }
  ];

  return (
    <FadeIn className="space-y-6">
      <div className="flex items-center justify-end">
        <Button variant="primary" size="md" leftIcon={<IconPlus size={18} />}>
          إضافة تحويل جديد
        </Button>
      </div>

      <div className="bg-[var(--admin-bg-surface)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--admin-text-muted)]">جاري التحميل...</div>
        ) : (
          <DataTable
            columns={columns}
            data={redirects}
            pageSize={10}
            className="border-0 shadow-none"
          />
        )}
      </div>
    </FadeIn>
  );
}
