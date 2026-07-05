import Image from "next/image";
import FadeIn from "./fade-in";
import CountUp from "./count-up";
import Typewriter from "./typewriter";
import Aurora from "./aurora";
import SilkBg from "./silk-bg";
import Lens from "./lens";
import LiquidStats from "./liquid-stats";
import LocationCard from "./location-card";
import GlassFx from "./glass-fx";
import WordReveal from "./word-reveal";
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
    desc: "Meta, Google, TikTok, and Shopee ads — over a million dollars managed at a 15–20× average ROAS.",
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
    a: "That's home ground. Fourteen years on the commercial side — over a million dollars deployed across Meta, Google, TikTok, and Shopee ads at a 15–20× average ROAS.",
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
    <div id="top" className="relative">
      <Aurora />
      <SilkBg />
      <div aria-hidden="true" className="grain" />
      <Lens />
      <GlassFx />
      <div className="relative z-10 overflow-hidden text-ink">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 sm:pt-24">
          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn>
              <div className="glass mx-auto flex max-w-3xl flex-col items-center px-6 py-12 text-center sm:px-14 sm:py-16">
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
            <div className="glass p-7 sm:p-12">
            <FadeIn>
              <Eyebrow>About</Eyebrow>
              <h2 className="mt-4 max-w-xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                <WordReveal
                  segments={[
                    { text: "Fourteen years on the business side." },
                  ]}
                />
              </h2>
            </FadeIn>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_auto] lg:items-start">
              <FadeIn
                delay={100}
                className="max-w-xl space-y-6 text-base leading-relaxed text-soft"
              >
                <p>
                  I spent fourteen years on the business side — founding AS
                  GOOD SUPPLY CO and running it for nearly a decade, then
                  leading commercial at consumer brands, running the full org:
                  offline stores, online store &amp; marketplace, digital
                  marketing, CRM, KOL, and content teams.
                </p>
                <p>
                  Performance marketing is home ground — over a million
                  dollars deployed across Meta, Google, TikTok, and Shopee ads
                  at a 15–20× average ROAS. Somewhere along the way I started
                  building the systems my teams needed, and never stopped.
                </p>
                <p className="text-faint">
                  Today I build operational software: ERP and accounting
                  platforms, WhatsApp commerce, dashboards, and AI agents that
                  work around the clock. My approach is simple — understand
                  the business flow first, then write the code. The tools
                  change; the goal doesn&apos;t: systems that quietly do their
                  job every day.
                </p>
              </FadeIn>
              <FadeIn
                delay={200}
                className="flex items-center justify-center lg:justify-start"
              >
                <Image
                  src="/herin.jpg"
                  alt="Herin Yudha Pratama"
                  width={400}
                  height={400}
                  className="aspect-square w-40 rounded-full object-cover sm:w-52"
                />
              </FadeIn>
            </div>
            <FadeIn delay={250} className="mt-10">
              <LiquidStats />
            </FadeIn>
            </div>
          </div>
        </section>

        {/* ERP demo section */}
        <section id="erp" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <FadeIn className="text-center">
              <Eyebrow tone="accent">ERP &amp; Accounting — live demo</Eyebrow>
            </FadeIn>
            <FadeIn delay={80}>
              <BrowserCard
                url="erp.herin.id"
                fullHref="/demo/erp"
                className="mt-6"
              >
                <iframe
                  src={ERP_DEMO_URL}
                  title="Interactive ERP demo"
                  loading="lazy"
                  allow="clipboard-write"
                  className="h-[68vh] min-h-[540px] w-full bg-white"
                />
              </BrowserCard>
            </FadeIn>
            <FadeIn delay={140}>
              <div className="glass mt-8 grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
                <div>
                  <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                    <WordReveal
                      segments={[
                        { text: "From transaction records" },
                        { text: "to a ledger that balances.", soft: true },
                      ]}
                    />
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-soft">
                    Signatech ERP connects every transaction: customer orders,
                    warehouse movement, vendor bills, cash flow, and financial
                    reports — one source of truth.
                  </p>
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
                </div>
                <div>
                  <ul>
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
                  <div className="mt-6 flex flex-wrap gap-2">
                    {erpChips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-line bg-white/[0.04] px-3.5 py-1.5 text-xs text-soft"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* WA Commerce section */}
        <section id="wa" className="scroll-mt-24 py-16 sm:py-24">
          {/* Wide container: the embedded dashboard collapses to its mobile
              layout under 1100px of iframe width, so give it every pixel. */}
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <FadeIn className="text-center">
              <Eyebrow tone="accent">Automation — live demo</Eyebrow>
            </FadeIn>
            <FadeIn delay={80}>
              <BrowserCard
                url="wa-commerce-demo-herin.vercel.app"
                fullHref={WA_DEMO_URL}
                className="mt-6"
              >
                <iframe
                  src={WA_DEMO_URL}
                  title="Interactive WA Commerce dashboard demo"
                  className="h-[80vh] min-h-[660px] w-full border-0 bg-[#f8f9fc]"
                  loading="lazy"
                  allow="clipboard-read; clipboard-write"
                />
              </BrowserCard>
            </FadeIn>
            <FadeIn delay={140}>
              <div className="glass mx-auto mt-8 grid max-w-6xl gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
                <div>
                  <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                    <WordReveal
                      segments={[
                        { text: "WhatsApp becomes" },
                        { text: "a measurable sales channel.", soft: true },
                      ]}
                    />
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-soft">
                    A real WhatsApp commerce dashboard with safe dummy data —
                    AI replies, campaign automation, checkout links, and human
                    takeover in one operating view.
                  </p>
                </div>
                <ul>
                  {waChecks.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-b border-line py-3 text-sm text-soft first:pt-0"
                    >
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="glass p-7 sm:p-10">
            <FadeIn className="text-center">
              <Eyebrow>Experience</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                <WordReveal
                  segments={[
                    { text: "And that's not everything I've built." },
                  ]}
                />
              </h2>
              <p className="mt-3 text-xs text-faint">
                Fourteen years across brands, commerce, and systems
              </p>
            </FadeIn>
            <div className="mt-10 border-t border-line">
              {experience.map((e, i) => (
                <FadeIn key={e.role + e.company} delay={i * 80}>
                  <div className="border-b border-line py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <div>
                        <span className="text-base text-ink">{e.role}</span>
                        <span className="text-soft"> — {e.company}</span>
                      </div>
                      <span className="text-xs text-faint tabular-nums">
                        {e.period} · {e.place}
                      </span>
                    </div>
                    {e.detail && (
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-soft">
                        {e.detail}
                      </p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn className="text-center">
              <Eyebrow>What I do</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                <WordReveal
                  segments={[
                    { text: "Systems that make" },
                    { text: "your operation smarter.", soft: true },
                  ]}
                />
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-soft">
                From ideas to production — I design, build, and run the
                software layer of a business.
              </p>
            </FadeIn>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <FadeIn key={s.title} delay={(i % 3) * 100}>
                  <div className="glass group h-full p-6 transition-colors hover:border-white/20">
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

        {/* Location globe */}
        <section id="location" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <FadeIn>
              <LocationCard />
            </FadeIn>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <FadeIn className="text-center">
              <Eyebrow>FAQs</Eyebrow>
              <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                <WordReveal
                  segments={[{ text: "Got questions? I've got answers." }]}
                />
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
            <FadeIn>
              <div className="glass mx-auto max-w-3xl px-6 py-12 text-center sm:px-14 sm:py-14">
                <h2 className="mx-auto max-w-xl text-3xl font-light leading-tight tracking-tight sm:text-5xl">
                  <WordReveal
                    segments={[
                      { text: "Let's build systems" },
                      { text: "that quietly do their job.", soft: true },
                    ]}
                  />
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-soft">
                  From first conversation to software in production —
                  everything designed around how your business actually runs.
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
              </div>
            </FadeIn>

            <footer className="mt-16 border-t border-line pt-10 sm:mt-20">
              <div className="grid gap-10 pb-10 sm:grid-cols-[1.6fr_1fr_1fr]">
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
