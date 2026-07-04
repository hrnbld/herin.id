import Image from "next/image";
import FadeIn from "./fade-in";
import CountUp from "./count-up";
import Typewriter from "./typewriter";
import Accordion, { type QA } from "./accordion";

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
    detail:
      "Building a product company from zero — brand, operations, and every system underneath it.",
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
    detail:
      "Founded and ran an apparel supply business for nearly a decade — production, wholesale, and retail.",
  },
];

const ERP_DEMO_URL = "https://erp.herin.id/login?embed=1&callbackUrl=%2F";
const WA_DEMO_URL = "https://wa-commerce-demo-herin.vercel.app/dashboard";

const brands = [
  "MAJI",
  "Paddy Indonesia",
  "PORTEE",
  "Visval",
  "AS GOOD SUPPLY CO",
];

const erpChecks = [
  "Sales, purchasing, and inventory flow straight into stock movement and accounting records.",
  "Journal posting, receivables, payables, cash and bank, general ledger, and profit & loss.",
  "Management dashboards for activity, due dates, sales trends, cash flow, and profitability.",
];

const erpChips = ["Sales", "Purchasing", "Inventory", "Accounting", "Reports"];

const waChecks = [
  "Unified WhatsApp inbox with customer context, labels, and AI-to-human handoff.",
  "Broadcasts for restock alerts, cart recovery, VIP drops, segmentation, and scheduling.",
  "Commerce analytics: chat revenue, paid orders, buyer funnel, response speed, and campaign ROI.",
];

const services = [
  {
    label: "AI Automation",
    title: "AI Automation & Agent Orchestration",
    desc: "Multi-agent AI systems that can weigh a decision, not just follow rules — running around the clock, monitored, and accountable.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
        <circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 23v4M19 30l-4 4M29 30l4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13 18l6-2M35 18l-6-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Full-Stack",
    title: "Full-Stack App Development",
    desc: "Web apps, dashboards, and internal tools built end-to-end — from database and architecture to production and monitoring.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
        <rect
          x="8"
          y="8"
          width="32"
          height="32"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M8 18h32M18 8v36" stroke="currentColor" strokeWidth="2" />
        <path
          d="M14 13h2M14 16h2M26 30l3 3-3 3M30 33h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "ERP",
    title: "ERP & Accounting Systems",
    desc: "From transaction records to a ledger that balances. Systems that follow the business flow, not the other way around.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
        <rect
          x="10"
          y="6"
          width="28"
          height="36"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M10 15h28M10 24h28M10 33h28" stroke="currentColor" strokeWidth="2" />
        <path
          d="M22 15v18M26 15v18"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 2"
        />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    title: "WhatsApp Commerce & AI Chatbots",
    desc: "Selling and serving customers where they already are — with agents that know their limits.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
        <path
          d="M8 40V8a4 4 0 0 1 4-4h14l14 14v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M26 4v14h14" stroke="currentColor" strokeWidth="2" />
        <path
          d="M18 28v4M22 26v6M26 24v8M30 27v5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Ads",
    title: "Performance Marketing & Ads",
    desc: "Meta, Google, TikTok, and Shopee ads — tens of billions of rupiah managed at a 15–20× average ROAS.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
        <path
          d="M8 40V20l12-12 8 8 12-12v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="30" r="2" fill="currentColor" />
        <circle cx="26" cy="24" r="2" fill="currentColor" />
        <circle cx="34" cy="14" r="2" fill="currentColor" />
        <path d="M18 30l8-6 8-10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    title: "Dashboards & Analytics",
    desc: "Numbers from many sources, unified and presented so they're fast to read — and right.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-6 w-6">
        <rect
          x="4"
          y="10"
          width="40"
          height="28"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M4 24h40" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="34" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M14 23v12M34 27v7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const faqs: QA[] = [
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
    a: "That's home ground. Fourteen years on the commercial side — tens of billions of rupiah deployed across Meta, Google, TikTok, and Shopee ads at a 15–20× average ROAS.",
  },
  {
    q: "Where are you based?",
    a: "Bandung, Indonesia (WIB, UTC+7). I work remotely with teams anywhere, and my systems are built to run without me watching them.",
  },
];

function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="mt-1 h-3.5 w-3.5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Eyebrow({
  children,
  tone = "soft",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "soft" | "accent";
  className?: string;
}) {
  return (
    <p
      className={`text-xs tracking-wide ${
        tone === "accent" ? "text-accent-soft" : "text-faint"
      } ${className}`}
    >
      {children}
    </p>
  );
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-white">
        H
      </span>
      <span className="text-sm font-semibold tracking-tight text-ink">
        Herin
      </span>
    </a>
  );
}

function BrowserCard({
  url,
  fullHref,
  children,
  className = "",
}: {
  url: string;
  fullHref: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-white/[0.04] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5 text-xs">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full border border-line bg-white/[0.04] px-3 py-1 text-center text-soft">
          {url}
        </span>
        <a
          href={fullHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-soft transition-colors hover:text-ink"
        >
          Full screen ↗
        </a>
      </div>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="p-3 sm:p-4" id="top">
      <div className="relative overflow-hidden rounded-[24px] bg-canvas text-ink sm:rounded-[28px]">
        {/* Hero */}
        <section className="relative overflow-hidden pt-24 sm:pt-32">
          <Image
            src="/textures/rock-3.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover object-top opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,transparent_30%,#0d0b0a_100%)]" />
          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn className="flex flex-col items-center text-center">
              <h1 className="max-w-3xl text-4xl font-light leading-[1.12] tracking-tight text-ink sm:text-6xl">
                <Typewriter
                  words={["Hello.", "Halo.", "Bonjour.", "Hola.", "こんにちは."]}
                  className="text-accent-soft"
                />
                <br />
                I&apos;m Herin Yudha Pratama
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-soft sm:text-base">
                I design and build business-critical software for operations,
                commerce, and AI automation.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#erp"
                  className="rounded-full border border-line bg-white/[0.05] px-5 py-2.5 text-sm text-ink backdrop-blur-sm transition-colors hover:bg-white/[0.1]"
                >
                  Try the live demos
                </a>
                <a
                  href="mailto:hello@herin.id"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0d0b0a] transition-colors hover:bg-white/85"
                >
                  Get in touch
                </a>
              </div>
            </FadeIn>

            {/* Brand marquee */}
            <div className="pt-14 pb-10 sm:pt-16 sm:pb-12">
              <p className="text-center text-xs text-faint">
                Brands I&apos;ve founded, built, and led
              </p>
              <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                <div className="animate-marquee flex w-max items-center gap-14 pr-14">
                  {[...brands, ...brands].map((b, i) => (
                    <span
                      key={b + i}
                      className="whitespace-nowrap text-lg font-semibold tracking-tight text-white/35"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About / quote band */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn>
              <Eyebrow>About</Eyebrow>
              <h2 className="mt-4 max-w-xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Fourteen years on the business side,{" "}
                <span className="text-soft">written into code.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-soft">
                When the operation and the software are designed by the same
                person, the seams disappear.
              </p>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="relative mt-10 overflow-hidden rounded-3xl border border-line">
                <Image
                  src="/textures/rock-1.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(13,11,10,0.92)_20%,rgba(13,11,10,0.55)_60%,rgba(13,11,10,0.85))]" />
                <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-[1.5fr_auto]">
                  <div>
                    <p className="max-w-xl text-lg font-medium leading-relaxed text-ink sm:text-2xl">
                      &ldquo;I founded and ran brands for fourteen years before
                      I wrote production code. Somewhere along the way I
                      started building the systems my teams needed — and never
                      stopped. Understand the business flow first, then write
                      the code.&rdquo;
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                      <Image
                        src="/herin.jpg"
                        alt="Herin Yudha Pratama"
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover grayscale"
                      />
                      <div className="text-xs">
                        <p className="font-medium text-ink">
                          Herin Yudha Pratama
                        </p>
                        <p className="mt-0.5 text-soft">
                          Founder, MAJI — Bandung, Indonesia
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-10 lg:flex-col lg:justify-center lg:gap-8">
                    <div>
                      <p className="text-3xl font-light tracking-tight text-ink sm:text-4xl">
                        <CountUp value={20} prefix="15–" suffix="×" />
                      </p>
                      <p className="mt-1 max-w-[140px] text-xs leading-relaxed text-soft">
                        Average ROAS across Meta, Google, TikTok &amp; Shopee
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-light tracking-tight text-ink sm:text-4xl">
                        <CountUp value={10} prefix="Rp" suffix="B+" />
                      </p>
                      <p className="mt-1 max-w-[140px] text-xs leading-relaxed text-soft">
                        Ad spend deployed and managed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ERP demo section */}
        <section id="erp" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <FadeIn>
                <Eyebrow tone="accent">ERP &amp; Accounting — live demo</Eyebrow>
                <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                  From transaction records{" "}
                  <span className="text-soft">to a ledger that balances.</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-soft">
                  Signatech ERP connects every transaction: customer orders,
                  warehouse movement, vendor bills, cash flow, and financial
                  reports — one source of truth.
                </p>
                <ul className="mt-6">
                  {erpChecks.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-b border-line py-3 text-sm text-soft first:pt-0"
                    >
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2">
                  {erpChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-line bg-white/[0.04] px-3.5 py-1.5 text-xs text-soft"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <a
                  href="/demo/erp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0d0b0a] transition-colors hover:bg-white/85"
                >
                  Open full ERP demo
                  <span
                    aria-hidden="true"
                    className="inline-block animate-[demo-arrow_1s_ease-in-out_infinite]"
                  >
                    →
                  </span>
                </a>
              </FadeIn>
              <FadeIn delay={120}>
                <div className="relative overflow-hidden rounded-3xl border border-line">
                  <Image
                    src="/textures/rock-2.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(13,11,10,0.75),rgba(13,11,10,0.92))]" />
                  <div className="relative p-6 sm:p-8">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                      <p className="text-xs font-medium text-ink">
                        Why teams switch to it
                      </p>
                      <ul className="mt-4 space-y-3 text-xs leading-relaxed text-soft">
                        <li className="flex gap-2.5">
                          <Check />
                          Operational documents automatically become stock
                          movement and journal entries.
                        </li>
                        <li className="flex gap-2.5">
                          <Check />
                          Cleaner controls, faster reconciliation, fewer
                          spreadsheet handoffs.
                        </li>
                        <li className="flex gap-2.5">
                          <Check />
                          Built for Indonesian business flows — from faktur to
                          general ledger.
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Quotation → Order", "Goods receipt", "GL posting", "P&L"].map(
                        (chip) => (
                          <span
                            key={chip}
                            className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-soft backdrop-blur-sm"
                          >
                            {chip}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={150}>
              <BrowserCard
                url="erp.herin.id"
                fullHref="/demo/erp"
                className="mt-12"
              >
                <iframe
                  src={ERP_DEMO_URL}
                  title="Interactive ERP demo"
                  loading="lazy"
                  allow="clipboard-write"
                  className="h-[62vh] min-h-[520px] w-full bg-white"
                />
              </BrowserCard>
            </FadeIn>
          </div>
        </section>

        {/* WA Commerce section */}
        <section id="wa" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn className="text-center">
              <Eyebrow tone="accent">Automation — live demo</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                WhatsApp becomes{" "}
                <span className="text-soft">a measurable sales channel.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-soft">
                A real WhatsApp commerce dashboard with safe dummy data — AI
                replies, campaign automation, checkout links, and human
                takeover in one operating view.
              </p>
            </FadeIn>
            <FadeIn delay={120}>
              <BrowserCard
                url="wa-commerce-demo-herin.vercel.app"
                fullHref={WA_DEMO_URL}
                className="mt-10"
              >
                <iframe
                  src={WA_DEMO_URL}
                  title="Interactive WA Commerce dashboard demo"
                  className="h-[560px] w-full border-0 bg-[#f8f9fc]"
                  loading="lazy"
                  allow="clipboard-read; clipboard-write"
                />
              </BrowserCard>
            </FadeIn>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {waChecks.map((item, i) => (
                <FadeIn key={item} delay={i * 100}>
                  <div className="flex gap-3 text-sm leading-relaxed text-soft">
                    <Check />
                    {item}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Experience rail */}
        <section id="experience" className="scroll-mt-24 py-16 sm:py-24">
          <FadeIn className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <h2 className="mx-auto max-w-xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              And that&apos;s not everything I&apos;ve built.
            </h2>
            <p className="mt-3 text-xs text-faint">
              Fourteen years across brands, commerce, and systems
            </p>
          </FadeIn>
          <div className="rail mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-[max(1.25rem,calc((100vw-64rem)/2))]">
            {experience.map((e) => (
              <div
                key={e.role + e.company}
                className="glow-top flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-3xl border border-line bg-card p-6 sm:w-[340px]"
              >
                <p className="text-sm leading-relaxed text-soft">{e.detail}</p>
                <div className="mt-8 border-t border-line pt-4">
                  <p className="text-sm font-medium text-ink">{e.company}</p>
                  <p className="mt-1 text-xs text-soft">{e.role}</p>
                  <p className="mt-1 text-xs text-faint tabular-nums">
                    {e.period} · {e.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn className="text-center">
              <Eyebrow>What I do</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Systems that make{" "}
                <span className="text-soft">your operation smarter.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-soft">
                From ideas to production — I design, build, and run the
                software layer of a business.
              </p>
            </FadeIn>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <FadeIn key={s.title} delay={(i % 3) * 100}>
                  <div className="glow-top group h-full rounded-3xl border border-line bg-card p-6 transition-colors hover:border-white/15">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/[0.04] text-accent-soft transition-colors group-hover:text-accent">
                      {s.icon}
                    </span>
                    <Eyebrow tone="accent" className="mt-5">
                      {s.label}
                    </Eyebrow>
                    <h3 className="mt-1.5 text-base font-medium text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-soft">
                      {s.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <FadeIn className="text-center">
              <Eyebrow>FAQs</Eyebrow>
              <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Got questions? I&apos;ve got answers.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-soft">
                How I work, what the demos are, and what it&apos;s like to
                build with me.
              </p>
            </FadeIn>
            <FadeIn delay={100} className="mt-10">
              <Accordion items={faqs} />
            </FadeIn>
          </div>
        </section>

        {/* CTA + footer */}
        <section id="contact" className="relative overflow-hidden pt-16 sm:pt-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn className="text-center">
              <h2 className="mx-auto max-w-xl text-3xl font-light leading-tight tracking-tight sm:text-5xl">
                Let&apos;s build systems{" "}
                <span className="text-soft">that quietly do their job.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-soft">
                From first conversation to software in production — everything
                designed around how your business actually runs.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#erp"
                  className="rounded-full border border-line bg-white/[0.05] px-5 py-2.5 text-sm text-ink transition-colors hover:bg-white/[0.1]"
                >
                  Try the demos
                </a>
                <a
                  href="mailto:hello@herin.id"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0d0b0a] transition-colors hover:bg-white/85"
                >
                  hello@herin.id
                </a>
              </div>
            </FadeIn>

            <footer className="mt-16 border-t border-line pt-10 sm:mt-20">
              <div className="grid gap-10 pb-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                  <Logo />
                  <p className="mt-4 max-w-[230px] text-xs leading-relaxed text-faint">
                    Business-critical software for operations, commerce, and AI
                    automation — designed and built in Bandung.
                  </p>
                  <p className="mt-4 text-[11px] text-faint">
                    © {new Date().getFullYear()} Herin Yudha Pratama.
                  </p>
                </div>
                <div className="text-xs">
                  <p className="text-faint">Menu</p>
                  <ul className="mt-3 space-y-2.5 text-soft">
                    <li>
                      <a href="#services" className="hover:text-ink">
                        Services
                      </a>
                    </li>
                    <li>
                      <a href="#experience" className="hover:text-ink">
                        Experience
                      </a>
                    </li>
                    <li>
                      <a href="#faq" className="hover:text-ink">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="text-xs">
                  <p className="text-faint">Live demos</p>
                  <ul className="mt-3 space-y-2.5 text-soft">
                    <li>
                      <a
                        href="/demo/erp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ink"
                      >
                        Signatech ERP
                      </a>
                    </li>
                    <li>
                      <a
                        href={WA_DEMO_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-ink"
                      >
                        WA Commerce
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="text-xs">
                  <p className="text-faint">Contact</p>
                  <ul className="mt-3 space-y-2.5 text-soft">
                    <li>
                      <a href="mailto:hello@herin.id" className="hover:text-ink">
                        hello@herin.id
                      </a>
                    </li>
                    <li>Bandung, Indonesia</li>
                  </ul>
                </div>
                <div className="text-xs">
                  <p className="text-faint">Social</p>
                  <ul className="mt-3 space-y-2.5 text-soft">
                    <li>
                      <a
                        href="https://www.instagram.com/monarkhi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-ink"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.threads.com/monarkhi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-ink"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 7c-3 0-4 5-4 5s1 5 4 5 4-5 4-5-1-5-4-5z"/>
                          <path d="M8 12h8"/>
                        </svg>
                        Threads
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.facebook.com/herinbleed"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-ink"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.linkedin.com/in/herinyudha"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-ink"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                          <rect x="2" y="9" width="4" height="12"/>
                          <circle cx="4" cy="4" r="2"/>
                        </svg>
                        LinkedIn
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </footer>
          </div>

          {/* Giant watermark over warm rust glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative select-none"
          >
            <div className="absolute -bottom-[8vw] left-0 h-[30vw] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(122,70,48,0.5),transparent)] blur-2xl" />
            <p className="relative -mb-[0.34em] bg-[linear-gradient(180deg,rgba(190,140,115,0.45),rgba(201,79,43,0.06))] bg-clip-text text-center text-[26vw] font-medium leading-none tracking-tight text-transparent">
              Herin
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
