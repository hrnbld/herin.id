// Single source of truth for the machine-readable profile served by the
// MCP endpoint (app/api/[transport]/route.ts). Human-facing copy lives in
// app/page.tsx and public/llms.txt — keep the three in sync when the
// story changes.

export const profile = {
  name: "Herin Yudha Pratama",
  title: "Full-stack engineer & systems architect",
  location: "Bandung, Indonesia",
  timezone: "WIB (UTC+7)",
  languages: ["English", "Bahasa Indonesia"],
  site: "https://herin.id",
  email: "hello@herin.id",
  linkedin: "https://www.linkedin.com/in/herinyudha",
  summary:
    "Fourteen years on the business side — founder, commercial lead, head of commercial — now designing and building business-critical software for operations, commerce, and AI automation. Approach: understand the business flow first, then write the code. The tools change; the goal doesn't: systems that quietly do their job every day.",
  remote: "Works remotely with teams anywhere.",
};

export const trackRecord = {
  adsSpend: "Over a million dollars deployed across Meta, Google, TikTok, and Shopee ads",
  averageRoas: "15–20×",
  commercialLeadership:
    "Led full commercial orgs at consumer brands: offline stores, online store & marketplace, digital marketing, CRM, KOL, and content teams.",
  yearsOperating: 14,
};

export const experience = [
  {
    role: "Founder",
    company: "MAJI",
    period: "2023 — now",
    place: "Bandung",
  },
  {
    role: "Head of Commercial",
    company: "Paddy Indonesia",
    period: "2024 — 2026",
    place: "Bandung",
    detail:
      "Led the full commercial org — offline stores, online store & marketplace, digital marketing, CRM, KOL, and content teams.",
  },
  {
    role: "Marketing Manager",
    company: "PORTEE",
    period: "2023 — 2024",
    place: "Bandung",
    detail:
      "Led the full commercial org — offline stores, online store & marketplace, digital marketing, CRM, KOL, and content teams.",
  },
  {
    role: "Commercial Lead & Digital Marketing Manager",
    company: "Visval",
    period: "2021 — 2022",
    place: "Bandung",
    detail:
      "Managed online store & marketplace, digital marketing, CRM, and KOL strategy.",
  },
  {
    role: "Founder",
    company: "AS GOOD SUPPLY CO",
    period: "2012 — 2021",
    place: "Bandung",
  },
];

export const services = [
  {
    title: "AI Automation & Agent Orchestration",
    desc: "Multi-agent AI systems that can weigh a decision, not just follow rules — running around the clock, monitored, and accountable.",
  },
  {
    title: "Full-Stack App Development",
    desc: "Web apps, dashboards, and internal tools built end-to-end — from database and architecture to production and monitoring.",
  },
  {
    title: "ERP & Accounting Systems",
    desc: "From transaction records to a ledger that balances. Systems that follow the business flow, not the other way around.",
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
    desc: "Live double-entry ERP with safe dummy data: sales, purchasing, and inventory flow straight into stock movement and accounting records — journal posting, AR/AP, cash and bank, general ledger, P&L, and management dashboards.",
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
    a: "Operational software: ERP and accounting platforms, WhatsApp commerce systems, dashboards, and AI agents that run around the clock. End to end — database, architecture, code, deployment, and monitoring.",
  },
  {
    q: "Are the demos on this site real?",
    a: "Yes. Both demos are live software running in production infrastructure — the same systems, isolated with safe dummy data. Click around; nothing you do touches real customers.",
  },
  {
    q: "How do we work together?",
    a: "Business flow first, code second. We map how your operation actually runs, agree on a small scope that matters, ship it, and iterate. You get working software early — not a slide deck.",
  },
  {
    q: "Can you handle the marketing side too?",
    a: "That's home ground. Fourteen years on the commercial side — over a million dollars deployed across Meta, Google, TikTok, and Shopee ads at a 15–20× average ROAS.",
  },
  {
    q: "Where are you based?",
    a: "Bandung, Indonesia (WIB, UTC+7). I work remotely with teams anywhere, and my systems are built to run without me watching them.",
  },
];
