import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { AUDIENCES, SECTORS } from "@/data/content";

export default function ClientsPage() {
  return (
    <PageShell
      title="Who We Serve | CDS IGRL"
      description="Governments, development finance institutions and funds, and enterprises building institutions that matter."
      path="/clients"
    >
      <PageHero eyebrow="Who We Serve" title={<>CLIENTS BUILDING<br /><span className="text-gold">INSTITUTIONS THAT MATTER.</span></>}>
        <p className="text-xl md:text-2xl font-medium text-white/75 max-w-3xl mx-auto leading-relaxed">
          We work where complexity meets ambition — across the public sector, capital providers, and commercial clients.
        </p>
      </PageHero>

      <section data-reveal className="bg-cream text-ink py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid gap-6">
          {AUDIENCES.map((a) => (
            <div key={a.code} className="reveal bg-white rounded-2xl shadow-lg shadow-ink/5 p-8 md:p-12 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
              <div className="h-20 w-20 rounded-2xl bg-ink text-gold grid place-items-center text-2xl font-black">{a.code}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/40 mb-2">{a.sub}</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{a.title}</h2>
                <p className="text-ink/65 text-lg max-w-2xl">{a.desc}</p>
              </div>
              <p className="text-sm font-black text-gold-deep md:text-right md:max-w-[12rem]">{a.focus}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="bg-ink py-24 px-6 md:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="reveal text-3xl md:text-5xl font-black tracking-tighter mb-12">Across seven sectors.</h2>
          <div className="reveal flex flex-wrap justify-center gap-3">
            {SECTORS.map((s) => (
              <span key={s} className="rounded-full bg-white/5 border border-white/10 px-6 py-3 text-sm font-bold">{s}</span>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
