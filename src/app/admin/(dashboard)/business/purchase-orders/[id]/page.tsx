import { PurchaseOrderEditor } from '@/components/admin/business/PurchaseOrderEditor';

export default function EditPurchaseOrderPage({ params }: { params: { id: string } }) {
  return <PurchaseOrderEditor id={params.id} />;
}
