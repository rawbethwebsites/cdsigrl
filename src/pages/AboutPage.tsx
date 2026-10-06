import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { SECTORS, VALUES } from "@/data/content";

export default function AboutPage() {
  return (
    <PageShell
      title="About | CDS IGRL"
      description="CDS IGRL works with retailers, manufacturers, oil & gas operators, healthcare labs, farms, logistics yards, and utilities — turning measurement requirements into compliant, reliable instruments."
      path="/about"
    >
      <PageHero eyebrow="Who We Are" title={<>GLOBAL PERSPECTIVE.<br /><span className="text-gold">LOCAL DEPLOYMENT.</span></>}>
        <p className="text-xl md:text-2xl font-medium text-white/75 max-w-3xl mx-auto leading-relaxed">
          CDS IGRL works with retailers, manufacturers, oil & gas operators, healthcare labs, farms, logistics yards, and utilities — turning measurement requirements into compliant, reliable instruments.
        </p>
      </PageHero>

      <section data-reveal className="bg-cream text-ink py-32 px-6 md:px-24">
        <div className="max-w-5xl mx-auto">
          <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-gold-deep mb-8">Our Mission</p>
          <blockquote className="reveal text-3xl md:text-5xl font-black tracking-tighter leading-[1.05]">
            “To design and operationalize institutions that deliver sustained public and commercial value.”
          </blockquote>
          <div className="reveal mt-14 grid md:grid-cols-2 gap-10 text-lg text-ink/65 leading-relaxed">
            <p>
              We integrate strategy, institution design, technology, PPP advisory, investor engagement, operations,
              governance, and capacity building into one implementation-led model — aligning purpose, structure, people,
              systems, governance, and capital.
            </p>
            <p>
              Headquartered globally and deployed locally, we combine global benchmarks with deep contextual understanding
              to deliver solutions that work on the ground — not just on paper.
            </p>
          </div>
        </div>
      </section>

      <section data-reveal className="bg-ink py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="reveal text-center text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-20">What we stand for.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div key={v.title} className="reveal bg-white/5 border border-white/10 p-8 rounded-2xl">
                <span className="text-gold font-black text-sm tracking-widest">0{i + 1}</span>
                <h3 className="text-2xl font-bold mt-6 mb-3">{v.title}</h3>
                <p className="text-white/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="bg-gold/[0.06] border-y border-gold/10 py-24 px-6 md:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-10">Sectors We Work In</p>
          <div className="reveal flex flex-wrap justify-center gap-3">
            {SECTORS.map((s) => (
              <span key={s} className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold">{s}</span>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Work with CDS IGRL." />
    </PageShell>
  );
}
