"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import { Collection, CollectionService } from "@/lib/services/collection.service";

export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    CollectionService.getCollection(id)
      .then((data) => {
        if (!active) return;
        if (!data) setError("Không tìm thấy bộ sưu tập.");
        else setCollection(data);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Không thể tải bộ sưu tập.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <div className="flex min-h-[360px] items-center justify-center text-sm text-[var(--admin-text-muted)]">Đang tải bộ sưu tập...</div>;
  if (!collection) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-[var(--admin-danger)]">{error}</p>
        <Link href="/admin/collections" className="text-sm font-semibold text-[var(--admin-primary)] hover:underline">Quay lại danh sách bộ sưu tập</Link>
      </div>
    );
  }
  return <CollectionForm initialData={collection} />;
}
