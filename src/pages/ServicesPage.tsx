import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { PILLARS, serviceImage } from "@/data/content";

const HOW = [
  "They connect assessment, equipment selection, installation, certification, and support into one service model.",
  "They are built for retail, industrial, and scientific operations where measurement accuracy is non-negotiable.",
  "They are delivered through a five-step methodology from diagnosis to sustained performance.",
];

export default function ServicesPage() {
  return (
    <PageShell
      title="Services — Legal Metrology Solutions | CDS IGRL"
      description="Six integrated service categories — retail and packaging, fuel and industrial flow, bulk weighing, hospitality and agriculture, utilities and transport, laboratory and precision."
      path="/services"
    >
      <PageHero eyebrow="Our Services" title={<>THE 6 SERVICES OF<br /><span className="text-brand">LEGAL METROLOGY.</span></>}>
        <p className="text-xl md:text-2xl font-medium text-white/75 max-w-3xl mx-auto leading-relaxed">
          We do not offer isolated fixes. Our six service lines work as one system to move clients from diagnosis to
          sustained performance.
        </p>
      </PageHero>

      <section data-reveal className="bg-brand text-ink py-20 px-6 md:px-24">
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
            <Link key={p.slug} to={`/services/${p.slug}`} className="reveal group grid md:grid-cols-[18rem_1fr_auto] gap-6 md:gap-10 py-12 items-start">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-coal">
                <img src={serviceImage(p.slug)} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent" />
                <span className="absolute bottom-3 left-4 text-3xl font-black text-brand">{p.n}</span>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 group-hover:text-brand transition-colors">{p.title}</h2>
                <p className="text-white/70 text-lg mb-4 max-w-3xl">{p.hook}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">{p.tags.join(" • ")}</p>
              </div>
              <span className="hidden md:grid h-14 w-14 place-items-center rounded-full border border-white/15 group-hover:bg-brand group-hover:text-ink group-hover:border-brand transition-all">
                <ArrowRight size={20} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection title="Not sure which instruments you need?" body="Start with a rapid assessment of your application. We will show you where the real constraints are." />
    </PageShell>
  );
}
