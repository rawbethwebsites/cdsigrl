import { Navigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import PageShell from "@/components/PageShell";
import Eyebrow from "@/components/Eyebrow";
import { ButtonLink } from "@/components/Buttons";
import CTASection from "@/components/CTASection";
import { PILLARS, STEPS } from "@/data/content";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const idx = PILLARS.findIndex((p) => p.slug === slug);
  if (idx === -1) return <Navigate to="/services" replace />;
  const p = PILLARS[idx];
  const next = PILLARS[(idx + 1) % PILLARS.length];

  return (
    <PageShell
      title={`${p.title} | CDS IGRL`}
      description={p.short}
      path={`/services/${p.slug}`}
      backHref="/services"
    >
      {/* HERO */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-24 pt-36 pb-24 overflow-hidden">
        <span aria-hidden className="absolute right-[-2rem] md:right-10 top-24 text-[16rem] md:text-[26rem] font-black leading-none text-gold/[0.07] select-none">{p.n}</span>
        <div className="hero-content relative max-w-5xl mx-auto text-center">
          <Eyebrow className="mb-8">Pillar {p.n}</Eyebrow>
          <h1 className="text-[clamp(2.1rem,8.5vw,6rem)] font-black break-words leading-[0.88] tracking-tighter mb-8 uppercase">{p.title}</h1>
          <p className="text-xl md:text-2xl font-medium text-white/75 mb-12 max-w-3xl mx-auto leading-relaxed">{p.hook}</p>
          <div className="flex flex-col md:flex-row gap-5 justify-center">
            <ButtonLink to="/get-started">Discuss Your Mandate</ButtonLink>
            <ButtonLink to="/services" variant="ghost">All 8 Pillars</ButtonLink>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section data-reveal className="bg-cream text-ink py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-gold-deep mb-5">What we do</p>
            <p className="reveal text-2xl md:text-3xl font-bold leading-snug tracking-tight">{p.body}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 content-start">
            {p.deliverables.map((d) => (
              <div key={d} className="reveal bg-white p-7 rounded-2xl shadow-lg shadow-ink/5">
                <span className="h-9 w-9 rounded-full bg-gold grid place-items-center mb-5"><Check size={18} /></span>
                <h3 className="text-lg font-bold leading-tight">{d}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME + BEST FOR */}
      <section data-reveal className="bg-ink py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="reveal bg-gold text-ink p-10 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-ink/60">The Outcome</p>
            <p className="text-2xl md:text-3xl font-black tracking-tight leading-tight">{p.outcome}</p>
          </div>
          <div className="reveal bg-white/5 border border-white/10 p-10 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-gold">Best For</p>
            <p className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{p.bestFor}</p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section data-reveal className="bg-gold/[0.06] border-y border-gold/10 py-32 px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="reveal text-center text-4xl md:text-5xl font-black tracking-tighter mb-20">How we deliver it</h2>
          <div className="space-y-10">
            {STEPS.map((s) => (
              <div key={s.label} className="reveal-left flex flex-col md:flex-row gap-2 md:gap-8 items-start">
                <div className="md:w-40 flex-shrink-0"><span className="text-gold text-xs font-black uppercase tracking-[0.3em]">{s.label}</span></div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
                  <p className="text-white/60">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT PILLAR */}
      <section data-reveal className="bg-white text-ink py-32 px-6 md:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-gold-deep mb-5">Next Pillar · {next.n}</p>
          <h2 className="reveal text-4xl md:text-5xl font-black tracking-tighter mb-4">{next.title}</h2>
          <p className="reveal text-xl text-ink/60 mb-12 max-w-2xl mx-auto">{next.short}</p>
          <div className="reveal flex flex-col md:flex-row gap-5 justify-center">
            <ButtonLink to={`/services/${next.slug}`} variant="primaryLight">View Next Pillar</ButtonLink>
            <ButtonLink to="/services" variant="ghostLight">All Services</ButtonLink>
          </div>
        </div>
      </section>

      <CTASection title={`Start with ${p.title.toLowerCase()}.`} />
    </PageShell>
  );
}
