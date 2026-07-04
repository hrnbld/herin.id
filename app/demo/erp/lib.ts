/* Shared types, seed data, and double-entry journal builders for the ERP demo. */

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
};

export type Contact = { id: string; name: string };

export type Line = { productId: string; qty: number; price: number; cost: number };

export type SOStatus = "draft" | "confirmed" | "shipped";
export type SalesOrder = {
  id: string;
  number: string;
  customerId: string;
  date: string;
  lines: Line[];
  status: SOStatus;
  invoiceId?: string;
};

export type InvoiceStatus = "draft" | "posted" | "paid";
export type Invoice = {
  id: string;
  number: string;
  customerId: string;
  date: string;
  lines: Line[];
  status: InvoiceStatus;
  soId?: string;
};

export type POStatus = "draft" | "ordered" | "received";
export type PurchaseOrder = {
  id: string;
  number: string;
  vendorId: string;
  date: string;
  lines: Line[]; // price = unit cost
  status: POStatus;
  billId?: string;
};

export type BillStatus = "open" | "paid";
export type Bill = {
  id: string;
  number: string;
  vendorId: string;
  date: string;
  total: number;
  status: BillStatus;
  poId: string;
};

export type Adjustment = {
  id: string;
  number: string;
  productId: string;
  qtyDelta: number;
  reason: string;
  date: string;
  value: number; // abs(qtyDelta) * cost
};

export type JournalLine = { account: string; debit: number; credit: number };
export type JournalEntry = {
  id: string;
  date: string;
  memo: string;
  lines: JournalLine[];
};

export type DB = {
  products: Product[];
  customers: Contact[];
  vendors: Contact[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  bills: Bill[];
  adjustments: Adjustment[];
  journal: JournalEntry[];
  seq: { so: number; inv: number; po: number; bill: number; adj: number; j: number };
};

/* ---------- accounts ---------- */

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export const ACCOUNTS: { name: string; code: string; type: AccountType }[] = [
  { code: "1100", name: "Cash", type: "asset" },
  { code: "1200", name: "Accounts Receivable", type: "asset" },
  { code: "1300", name: "Inventory", type: "asset" },
  { code: "2100", name: "Accounts Payable", type: "liability" },
  { code: "3100", name: "Owner's Equity", type: "equity" },
  { code: "4100", name: "Revenue", type: "revenue" },
  { code: "5100", name: "Cost of Goods Sold", type: "expense" },
  { code: "5200", name: "Inventory Shrinkage", type: "expense" },
];

/* ---------- helpers ---------- */

export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
}

export function lineTotal(lines: Line[]): number {
  return lines.reduce((s, l) => s + l.qty * l.price, 0);
}

export function lineCost(lines: Line[]): number {
  return lines.reduce((s, l) => s + l.qty * l.cost, 0);
}

/* ---------- journal builders ---------- */

export function invoicePostEntry(inv: Invoice, id: string): JournalEntry {
  const total = lineTotal(inv.lines);
  const cost = lineCost(inv.lines);
  return {
    id,
    date: inv.date,
    memo: `Invoice ${inv.number} posted`,
    lines: [
      { account: "Accounts Receivable", debit: total, credit: 0 },
      { account: "Revenue", debit: 0, credit: total },
      { account: "Cost of Goods Sold", debit: cost, credit: 0 },
      { account: "Inventory", debit: 0, credit: cost },
    ],
  };
}

export function invoicePaymentEntry(inv: Invoice, id: string, date: string): JournalEntry {
  const total = lineTotal(inv.lines);
  return {
    id,
    date,
    memo: `Payment received — ${inv.number}`,
    lines: [
      { account: "Cash", debit: total, credit: 0 },
      { account: "Accounts Receivable", debit: 0, credit: total },
    ],
  };
}

export function billReceiptEntry(bill: Bill, id: string): JournalEntry {
  return {
    id,
    date: bill.date,
    memo: `Goods received — ${bill.number}`,
    lines: [
      { account: "Inventory", debit: bill.total, credit: 0 },
      { account: "Accounts Payable", debit: 0, credit: bill.total },
    ],
  };
}

export function billPaymentEntry(bill: Bill, id: string, date: string): JournalEntry {
  return {
    id,
    date,
    memo: `Bill paid — ${bill.number}`,
    lines: [
      { account: "Accounts Payable", debit: bill.total, credit: 0 },
      { account: "Cash", debit: 0, credit: bill.total },
    ],
  };
}

export function adjustmentEntry(adj: Adjustment, id: string): JournalEntry {
  const lines: JournalLine[] =
    adj.qtyDelta < 0
      ? [
          { account: "Inventory Shrinkage", debit: adj.value, credit: 0 },
          { account: "Inventory", debit: 0, credit: adj.value },
        ]
      : [
          { account: "Inventory", debit: adj.value, credit: 0 },
          { account: "Inventory Shrinkage", debit: 0, credit: adj.value },
        ];
  return { id, date: adj.date, memo: `Stock adjustment ${adj.number}`, lines };
}

/* ---------- seed ---------- */

const PRODUCTS: Omit<Product, "stock">[] = [
  { id: "p1", name: "Arabica Beans 1kg", sku: "AR-1000", price: 24, cost: 14 },
  { id: "p2", name: "Robusta Beans 1kg", sku: "RB-1000", price: 18, cost: 10 },
  { id: "p3", name: "Cold Brew 250ml", sku: "CB-0250", price: 6, cost: 3 },
  { id: "p4", name: "Drip Bag Box (10)", sku: "DB-0010", price: 12, cost: 6 },
  { id: "p5", name: "Ceramic Mug", sku: "MG-0001", price: 15, cost: 7 },
  { id: "p6", name: "Grinder S40", sku: "GR-S040", price: 89, cost: 52 },
  { id: "p7", name: "V60 Brew Kit", sku: "VK-0060", price: 32, cost: 18 },
  { id: "p8", name: "Milk Frother", sku: "MF-0001", price: 45, cost: 26 },
];

const INITIAL_STOCK: Record<string, number> = {
  p1: 160, p2: 190, p3: 480, p4: 260, p5: 110, p6: 60, p7: 130, p8: 70,
};

const CUSTOMERS: Contact[] = [
  { id: "c1", name: "Bluebird Café" },
  { id: "c2", name: "Harbor Roasters" },
  { id: "c3", name: "Daily Grind Co." },
  { id: "c4", name: "Northside Deli" },
  { id: "c5", name: "Café Aurora" },
];

const VENDORS: Contact[] = [
  { id: "v1", name: "Highland Coffee Estates" },
  { id: "v2", name: "PackPro Supplies" },
  { id: "v3", name: "BrewGear Importers" },
];

export function seed(): DB {
  const products: Product[] = PRODUCTS.map((p) => ({
    ...p,
    stock: INITIAL_STOCK[p.id],
  }));
  const journal: JournalEntry[] = [];
  let j = 0;
  const jid = () => `j${++j}`;

  const openingCash = 40000;
  const openingInventory = products.reduce((s, p) => s + p.stock * p.cost, 0);
  journal.push({
    id: jid(),
    date: daysAgo(75),
    memo: "Opening balances",
    lines: [
      { account: "Cash", debit: openingCash, credit: 0 },
      { account: "Inventory", debit: openingInventory, credit: 0 },
      {
        account: "Owner's Equity",
        debit: 0,
        credit: openingCash + openingInventory,
      },
    ],
  });

  /* purchases first (stock in) */
  const purchaseOrders: PurchaseOrder[] = [];
  const bills: Bill[] = [];
  const poSeedData: {
    n: number;
    vendorId: string;
    day: number;
    lines: [string, number][];
    state: "paidbill" | "openbill" | "ordered";
  }[] = [
    { n: 3041, vendorId: "v1", day: 20, lines: [["p1", 40], ["p3", 60]], state: "paidbill" },
    { n: 3042, vendorId: "v3", day: 12, lines: [["p6", 30]], state: "openbill" },
    { n: 3043, vendorId: "v2", day: 2, lines: [["p4", 100]], state: "ordered" },
  ];
  let billN = 4040;
  for (const s of poSeedData) {
    const lines: Line[] = s.lines.map(([pid, qty]) => {
      const p = products.find((x) => x.id === pid)!;
      return { productId: pid, qty, price: p.cost, cost: p.cost };
    });
    const po: PurchaseOrder = {
      id: `po${s.n}`,
      number: `PO-${s.n}`,
      vendorId: s.vendorId,
      date: daysAgo(s.day),
      lines,
      status: s.state === "ordered" ? "ordered" : "received",
    };
    if (s.state !== "ordered") {
      billN += 1;
      const bill: Bill = {
        id: `bill${billN}`,
        number: `BILL-${billN}`,
        vendorId: s.vendorId,
        date: daysAgo(s.day - 1),
        total: lineTotal(lines),
        status: s.state === "paidbill" ? "paid" : "open",
        poId: po.id,
      };
      po.billId = bill.id;
      bills.push(bill);
      journal.push(billReceiptEntry(bill, jid()));
      if (bill.status === "paid") {
        journal.push(billPaymentEntry(bill, jid(), daysAgo(s.day - 3)));
      }
      for (const l of lines) {
        const p = products.find((x) => x.id === l.productId)!;
        p.stock += l.qty;
      }
    }
    purchaseOrders.push(po);
  }

  /* sales invoices (stock out) */
  const invoices: Invoice[] = [];
  let seqInv = 1041;
  for (let i = 11; i >= 0; i--) {
    const date = daysAgo(i * 5 + 3);
    const customer = CUSTOMERS[(i * 3) % CUSTOMERS.length];
    const lineCount = (i % 3) + 1;
    const lines: Line[] = [];
    for (let l = 0; l < lineCount; l++) {
      const p = products[(i * 2 + l * 3) % products.length];
      const qty = (((i + l) % 4) + 2) * 6;
      lines.push({ productId: p.id, qty, price: p.price, cost: p.cost });
    }
    seqInv += 1;
    const inv: Invoice = {
      id: `inv${seqInv}`,
      number: `INV-${seqInv}`,
      customerId: customer.id,
      date,
      lines,
      status: i >= 3 ? "paid" : "posted",
    };
    invoices.push(inv);
    journal.push(invoicePostEntry(inv, jid()));
    for (const l of lines) {
      const p = products.find((x) => x.id === l.productId)!;
      p.stock -= l.qty;
    }
    if (inv.status === "paid") {
      journal.push(invoicePaymentEntry(inv, jid(), daysAgo(Math.max(i * 5 - 4, 0))));
    }
  }

  /* one shrinkage adjustment */
  const adj: Adjustment = {
    id: "adj5041",
    number: "ADJ-5041",
    productId: "p5",
    qtyDelta: -5,
    reason: "Broken in storage",
    date: daysAgo(6),
    value: 5 * 7,
  };
  const p5 = products.find((x) => x.id === "p5")!;
  p5.stock -= 5;
  journal.push(adjustmentEntry(adj, jid()));

  /* sales orders (no GL impact until invoiced) */
  const salesOrders: SalesOrder[] = [
    {
      id: "so2042",
      number: "SO-2042",
      customerId: "c2",
      date: daysAgo(2),
      lines: [
        { productId: "p1", qty: 24, price: 24, cost: 14 },
        { productId: "p4", qty: 12, price: 12, cost: 6 },
      ],
      status: "confirmed",
    },
    {
      id: "so2043",
      number: "SO-2043",
      customerId: "c5",
      date: daysAgo(1),
      lines: [{ productId: "p3", qty: 48, price: 6, cost: 3 }],
      status: "draft",
    },
  ];

  return {
    products,
    customers: CUSTOMERS,
    vendors: VENDORS,
    salesOrders,
    invoices: invoices.reverse(),
    purchaseOrders: purchaseOrders.reverse(),
    bills: bills.reverse(),
    adjustments: [adj],
    journal,
    seq: { so: 2043, inv: seqInv, po: 3043, bill: billN, adj: 5041, j },
  };
}

export const STORAGE_KEY = "erp-demo-v2";

export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
