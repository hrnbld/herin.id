import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live ERP Demo — herin.id",
  description:
    "A working demo of an accounting & inventory platform — create invoices, post them, and watch the ledger stay balanced. Sample data only.",
};

const ERP_DEMO_URL = "https://erp.herin.id/login?embed=1&callbackUrl=%2F";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <iframe
        src={ERP_DEMO_URL}
        title="Interactive ERP demo"
        className="h-screen w-full border-0"
        allow="clipboard-write"
      />
    </main>
  );
}
