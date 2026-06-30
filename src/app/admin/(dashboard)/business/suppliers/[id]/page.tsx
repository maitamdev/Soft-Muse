import { SupplierEditor } from '@/components/admin/business/SupplierEditor';

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  return <SupplierEditor id={params.id} />;
}
