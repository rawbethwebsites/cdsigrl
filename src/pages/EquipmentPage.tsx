import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { EQUIPMENT } from "@/data/equipment";
import { cn } from "@/utils/cn";

const CATEGORIES = [
  { slug: "retail-food-packaging", title: "Retail & Food Packaging" },
  { slug: "fuel-industrial-flow", title: "Fuel & Industrial Flow" },
  { slug: "truck-bulk-weighing", title: "Truck & Bulk Weighing" },
  { slug: "hospitality-agriculture", title: "Hospitality & Agriculture" },
  { slug: "utilities-transport", title: "Utilities & Transport" },
  { slug: "laboratory-precision", title: "Laboratory & Precision" },
];

export default function EquipmentPage() {
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(
    () => (filter === "all" ? EQUIPMENT : EQUIPMENT.filter((e) => e.category === filter)),
    [filter]
  );

  return (
    <PageShell
      title="Equipment Catalogue | CDS IGRL"
      description="Precision measurement instruments supplied and supported by CDS IGRL across Nigeria — scales, weighbridges, flow meters, meters, and laboratory balances."
      path="/equipment"
    >
      <PageHero eyebrow="Equipment Catalogue" title={<>PRECISION<br /><span className="text-brand">INSTRUMENTS.</span></>}>
        <p className="text-xl md:text-2xl font-medium text-white/75 max-w-3xl mx-auto leading-relaxed">
          {EQUIPMENT.length} instrument types across six service categories — supplied, installed, and
          supported for legal metrology compliance in Nigeria.
        </p>
      </PageHero>

      {/* FILTERS */}
      <section className="px-6 md:px-24 pb-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={cn(
              "rounded-full px-5 py-3 text-[10px] font-black uppercase tracking-widest border transition-colors",
              filter === "all"
                ? "bg-brand text-ink border-brand"
                : "border-white/15 text-white/70 hover:border-brand/50 hover:text-white"
            )}
          >
            All ({EQUIPMENT.length})
          </button>
          {CATEGORIES.map((c) => {
            const n = EQUIPMENT.filter((e) => e.category === c.slug).length;
            const on = filter === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setFilter(c.slug)}
                aria-pressed={on}
                className={cn(
                  "rounded-full px-5 py-3 text-[10px] font-black uppercase tracking-widest border transition-colors",
                  on
                    ? "bg-brand text-ink border-brand"
                    : "border-white/15 text-white/70 hover:border-brand/50 hover:text-white"
                )}
              >
                {c.title} ({n})
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID */}
      <section className="px-6 md:px-24 py-16">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((e) => {
            const isOpen = open === e.slug;
            return (
              <article
                key={e.slug}
                className={cn(
                  "bg-white/5 border rounded-2xl p-7 flex flex-col transition-colors",
                  isOpen ? "border-brand/50" : "border-white/10 hover:border-brand/40"
                )}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-brand mb-4">
                  {e.tag}
                </p>
                <h2 className="text-xl font-black tracking-tight leading-tight mb-3">{e.title}</h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">{e.description}</p>

                <button
                  onClick={() => setOpen(isOpen ? null : e.slug)}
                  aria-expanded={isOpen}
                  className="self-start text-[10px] font-black uppercase tracking-widest text-brand hover:text-cream transition-colors"
                >
                  {isOpen ? "Hide details" : "Uses & compliance +"}
                </button>

                {isOpen && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3">
                      Uses in Nigeria
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {e.uses.map((u) => (
                        <li key={u} className="text-white/65 text-sm leading-relaxed flex gap-3">
                          <span aria-hidden className="text-brand flex-shrink-0">—</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3">
                      Compliance
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed">{e.compliance}</p>
                  </div>
                )}

                <p className="mt-6 text-[9px] font-black uppercase tracking-[0.25em] text-white/55">
                  {e.categoryTitle}
                </p>
              </article>
            );
          })}
        </div>

        <div className="max-w-7xl mx-auto mt-14 text-center">
          <p className="text-white/60 mb-6">
            Looking for a specific instrument or specification?
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center justify-center px-10 md:px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand text-ink hover:bg-cream transition-all"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <CTASection
        title="Need help choosing the right instrument?"
        body="Tell us what you measure and where. We will recommend certified equipment for your application, site conditions, and compliance requirements."
      />
    </PageShell>
  );
}
