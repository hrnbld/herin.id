"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

/* ---------- types ---------- */

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
};

type Customer = { id: string; name: string };

type InvoiceLine = { productId: string; qty: number; price: number; cost: number };

type InvoiceStatus = "draft" | "posted" | "paid";

type Invoice = {
  id: string;
  number: string;
  customerId: string;
  date: string; // ISO yyyy-mm-dd
  lines: InvoiceLine[];
  status: InvoiceStatus;
};

type JournalLine = { account: string; debit: number; credit: number };

type JournalEntry = { id: string; date: string; memo: string; lines: JournalLine[] };

type DB = {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  journal: JournalEntry[];
  seq: number;
};

/* ---------- helpers ---------- */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
}

function invoiceTotal(inv: Invoice): number {
  return inv.lines.reduce((s, l) => s + l.qty * l.price, 0);
}

function invoiceCost(inv: Invoice): number {
  return inv.lines.reduce((s, l) => s + l.qty * l.cost, 0);
}

function postEntry(inv: Invoice, entryId: string): JournalEntry {
  const total = invoiceTotal(inv);
  const cost = invoiceCost(inv);
  return {
    id: entryId,
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

function paymentEntry(inv: Invoice, entryId: string, date: string): JournalEntry {
  const total = invoiceTotal(inv);
  return {
    id: entryId,
    date,
    memo: `Payment received — ${inv.number}`,
    lines: [
      { account: "Cash", debit: total, credit: 0 },
      { account: "Accounts Receivable", debit: 0, credit: total },
    ],
  };
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

const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Bluebird Café" },
  { id: "c2", name: "Harbor Roasters" },
  { id: "c3", name: "Daily Grind Co." },
  { id: "c4", name: "Northside Deli" },
  { id: "c5", name: "Café Aurora" },
];

function seed(): DB {
  const products: Product[] = PRODUCTS.map((p) => ({
    ...p,
    stock: INITIAL_STOCK[p.id],
  }));

  const openingCash = 25000;
  const openingInventory = products.reduce((s, p) => s + p.stock * p.cost, 0);

  const journal: JournalEntry[] = [
    {
      id: "j1",
      date: daysAgo(70),
      memo: "Opening balances",
      lines: [
        { account: "Cash", debit: openingCash, credit: 0 },
        { account: "Inventory", debit: openingInventory, credit: 0 },
        { account: "Owner's Equity", debit: 0, credit: openingCash + openingInventory },
      ],
    },
  ];

  const invoices: Invoice[] = [];
  let seq = 1041;
  let jseq = 2;

  // 12 historical invoices over the last ~8 weeks, oldest first
  for (let i = 11; i >= 0; i--) {
    const date = daysAgo(i * 5 + 3);
    const customer = CUSTOMERS[(i * 3) % CUSTOMERS.length];
    const lineCount = (i % 3) + 1;
    const lines: InvoiceLine[] = [];
    for (let l = 0; l < lineCount; l++) {
      const p = products[(i * 2 + l * 3) % products.length];
      const qty = (((i + l) % 4) + 2) * 6;
      lines.push({ productId: p.id, qty, price: p.price, cost: p.cost });
    }
    seq += 1;
    const inv: Invoice = {
      id: `inv${seq}`,
      number: `INV-${seq}`,
      customerId: customer.id,
      date,
      lines,
      status: i >= 3 ? "paid" : "posted", // 3 newest still unpaid
    };
    invoices.push(inv);

    journal.push(postEntry(inv, `j${jseq++}`));
    for (const line of lines) {
      const p = products.find((x) => x.id === line.productId)!;
      p.stock -= line.qty;
    }
    if (inv.status === "paid") {
      const payDate = daysAgo(Math.max(i * 5 - 4, 0));
      journal.push(paymentEntry(inv, `j${jseq++}`, payDate));
    }
  }

  return { products, customers: CUSTOMERS, invoices: invoices.reverse(), journal, seq };
}

/* ---------- storage ---------- */

const KEY = "erp-demo-v1";

function load(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* corrupted storage → reseed */
  }
  return seed();
}

/* ---------- UI bits ---------- */

const TABS = ["Dashboard", "Invoices", "Inventory", "Ledger"] as const;
type Tab = (typeof TABS)[number];

function StatusPill({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, string> = {
    draft: "bg-stone-100 text-stone-600",
    posted: "bg-amber-100 text-amber-800",
    paid: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <p className="text-xs uppercase tracking-widest text-faint">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
}

/* ---------- main ---------- */

export default function DemoApp() {
  const [db, setDb] = useState<DB | null>(null);
  const [tab, setTab] = useState<Tab>("Dashboard");
  const [showNew, setShowNew] = useState(false);
  const [openInvoice, setOpenInvoice] = useState<string | null>(null);

  // new-invoice form state
  const [formCustomer, setFormCustomer] = useState("c1");
  const [formLines, setFormLines] = useState<{ productId: string; qty: number }[]>([
    { productId: "p1", qty: 5 },
  ]);

  useEffect(() => {
    setDb(load());
  }, []);

  useEffect(() => {
    if (db) window.localStorage.setItem(KEY, JSON.stringify(db));
  }, [db]);

  const balances = useMemo(() => {
    const map = new Map<string, { debit: number; credit: number }>();
    if (!db) return map;
    for (const e of db.journal) {
      for (const l of e.lines) {
        const b = map.get(l.account) ?? { debit: 0, credit: 0 };
        b.debit += l.debit;
        b.credit += l.credit;
        map.set(l.account, b);
      }
    }
    return map;
  }, [db]);

  if (!db) {
    return (
      <main className="flex min-h-screen items-center justify-center text-faint">
        Loading demo…
      </main>
    );
  }

  const bal = (account: string, side: "debit" | "credit") => {
    const b = balances.get(account) ?? { debit: 0, credit: 0 };
    return side === "debit" ? b.debit - b.credit : b.credit - b.debit;
  };

  const revenue = bal("Revenue", "credit");
  const cash = bal("Cash", "debit");
  const ar = bal("Accounts Receivable", "debit");
  const stockValue = db.products.reduce((s, p) => s + p.stock * p.cost, 0);

  // weekly revenue buckets, last 8 weeks
  const weeks: { label: string; total: number }[] = [];
  for (let w = 7; w >= 0; w--) {
    const start = new Date();
    start.setDate(start.getDate() - (w + 1) * 7);
    const end = new Date();
    end.setDate(end.getDate() - w * 7);
    const total = db.invoices
      .filter((i) => i.status !== "draft")
      .filter((i) => {
        const d = new Date(i.date);
        return d > start && d <= end;
      })
      .reduce((s, i) => s + invoiceTotal(i), 0);
    weeks.push({ label: `W${8 - w}`, total });
  }
  const maxWeek = Math.max(...weeks.map((w) => w.total), 1);

  /* ----- actions ----- */

  const postInvoice = (id: string) => {
    setDb((prev) => {
      if (!prev) return prev;
      const inv = prev.invoices.find((i) => i.id === id);
      if (!inv || inv.status !== "draft") return prev;
      for (const l of inv.lines) {
        const p = prev.products.find((x) => x.id === l.productId)!;
        if (p.stock < l.qty) {
          window.alert(`Not enough stock for ${p.name} (${p.stock} on hand).`);
          return prev;
        }
      }
      const products = prev.products.map((p) => {
        const sold = inv.lines
          .filter((l) => l.productId === p.id)
          .reduce((s, l) => s + l.qty, 0);
        return sold ? { ...p, stock: p.stock - sold } : p;
      });
      const posted: Invoice = { ...inv, status: "posted" };
      return {
        ...prev,
        products,
        invoices: prev.invoices.map((i) => (i.id === id ? posted : i)),
        journal: [...prev.journal, postEntry(posted, `j${prev.journal.length + 1}-${id}`)],
      };
    });
  };

  const recordPayment = (id: string) => {
    setDb((prev) => {
      if (!prev) return prev;
      const inv = prev.invoices.find((i) => i.id === id);
      if (!inv || inv.status !== "posted") return prev;
      return {
        ...prev,
        invoices: prev.invoices.map((i) =>
          i.id === id ? { ...i, status: "paid" as const } : i
        ),
        journal: [
          ...prev.journal,
          paymentEntry(inv, `j${prev.journal.length + 1}-${id}-pay`, iso(new Date())),
        ],
      };
    });
  };

  const saveInvoice = (post: boolean) => {
    const lines: InvoiceLine[] = formLines
      .filter((l) => l.qty > 0)
      .map((l) => {
        const p = db.products.find((x) => x.id === l.productId)!;
        return { productId: l.productId, qty: l.qty, price: p.price, cost: p.cost };
      });
    if (!lines.length) return;
    const seq = db.seq + 1;
    const inv: Invoice = {
      id: `inv${seq}`,
      number: `INV-${seq}`,
      customerId: formCustomer,
      date: iso(new Date()),
      lines,
      status: "draft",
    };
    setDb((prev) => (prev ? { ...prev, seq, invoices: [inv, ...prev.invoices] } : prev));
    setShowNew(false);
    setFormLines([{ productId: "p1", qty: 5 }]);
    setTab("Invoices");
    if (post) setTimeout(() => postInvoice(inv.id), 0);
  };

  const reset = () => {
    window.localStorage.removeItem(KEY);
    setDb(seed());
    setOpenInvoice(null);
  };

  const customerName = (id: string) => db.customers.find((c) => c.id === id)?.name ?? id;
  const productName = (id: string) => db.products.find((p) => p.id === id)?.name ?? id;

  const formTotal = formLines.reduce((s, l) => {
    const p = db.products.find((x) => x.id === l.productId);
    return s + (p ? p.price * l.qty : 0);
  }, 0);

  /* ----- render ----- */

  return (
    <main className="min-h-screen bg-paper px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <header className="flex flex-wrap items-center justify-between gap-3 pb-6">
          <div>
            <p className="font-display text-2xl">Meridian Coffee Supply</p>
            <p className="text-sm text-soft">
              Wholesale accounting &amp; inventory — live demo
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Demo data — resets anytime
            </span>
            <button
              onClick={reset}
              className="rounded-lg border border-line bg-white px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
            >
              Reset
            </button>
            <a href="/" className="text-soft hover:text-accent transition-colors">
              ← herin.id
            </a>
          </div>
        </header>

        {/* tabs */}
        <nav className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1 text-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
                tab === t ? "bg-ink text-paper" : "text-soft hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto flex items-center pr-1">
            <button
              onClick={() => setShowNew(true)}
              className="rounded-lg bg-accent px-4 py-2 text-white hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              + New invoice
            </button>
          </div>
        </nav>

        {/* dashboard */}
        {tab === "Dashboard" && (
          <section className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi label="Revenue (all time)" value={usd.format(revenue)} />
              <Kpi label="Cash" value={usd.format(cash)} />
              <Kpi
                label="Receivables open"
                value={usd.format(ar)}
                hint={`${db.invoices.filter((i) => i.status === "posted").length} unpaid invoices`}
              />
              <Kpi label="Inventory value" value={usd.format(stockValue)} hint="at cost" />
            </div>
            <div className="rounded-xl border border-line bg-white p-5">
              <p className="text-xs uppercase tracking-widest text-faint">
                Revenue, last 8 weeks
              </p>
              <div className="mt-4 flex h-40 items-end gap-2">
                {weeks.map((w) => (
                  <div
                    key={w.label}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <span className="text-[10px] text-faint">
                      {w.total ? usd.format(w.total) : ""}
                    </span>
                    <div
                      className="w-full rounded-t bg-accent/80"
                      style={{ height: `${Math.round((w.total / maxWeek) * 100)}%` }}
                    />
                    <span className="text-[10px] text-faint">{w.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-soft">
              Try it: create an invoice, post it, then record the payment — and watch
              Cash, Receivables, Inventory, and the Ledger move together.
            </p>
          </section>
        )}

        {/* invoices */}
        {tab === "Invoices" && (
          <section className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-widest text-faint">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {db.invoices.map((inv) => (
                  <Fragment key={inv.id}>
                    <tr
                      onClick={() => setOpenInvoice(openInvoice === inv.id ? null : inv.id)}
                      className="cursor-pointer border-b border-line/60 hover:bg-paper/60"
                    >
                      <td className="px-4 py-3 font-medium">{inv.number}</td>
                      <td className="px-4 py-3">{customerName(inv.customerId)}</td>
                      <td className="px-4 py-3 text-soft">{inv.date}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {usdCents.format(invoiceTotal(inv))}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {inv.status === "draft" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              postInvoice(inv.id);
                            }}
                            className="rounded-lg border border-line px-3 py-1 text-xs hover:border-accent hover:text-accent"
                          >
                            Post
                          </button>
                        )}
                        {inv.status === "posted" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              recordPayment(inv.id);
                            }}
                            className="rounded-lg border border-line px-3 py-1 text-xs hover:border-accent hover:text-accent"
                          >
                            Record payment
                          </button>
                        )}
                      </td>
                    </tr>
                    {openInvoice === inv.id && (
                      <tr className="border-b border-line/60 bg-paper/40">
                        <td colSpan={6} className="px-6 py-4">
                          <table className="w-full text-xs">
                            <tbody>
                              {inv.lines.map((l, idx) => (
                                <tr key={idx}>
                                  <td className="py-1">{productName(l.productId)}</td>
                                  <td className="py-1 text-right tabular-nums">
                                    {l.qty} × {usdCents.format(l.price)}
                                  </td>
                                  <td className="py-1 text-right tabular-nums">
                                    {usdCents.format(l.qty * l.price)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* inventory */}
        {tab === "Inventory" && (
          <section className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-widest text-faint">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3 text-right">On hand</th>
                  <th className="px-4 py-3 text-right">Unit cost</th>
                  <th className="px-4 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {db.products.map((p) => (
                  <tr key={p.id} className="border-b border-line/60">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-soft">{p.sku}</td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums ${
                        p.stock < 20 ? "text-accent font-medium" : ""
                      }`}
                    >
                      {p.stock}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {usdCents.format(p.cost)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {usd.format(p.stock * p.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ledger */}
        {tab === "Ledger" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-5">
              <p className="text-xs uppercase tracking-widest text-faint">Trial balance</p>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {["Cash", "Accounts Receivable", "Inventory", "Cost of Goods Sold"].map(
                    (a) => (
                      <tr key={a} className="border-b border-line/60">
                        <td className="py-2">{a}</td>
                        <td className="py-2 text-right tabular-nums">
                          {usdCents.format(bal(a, "debit"))}
                        </td>
                        <td className="py-2 text-right text-faint">Dr</td>
                      </tr>
                    )
                  )}
                  {["Revenue", "Owner's Equity"].map((a) => (
                    <tr key={a} className="border-b border-line/60">
                      <td className="py-2">{a}</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(bal(a, "credit"))}
                      </td>
                      <td className="py-2 text-right text-faint">Cr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-faint">
                Debits equal credits — always. That&apos;s the point.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-5">
              <p className="text-xs uppercase tracking-widest text-faint">
                Journal — latest entries
              </p>
              <div className="mt-3 space-y-4 text-sm">
                {[...db.journal]
                  .reverse()
                  .slice(0, 8)
                  .map((e) => (
                    <div key={e.id} className="border-b border-line/60 pb-3">
                      <p className="flex justify-between">
                        <span className="font-medium">{e.memo}</span>
                        <span className="text-faint">{e.date}</span>
                      </p>
                      {e.lines.map((l, i) => (
                        <p key={i} className="flex justify-between text-xs text-soft">
                          <span className={l.credit ? "pl-4" : ""}>{l.account}</span>
                          <span className="tabular-nums">
                            {l.debit
                              ? `Dr ${usdCents.format(l.debit)}`
                              : `Cr ${usdCents.format(l.credit)}`}
                          </span>
                        </p>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* new invoice modal */}
        {showNew && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={() => setShowNew(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-display text-2xl">New invoice</p>
              <label className="mt-5 block text-xs uppercase tracking-widest text-faint">
                Customer
              </label>
              <select
                value={formCustomer}
                onChange={(e) => setFormCustomer(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
              >
                {db.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-xs uppercase tracking-widest text-faint">
                Lines
              </label>
              <div className="mt-1 space-y-2">
                {formLines.map((l, idx) => (
                  <div key={idx} className="flex gap-2">
                    <select
                      value={l.productId}
                      onChange={(e) =>
                        setFormLines((ls) =>
                          ls.map((x, i) =>
                            i === idx ? { ...x, productId: e.target.value } : x
                          )
                        )
                      }
                      className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
                    >
                      {db.products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {usdCents.format(p.price)} ({p.stock} left)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={l.qty}
                      onChange={(e) =>
                        setFormLines((ls) =>
                          ls.map((x, i) =>
                            i === idx ? { ...x, qty: Number(e.target.value) } : x
                          )
                        )
                      }
                      className="w-20 rounded-lg border border-line px-3 py-2 text-sm tabular-nums"
                    />
                    {formLines.length > 1 && (
                      <button
                        onClick={() =>
                          setFormLines((ls) => ls.filter((_, i) => i !== idx))
                        }
                        className="px-2 text-faint hover:text-accent"
                        aria-label="Remove line"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setFormLines((ls) => [...ls, { productId: "p1", qty: 1 }])
                }
                className="mt-2 text-sm text-soft hover:text-accent"
              >
                + Add line
              </button>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <p className="text-sm text-soft">
                  Total{" "}
                  <span className="font-display text-xl text-ink">
                    {usdCents.format(formTotal)}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveInvoice(false)}
                    className="rounded-lg border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent"
                  >
                    Save draft
                  </button>
                  <button
                    onClick={() => saveInvoice(true)}
                    className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    Post invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="py-10 text-center text-xs text-faint">
          Sample data only. This demo shows the kind of accounting &amp; inventory
          systems I build —{" "}
          <a href="/#contact" className="underline hover:text-accent">
            get in touch
          </a>{" "}
          for the real thing.
        </footer>
      </div>
    </main>
  );
}
