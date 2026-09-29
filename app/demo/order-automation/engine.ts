/** Executable, deterministic workflow demo. No Shopify/Zapier/Google credentials or live orders. */
export type Item = { title: string; quantity: number };
export type Order = { id: string; created_at: string; items: Item[]; total: number };
export type Mapping = { title: string; sku: string };
export type Result = { orderId: string; date: string; products: string; skus: string; unmapped: string[]; total: number; lineCount: number };
export type Store = { fulfillment: Result[]; payments: { orderId: string; date: string; total: number }[] };
export type ProcessResult = { store: Store; result: Result; status: 'written' | 'duplicate' };
export const initialStore: Store = { fulfillment: [], payments: [] };
export const defaultMapping: Mapping[] = [
  { title: 'Classic Sofa', sku: 'SOFA-CLASSIC' },
  { title: 'Linen Cushion', sku: 'CUSHION-LINEN' },
  { title: 'Sofa Slipcover', sku: 'SLIPCOVER-SOFA' },
];
export const examples: { label: string; order: Order }[] = [
  { label: 'Single item', order: { id: 'DEMO-1001', created_at: '2026-09-24T04:30:00Z', total: 120, items: [{ title: 'Classic Sofa', quantity: 1 }] } },
  { label: 'Three mixed items', order: { id: 'DEMO-1002', created_at: '2026-09-25T23:30:00Z', total: 185, items: [{ title: 'Classic Sofa', quantity: 1 }, { title: 'Linen Cushion', quantity: 2 }, { title: 'Limited Edition Throw', quantity: 1 }] } },
  { label: 'Slipcover only', order: { id: 'DEMO-1003', created_at: '2026-09-26T08:10:00Z', total: 45, items: [{ title: 'Sofa Slipcover', quantity: 1 }] } },
  { label: 'Unknown product', order: { id: 'DEMO-1004', created_at: '2026-09-27T11:00:00Z', total: 68, items: [{ title: 'Mystery Ottoman', quantity: 1 }] } },
];
export function processOrder(order: Order, mapping: Mapping[], store: Store, timeZone = 'America/Los_Angeles'): ProcessResult {
  if (!order.id.trim() || !Number.isFinite(Date.parse(order.created_at)) || !Array.isArray(order.items) || !order.items.length || !Number.isFinite(order.total) || order.total < 0 || order.items.some(i => !i.title?.trim() || !Number.isInteger(i.quantity) || i.quantity < 1)) throw new Error('Order requires an ID, valid timestamp, nonnegative total, and items with positive integer quantities.');
  if (mapping.some(m => !m.title.trim() || !m.sku.trim()) || new Set(mapping.map(m => m.title.trim().toLocaleLowerCase())).size !== mapping.length) throw new Error('SKU mapping needs unique, nonempty titles and SKUs.');
  // Format in the chosen reporting timezone, not the visitor browser's timezone.
  const date = new Intl.DateTimeFormat('en-US', { timeZone, month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(order.created_at));
  const byTitle = new Map(mapping.map(m => [m.title.trim().toLocaleLowerCase(), m.sku.trim()]));
  const rows = order.items.map(item => {
    const sku = byTitle.get(item.title.trim().toLocaleLowerCase());
    return { product: `${item.title.trim()} × ${item.quantity}`, sku: `${sku || `UNMAPPED: ${item.title.trim()}`} × ${item.quantity}`, unmapped: !sku ? item.title.trim() : null };
  });
  const result: Result = { orderId: order.id.trim(), date, products: rows.map(r => r.product).join('\n'), skus: rows.map(r => r.sku).join('\n'), unmapped: rows.flatMap(r => r.unmapped ? [r.unmapped] : []), total: order.total, lineCount: rows.length };
  // Deduplicate both destination tables by the same order ID. No partial writes.
  if (store.fulfillment.some(r => r.orderId === result.orderId) || store.payments.some(r => r.orderId === result.orderId)) return { store, result, status: 'duplicate' };
  return { result, status: 'written', store: { fulfillment: [...store.fulfillment, result], payments: [...store.payments, { orderId: result.orderId, date, total: result.total }] } };
}
