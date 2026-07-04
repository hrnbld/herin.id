import Image from "next/image";

const works = [
  {
    name: "Signatech",
    tag: "ERP · SaaS",
    desc: "Platform ERP dan akuntansi untuk distribusi farmasi — pembelian, penjualan, inventori, dan buku besar dalam satu sistem yang dipakai harian, multi-tenant.",
    href: "https://signatech.id",
    label: "signatech.id",
  },
  {
    name: "Farmatek",
    tag: "E-commerce · WhatsApp AI",
    desc: "Apotek digital dengan agen WhatsApp — katalog produk, pemesanan, dan layanan pelanggan yang berjalan otomatis di aplikasi chat yang dipakai semua orang.",
    href: "https://farmatek.id",
    label: "farmatek.id",
  },
  {
    name: "Neupix WA Commerce",
    tag: "Produk · Multi-tenant",
    desc: "Mesin WhatsApp commerce whitelabel — satu inti, banyak tenant, dengan guardrail per industri. Dipakai untuk farmasi dan kosmetik, siap dipasang untuk yang berikutnya.",
    href: null,
    label: null,
  },
  {
    name: "Alcavella",
    tag: "Analitik · Ads",
    desc: "Dashboard analitik iklan lintas platform — Meta, TikTok, dan marketplace — supaya keputusan budget harian diambil dari angka yang bisa dipercaya.",
    href: "https://alcavella.id",
    label: "alcavella.id",
  },
];

const services = [
  {
    title: "ERP & Sistem Akuntansi",
    desc: "Dari pencatatan transaksi sampai buku besar yang seimbang. Sistem yang mengikuti alur bisnis, bukan sebaliknya.",
  },
  {
    title: "WhatsApp Commerce & Chatbot AI",
    desc: "Jualan dan layanan pelanggan di tempat pelanggan Anda sudah berada — dengan agen yang tahu batasnya.",
  },
  {
    title: "AI Agent & Automasi",
    desc: "Automasi yang bisa menimbang, bukan sekadar menjalankan aturan. Berjalan 24 jam, diawasi, dan bisa dipertanggungjawabkan.",
  },
  {
    title: "Dashboard & Analitik",
    desc: "Data dari banyak sumber, disatukan dan disajikan supaya cepat dibaca — dan benar.",
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
          <a href="#karya" className="hover:text-ink transition-colors">
            Karya
          </a>
          <a href="#kontak" className="hover:text-ink transition-colors">
            Kontak
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-28 sm:pt-32 sm:pb-40">
        <p className="text-sm tracking-widest uppercase text-soft mb-6">
          Full-Stack Engineer &amp; Systems Architect — Bandung
        </p>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-tight">
          Herin Yudha
          <br />
          Pratama<span className="text-accent">.</span>
        </h1>
        <p className="mt-10 max-w-xl text-lg sm:text-xl text-soft leading-relaxed">
          Sistem yang rapi di belakang bisnis yang ramai. Saya merancang dan
          membangun ERP, WhatsApp commerce, dan automasi AI untuk bisnis di
          Indonesia — dari database sampai production.
        </p>
        <div className="mt-10 flex gap-8 text-sm">
          <a
            href="#karya"
            className="border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Lihat karya ↓
          </a>
          <a
            href="#kontak"
            className="border-b border-line pb-1 text-soft hover:text-accent hover:border-accent transition-colors"
          >
            Kontak
          </a>
        </div>
      </section>

      {/* Tentang */}
      <section className="border-t border-line py-24 grid gap-10 sm:grid-cols-[200px_1fr_auto]">
        <SectionLabel no="01" title="Tentang" />
        <div className="max-w-xl space-y-6 text-lg leading-relaxed">
          <p>
            Saya membangun sistem operasional untuk bisnis: ERP dan akuntansi,
            commerce lewat WhatsApp, dashboard, dan agent AI yang bekerja
            sepanjang hari. Pendekatan saya sederhana — pahami alur bisnisnya
            dulu, baru tulis kodenya.
          </p>
          <p className="text-soft">
            Sehari-hari saya bekerja end-to-end dengan TypeScript, Node.js,
            Python, React, dan PostgreSQL — ditambah LLM untuk automasi yang
            butuh penilaian, bukan cuma aturan. Dari arsitektur sampai
            monitoring di production.
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

      {/* Karya */}
      <section id="karya" className="border-t border-line py-24">
        <SectionLabel no="02" title="Karya Terpilih" />
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

      {/* Layanan */}
      <section className="border-t border-line py-24">
        <SectionLabel no="03" title="Yang Saya Kerjakan" />
        <div className="mt-14 grid gap-x-12 gap-y-14 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title}>
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-soft leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="border-t border-line py-24 sm:py-32">
        <SectionLabel no="04" title="Kontak" />
        <p className="mt-12 max-w-xl text-lg text-soft leading-relaxed">
          Punya proyek, atau mau ngobrol dulu soal sistemnya? Email paling
          cepat sampai.
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
        <span>Dibuat di Bandung.</span>
      </footer>
    </main>
  );
}
