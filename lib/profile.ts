// Single source of truth for the machine-readable profile served by the
// MCP endpoint (app/api/[transport]/route.ts). Human-facing copy lives in
// app/page.tsx and public/llms.txt — keep the three in sync when the
// story changes.

export const profile = {
  name: "Herin Yudha Pratama",
  title: "AI automation builder & commercial systems operator",
  location: "Bandung, Indonesia",
  timezone: "WIB (UTC+7)",
  languages: ["English", "Bahasa Indonesia"],
  site: "https://herin.id",
  email: "hello@herin.id",
  linkedin: "https://www.linkedin.com/in/herinyudha",
  summary:
    "Commercial operator with fourteen years across founder, marketing manager, commercial lead, and head-of-commercial roles — now using AI-assisted development, coding agents, APIs, and orchestration to turn commerce workflows into practical apps, dashboards, WhatsApp systems, and optimization loops. The edge is business flow first: understand the operation, then make the system work.",
  remote: "Works remotely with teams anywhere.",
};

export const trackRecord = {
  adsSpend: "Over a million dollars managed across Meta, Google, TikTok, and Shopee ads",
  averageRoas: "15–20×",
  commercialLeadership:
    "Led and grew commercial operations across consumer brands: offline stores, online store, marketplaces, CRM, KOL, content, and performance marketing.",
  yearsOperating: 14,
};

export const experience = [
  {
    role: "Founder",
    company: "MAJI",
    period: "2023 — now",
    place: "Bandung",
    detail:
      "Built and operated a consumer fragrance brand across product, content, marketplace, paid acquisition, and customer operations.",
  },
  {
    role: "Head of Commercial",
    company: "Paddy Indonesia",
    period: "2024 — 2026",
    place: "Bandung",
    detail:
      "Led commercial operations across offline stores, online store, marketplaces, CRM, KOL, content, and performance marketing.",
  },
  {
    role: "Marketing Manager",
    company: "PORTEE",
    period: "2023 — 2024",
    place: "Bandung",
    detail:
      "Managed growth across performance marketing, marketplace campaigns, CRM, KOL coordination, and digital acquisition.",
  },
  {
    role: "Commercial Lead & Digital Marketing Manager",
    company: "Visval",
    period: "2021 — 2022",
    place: "Bandung",
    detail:
      "Led online store, marketplace growth, performance marketing, CRM, and KOL strategy.",
  },
  {
    role: "Founder",
    company: "AS GOOD SUPPLY CO",
    period: "2012 — 2021",
    place: "Bandung",
    detail:
      "Founded and operated an independent apparel/supply brand for nearly a decade, covering product, sales, operations, and community-led growth.",
  },
];

export const services = [
  {
    title: "AI Automation & Agent Orchestration",
    desc: "AI workflows and agent orchestration for research, reporting, operations, support, and decision loops — with human checkpoints and practical monitoring.",
  },
  {
    title: "AI-Assisted App Prototyping",
    desc: "Internal apps, dashboards, and workflow tools shipped with AI-assisted development — scoped around real business flows, then tested in production.",
  },
  {
    title: "ERP & Accounting Systems",
    desc: "ERP-style workflows mapped from real operations: sales, purchasing, inventory, ledger, reporting, and operator dashboards.",
  },
  {
    title: "WhatsApp Commerce & AI Chatbots",
    desc: "Selling and serving customers where they already are — with agents that know their limits.",
  },
  {
    title: "Performance Marketing & Ads",
    desc: "Meta, Google, TikTok, and Shopee ads — over a million dollars managed at a 15–20× average ROAS.",
  },
  {
    title: "Dashboards & Analytics",
    desc: "Numbers from many sources, unified and presented so they're fast to read — and right.",
  },
];

export const demos = [
  {
    name: "ERP & Accounting demo",
    url: "https://herin.id/#erp",
    directUrl: "https://erp.herin.id",
    desc: "Live ERP-style operations demo with safe dummy data: sales, purchasing, and inventory flow straight into stock movement and accounting records — journal posting, AR/AP, cash and bank, general ledger, P&L, and management dashboards.",
  },
  {
    name: "WhatsApp Commerce demo",
    url: "https://herin.id/#wa",
    desc: "Unified WhatsApp inbox with customer context and AI-to-human handoff, broadcasts (restock alerts, cart recovery, VIP drops, segmentation, scheduling), and commerce analytics: chat revenue, paid orders, buyer funnel, response speed, campaign ROI.",
  },
];

export const faqs = [
  {
    q: "What do you actually build?",
    a: "AI-assisted business systems: ERP-style internal tools, WhatsApp commerce dashboards, reporting, AI agents, and workflow orchestration. Herin is not positioning as a traditional software engineer; the edge is operator context plus AI-assisted build workflow.",
  },
  {
    q: "Are the demos on this site real?",
    a: "Yes. Both demos are live software running in production infrastructure — the same systems, isolated with safe dummy data. Click around; nothing you do touches real customers.",
  },
  {
    q: "How do we work together?",
    a: "Business flow first, AI-assisted build second. We map how your operation actually runs, agree on a small scope that matters, ship it with the right tools and agents, then iterate from real usage.",
  },
  {
    q: "Can you handle the marketing side too?",
    a: "That's home ground. Fourteen years on the commercial side — over a million dollars managed across Meta, Google, TikTok, and Shopee ads at a 15–20× average ROAS.",
  },
  {
    q: "Where are you based?",
    a: "Bandung, Indonesia (WIB, UTC+7). I work remotely with teams anywhere, and my systems are built to run without me watching them.",
  },
];
