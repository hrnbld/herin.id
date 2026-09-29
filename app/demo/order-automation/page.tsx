import type { Metadata } from 'next';
import Demo from './Demo';
export const metadata: Metadata = { title: 'Order automation | Interactive workflow demo | Herin', description: 'Hands-on simulated Shopify order processing with per-item SKU lookup, unmapped handling, duplicate prevention and one-row-per-order output. Sample data only; no Shopify, Zapier or Google Sheets connection.' };
export default function Page() { return <Demo />; }
