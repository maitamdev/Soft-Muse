import type { IBusinessRepository } from '@/lib/contracts/IBusinessRepository';
import type { Supplier, PurchaseOrder, Expense, Asset, Liability, Capital } from '@/data/mock/business';
import { eventBus } from '@/lib/events/EventBus';
import { createClient } from '@/lib/supabase/client';

type Row = Record<string, unknown>;
const compact = <T extends Row>(value: T): Partial<T> => Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as Partial<T>;
const changed = (area: string, id?: string) => eventBus.emit('business.changed', { area, id });

function supplierFromRow(row: Row): Supplier {
 return { id: String(row.id), name: String(row.name), supplierCode: String(row.supplier_code), contactName: String(row.contact_name ?? ''), contactPerson: String(row.contact_name ?? ''), email: String(row.email ?? ''), phone: String(row.phone ?? ''), whatsapp: String(row.whatsapp ?? ''), country: String(row.country ?? 'Việt Nam'), city: String(row.city ?? ''), address: String(row.address ?? ''), taxNumber: String(row.tax_number ?? ''), commercialRegistration: String(row.commercial_registration ?? ''), paymentTerms: String(row.payment_terms ?? 'net_30'), currency: String(row.currency ?? 'VND'), materialsProvided: (row.materials_provided as string[] | null) ?? [], totalPurchases: Number(row.total_purchases ?? 0), outstandingBalance: Number(row.outstanding_balance ?? 0), status: String(row.status) as Supplier['status'], notes: String(row.notes ?? '') };
}
function supplierToRow(data: Partial<Supplier>) { return compact({ name: data.name, supplier_code: data.supplierCode, contact_name: data.contactName ?? data.contactPerson, email: data.email, phone: data.phone, whatsapp: data.whatsapp, country: data.country, city: data.city, address: data.address, tax_number: data.taxNumber, commercial_registration: data.commercialRegistration, payment_terms: data.paymentTerms, currency: data.currency, materials_provided: data.materialsProvided, status: data.status, notes: data.notes }); }

function purchaseOrderFromRow(row: Row): PurchaseOrder {
 return { id: String(row.id), supplierId: String(row.supplier_id), reference: String(row.reference), date: String(row.order_date), expectedArrival: row.expected_arrival ? String(row.expected_arrival) : '', receivedDate: row.received_date ? String(row.received_date) : undefined, items: (row.items as PurchaseOrder['items'] | null) ?? [], subtotal: Number(row.subtotal ?? 0), tax: Number(row.tax ?? 0), shipping: Number(row.shipping ?? 0), total: Number(row.total ?? 0), status: String(row.status) as PurchaseOrder['status'], paymentStatus: String(row.payment_status) as PurchaseOrder['paymentStatus'], notes: String(row.notes ?? '') };
}
function purchaseOrderToRow(data: Partial<PurchaseOrder>) {
 const items = data.items?.map((item) => ({ ...item, quantity: Math.max(0, Number(item.quantity || 0)), unitCost: Math.max(0, Number(item.unitCost || 0)), total: Math.max(0, Number(item.quantity || 0) * Number(item.unitCost || 0)) }));
 const subtotal = items?.reduce((sum, item) => sum + item.total, 0) ?? data.subtotal;
 const tax = data.tax ?? 0; const shipping = data.shipping ?? 0;
 return compact({ supplier_id: data.supplierId, reference: data.reference, order_date: data.date, expected_arrival: data.expectedArrival || null, received_date: data.receivedDate || null, items, subtotal, tax, shipping, total: subtotal === undefined ? data.total : subtotal + tax + shipping, status: data.status, payment_status: data.paymentStatus, notes: data.notes });
}

function expenseFromRow(row: Row): Expense { return { id: String(row.id), name: String(row.name), category: String(row.category), amount: Number(row.amount), currency: String(row.currency ?? 'VND'), date: String(row.expense_date), paymentMethod: String(row.payment_method), supplierId: row.supplier_id ? String(row.supplier_id) : undefined, description: String(row.description ?? ''), notes: String(row.notes ?? ''), receipt: row.receipt ? String(row.receipt) : undefined, referenceId: row.reference_id ? String(row.reference_id) : undefined, status: String(row.status) as Expense['status'] }; }
function expenseToRow(data: Partial<Expense>) { return compact({ name: data.name, category: data.category, amount: data.amount, currency: data.currency, expense_date: data.date, payment_method: data.paymentMethod, supplier_id: data.supplierId || null, description: data.description, notes: data.notes, receipt: data.receipt || null, reference_id: data.referenceId || null, status: data.status }); }
function assetFromRow(row: Row): Asset { return { id: String(row.id), name: String(row.name), type: String(row.asset_type), purchaseDate: String(row.purchase_date), purchaseValue: Number(row.purchase_value ?? 0), currentValue: Number(row.current_value ?? 0), depreciation: Number(row.depreciation ?? 0), depreciationRate: Number(row.depreciation_rate ?? 0), status: String(row.status) as Asset['status'], documents: (row.documents as string[] | null) ?? [] }; }
function assetToRow(data: Partial<Asset>) { return compact({ name: data.name, asset_type: data.type, purchase_date: data.purchaseDate, purchase_value: data.purchaseValue, current_value: data.currentValue, depreciation: data.depreciation, depreciation_rate: data.depreciationRate, status: data.status, documents: data.documents }); }
function liabilityFromRow(row: Row): Liability { return { id: String(row.id), name: String(row.name), type: String(row.liability_type), supplierId: row.supplier_id ? String(row.supplier_id) : undefined, amount: Number(row.amount), dueDate: String(row.due_date), status: String(row.status) as Liability['status'] }; }
function liabilityToRow(data: Partial<Liability>) { return compact({ name: data.name, liability_type: data.type, supplier_id: data.supplierId || null, amount: data.amount, due_date: data.dueDate, status: data.status }); }
function capitalFromRow(row: Row): Capital { return { id: String(row.id), type: String(row.entry_type) as Capital['type'], owner: String(row.owner), amount: Number(row.amount), reason: String(row.reason ?? ''), date: String(row.entry_date), notes: String(row.notes ?? '') }; }
function capitalToRow(data: Partial<Capital>) { return compact({ entry_type: data.type, owner: data.owner, amount: data.amount, reason: data.reason, entry_date: data.date, notes: data.notes }); }

export class SupabaseBusinessRepository implements IBusinessRepository {
 private async refreshSupplierStats(supplierId?: string) {
  if (!supplierId) return;
  const { data, error } = await createClient().from('purchase_orders').select('total,payment_status,status').eq('supplier_id', supplierId).in('status', ['received', 'partially_received']);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Array<{ total: number; payment_status: string }>;
  const totalPurchases = rows.reduce((sum, row) => sum + Number(row.total), 0);
  const outstandingBalance = rows.reduce((sum, row) => sum + (row.payment_status === 'paid' ? 0 : row.payment_status === 'partial' ? Number(row.total) / 2 : Number(row.total)), 0);
  const { error: updateError } = await createClient().from('suppliers').update({ total_purchases: totalPurchases, outstanding_balance: outstandingBalance }).eq('id', supplierId);
  if (updateError) throw new Error(updateError.message);
 }

 async getSuppliers(): Promise<Supplier[]> { const { data, error } = await createClient().from('suppliers').select('*').order('created_at', { ascending: false }); if (error) throw new Error(`Không thể tải nhà cung cấp: ${error.message}`); return (data ?? []).map(supplierFromRow); }
 async getSupplier(id: string): Promise<Supplier | undefined> { const { data, error } = await createClient().from('suppliers').select('*').eq('id', id).maybeSingle(); if (error) throw new Error(error.message); return data ? supplierFromRow(data) : undefined; }
 async createSupplier(data: Omit<Supplier, 'id' | 'totalPurchases' | 'outstandingBalance'>): Promise<Supplier> { const { data: created, error } = await createClient().from('suppliers').insert(supplierToRow(data)).select('*').single(); if (error) throw new Error(`Không thể tạo nhà cung cấp: ${error.message}`); changed('suppliers', created.id); return supplierFromRow(created); }
 async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> { const { data: updated, error } = await createClient().from('suppliers').update(supplierToRow(data)).eq('id', id).select('*').single(); if (error) throw new Error(`Không thể cập nhật nhà cung cấp: ${error.message}`); changed('suppliers', id); return supplierFromRow(updated); }
 async deleteSupplier(id: string): Promise<void> { const supplier = await this.getSupplier(id); if (!supplier) throw new Error('Không tìm thấy nhà cung cấp.'); if (supplier.status !== 'inactive') throw new Error('Hãy lưu trữ nhà cung cấp trước khi xóa.'); const { error } = await createClient().from('suppliers').delete().eq('id', id); if (error) throw new Error(`Không thể xóa nhà cung cấp đang có chứng từ liên quan: ${error.message}`); changed('suppliers', id); }
 async archiveSupplier(id: string) { await this.updateSupplier(id, { status: 'inactive' }); }
 async restoreSupplier(id: string) { await this.updateSupplier(id, { status: 'active' }); }

 async getPurchaseOrders(): Promise<PurchaseOrder[]> { const { data, error } = await createClient().from('purchase_orders').select('*').order('order_date', { ascending: false }); if (error) throw new Error(`Không thể tải đơn mua hàng: ${error.message}`); return (data ?? []).map(purchaseOrderFromRow); }
 async createPurchaseOrder(data: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> { if (!data.items.length) throw new Error('Đơn mua hàng phải có ít nhất một sản phẩm.'); const { data: created, error } = await createClient().from('purchase_orders').insert(purchaseOrderToRow(data)).select('*').single(); if (error) throw new Error(`Không thể tạo đơn mua hàng: ${error.message}`); changed('purchase-orders', created.id); return purchaseOrderFromRow(created); }
 async updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> { const current = (await this.getPurchaseOrders()).find((item) => item.id === id); if (!current) throw new Error('Không tìm thấy đơn mua hàng.'); if (current.status === 'received' && data.status !== undefined && data.status !== 'received') throw new Error('Đơn đã nhập kho không thể sửa lại trạng thái.'); const { data: updated, error } = await createClient().from('purchase_orders').update(purchaseOrderToRow(data)).eq('id', id).select('*').single(); if (error) throw new Error(`Không thể cập nhật đơn mua hàng: ${error.message}`); await Promise.all([this.refreshSupplierStats(current.supplierId), this.refreshSupplierStats(updated.supplier_id)]); changed('purchase-orders', id); return purchaseOrderFromRow(updated); }
 async updatePurchaseOrderStatus(id: string, status: PurchaseOrder['status']) { return this.updatePurchaseOrder(id, { status }); }
 async receivePurchaseOrder(id: string): Promise<PurchaseOrder> { const { error } = await createClient().rpc('receive_purchase_order', { target_purchase_order_id: id }); if (error) throw new Error(`Không thể nhập kho: ${error.message}`); const updated = (await this.getPurchaseOrders()).find((item) => item.id === id); if (!updated) throw new Error('Không tìm thấy đơn mua hàng sau khi nhập kho.'); changed('purchase-orders', id); eventBus.emit('inventory.changed'); return updated; }
 async deletePurchaseOrder(id: string): Promise<void> { const item = (await this.getPurchaseOrders()).find((row) => row.id === id); if (!item) throw new Error('Không tìm thấy đơn mua hàng.'); if (!['draft', 'cancelled'].includes(item.status)) throw new Error('Chỉ được xóa đơn nháp hoặc đã hủy.'); const { error } = await createClient().from('purchase_orders').delete().eq('id', id); if (error) throw new Error(error.message); await this.refreshSupplierStats(item.supplierId); changed('purchase-orders', id); }

 async getExpenses(): Promise<Expense[]> { const { data, error } = await createClient().from('expenses').select('*').order('expense_date', { ascending: false }); if (error) throw new Error(`Không thể tải chi phí: ${error.message}`); return (data ?? []).map(expenseFromRow); }
 async createExpense(data: Omit<Expense, 'id'>): Promise<Expense> { const { data: created, error } = await createClient().from('expenses').insert(expenseToRow(data)).select('*').single(); if (error) throw new Error(`Không thể tạo chi phí: ${error.message}`); changed('expenses', created.id); return expenseFromRow(created); }
 async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> { const { data: updated, error } = await createClient().from('expenses').update(expenseToRow(data)).eq('id', id).select('*').single(); if (error) throw new Error(`Không thể cập nhật chi phí: ${error.message}`); changed('expenses', id); return expenseFromRow(updated); }
 async deleteExpense(id: string): Promise<void> { const item = (await this.getExpenses()).find((row) => row.id === id); if (!item) throw new Error('Không tìm thấy chi phí.'); if (item.status !== 'cancelled') throw new Error('Hãy hủy chi phí trước khi xóa.'); const { error } = await createClient().from('expenses').delete().eq('id', id); if (error) throw new Error(error.message); changed('expenses', id); }
 async archiveExpense(id: string) { await this.updateExpense(id, { status: 'cancelled' }); }

 async getAssets(): Promise<Asset[]> { const { data, error } = await createClient().from('assets').select('*').order('purchase_date', { ascending: false }); if (error) throw new Error(`Không thể tải tài sản: ${error.message}`); return (data ?? []).map(assetFromRow); }
 async createAsset(data: Omit<Asset, 'id'>): Promise<Asset> { const { data: created, error } = await createClient().from('assets').insert(assetToRow(data)).select('*').single(); if (error) throw new Error(`Không thể tạo tài sản: ${error.message}`); changed('assets', created.id); return assetFromRow(created); }
 async updateAsset(id: string, data: Partial<Asset>): Promise<Asset> { const { data: updated, error } = await createClient().from('assets').update(assetToRow(data)).eq('id', id).select('*').single(); if (error) throw new Error(`Không thể cập nhật tài sản: ${error.message}`); changed('assets', id); return assetFromRow(updated); }
 async deleteAsset(id: string): Promise<void> { const item = (await this.getAssets()).find((row) => row.id === id); if (!item) throw new Error('Không tìm thấy tài sản.'); if (item.status !== 'written_off') throw new Error('Hãy ghi giảm tài sản trước khi xóa.'); const { error } = await createClient().from('assets').delete().eq('id', id); if (error) throw new Error(error.message); changed('assets', id); }
 async archiveAsset(id: string) { await this.updateAsset(id, { status: 'written_off' }); }

 async getLiabilities(): Promise<Liability[]> { const { data, error } = await createClient().from('liabilities').select('*').order('due_date'); if (error) throw new Error(`Không thể tải công nợ: ${error.message}`); return (data ?? []).map(liabilityFromRow); }
 async createLiability(data: Omit<Liability, 'id'>): Promise<Liability> { const { data: created, error } = await createClient().from('liabilities').insert(liabilityToRow(data)).select('*').single(); if (error) throw new Error(`Không thể tạo công nợ: ${error.message}`); changed('liabilities', created.id); return liabilityFromRow(created); }
 async updateLiability(id: string, data: Partial<Liability>): Promise<Liability> { const { data: updated, error } = await createClient().from('liabilities').update(liabilityToRow(data)).eq('id', id).select('*').single(); if (error) throw new Error(`Không thể cập nhật công nợ: ${error.message}`); changed('liabilities', id); return liabilityFromRow(updated); }
 async deleteLiability(id: string): Promise<void> { const item = (await this.getLiabilities()).find((row) => row.id === id); if (!item) throw new Error('Không tìm thấy công nợ.'); if (item.status !== 'paid') throw new Error('Chỉ được xóa công nợ đã thanh toán.'); const { error } = await createClient().from('liabilities').delete().eq('id', id); if (error) throw new Error(error.message); changed('liabilities', id); }

 async getCapital(): Promise<Capital[]> { const { data, error } = await createClient().from('capital_entries').select('*').order('entry_date', { ascending: false }); if (error) throw new Error(`Không thể tải vốn chủ sở hữu: ${error.message}`); return (data ?? []).map(capitalFromRow); }
 async createCapital(data: Omit<Capital, 'id'>): Promise<Capital> { const { data: created, error } = await createClient().from('capital_entries').insert(capitalToRow(data)).select('*').single(); if (error) throw new Error(`Không thể tạo giao dịch vốn: ${error.message}`); changed('capital', created.id); return capitalFromRow(created); }
 async updateCapital(id: string, data: Partial<Capital>): Promise<Capital> { const { data: updated, error } = await createClient().from('capital_entries').update(capitalToRow(data)).eq('id', id).select('*').single(); if (error) throw new Error(`Không thể cập nhật giao dịch vốn: ${error.message}`); changed('capital', id); return capitalFromRow(updated); }
 async deleteCapital(id: string): Promise<void> { const { error } = await createClient().from('capital_entries').delete().eq('id', id); if (error) throw new Error(error.message); changed('capital', id); }

 async getFinancialSummary() {
  const supabase = createClient();
  const [orders, expenses, assets, liabilities, capital, suppliers, purchaseOrders, products] = await Promise.all([
   supabase.from('orders').select('total,status,order_items(quantity,products(cost_price))').is('archived_at', null),
   supabase.from('expenses').select('amount,status'), supabase.from('assets').select('current_value'),
   supabase.from('liabilities').select('amount,status'), supabase.from('capital_entries').select('entry_type,amount'),
   supabase.from('suppliers').select('id', { count: 'exact', head: true }),
   supabase.from('purchase_orders').select('total,payment_status'),
   supabase.from('products').select('stock,cost_price,product_variants(stock,cost)'),
  ]);
  const failed = [orders, expenses, assets, liabilities, capital, suppliers, purchaseOrders, products].find((result) => result.error);
  if (failed?.error) throw new Error(`Không thể tổng hợp tài chính: ${failed.error.message}`);
  const delivered = ((orders.data ?? []) as Array<Row & { order_items?: Array<Row & { products?: { cost_price?: number } | null }> }>).filter((order) => order.status === 'delivered');
  const totalRevenue = delivered.reduce((sum, order) => sum + Number(order.total), 0);
  const totalCOGS = delivered.reduce((sum, order) => sum + (order.order_items ?? []).reduce((lineSum, line) => lineSum + Number(line.quantity) * Number(line.products?.cost_price ?? 0), 0), 0);
  const expenseRows = (expenses.data ?? []) as Row[];
  const assetRows = (assets.data ?? []) as Row[];
  const liabilityRows = (liabilities.data ?? []) as Row[];
  const capitalRows = (capital.data ?? []) as Row[];
  const purchaseOrderRows = (purchaseOrders.data ?? []) as Row[];
  const totalExpenses = expenseRows.filter((item) => item.status !== 'cancelled').reduce((sum, item) => sum + Number(item.amount), 0);
  const inventoryValue = ((products.data ?? []) as Array<Row & { product_variants?: Array<Row> }>).reduce((sum, product) => { const variants = product.product_variants ?? []; return sum + (variants.length ? variants.reduce((variantSum, variant) => variantSum + Number(variant.stock) * Number(variant.cost), 0) : Number(product.stock) * Number(product.cost_price)); }, 0);
  const fixedAssets = assetRows.reduce((sum, item) => sum + Number(item.current_value), 0);
  const totalLiabilities = liabilityRows.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + Number(item.amount), 0);
  const totalCapital = capitalRows.reduce((sum, item) => sum + (item.entry_type === 'increase' ? Number(item.amount) : -Number(item.amount)), 0);
  const paidPurchases = purchaseOrderRows.filter((item) => item.payment_status === 'paid').reduce((sum, item) => sum + Number(item.total), 0);
  const grossProfit = totalRevenue - totalCOGS;
  return { totalRevenue, totalExpenses, totalCOGS, grossProfit, netProfit: grossProfit - totalExpenses, cashFlow: totalRevenue + totalCapital - totalExpenses - paidPurchases, totalAssets: fixedAssets + inventoryValue, totalLiabilities, totalCapital, inventoryValue, outstandingPayments: totalLiabilities, supplierCount: suppliers.count ?? 0, poCount: purchaseOrderRows.length };
 }
}

export const businessService = new SupabaseBusinessRepository();
