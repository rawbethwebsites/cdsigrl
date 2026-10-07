import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import PageShell from "@/components/PageShell";
import Eyebrow from "@/components/Eyebrow";
import { ButtonLink } from "@/components/Buttons";
import CTASection from "@/components/CTASection";
import { AUDIENCES, FAQS, PILLARS, SECTORS, STEPS, VALUES } from "@/data/content";
import { cn } from "@/utils/cn";

const HeroOrb = lazy(() => import("@/components/HeroOrb"));

const STATS = [
  { value: "6", label: "Service Categories" },
  { value: "22+", label: "Instrument Types" },
  { value: "36", label: "States Covered" },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <PageShell
      title="CDS IGRL | Legal Metrology Solutions"
      description="CDS IGRL supplies, installs, and supports precision measurement instruments and legal metrology solutions for retail, industrial, and scientific applications across Nigeria."
      path="/classic"
    >
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-24 pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70 md:opacity-100">
          <Suspense fallback={null}><HeroOrb /></Suspense>
        </div>
        <div aria-hidden className="absolute inset-0 z-0 bg-gradient-to-r from-ink/95 via-ink/55 to-transparent" />

        <div className="hero-content relative z-10 max-w-7xl mx-auto w-full">
          <Eyebrow className="mb-8">Legal Metrology Partner</Eyebrow>
          <h1 className="text-[clamp(2.25rem,10vw,7rem)] font-black leading-[0.85] tracking-tighter mb-8 max-w-5xl">
            PRECISION<br />MEASUREMENT<br /><span className="text-gold">SOLUTIONS.</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium text-white/75 mb-12 max-w-2xl leading-relaxed">
            We supply, install, and support measurement instruments that keep trade fair, industry accurate, and
            laboratories compliant — from retail scales to weighbridges, fuel dispensers to analytical balances.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <ButtonLink to="/get-started">Talk to Our Team</ButtonLink>
            <ButtonLink to="/approach" variant="ghost">Explore Our Approach</ButtonLink>
          </div>

          <dl className="mt-20 grid grid-cols-3 max-w-3xl border-t border-white/10 pt-8 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/45 mb-2">{s.label}</dt>
                <dd className="text-lg md:text-3xl font-black tracking-tight text-gold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SECTOR MARQUEE */}
      <section aria-label="Sectors" className="bg-gold text-ink py-6 overflow-hidden">
        <div className="flex gap-14 animate-marquee whitespace-nowrap w-max">
          {[...SECTORS, ...SECTORS, ...SECTORS, ...SECTORS].map((s, i) => (
            <span key={i} className="text-sm md:text-base font-black uppercase tracking-[0.3em] flex items-center gap-14">
              {s} <span aria-hidden className="text-ink/40">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section data-reveal className="bg-cream text-ink py-32 px-6 md:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
            <div>
              <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-gold-deep mb-5">01 · Core Capabilities</p>
              <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">The 6 services of<br />legal metrology.</h2>
            </div>
            <p className="reveal max-w-md text-lg text-ink/60">
              Each service stands on its own. The strongest results come when they are sequenced and delivered as one system.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => (
              <Link
                key={p.slug}
                to={`/services/${p.slug}`}
                className="reveal group bg-white p-7 rounded-2xl shadow-lg shadow-ink/5 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-10">
                  <span className="text-3xl font-black text-gold-deep">{p.n}</span>
                  <ArrowUpRight className="text-ink/25 group-hover:text-ink transition-colors" size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight leading-tight mb-3">{p.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed mb-6 flex-1">{p.short}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-ink/40">{p.tags.join(" • ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ASTUDITY */}
      <section data-reveal className="bg-ink py-32 px-6 md:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-5">02 · Why CDS IGRL</p>
            <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8">Measuring what matters, to the standard.</h2>
            <p className="reveal text-lg text-white/65 leading-relaxed mb-10">
              CDS International Global Resources Limited is Nigeria's trusted partner for legal metrology and precision measurement instruments.
              Every engagement is end-to-end — assessing your application, selecting certified instruments, supporting installation, confirming compliance, and keeping them accurate.
            </p>
            <ButtonLink to="/about" variant="ghost" className="reveal">Read Who We Are</ButtonLink>
          </div>
          <div className="grid gap-5">
            {VALUES.map((v, i) => (
              <div key={v.title} className="reveal bg-white/5 border border-white/10 p-8 rounded-2xl flex gap-6">
                <span className="text-gold font-black text-sm tracking-widest pt-1">0{i + 1}</span>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{v.title}</h3>
                  <p className="text-white/60">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section data-reveal className="bg-gold/[0.06] border-y border-gold/10 py-32 px-6 md:px-24">
        <div className="max-w-5xl mx-auto">
          <p className="reveal text-center text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-5">03 · Our Approach</p>
          <h2 className="reveal text-center text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-20">Diagnose to deliver,<br />end to end.</h2>
          <div className="space-y-10">
            {STEPS.map((s) => (
              <div key={s.label} className="reveal-left flex flex-col md:flex-row gap-3 md:gap-10 items-start border-b border-white/10 pb-10">
                <div className="md:w-48 flex-shrink-0">
                  <span className="text-gold text-xs font-black uppercase tracking-[0.3em]">{s.label}</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{s.title}</h3>
                  <p className="text-white/60 max-w-2xl">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal mt-14 text-center">
            <ButtonLink to="/approach">See the Full Methodology</ButtonLink>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section data-reveal className="bg-ink py-32 px-6 md:px-24">
        <div className="max-w-7xl mx-auto">
          <p className="reveal text-center text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-5">04 · Who We Serve</p>
          <h2 className="reveal text-center text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-20">Clients measuring<br />what matters.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {AUDIENCES.map((a) => (
              <div key={a.code} className="reveal bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-gold/40 transition-colors">
                <div className="h-14 w-14 rounded-xl bg-gold text-ink grid place-items-center font-black mb-8">{a.code}</div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">{a.sub}</p>
                <h3 className="text-3xl font-black tracking-tight mb-4">{a.title}</h3>
                <p className="text-white/60 mb-8">{a.desc}</p>
                <p className="text-xs font-bold text-gold">{a.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-reveal className="bg-cream text-ink py-32 px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="reveal text-center text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-16">Questions, answered.</h2>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="reveal">
                  <button
                    className="w-full flex items-center justify-between gap-6 py-7 text-left"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span className="text-lg md:text-xl font-bold">{f.q}</span>
                    <Plus className={cn("flex-shrink-0 transition-transform", open && "rotate-45")} size={22} />
                  </button>
                  <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]")}>
                    <p className="overflow-hidden text-ink/65 leading-relaxed max-w-3xl">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
