"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductService } from "@/lib/services/product.service";
import type { Product } from "@/data/mock/products";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = use(params);
 const [product, setProduct] = useState<Product | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
 let active = true;
 ProductService.getProduct(id)
 .then((data) => {
 if (!active) return;
 if (!data) setError("Không tìm thấy sản phẩm.");
 else setProduct(data);
 })
 .catch((reason) => {
 if (active) setError(reason instanceof Error ? reason.message : "Không thể tải sản phẩm.");
 })
 .finally(() => { if (active) setLoading(false); });
 return () => { active = false; };
 }, [id]);

 if (loading) return <div className="min-h-[360px] flex items-center justify-center text-sm text-[var(--admin-text-muted)]">Đang tải sản phẩm...</div>;
 if (!product) return <div className="min-h-[360px] flex flex-col items-center justify-center gap-4"><p className="text-sm text-[var(--admin-danger)]">{error}</p><Link href="/admin/products" className="text-sm font-semibold text-[var(--admin-primary)] hover:underline">Quay lại danh sách sản phẩm</Link></div>;
 return <ProductForm initialData={product} isEdit />;
}
