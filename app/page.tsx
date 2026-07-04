import Image from "next/image";
import Typewriter from "./typewriter";
import FadeIn from "./fade-in";

type Experience = {
  role: string;
  company: string;
  period: string;
  place: string;
  detail?: string;
};

const experience: Experience[] = [
  {
    role: "Founder",
    company: "MAJI",
    period: "2023 — Now",
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
  },
  {
    role: "Commercial Lead & Digital Marketing Manager",
    company: "Visval",
    period: "2021 — 2022",
    place: "Bandung",
  },
  {
    role: "Founder",
    company: "AS GOOD SUPPLY CO",
    period: "2012 — 2021",
    place: "Bandung",
  },
];

const ERP_DEMO_URL = "https://erp.herin.id/login?embed=1&callbackUrl=%2F";

const erpFunctions = [
  "Sales workflow: quotations, orders, delivery, invoices, payments, and returns.",
  "Purchasing workflow: purchase requests, purchase orders, goods receipt, vendor bills, and payments.",
  "Inventory control: item master, warehouses, stock cards, transfers, stock counts, and adjustments.",
  "Accounting engine: journal posting, receivables, payables, cash and bank, general ledger, and profit & loss.",
];

const erpAdvantages = [
  "One source of truth across sales, purchasing, inventory, and finance.",
  "Operational documents automatically flow into stock movement and accounting records.",
  "Management dashboards show activity, due dates, sales trends, cash flow, expenses, and profitability.",
  "Built for teams that need cleaner controls, faster reconciliation, and fewer spreadsheet handoffs.",
];

const waMetrics = [
  { label: "Revenue from chat", value: "$42,870", delta: "+18.4%" },
  { label: "Paid orders", value: "684", delta: "+11.2%" },
  { label: "AI-handled chats", value: "86%", delta: "+9.5%" },
  { label: "Median first reply", value: "00:42", delta: "-31%" },
];

const waFunnel = [
  { label: "New conversations", value: "4,820", width: "100%" },
  { label: "Qualified buyers", value: "2,390", width: "64%" },
  { label: "Carts created", value: "1,104", width: "38%" },
  { label: "Paid orders", value: "684", width: "24%" },
];

const waCampaigns = [
  {
    name: "Restock alert",
    audience: "1,840",
    revenue: "$13,420",
    status: "Live",
  },
  {
    name: "Cart recovery",
    audience: "912",
    revenue: "$8,760",
    status: "Auto",
  },
  {
    name: "VIP payday drop",
    audience: "620",
    revenue: "$6,210",
    status: "Queued",
  },
];

const waMessages = [
  {
    sender: "Customer",
    text: "Is the travel bundle still available in black?",
    time: "09:42",
  },
  {
    sender: "AI Agent",
    text: "Yes. I can reserve it for 30 minutes and send the checkout link.",
    time: "09:42",
  },
  {
    sender: "Customer",
    text: "Send it. I want 2 pcs.",
    time: "09:43",
  },
  {
    sender: "AI Agent",
    text: "Done. Total is $118.00. Payment link is ready.",
    time: "09:43",
  },
];

const waProducts = [
  { name: "Travel Bundle", orders: "212", revenue: "$12.5K" },
  { name: "Daily Set", orders: "184", revenue: "$9.8K" },
  { name: "Mini Refill", orders: "143", revenue: "$5.7K" },
];

const services = [
  {
    title: "AI Automation & Agent Orchestration",
    desc: "Multi-agent AI systems that can weigh a decision, not just follow rules — running around the clock, monitored, and accountable.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="2"/>
        <circle cx="16" cy="30" r="3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="32" cy="30" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M24 23v4M19 30l-4 4M29 30l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M13 18l6-2M35 18l-6-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Full-Stack App Development",
    desc: "Web apps, dashboards, and internal tools built end-to-end — from database and architecture to production and monitoring.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 18h32M18 8v36" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 13h2M14 16h2M26 30l3 3-3 3M30 33h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "ERP & Accounting Systems",
    desc: "From transaction records to a ledger that balances. Systems that follow the business flow, not the other way around.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <rect x="10" y="6" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 15h28M10 24h28M10 33h28" stroke="currentColor" strokeWidth="2"/>
        <path d="M22 15v18M26 15v18" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    title: "WhatsApp Commerce & AI Chatbots",
    desc: "Selling and serving customers where they already are — with agents that know their limits.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <path d="M8 40V8a4 4 0 0 1 4-4h14l14 14v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" stroke="currentColor" strokeWidth="2"/>
        <path d="M26 4v14h14" stroke="currentColor" strokeWidth="2"/>
        <path d="M18 28v4M22 26v6M26 24v8M30 27v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Performance Marketing & Ads",
    desc: "Meta, Google, TikTok, and Shopee ads — tens of billions of rupiah managed at a 15–20× average ROAS.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <path d="M8 40V20l12-12 8 8 12-12v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="18" cy="30" r="2" fill="currentColor"/>
        <circle cx="26" cy="24" r="2" fill="currentColor"/>
        <circle cx="34" cy="14" r="2" fill="currentColor"/>
        <path d="M18 30l8-6 8-10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    title: "Dashboards & Analytics",
    desc: "Numbers from many sources, unified and presented so they're fast to read — and right.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <rect x="4" y="10" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 24h40" stroke="currentColor" strokeWidth="2"/>
        <circle cx="14" cy="20" r="3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="34" cy="30" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 23v12M34 27v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function SectionLabel({ no, title }: { no: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 text-sm tracking-widest uppercase text-faint">
      <span className="text-accent font-medium">{no}</span>
      <span>{title}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 sm:px-10">
      {/* Nav */}
      <header className="flex items-center justify-end py-8 text-sm">
        <nav className="flex gap-6 text-soft">
          <a href="#demo" className="hover:text-ink transition-colors">
            Demo
          </a>
          <a href="#wa-commerce" className="hover:text-ink transition-colors">
            WA Commerce
          </a>
          <a href="#contact" className="hover:text-ink transition-colors">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-12 sm:pt-28 sm:pb-14">
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[1.1] tracking-tight">
          <span className="inline-block">
            <Typewriter
              words={["Hello.", "Halo.", "Bonjour.", "Hola.", "こんにちは."]}
              className="text-accent"
            />
          </span>
          <br />
          <span className="text-ink">
            I&apos;m Herin Yudha Pratama
          </span>
        </h1>
      </section>

      {/* About */}
      <section className="border-t border-line py-24 grid gap-10 sm:grid-cols-[200px_1fr_auto]">
        <SectionLabel no="01" title="About" />
        <div className="max-w-xl space-y-6 text-lg leading-relaxed">
          <p>
            I spent fourteen years on the business side — founding AS GOOD
            SUPPLY CO and running it for nearly a decade, then leading
            commercial at consumer brands, running the full org: offline
            stores, online store &amp; marketplace, digital marketing, CRM,
            KOL, and content teams.
          </p>
          <p>
            Performance marketing is home ground — tens of billions of rupiah
            deployed across Meta, Google, TikTok, and Shopee ads at a 15–20×
            average ROAS. Somewhere along the way I started building the
            systems my teams needed, and never stopped.
          </p>
          <p className="text-soft">
            Today I build operational software: ERP and accounting platforms,
            WhatsApp commerce, dashboards, and AI agents that work around the
            clock. My approach is simple — understand the business flow first,
            then write the code. The tools change; the goal doesn&apos;t:
            systems that quietly do their job every day.
          </p>
        </div>
        <Image
          src="/herin.jpg"
          alt="Herin Yudha Pratama"
          width={400}
          height={400}
          priority={false}
          className="w-44 sm:w-56 lg:w-64 aspect-square rounded-full object-cover -order-1 sm:order-none"
        />
      </section>

      {/* Live Demo */}
      <section
        id="demo"
        className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-line bg-[#f4f6f3] py-10 sm:py-12"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionLabel no="02" title="Interactive Demo" />
            <a
              href="/demo/erp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-accent bg-accent px-4 py-2 text-sm font-medium text-paper shadow-[0_18px_40px_-24px_rgba(180,83,10,0.9)] transition-colors hover:bg-ink hover:border-ink"
            >
              Interactive ERP demo
              <span
                aria-hidden="true"
                className="inline-block animate-[demo-arrow_1s_ease-in-out_infinite] text-lg leading-none"
              >
                →
              </span>
            </a>
          </div>

          <div className="relative mt-8">
            <div className="overflow-hidden rounded-lg border border-[#d7d9d0] bg-white shadow-[0_26px_90px_-42px_rgba(28,25,23,0.55)]">
              <div className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 text-sm">
                <span className="flex shrink-0 gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                </span>
                <span className="min-w-0 flex-1 truncate border border-line bg-paper px-3 py-1 text-center text-xs text-soft">
                  https://<span className="text-ink">erp.herin.id</span>
                </span>
                <a
                  href="/demo/erp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 border-b border-line pb-0.5 text-xs text-soft transition-colors hover:border-accent hover:text-accent"
                >
                  Full screen
                </a>
              </div>
              <iframe
                src={ERP_DEMO_URL}
                title="Interactive ERP demo"
                loading="eager"
                allow="clipboard-write"
                className="h-[74vh] min-h-[620px] w-full bg-white"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                What this ERP does.
              </h2>
              <p className="mt-4 leading-relaxed text-soft">
                Signatech ERP is an operations and accounting system for teams
                that need every transaction to connect: from customer orders and
                warehouse movement to vendor bills, cash flow, and financial
                reports.
              </p>
            </div>
            <div className="grid gap-6 text-sm leading-relaxed sm:grid-cols-2">
              <div>
                <h3 className="font-display text-lg text-ink">
                  Core functions
                </h3>
                <ul className="mt-3 space-y-2 text-soft">
                  {erpFunctions.map((item) => (
                    <li key={item} className="border-t border-line pt-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-lg text-ink">
                  Why it matters
                </h3>
                <ul className="mt-3 space-y-2 text-soft">
                  {erpAdvantages.map((item) => (
                    <li key={item} className="border-t border-line pt-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WA Commerce Dashboard */}
      <section
        id="wa-commerce"
        className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-[#29463c] bg-[#10251f] py-12 text-[#f9f6ee] sm:py-14"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <div className="flex items-baseline gap-3 text-sm uppercase tracking-widest text-[#9fb8aa]">
                <span className="font-medium text-[#f4b66f]">03</span>
                <span>WA Commerce Dashboard</span>
              </div>
              <h2 className="mt-5 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
                WhatsApp commerce, measured like a real storefront.
              </h2>
            </div>
            <p className="max-w-2xl leading-relaxed text-[#cbd8d0] lg:justify-self-end">
              A dummy operating dashboard for chat-led selling: campaign
              broadcasts, AI replies, checkout links, cart recovery, handoffs,
              and revenue attribution from WhatsApp conversations.
            </p>
          </div>

          <div className="mt-8 overflow-hidden border border-white/15 bg-[#f9f6ee] text-[#17211c] shadow-[0_28px_100px_-46px_rgba(0,0,0,0.7)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9dfd8] bg-white px-4 py-3">
              <div>
                <p className="font-display text-xl">WA Commerce Control Room</p>
                <p className="text-xs uppercase tracking-widest text-[#6f7d74]">
                  Demo data · Last 30 days
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#446457]">
                <span className="h-2 w-2 rounded-full bg-[#25d366]" />
                AI agent online
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.28fr_0.72fr]">
              <div className="border-b border-[#d9dfd8] lg:border-b-0 lg:border-r">
                <div className="grid sm:grid-cols-4">
                  {waMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="border-b border-r border-[#d9dfd8] p-4 last:border-r-0 sm:border-b-0"
                    >
                      <p className="text-xs uppercase tracking-widest text-[#7b857f]">
                        {metric.label}
                      </p>
                      <p className="mt-3 font-display text-2xl">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-xs text-[#147044]">
                        {metric.delta}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="border-b border-[#d9dfd8] p-5 lg:border-b-0 lg:border-r">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-xl">Sales funnel</h3>
                      <span className="text-xs text-[#7b857f]">WhatsApp</span>
                    </div>
                    <div className="mt-5 space-y-4">
                      {waFunnel.map((step) => (
                        <div key={step.label}>
                          <div className="flex items-center justify-between text-sm">
                            <span>{step.label}</span>
                            <span className="font-medium">{step.value}</span>
                          </div>
                          <div className="mt-2 h-2 bg-[#dfe6df]">
                            <div
                              className="h-full bg-[#25d366]"
                              style={{ width: step.width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-xl">Campaigns</h3>
                      <span className="text-xs text-[#7b857f]">Revenue</span>
                    </div>
                    <div className="mt-4 divide-y divide-[#d9dfd8]">
                      {waCampaigns.map((campaign) => (
                        <div
                          key={campaign.name}
                          className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="mt-1 text-xs text-[#7b857f]">
                              {campaign.audience} recipients · {campaign.status}
                            </p>
                          </div>
                          <p className="font-display text-lg">
                            {campaign.revenue}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="bg-[#eef5ef]">
                <div className="border-b border-[#d9dfd8] p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-xl">Live chat</h3>
                    <span className="text-xs text-[#7b857f]">Auto-checkout</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {waMessages.map((message) => (
                      <div
                        key={`${message.sender}-${message.time}-${message.text}`}
                        className={
                          message.sender === "AI Agent"
                            ? "ml-8 border border-[#b9d6c4] bg-[#dff4e6] p-3"
                            : "mr-8 border border-[#d6ded8] bg-white p-3"
                        }
                      >
                        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#7b857f]">
                          <span>{message.sender}</span>
                          <span>{message.time}</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-xl">Top products</h3>
                  <div className="mt-4 divide-y divide-[#d1ddd3]">
                    {waProducts.map((product) => (
                      <div
                        key={product.name}
                        className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-[#7b857f]">
                            {product.orders} orders
                          </p>
                        </div>
                        <p className="font-display text-lg">{product.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-line py-24 grid gap-10 sm:grid-cols-[200px_1fr]">
        <SectionLabel no="04" title="Experience" />
        <div className="divide-y divide-line">
          {experience.map((e) => (
            <div key={e.role + e.company} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <div>
                  <span className="text-lg">{e.role}</span>
                  <span className="text-soft"> — {e.company}</span>
                </div>
                <span className="text-sm text-faint tabular-nums">
                  {e.period}
                </span>
              </div>
              {e.detail && (
                <p className="mt-2 max-w-xl text-sm text-soft leading-relaxed">
                  {e.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* What I Do */}
      <section className="border-t border-line py-24">
        <SectionLabel no="05" title="What I Do" />
        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={i * 100}>
              <div className="group">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 text-accent transition-colors group-hover:text-ink">
                    {s.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-xl">{s.title}</h3>
                    <p className="mt-2 text-sm text-soft leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-line py-24 sm:py-32">
        <SectionLabel no="06" title="Contact" />
        <p className="mt-12 max-w-xl text-lg text-soft leading-relaxed">
          Let&apos;s work together.
        </p>
        <a
          href="mailto:hello@herin.id"
          className="mt-6 inline-block font-display text-3xl sm:text-5xl hover:text-accent transition-colors break-all"
        >
          hello@herin.id
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-10 flex flex-wrap justify-between gap-4 text-sm text-faint">
        <span>© {new Date().getFullYear()} Herin Yudha Pratama</span>
      </footer>
    </main>
  );
}
