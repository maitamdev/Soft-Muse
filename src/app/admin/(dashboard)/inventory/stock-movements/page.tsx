"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { IconAdjustments, IconArrowDownRight, IconArrowUpRight, IconChevronRight, IconRefresh } from "@tabler/icons-react";
import { ProductService } from "@/lib/services/product.service";
import { InventoryService, type InventoryMovement } from "@/lib/services/inventory.service";
import type { Product } from "@/data/mock/products";
import { Badge } from "@/components/admin/design-system/Badge";
import { Button } from "@/components/admin/design-system/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/design-system/Card";
import { DataTable, type Column } from "@/components/admin/design-system/DataTable";
import { Modal } from "@/components/admin/design-system/Modal";
import { PageHeader } from "@/components/admin/design-system/Layout";
import { Input } from "@/components/admin/design-system/Input";
import { TextArea } from "@/components/admin/design-system/TextArea";

const TYPE_CONFIG: Record<InventoryMovement["type"], { label: string; variant: "success" | "danger" | "primary" | "warning" }> = {
  receive: { label: "Nhập kho", variant: "success" },
  deduct: { label: "Xuất kho", variant: "danger" },
  return: { label: "Hoàn kho", variant: "primary" },
  adjustment: { label: "Điều chỉnh", variant: "warning" },
  transfer_in: { label: "Chuyển vào", variant: "success" },
  transfer_out: { label: "Chuyển ra", variant: "danger" },
};

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [reverseTarget, setReverseTarget] = useState<InventoryMovement | null>(null);
  const [reverseReason, setReverseReason] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [movementData, productData] = await Promise.all([InventoryService.getMovements(), ProductService.getProducts()]);
      setMovements(movementData);
      setProducts(productData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải biến động tồn kho.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const selectedProduct = products.find((product) => product.id === productId);
  const reversedIds = useMemo(() => new Set(movements.filter((item) => item.referenceType === "adjustment" && item.referenceId).map((item) => item.referenceId)), [movements]);
  const filtered = movements.filter((movement) => {
    const term = search.trim().toLowerCase();
    return !term || `${movement.productName ?? ""} ${movement.productId} ${movement.reason}`.toLowerCase().includes(term);
  });

  const submitAdjustment = async () => {
    const parsed = Number.parseInt(quantity, 10);
    if (!productId) return toast.error("Vui lòng chọn sản phẩm.");
    if (selectedProduct?.variants.length && !variantId) return toast.error("Vui lòng chọn biến thể.");
    if (!Number.isInteger(parsed) || parsed === 0) return toast.error("Số lượng điều chỉnh phải là số nguyên khác 0.");
    if (reason.trim().length < 2) return toast.error("Vui lòng nhập lý do điều chỉnh.");
    setSaving(true);
    try {
      await InventoryService.adjustStock(productId, variantId || undefined, parsed, reason.trim());
      toast.success("Đã ghi nhận điều chỉnh tồn kho.");
      setAdjustOpen(false); setProductId(""); setVariantId(""); setQuantity(""); setReason("");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể điều chỉnh tồn kho.");
    } finally { setSaving(false); }
  };

  const reverseAdjustment = async () => {
    if (!reverseTarget) return;
    setSaving(true);
    try {
      await InventoryService.reverseMovement(reverseTarget.id, reverseReason.trim() || `Hoàn tác điều chỉnh: ${reverseTarget.reason}`);
      toast.success("Đã hoàn tác điều chỉnh bằng một bút toán đối ứng.");
      setReverseTarget(null); setReverseReason("");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể hoàn tác điều chỉnh.");
    } finally { setSaving(false); }
  };

  const columns: Column<InventoryMovement>[] = [
    { header: "Sản phẩm", accessor: "productId", render: (_, row) => <div><p className="font-semibold text-[var(--admin-text-base)]">{row.productName || row.productId}</p>{row.variantId && <p className="mt-1 text-xs font-mono text-[var(--admin-text-muted)]">Biến thể: {row.variantId}</p>}</div> },
    { header: "Loại", accessor: "type", render: (_, row) => <Badge variant={TYPE_CONFIG[row.type].variant}>{TYPE_CONFIG[row.type].label}</Badge> },
    { header: "Số lượng", accessor: "quantity", render: (_, row) => <span className={`inline-flex items-center gap-1 font-bold ${row.quantity > 0 ? "text-[var(--admin-success)]" : "text-[var(--admin-danger)]"}`}>{row.quantity > 0 ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}{row.quantity > 0 ? "+" : ""}{row.quantity}</span> },
    { header: "Trước → sau", accessor: "balanceAfter", render: (_, row) => <span className="tabular-nums text-[var(--admin-text-muted)]">{row.balanceBefore} → {row.balanceAfter}</span> },
    { header: "Lý do", accessor: "reason" },
    { header: "Thời gian", accessor: "date", type: "date" },
    { header: "Thao tác", accessor: "id", render: (_, row) => row.type === "adjustment" && !row.referenceId && !reversedIds.has(row.id) ? <Button variant="ghost" size="sm" leftIcon={<IconRefresh size={14} />} onClick={() => { setReverseTarget(row); setReverseReason(""); }}>Hoàn tác</Button> : null },
  ];

  return <div className="space-y-6 pb-12">
    <div className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)]"><Link href="/admin/inventory">Tồn kho</Link><IconChevronRight size={14} /><span>Biến động tồn kho</span></div>
    <PageHeader title="Biến động tồn kho" description="Nhật ký kho bất biến; sai sót được sửa bằng bút toán hoàn tác để giữ lịch sử đối soát." actions={<Button leftIcon={<IconAdjustments size={18} />} onClick={() => setAdjustOpen(true)}>Điều chỉnh kho</Button>} />
    <Card><CardHeader><CardTitle>Nhật ký nhập, xuất và điều chỉnh</CardTitle></CardHeader><CardContent className="p-0"><DataTable columns={columns} data={filtered} isLoading={loading} searchQuery={search} onSearchChange={setSearch} pageSize={20} /></CardContent></Card>

    <Modal isOpen={adjustOpen} onClose={() => setAdjustOpen(false)} title="Điều chỉnh tồn kho" size="sm" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setAdjustOpen(false)}>Hủy</Button><Button isLoading={saving} onClick={() => void submitAdjustment()}>Lưu điều chỉnh</Button></div>}>
      <div className="space-y-4"><label className="flex flex-col gap-1 text-sm font-medium">Sản phẩm<select value={productId} onChange={(event) => { setProductId(event.target.value); setVariantId(""); }} className="h-11 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3"><option value="">Chọn sản phẩm</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.sku}</option>)}</select></label>
      {selectedProduct?.variants.length ? <label className="flex flex-col gap-1 text-sm font-medium">Biến thể<select value={variantId} onChange={(event) => setVariantId(event.target.value)} className="h-11 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3"><option value="">Chọn biến thể</option>{selectedProduct.variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.color} / {variant.size} · tồn {variant.stock}</option>)}</select></label> : null}
      <Input label="Số lượng thay đổi" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} hint="Số dương để nhập thêm, số âm để xuất bớt." /><TextArea label="Lý do" value={reason} onChange={(event) => setReason(event.target.value)} rows={3} /></div>
    </Modal>
    <Modal isOpen={!!reverseTarget} onClose={() => setReverseTarget(null)} title="Hoàn tác điều chỉnh kho" size="sm" footer={<div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setReverseTarget(null)}>Hủy</Button><Button variant="warning" isLoading={saving} onClick={() => void reverseAdjustment()}>Xác nhận hoàn tác</Button></div>}>
      <div className="space-y-4"><p className="text-sm text-[var(--admin-text-muted)]">Hệ thống sẽ tạo bút toán đối ứng {reverseTarget ? -reverseTarget.quantity : 0}. Nhật ký gốc vẫn được giữ để đối soát.</p><TextArea label="Lý do hoàn tác" value={reverseReason} onChange={(event) => setReverseReason(event.target.value)} rows={3} /></div>
    </Modal>
  </div>;
}
