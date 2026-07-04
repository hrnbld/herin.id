import Image from "next/image";

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

const works = [
  {
    name: "Signatech",
    tag: "ERP · SaaS",
    desc: "ERP and accounting platform for pharmaceutical distribution — purchasing, sales, inventory, and general ledger in one multi-tenant system, used daily.",
    href: "https://signatech.id",
    label: "signatech.id",
  },
  {
    name: "Farmatek",
    tag: "E-commerce · WhatsApp AI",
    desc: "Digital pharmacy with a WhatsApp agent — product catalog, ordering, and customer service running automatically inside the chat app everyone already uses.",
    href: "https://farmatek.id",
    label: "farmatek.id",
  },
  {
    name: "Neupix WA Commerce",
    tag: "Product · Multi-tenant",
    desc: "White-label WhatsApp commerce engine — one core, many tenants, with per-industry guardrails. Serving pharmacy and cosmetics, ready for the next one.",
    href: null,
    label: null,
  },
  {
    name: "Alcavella",
    tag: "Analytics · Ads",
    desc: "Cross-platform advertising analytics dashboard — Meta, TikTok, and marketplaces — so daily budget decisions come from numbers you can trust.",
    href: "https://alcavella.id",
    label: "alcavella.id",
  },
];

const services = [
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
    desc: "Meta, Google, TikTok, and Shopee ads — tens of billions of rupiah managed at a 15–20× average ROAS.",
  },
  {
    title: "Dashboards & Analytics",
    desc: "Numbers from many sources, unified and presented so they're fast to read — and right.",
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
      <header className="flex items-center justify-between py-8 text-sm">
        <span className="font-display text-lg">herin.id</span>
        <nav className="flex gap-6 text-soft">
          <a href="#work" className="hover:text-ink transition-colors">
            Work
          </a>
          <a href="#contact" className="hover:text-ink transition-colors">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-28 sm:pt-32 sm:pb-40">
        <p className="text-sm tracking-widest uppercase text-soft mb-6">
          Full-Stack Engineer &amp; Systems Architect — Bandung, Indonesia
        </p>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-tight">
          Herin Yudha
          <br />
          Pratama<span className="text-accent">.</span>
        </h1>
        <p className="mt-10 max-w-xl text-lg sm:text-xl text-soft leading-relaxed">
          Quiet systems behind busy businesses. I design and build ERP,
          WhatsApp commerce, and AI automation for companies in Indonesia —
          from database to production.
        </p>
        <div className="mt-10 flex gap-8 text-sm">
          <a
            href="#work"
            className="border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            See the work ↓
          </a>
          <a
            href="#contact"
            className="border-b border-line pb-1 text-soft hover:text-accent hover:border-accent transition-colors"
          >
            Contact
          </a>
        </div>
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

      {/* Experience */}
      <section className="border-t border-line py-24 grid gap-10 sm:grid-cols-[200px_1fr]">
        <SectionLabel no="02" title="Experience" />
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

      {/* Work */}
      <section id="work" className="border-t border-line py-24">
        <SectionLabel no="03" title="Selected Work" />
        <div className="mt-14 divide-y divide-line">
          {works.map((w) => (
            <article key={w.name} className="py-10 group">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-3xl sm:text-4xl">
                  {w.href ? (
                    <a
                      href={w.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group-hover:text-accent transition-colors"
                    >
                      {w.name}
                      <span className="text-faint text-xl align-super ml-1">
                        ↗
                      </span>
                    </a>
                  ) : (
                    w.name
                  )}
                </h2>
                <span className="text-xs tracking-widest uppercase text-faint">
                  {w.tag}
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-soft leading-relaxed">
                {w.desc}
              </p>
              {w.label && (
                <p className="mt-3 text-sm text-faint">{w.label}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* What I Do */}
      <section className="border-t border-line py-24">
        <SectionLabel no="04" title="What I Do" />
        <div className="mt-14 grid gap-x-12 gap-y-14 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title}>
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-soft leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo */}
      <section className="border-t border-line py-24">
        <SectionLabel no="05" title="Live Demo" />
        <h2 className="mt-12 font-display text-3xl sm:text-4xl max-w-2xl">
          Don&apos;t take my word for it — click around.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-soft leading-relaxed">
          A working sample of the kind of system I build — sales orders,
          invoicing, purchasing, inventory, and a ledger that stays balanced.
          All sample data, in dollars. It&apos;s live below: create an
          invoice, post it, watch the books move.
        </p>
        <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_-30px_rgba(28,25,23,0.35)]">
          <div className="flex items-center gap-2 border-b border-line bg-paper/60 px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
            </span>
            <span className="mx-auto rounded-md bg-white px-4 py-0.5 text-xs text-faint border border-line">
              herin.id<span className="text-ink">/demo/erp</span>
            </span>
            <a
              href="/demo/erp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-soft hover:text-accent transition-colors"
              title="Open full screen"
            >
              ⤢ Full screen
            </a>
          </div>
          <iframe
            src="/demo/erp"
            title="Interactive ERP demo"
            loading="lazy"
            className="h-[640px] w-full"
          />
        </div>
        <p className="mt-4 text-sm text-faint">
          Interactive demo — runs entirely in your browser, resets anytime.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-line py-24 sm:py-32">
        <SectionLabel no="06" title="Contact" />
        <p className="mt-12 max-w-xl text-lg text-soft leading-relaxed">
          Have a project in mind, or want to talk systems first? Email is the
          fastest way to reach me.
        </p>
        <a
          href="mailto:surel.herin@gmail.com"
          className="mt-6 inline-block font-display text-3xl sm:text-5xl hover:text-accent transition-colors break-all"
        >
          surel.herin@gmail.com
        </a>
        <div className="mt-10 flex gap-6 text-sm text-soft">
          <a
            href="https://github.com/hrnbld"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-line pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-10 flex flex-wrap justify-between gap-4 text-sm text-faint">
        <span>© {new Date().getFullYear()} Herin Yudha Pratama</span>
        <span>Built in Bandung.</span>
      </footer>
    </main>
  );
}
