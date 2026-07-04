"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ACCOUNTS,
  type Adjustment,
  type Bill,
  type DB,
  type Invoice,
  type Line,
  type PurchaseOrder,
  type SalesOrder,
  STORAGE_KEY,
  adjustmentEntry,
  billPaymentEntry,
  billReceiptEntry,
  daysAgo,
  invoicePaymentEntry,
  invoicePostEntry,
  iso,
  lineTotal,
  seed,
  usd,
  usdCents,
} from "./lib";

/* ---------- storage ---------- */

function load(): DB {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* corrupted → reseed */
  }
  return seed();
}

/* ---------- small UI bits ---------- */

const MODULES = [
  "Dashboard",
  "Sales",
  "Purchases",
  "Inventory",
  "Contacts",
  "Accounting",
] as const;
type Module = (typeof MODULES)[number];

type ModalKind =
  | null
  | "invoice"
  | "so"
  | "po"
  | "adj"
  | "item"
  | "customer"
  | "vendor";

function Pill({ text }: { text: string }) {
  const styles: Record<string, string> = {
    draft: "bg-stone-100 text-stone-600",
    confirmed: "bg-sky-100 text-sky-800",
    shipped: "bg-indigo-100 text-indigo-800",
    posted: "bg-amber-100 text-amber-800",
    paid: "bg-emerald-100 text-emerald-800",
    ordered: "bg-sky-100 text-sky-800",
    received: "bg-emerald-100 text-emerald-800",
    open: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
        styles[text] ?? "bg-stone-100 text-stone-600"
      }`}
    >
      {text}
    </span>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-[11px] uppercase tracking-widest text-faint">{label}</p>
      <p className="mt-1.5 font-display text-2xl">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-faint">{hint}</p>}
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-line px-3 py-1 text-xs hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
    >
      {label}
    </button>
  );
}

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`px-3 py-2.5 text-[11px] uppercase tracking-widest text-faint font-medium ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

/* ---------- main ---------- */

export default function DemoApp() {
  const [db, setDb] = useState<DB | null>(null);
  const [mod, setMod] = useState<Module>("Dashboard");
  const [sub, setSub] = useState<string>("");
  const [modal, setModal] = useState<ModalKind>(null);
  const [openRow, setOpenRow] = useState<string | null>(null);

  // form state
  const [formContact, setFormContact] = useState("c1");
  const [formLines, setFormLines] = useState<{ productId: string; qty: number }[]>([
    { productId: "p1", qty: 10 },
  ]);
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState(10);
  const [formCost, setFormCost] = useState(5);
  const [formQtyDelta, setFormQtyDelta] = useState(-1);
  const [formReason, setFormReason] = useState("Stock count correction");
  const [formProduct, setFormProduct] = useState("p1");

  useEffect(() => setDb(load()), []);
  useEffect(() => {
    if (db) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const balances = useMemo(() => {
    const map = new Map<string, { debit: number; credit: number }>();
    if (!db) return map;
    for (const e of db.journal)
      for (const l of e.lines) {
        const b = map.get(l.account) ?? { debit: 0, credit: 0 };
        b.debit += l.debit;
        b.credit += l.credit;
        map.set(l.account, b);
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

  const bal = (account: string): number => {
    const b = balances.get(account) ?? { debit: 0, credit: 0 };
    const type = ACCOUNTS.find((a) => a.name === account)?.type ?? "asset";
    return type === "asset" || type === "expense"
      ? b.debit - b.credit
      : b.credit - b.debit;
  };

  const customerName = (id: string) =>
    db.customers.find((c) => c.id === id)?.name ?? id;
  const vendorName = (id: string) => db.vendors.find((v) => v.id === id)?.name ?? id;
  const productName = (id: string) => db.products.find((p) => p.id === id)?.name ?? id;
  const nextJ = (prev: DB) => `j${prev.seq.j + 1}`;

  /* ---------- actions ---------- */

  const confirmSO = (id: string) =>
    setDb((prev) =>
      prev
        ? {
            ...prev,
            salesOrders: prev.salesOrders.map((s) =>
              s.id === id && s.status === "draft"
                ? { ...s, status: "confirmed" as const }
                : s
            ),
          }
        : prev
    );

  const shipSO = (id: string) =>
    setDb((prev) =>
      prev
        ? {
            ...prev,
            salesOrders: prev.salesOrders.map((s) =>
              s.id === id && s.status === "confirmed"
                ? { ...s, status: "shipped" as const }
                : s
            ),
          }
        : prev
    );

  const invoiceFromSO = (id: string) => {
    setDb((prev) => {
      if (!prev) return prev;
      const so = prev.salesOrders.find((s) => s.id === id);
      if (!so || so.invoiceId) return prev;
      const seqInv = prev.seq.inv + 1;
      const inv: Invoice = {
        id: `inv${seqInv}`,
        number: `INV-${seqInv}`,
        customerId: so.customerId,
        date: iso(new Date()),
        lines: so.lines,
        status: "draft",
        soId: so.id,
      };
      return {
        ...prev,
        seq: { ...prev.seq, inv: seqInv },
        invoices: [inv, ...prev.invoices],
        salesOrders: prev.salesOrders.map((s) =>
          s.id === id ? { ...s, invoiceId: inv.id } : s
        ),
      };
    });
    setMod("Sales");
    setSub("Invoices");
  };

  const postInvoice = (id: string) =>
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
        journal: [...prev.journal, invoicePostEntry(posted, nextJ(prev))],
        seq: { ...prev.seq, j: prev.seq.j + 1 },
      };
    });

  const payInvoice = (id: string) =>
    setDb((prev) => {
      if (!prev) return prev;
      const inv = prev.invoices.find((i) => i.id === id);
      if (!inv || inv.status !== "posted") return prev;
      return {
        ...prev,
        invoices: prev.invoices.map((i) =>
          i.id === id ? { ...i, status: "paid" as const } : i
        ),
        journal: [...prev.journal, invoicePaymentEntry(inv, nextJ(prev), iso(new Date()))],
        seq: { ...prev.seq, j: prev.seq.j + 1 },
      };
    });

  const orderPO = (id: string) =>
    setDb((prev) =>
      prev
        ? {
            ...prev,
            purchaseOrders: prev.purchaseOrders.map((p) =>
              p.id === id && p.status === "draft"
                ? { ...p, status: "ordered" as const }
                : p
            ),
          }
        : prev
    );

  const receivePO = (id: string) =>
    setDb((prev) => {
      if (!prev) return prev;
      const po = prev.purchaseOrders.find((p) => p.id === id);
      if (!po || po.status !== "ordered") return prev;
      const seqBill = prev.seq.bill + 1;
      const bill: Bill = {
        id: `bill${seqBill}`,
        number: `BILL-${seqBill}`,
        vendorId: po.vendorId,
        date: iso(new Date()),
        total: lineTotal(po.lines),
        status: "open",
        poId: po.id,
      };
      const products = prev.products.map((p) => {
        const rec = po.lines
          .filter((l) => l.productId === p.id)
          .reduce((s, l) => s + l.qty, 0);
        return rec ? { ...p, stock: p.stock + rec } : p;
      });
      return {
        ...prev,
        products,
        purchaseOrders: prev.purchaseOrders.map((p) =>
          p.id === id ? { ...p, status: "received" as const, billId: bill.id } : p
        ),
        bills: [bill, ...prev.bills],
        journal: [...prev.journal, billReceiptEntry(bill, nextJ(prev))],
        seq: { ...prev.seq, bill: seqBill, j: prev.seq.j + 1 },
      };
    });

  const payBill = (id: string) =>
    setDb((prev) => {
      if (!prev) return prev;
      const bill = prev.bills.find((b) => b.id === id);
      if (!bill || bill.status !== "open") return prev;
      return {
        ...prev,
        bills: prev.bills.map((b) =>
          b.id === id ? { ...b, status: "paid" as const } : b
        ),
        journal: [...prev.journal, billPaymentEntry(bill, nextJ(prev), iso(new Date()))],
        seq: { ...prev.seq, j: prev.seq.j + 1 },
      };
    });

  const saveDoc = (kind: "invoice" | "so" | "po") => {
    const lines: Line[] = formLines
      .filter((l) => l.qty > 0)
      .map((l) => {
        const p = db.products.find((x) => x.id === l.productId)!;
        return {
          productId: l.productId,
          qty: l.qty,
          price: kind === "po" ? p.cost : p.price,
          cost: p.cost,
        };
      });
    if (!lines.length) return;
    setDb((prev) => {
      if (!prev) return prev;
      if (kind === "invoice") {
        const n = prev.seq.inv + 1;
        const inv: Invoice = {
          id: `inv${n}`,
          number: `INV-${n}`,
          customerId: formContact,
          date: iso(new Date()),
          lines,
          status: "draft",
        };
        return { ...prev, seq: { ...prev.seq, inv: n }, invoices: [inv, ...prev.invoices] };
      }
      if (kind === "so") {
        const n = prev.seq.so + 1;
        const so: SalesOrder = {
          id: `so${n}`,
          number: `SO-${n}`,
          customerId: formContact,
          date: iso(new Date()),
          lines,
          status: "draft",
        };
        return {
          ...prev,
          seq: { ...prev.seq, so: n },
          salesOrders: [so, ...prev.salesOrders],
        };
      }
      const n = prev.seq.po + 1;
      const po: PurchaseOrder = {
        id: `po${n}`,
        number: `PO-${n}`,
        vendorId: formContact,
        date: iso(new Date()),
        lines,
        status: "draft",
      };
      return {
        ...prev,
        seq: { ...prev.seq, po: n },
        purchaseOrders: [po, ...prev.purchaseOrders],
      };
    });
    setModal(null);
    if (kind === "invoice") {
      setMod("Sales");
      setSub("Invoices");
    } else if (kind === "so") {
      setMod("Sales");
      setSub("Orders");
    } else {
      setMod("Purchases");
      setSub("Orders");
    }
  };

  const saveAdjustment = () => {
    if (!formQtyDelta) return;
    setDb((prev) => {
      if (!prev) return prev;
      const p = prev.products.find((x) => x.id === formProduct)!;
      if (p.stock + formQtyDelta < 0) {
        window.alert(`Cannot adjust below zero (${p.stock} on hand).`);
        return prev;
      }
      const n = prev.seq.adj + 1;
      const adj: Adjustment = {
        id: `adj${n}`,
        number: `ADJ-${n}`,
        productId: formProduct,
        qtyDelta: formQtyDelta,
        reason: formReason || "Adjustment",
        date: iso(new Date()),
        value: Math.abs(formQtyDelta) * p.cost,
      };
      return {
        ...prev,
        products: prev.products.map((x) =>
          x.id === formProduct ? { ...x, stock: x.stock + formQtyDelta } : x
        ),
        adjustments: [adj, ...prev.adjustments],
        journal: [...prev.journal, adjustmentEntry(adj, nextJ(prev))],
        seq: { ...prev.seq, adj: n, j: prev.seq.j + 1 },
      };
    });
    setModal(null);
  };

  const saveItem = () => {
    if (!formName.trim()) return;
    setDb((prev) => {
      if (!prev) return prev;
      const id = `p${prev.products.length + 1}-${Date.now() % 10000}`;
      return {
        ...prev,
        products: [
          ...prev.products,
          {
            id,
            name: formName.trim(),
            sku: formSku.trim() || `SK-${prev.products.length + 1}`,
            price: formPrice,
            cost: formCost,
            stock: 0,
          },
        ],
      };
    });
    setModal(null);
    setFormName("");
    setFormSku("");
  };

  const saveContact = (kind: "customer" | "vendor") => {
    if (!formName.trim()) return;
    setDb((prev) => {
      if (!prev) return prev;
      const id = `${kind === "customer" ? "c" : "v"}${Date.now() % 100000}`;
      const contact = { id, name: formName.trim() };
      return kind === "customer"
        ? { ...prev, customers: [...prev.customers, contact] }
        : { ...prev, vendors: [...prev.vendors, contact] };
    });
    setModal(null);
    setFormName("");
  };

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setDb(seed());
    setOpenRow(null);
  };

  /* ---------- derived ---------- */

  const revenue = bal("Revenue");
  const cogs = bal("Cost of Goods Sold");
  const shrinkage = bal("Inventory Shrinkage");
  const netIncome = revenue - cogs - shrinkage;
  const cash = bal("Cash");
  const ar = bal("Accounts Receivable");
  const ap = bal("Accounts Payable");
  const inventoryGL = bal("Inventory");
  const equity = bal("Owner's Equity");

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
      .reduce((s, i) => s + lineTotal(i.lines), 0);
    weeks.push({ label: `W${8 - w}`, total });
  }
  const maxWeek = Math.max(...weeks.map((w) => w.total), 1);

  const subTabs: Record<Module, string[]> = {
    Dashboard: [],
    Sales: ["Orders", "Invoices"],
    Purchases: ["Orders", "Bills"],
    Inventory: ["Items", "Adjustments"],
    Contacts: ["Customers", "Vendors"],
    Accounting: ["Reports", "Chart of Accounts", "Journal"],
  };
  const activeSub = sub && subTabs[mod].includes(sub) ? sub : subTabs[mod][0] ?? "";

  const newButton: { label: string; kind: ModalKind } | null =
    mod === "Sales" && activeSub === "Orders"
      ? { label: "+ Sales order", kind: "so" }
      : mod === "Sales"
        ? { label: "+ Invoice", kind: "invoice" }
        : mod === "Purchases"
          ? { label: "+ Purchase order", kind: "po" }
          : mod === "Inventory" && activeSub === "Items"
            ? { label: "+ Item", kind: "item" }
            : mod === "Inventory"
              ? { label: "+ Adjustment", kind: "adj" }
              : mod === "Contacts" && activeSub === "Customers"
                ? { label: "+ Customer", kind: "customer" }
                : mod === "Contacts"
                  ? { label: "+ Vendor", kind: "vendor" }
                  : mod === "Dashboard"
                    ? { label: "+ Invoice", kind: "invoice" }
                    : null;

  const openModal = (kind: ModalKind) => {
    setFormLines([{ productId: db.products[0].id, qty: 10 }]);
    setFormContact(kind === "po" ? db.vendors[0].id : db.customers[0].id);
    setFormName("");
    setModal(kind);
  };

  const formDocTotal = formLines.reduce((s, l) => {
    const p = db.products.find((x) => x.id === l.productId);
    if (!p) return s;
    return s + (modal === "po" ? p.cost : p.price) * l.qty;
  }, 0);

  /* ---------- render ---------- */

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="flex min-h-screen flex-col sm:flex-row">
        {/* sidebar */}
        <aside className="flex shrink-0 flex-row items-center gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 sm:w-52 sm:flex-col sm:items-stretch sm:border-b-0 sm:border-r sm:px-4 sm:py-6">
          <div className="hidden sm:block sm:pb-6">
            <p className="font-display text-xl leading-tight">Meridian</p>
            <p className="text-xs text-soft">Coffee Supply — demo</p>
          </div>
          {MODULES.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMod(m);
                setSub("");
                setOpenRow(null);
              }}
              className={`rounded-lg px-3 py-2 text-left text-sm whitespace-nowrap transition-colors ${
                mod === m ? "bg-ink text-paper" : "text-soft hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
          <div className="hidden sm:mt-auto sm:block sm:space-y-2 sm:pt-6 text-xs">
            <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800">
              Demo data
            </span>
            <button
              onClick={reset}
              className="block text-soft underline hover:text-accent"
            >
              Reset data
            </button>
            <a href="/" className="block text-soft hover:text-accent">
              ← herin.id
            </a>
          </div>
        </aside>

        {/* content */}
        <div className="flex-1 px-4 py-5 sm:px-8 sm:py-6">
          {/* top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl">{mod}</h1>
              {subTabs[mod].length > 0 && (
                <div className="flex gap-1 rounded-lg border border-line bg-white p-0.5 text-xs">
                  {subTabs[mod].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSub(t);
                        setOpenRow(null);
                      }}
                      className={`rounded-md px-3 py-1.5 whitespace-nowrap ${
                        activeSub === t ? "bg-ink text-paper" : "text-soft hover:text-ink"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={reset}
                className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs text-soft hover:border-accent hover:text-accent sm:hidden"
              >
                Reset
              </button>
              {newButton && (
                <button
                  onClick={() => openModal(newButton.kind)}
                  className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90 whitespace-nowrap"
                >
                  {newButton.label}
                </button>
              )}
            </div>
          </div>

          {/* ===== Dashboard ===== */}
          {mod === "Dashboard" && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi label="Revenue" value={usd.format(revenue)} />
                <Kpi label="Cash" value={usd.format(cash)} />
                <Kpi
                  label="Receivables"
                  value={usd.format(ar)}
                  hint={`${db.invoices.filter((i) => i.status === "posted").length} unpaid invoices`}
                />
                <Kpi
                  label="Payables"
                  value={usd.format(ap)}
                  hint={`${db.bills.filter((b) => b.status === "open").length} open bills`}
                />
              </div>
              <div className="rounded-xl border border-line bg-white p-5">
                <p className="text-[11px] uppercase tracking-widest text-faint">
                  Revenue, last 8 weeks
                </p>
                <div className="mt-4 flex h-36 items-end gap-2">
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
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-line bg-white p-5">
                  <p className="text-[11px] uppercase tracking-widest text-faint">
                    Latest activity
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    {[...db.journal]
                      .reverse()
                      .slice(0, 6)
                      .map((e) => (
                        <p key={e.id} className="flex justify-between gap-4">
                          <span className="truncate">{e.memo}</span>
                          <span className="shrink-0 text-faint">{e.date}</span>
                        </p>
                      ))}
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-white p-5">
                  <p className="text-[11px] uppercase tracking-widest text-faint">
                    Low stock
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    {db.products
                      .filter((p) => p.stock < 20)
                      .map((p) => (
                        <p key={p.id} className="flex justify-between">
                          <span>{p.name}</span>
                          <span className="tabular-nums text-accent font-medium">
                            {p.stock} left
                          </span>
                        </p>
                      ))}
                    {db.products.filter((p) => p.stock < 20).length === 0 && (
                      <p className="text-faint">All stocked up.</p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-soft">
                Try the full flow: create a sales order → confirm → invoice → post →
                record payment. Then check Accounting → Reports and watch everything
                stay balanced.
              </p>
            </div>
          )}

          {/* ===== Sales / Orders ===== */}
          {mod === "Sales" && activeSub === "Orders" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>Order</Th>
                    <Th>Customer</Th>
                    <Th>Date</Th>
                    <Th right>Total</Th>
                    <Th>Status</Th>
                    <Th right>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {db.salesOrders.map((so) => (
                    <Fragment key={so.id}>
                      <tr
                        onClick={() => setOpenRow(openRow === so.id ? null : so.id)}
                        className="cursor-pointer border-b border-line/60 hover:bg-paper/60"
                      >
                        <td className="px-3 py-3 font-medium">{so.number}</td>
                        <td className="px-3 py-3">{customerName(so.customerId)}</td>
                        <td className="px-3 py-3 text-soft">{so.date}</td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {usdCents.format(lineTotal(so.lines))}
                        </td>
                        <td className="px-3 py-3">
                          <Pill text={so.status} />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            {so.status === "draft" && (
                              <ActionBtn
                                label="Confirm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmSO(so.id);
                                }}
                              />
                            )}
                            {so.status === "confirmed" && !so.invoiceId && (
                              <ActionBtn
                                label="Create invoice"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  invoiceFromSO(so.id);
                                }}
                              />
                            )}
                            {so.status === "confirmed" && (
                              <ActionBtn
                                label="Ship"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shipSO(so.id);
                                }}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                      {openRow === so.id && (
                        <tr className="border-b border-line/60 bg-paper/40">
                          <td colSpan={6} className="px-6 py-3 text-xs">
                            {so.lines.map((l, i) => (
                              <p key={i} className="flex justify-between py-0.5">
                                <span>{productName(l.productId)}</span>
                                <span className="tabular-nums">
                                  {l.qty} × {usdCents.format(l.price)} ={" "}
                                  {usdCents.format(l.qty * l.price)}
                                </span>
                              </p>
                            ))}
                            {so.invoiceId && (
                              <p className="pt-1 text-faint">
                                Invoiced as{" "}
                                {db.invoices.find((i) => i.id === so.invoiceId)?.number}
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Sales / Invoices ===== */}
          {mod === "Sales" && activeSub === "Invoices" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>Invoice</Th>
                    <Th>Customer</Th>
                    <Th>Date</Th>
                    <Th right>Total</Th>
                    <Th>Status</Th>
                    <Th right>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {db.invoices.map((inv) => (
                    <Fragment key={inv.id}>
                      <tr
                        onClick={() => setOpenRow(openRow === inv.id ? null : inv.id)}
                        className="cursor-pointer border-b border-line/60 hover:bg-paper/60"
                      >
                        <td className="px-3 py-3 font-medium">{inv.number}</td>
                        <td className="px-3 py-3">{customerName(inv.customerId)}</td>
                        <td className="px-3 py-3 text-soft">{inv.date}</td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {usdCents.format(lineTotal(inv.lines))}
                        </td>
                        <td className="px-3 py-3">
                          <Pill text={inv.status} />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            {inv.status === "draft" && (
                              <ActionBtn
                                label="Post"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  postInvoice(inv.id);
                                }}
                              />
                            )}
                            {inv.status === "posted" && (
                              <ActionBtn
                                label="Record payment"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  payInvoice(inv.id);
                                }}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                      {openRow === inv.id && (
                        <tr className="border-b border-line/60 bg-paper/40">
                          <td colSpan={6} className="px-6 py-3 text-xs">
                            {inv.lines.map((l, i) => (
                              <p key={i} className="flex justify-between py-0.5">
                                <span>{productName(l.productId)}</span>
                                <span className="tabular-nums">
                                  {l.qty} × {usdCents.format(l.price)} ={" "}
                                  {usdCents.format(l.qty * l.price)}
                                </span>
                              </p>
                            ))}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Purchases / Orders ===== */}
          {mod === "Purchases" && activeSub === "Orders" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>PO</Th>
                    <Th>Vendor</Th>
                    <Th>Date</Th>
                    <Th right>Total</Th>
                    <Th>Status</Th>
                    <Th right>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {db.purchaseOrders.map((po) => (
                    <Fragment key={po.id}>
                      <tr
                        onClick={() => setOpenRow(openRow === po.id ? null : po.id)}
                        className="cursor-pointer border-b border-line/60 hover:bg-paper/60"
                      >
                        <td className="px-3 py-3 font-medium">{po.number}</td>
                        <td className="px-3 py-3">{vendorName(po.vendorId)}</td>
                        <td className="px-3 py-3 text-soft">{po.date}</td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {usdCents.format(lineTotal(po.lines))}
                        </td>
                        <td className="px-3 py-3">
                          <Pill text={po.status} />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            {po.status === "draft" && (
                              <ActionBtn
                                label="Order"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  orderPO(po.id);
                                }}
                              />
                            )}
                            {po.status === "ordered" && (
                              <ActionBtn
                                label="Receive goods"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  receivePO(po.id);
                                }}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                      {openRow === po.id && (
                        <tr className="border-b border-line/60 bg-paper/40">
                          <td colSpan={6} className="px-6 py-3 text-xs">
                            {po.lines.map((l, i) => (
                              <p key={i} className="flex justify-between py-0.5">
                                <span>{productName(l.productId)}</span>
                                <span className="tabular-nums">
                                  {l.qty} × {usdCents.format(l.price)} ={" "}
                                  {usdCents.format(l.qty * l.price)}
                                </span>
                              </p>
                            ))}
                            {po.billId && (
                              <p className="pt-1 text-faint">
                                Billed as {db.bills.find((b) => b.id === po.billId)?.number}
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Purchases / Bills ===== */}
          {mod === "Purchases" && activeSub === "Bills" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>Bill</Th>
                    <Th>Vendor</Th>
                    <Th>Date</Th>
                    <Th right>Total</Th>
                    <Th>Status</Th>
                    <Th right>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {db.bills.map((b) => (
                    <tr key={b.id} className="border-b border-line/60">
                      <td className="px-3 py-3 font-medium">{b.number}</td>
                      <td className="px-3 py-3">{vendorName(b.vendorId)}</td>
                      <td className="px-3 py-3 text-soft">{b.date}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {usdCents.format(b.total)}
                      </td>
                      <td className="px-3 py-3">
                        <Pill text={b.status} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        {b.status === "open" && (
                          <ActionBtn label="Pay bill" onClick={() => payBill(b.id)} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Inventory / Items ===== */}
          {mod === "Inventory" && activeSub === "Items" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>Product</Th>
                    <Th>SKU</Th>
                    <Th right>On hand</Th>
                    <Th right>Unit cost</Th>
                    <Th right>Sell price</Th>
                    <Th right>Stock value</Th>
                  </tr>
                </thead>
                <tbody>
                  {db.products.map((p) => (
                    <tr key={p.id} className="border-b border-line/60">
                      <td className="px-3 py-3 font-medium">{p.name}</td>
                      <td className="px-3 py-3 text-soft">{p.sku}</td>
                      <td
                        className={`px-3 py-3 text-right tabular-nums ${
                          p.stock < 20 ? "font-medium text-accent" : ""
                        }`}
                      >
                        {p.stock}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {usdCents.format(p.cost)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {usdCents.format(p.price)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {usd.format(p.stock * p.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Inventory / Adjustments ===== */}
          {mod === "Inventory" && activeSub === "Adjustments" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>Ref</Th>
                    <Th>Product</Th>
                    <Th>Date</Th>
                    <Th right>Qty ±</Th>
                    <Th right>Value</Th>
                    <Th>Reason</Th>
                  </tr>
                </thead>
                <tbody>
                  {db.adjustments.map((a) => (
                    <tr key={a.id} className="border-b border-line/60">
                      <td className="px-3 py-3 font-medium">{a.number}</td>
                      <td className="px-3 py-3">{productName(a.productId)}</td>
                      <td className="px-3 py-3 text-soft">{a.date}</td>
                      <td
                        className={`px-3 py-3 text-right tabular-nums ${
                          a.qtyDelta < 0 ? "text-accent" : "text-emerald-700"
                        }`}
                      >
                        {a.qtyDelta > 0 ? `+${a.qtyDelta}` : a.qtyDelta}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {usdCents.format(a.value)}
                      </td>
                      <td className="px-3 py-3 text-soft">{a.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Contacts ===== */}
          {mod === "Contacts" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>Name</Th>
                    <Th right>
                      {activeSub === "Customers" ? "Open receivables" : "Open payables"}
                    </Th>
                    <Th right>{activeSub === "Customers" ? "Invoices" : "Bills"}</Th>
                  </tr>
                </thead>
                <tbody>
                  {(activeSub === "Customers" ? db.customers : db.vendors).map((ct) => {
                    const open =
                      activeSub === "Customers"
                        ? db.invoices
                            .filter(
                              (i) => i.customerId === ct.id && i.status === "posted"
                            )
                            .reduce((s, i) => s + lineTotal(i.lines), 0)
                        : db.bills
                            .filter((b) => b.vendorId === ct.id && b.status === "open")
                            .reduce((s, b) => s + b.total, 0);
                    const count =
                      activeSub === "Customers"
                        ? db.invoices.filter((i) => i.customerId === ct.id).length
                        : db.bills.filter((b) => b.vendorId === ct.id).length;
                    return (
                      <tr key={ct.id} className="border-b border-line/60">
                        <td className="px-3 py-3 font-medium">{ct.name}</td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {usdCents.format(open)}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">{count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Accounting / Reports ===== */}
          {mod === "Accounting" && activeSub === "Reports" && (
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="rounded-xl border border-line bg-white p-5">
                <p className="text-[11px] uppercase tracking-widest text-faint">
                  Trial balance
                </p>
                <table className="mt-3 w-full text-sm">
                  <tbody>
                    {ACCOUNTS.map((a) => {
                      const b = balances.get(a.name) ?? { debit: 0, credit: 0 };
                      const net = b.debit - b.credit;
                      if (b.debit === 0 && b.credit === 0) return null;
                      return (
                        <tr key={a.name} className="border-b border-line/60">
                          <td className="py-2">{a.name}</td>
                          <td className="py-2 text-right tabular-nums">
                            {net >= 0 ? usdCents.format(net) : ""}
                          </td>
                          <td className="py-2 text-right tabular-nums">
                            {net < 0 ? usdCents.format(-net) : ""}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="font-medium">
                      <td className="py-2">Total</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(
                          ACCOUNTS.reduce((s, a) => {
                            const b = balances.get(a.name) ?? { debit: 0, credit: 0 };
                            return s + Math.max(b.debit - b.credit, 0);
                          }, 0)
                        )}
                      </td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(
                          ACCOUNTS.reduce((s, a) => {
                            const b = balances.get(a.name) ?? { debit: 0, credit: 0 };
                            return s + Math.max(b.credit - b.debit, 0);
                          }, 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border border-line bg-white p-5">
                <p className="text-[11px] uppercase tracking-widest text-faint">
                  Profit &amp; loss
                </p>
                <table className="mt-3 w-full text-sm">
                  <tbody>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Revenue</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(revenue)}
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Cost of goods sold</td>
                      <td className="py-2 text-right tabular-nums">
                        ({usdCents.format(cogs)})
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Gross profit</td>
                      <td className="py-2 text-right tabular-nums font-medium">
                        {usdCents.format(revenue - cogs)}
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Inventory shrinkage</td>
                      <td className="py-2 text-right tabular-nums">
                        ({usdCents.format(shrinkage)})
                      </td>
                    </tr>
                    <tr className="font-medium">
                      <td className="py-2">Net income</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(netIncome)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border border-line bg-white p-5">
                <p className="text-[11px] uppercase tracking-widest text-faint">
                  Balance sheet
                </p>
                <table className="mt-3 w-full text-sm">
                  <tbody>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Cash</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(cash)}
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Accounts receivable</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(ar)}
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Inventory</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(inventoryGL)}
                      </td>
                    </tr>
                    <tr className="border-b border-line font-medium">
                      <td className="py-2">Total assets</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(cash + ar + inventoryGL)}
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Accounts payable</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(ap)}
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Owner&apos;s equity</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(equity)}
                      </td>
                    </tr>
                    <tr className="border-b border-line/60">
                      <td className="py-2">Retained earnings</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(netIncome)}
                      </td>
                    </tr>
                    <tr className="font-medium">
                      <td className="py-2">Total liabilities + equity</td>
                      <td className="py-2 text-right tabular-nums">
                        {usdCents.format(ap + equity + netIncome)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-faint">
                  Assets = Liabilities + Equity. Always.
                </p>
              </div>
            </div>
          )}

          {/* ===== Accounting / CoA ===== */}
          {mod === "Accounting" && activeSub === "Chart of Accounts" && (
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <Th>Code</Th>
                    <Th>Account</Th>
                    <Th>Type</Th>
                    <Th right>Balance</Th>
                  </tr>
                </thead>
                <tbody>
                  {ACCOUNTS.map((a) => (
                    <tr key={a.code} className="border-b border-line/60">
                      <td className="px-3 py-3 tabular-nums text-soft">{a.code}</td>
                      <td className="px-3 py-3 font-medium">{a.name}</td>
                      <td className="px-3 py-3 capitalize text-soft">{a.type}</td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {usdCents.format(bal(a.name))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Accounting / Journal ===== */}
          {mod === "Accounting" && activeSub === "Journal" && (
            <div className="space-y-3">
              {[...db.journal].reverse().map((e) => (
                <div key={e.id} className="rounded-xl border border-line bg-white p-4 text-sm">
                  <p className="flex justify-between">
                    <span className="font-medium">{e.memo}</span>
                    <span className="text-faint">{e.date}</span>
                  </p>
                  <div className="mt-2 space-y-0.5">
                    {e.lines.map((l, i) => (
                      <p key={i} className="flex justify-between text-xs text-soft">
                        <span className={l.credit ? "pl-5" : ""}>{l.account}</span>
                        <span className="tabular-nums">
                          {l.debit
                            ? `Dr ${usdCents.format(l.debit)}`
                            : `Cr ${usdCents.format(l.credit)}`}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== modals ===== */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(modal === "invoice" || modal === "so" || modal === "po") && (
              <>
                <p className="font-display text-2xl">
                  {modal === "invoice"
                    ? "New invoice"
                    : modal === "so"
                      ? "New sales order"
                      : "New purchase order"}
                </p>
                <label className="mt-5 block text-xs uppercase tracking-widest text-faint">
                  {modal === "po" ? "Vendor" : "Customer"}
                </label>
                <select
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
                >
                  {(modal === "po" ? db.vendors : db.customers).map((c) => (
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
                        className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
                      >
                        {db.products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} —{" "}
                            {usdCents.format(modal === "po" ? p.cost : p.price)}
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
                    setFormLines((ls) => [...ls, { productId: db.products[0].id, qty: 1 }])
                  }
                  className="mt-2 text-sm text-soft hover:text-accent"
                >
                  + Add line
                </button>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <p className="text-sm text-soft">
                    Total{" "}
                    <span className="font-display text-xl text-ink">
                      {usdCents.format(formDocTotal)}
                    </span>
                  </p>
                  <button
                    onClick={() => saveDoc(modal)}
                    className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    Save {modal === "invoice" ? "invoice" : "order"}
                  </button>
                </div>
              </>
            )}

            {modal === "adj" && (
              <>
                <p className="font-display text-2xl">Stock adjustment</p>
                <label className="mt-5 block text-xs uppercase tracking-widest text-faint">
                  Product
                </label>
                <select
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
                >
                  {db.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.stock} on hand)
                    </option>
                  ))}
                </select>
                <label className="mt-4 block text-xs uppercase tracking-widest text-faint">
                  Quantity change (negative = write-off)
                </label>
                <input
                  type="number"
                  value={formQtyDelta}
                  onChange={(e) => setFormQtyDelta(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm tabular-nums"
                />
                <label className="mt-4 block text-xs uppercase tracking-widest text-faint">
                  Reason
                </label>
                <input
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                />
                <div className="mt-5 flex justify-end border-t border-line pt-4">
                  <button
                    onClick={saveAdjustment}
                    className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    Post adjustment
                  </button>
                </div>
              </>
            )}

            {modal === "item" && (
              <>
                <p className="font-display text-2xl">New item</p>
                <label className="mt-5 block text-xs uppercase tracking-widest text-faint">
                  Name
                </label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                  placeholder="e.g. Espresso Tamper"
                />
                <label className="mt-4 block text-xs uppercase tracking-widest text-faint">
                  SKU
                </label>
                <input
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                  placeholder="ET-0001"
                />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-faint">
                      Sell price ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-faint">
                      Unit cost ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formCost}
                      onChange={(e) => setFormCost(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm tabular-nums"
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end border-t border-line pt-4">
                  <button
                    onClick={saveItem}
                    className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    Save item
                  </button>
                </div>
              </>
            )}

            {(modal === "customer" || modal === "vendor") && (
              <>
                <p className="font-display text-2xl">
                  {modal === "customer" ? "New customer" : "New vendor"}
                </p>
                <label className="mt-5 block text-xs uppercase tracking-widest text-faint">
                  Name
                </label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
                  placeholder={modal === "customer" ? "e.g. Sunset Bakery" : "e.g. RoastPack Ltd."}
                />
                <div className="mt-5 flex justify-end border-t border-line pt-4">
                  <button
                    onClick={() => saveContact(modal)}
                    className="rounded-lg bg-accent px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
