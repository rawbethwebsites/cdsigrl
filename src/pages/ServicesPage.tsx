import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { PILLARS } from "@/data/content";

const HOW = [
  "They connect strategy, structure, systems, governance, capital, and capability into one operating model.",
  "They are designed for governments, funds, enterprises, and project sponsors facing real delivery pressure.",
  "They are delivered through a five-step methodology from diagnosis to sustained performance.",
];

export default function ServicesPage() {
  return (
    <PageShell
      title="Services — Legal Metrology Solutions | CDS IGRL"
      description="Eight integrated capabilities — strategy, institution design, technology, PPP, investor engagement, operations, governance, and capacity — delivered as one system."
      path="/services"
    >
      <PageHero eyebrow="Our Services" title={<>THE 8 PILLARS OF<br /><span className="text-gold">INSTITUTIONAL BUILD.</span></>}>
        <p className="text-xl md:text-2xl font-medium text-white/75 max-w-3xl mx-auto leading-relaxed">
          We do not offer isolated fixes. Our eight capabilities work as one system to move clients from diagnosis to
          sustained performance.
        </p>
      </PageHero>

      <section data-reveal className="bg-gold text-ink py-20 px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {HOW.map((h, i) => (
            <div key={i} className="reveal">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/50">0{i + 1}</span>
              <p className="mt-3 text-lg font-bold leading-snug">{h}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="bg-ink py-24 px-6 md:px-24">
        <div className="max-w-6xl mx-auto divide-y divide-white/10 border-y border-white/10">
          {PILLARS.map((p) => (
            <Link key={p.slug} to={`/services/${p.slug}`} className="reveal group grid md:grid-cols-[6rem_1fr_auto] gap-4 md:gap-10 py-12 items-start">
              <span className="text-4xl md:text-5xl font-black text-gold">{p.n}</span>
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 group-hover:text-gold transition-colors">{p.title}</h2>
                <p className="text-white/70 text-lg mb-4 max-w-3xl">{p.hook}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">{p.tags.join(" • ")}</p>
              </div>
              <span className="hidden md:grid h-14 w-14 place-items-center rounded-full border border-white/15 group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all">
                <ArrowRight size={20} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection title="Not sure which pillars you need?" body="Start with a rapid institutional assessment. We will show you where the real constraints are." />
    </PageShell>
  );
}
