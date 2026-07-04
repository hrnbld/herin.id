import type { Metadata } from "next";
import DemoApp from "./DemoApp";

export const metadata: Metadata = {
  title: "Live ERP Demo — herin.id",
  description:
    "A working demo of an accounting & inventory platform — create invoices, post them, and watch the ledger stay balanced. Sample data only.",
};

export default function Page() {
  return <DemoApp />;
}
