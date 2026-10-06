import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { STEPS } from "@/data/content";

export default function ApproachPage() {
  return (
    <PageShell
      title="Our Approach — Assess to Support | CDS IGRL"
      description="A five-step methodology — Diagnose, Design, Deploy, Develop, Deliver — with one accountable partner from concept through sustained performance."
      path="/approach"
    >
      <PageHero eyebrow="Methodology" title={<>DIAGNOSE TO<br /><span className="text-gold">DELIVER.</span></>}>
        <p className="text-xl md:text-2xl font-medium text-white/75 max-w-3xl mx-auto leading-relaxed">
          Five disciplined steps. One partner, full accountability, from concept to sustained performance.
        </p>
      </PageHero>

      <section aria-label="Steps" className="bg-gold text-ink py-8 px-6 md:px-24">
        <ol className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm md:text-lg font-black uppercase tracking-[0.25em]">
          {["Diagnose", "Design", "Deploy", "Develop", "Deliver"].map((s, i) => (
            <li key={s} className="flex items-center gap-6">{s}{i < 4 && <span aria-hidden className="text-ink/40">→</span>}</li>
          ))}
        </ol>
      </section>

      <section data-reveal className="bg-ink py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid gap-6">
          {STEPS.map((s, i) => (
            <div key={s.label} className="reveal-left grid md:grid-cols-[12rem_1fr] gap-6 md:gap-12 bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
              <span className="text-7xl md:text-8xl font-black text-gold leading-none">0{i + 1}</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-3">{s.label.split("· ")[1]}</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">{s.title}</h2>
                <p className="text-lg text-white/65 max-w-2xl">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="bg-cream text-ink py-32 px-6 md:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-gold-deep mb-6">Why It Matters</p>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8">One accountable partner.</h2>
          <p className="reveal text-xl text-ink/65 leading-relaxed">
            This model gives clients coherence: one team responsible from concept through operational independence and
            sustained results. Our role does not stop at recommendations.
          </p>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
