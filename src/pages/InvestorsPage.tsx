import type { ReactNode } from "react";
import PageShell from "@/components/PageShell";
import { ButtonLink } from "@/components/Buttons";
import { ArrowRight, FileSpreadsheet, FileText, Lock } from "lucide-react";

type Metric = { value: string; label: string; note: string; compact?: boolean };

const GLASS =
  "rounded-[22px] border border-[rgba(226,236,244,.14)] bg-[#0B1B2B]/50 backdrop-blur-xl shadow-[0_24px_60px_-40px_rgba(0,0,0,.9)]";

const METRICS: Metric[] = [
  {
    value: "NGN 50B",
    label: "Proposed investor capital",
    note: "Illustrative sizing, released in staged closes against milestones.",
  },
  {
    value: "NGN 420B",
    label: "Illustrated 10-year gross proceeds",
    note: "Entitlement case: 10% of the source's constant NGN 35B/month target.",
  },
  {
    value: "8.4\u00D7",
    label: "MOIC on gross proceeds",
    note: "NGN 420B divided by NGN 50B. No terminal principal repayment is assumed.",
  },
  {
    value: "740%",
    label: "Simple net ROI (recalculated)",
    note: "The source's 840% mixes MOIC with ROI. The memorandum carries the corrected arithmetic.",
  },
  {
    value: "14.3 mo",
    label: "Interpolated payback",
    note: "The first whole monthly payment crossing capital arrives in month 15.",
  },
  {
    value: "125.2% / 83.8%",
    label: "Illustrated effective annual IRR",
    note: "Monthly or year-end receipt timing. Neither schedule reproduces the source's ~68%.",
    compact: true,
  },
];

const SCENARIOS = [
  { name: "Headline", moic: "8.4\u00D7", payback: "15 mo" },
  { name: "Ramp", moic: "7.87\u00D7", payback: "22 mo" },
  { name: "Downside", moic: "4.6\u00D7", payback: "35 mo" },
];

const SCENES = [
  { src: "/investors/scenes/trade.jpg", name: "Fair Trade", detail: "Beam balance", alt: "Beam balance for fair trade measurement" },
  { src: "/investors/scenes/flow.jpg", name: "Fuel & Flow", detail: "Turbine meter", alt: "Turbine flow meter for fuel measurement" },
  { src: "/investors/scenes/bulk.jpg", name: "Bulk", detail: "Weighbridge", alt: "Haul truck on a weighbridge with load cells" },
  { src: "/investors/scenes/utility.jpg", name: "Utilities", detail: "3-phase smart meter", alt: "Three-phase smart electricity meter" },
  { src: "/investors/scenes/calibration.jpg", name: "Certified Accuracy", detail: "Gauge + stamp", alt: "Calibration gauge with certification stamp" },
];

const USE_OF_FUNDS = [
  { label: "Equipment: weighbridges, provers, reference weights, flow rigs, mobile verification units", amount: "NGN 25B", pct: 50 },
  { label: "Infrastructure: six zonal ISO 17025 laboratories, field fleet, data centre and disaster recovery", amount: "NGN 10B", pct: 20 },
  { label: "Technology: national metrology portal, e-certificates, e-payment, AI verification, USSD and app", amount: "NGN 8B", pct: 16 },
  { label: "Human capital: inspector recruitment, OIML certification, factory training", amount: "NGN 4B", pct: 8 },
  { label: "Compliance: ICRC, performance bond, insurance, legal and audit", amount: "NGN 3B", pct: 6 },
];

const CLAUSES = [
  {
    n: "12.1",
    title: "Tenor & profit share",
    body: "A 20-year concession. The investor is admitted as a 10% gross-revenue profit-sharing partner for a fixed 10 years, computed as a first-line charge from the concessionaire's share, regardless of payback speed.",
  },
  {
    n: "12.2",
    title: "Minimum revenue undertaking",
    body: "A minimum expected monthly revenue of NGN 35B, based on published FMITI targets and the 2012 fee regulations. The basis requires reconciliation before it can carry a term sheet.",
  },
  {
    n: "12.3",
    title: "Structured payback",
    body: "If collections fall short, proposed remedies include budgetary provision, TSA recovery, tenor extension or a comfort letter supporting refinancing. A draft clause is not executed sovereign backing.",
  },
  {
    n: "12.4",
    title: "Escrow waterfall",
    body: "All revenues into a tripartite escrow managed by a CBN-appointed trustee: taxes, FGN 40% to TSA, investor 10% auto-sweep, OPEX reserve 20%, CDS-IGRL distribution 30%. Bank and trustee details to be confirmed.",
  },
  {
    n: "12.5",
    title: "Security package",
    body: "Receivables domiciliation, lien over the NGN 25B equipment, assignment of concession approvals, corporate and director guarantees, all-risk and political-risk cover, performance bond.",
  },
  {
    n: "12.6",
    title: "Audit & transparency",
    body: "Real-time collection dashboard, monthly investor audit rights, quarterly joint reviews with FMITI and ICRC, and monthly escrow bank statements.",
  },
];

const PROCESS = [
  { n: "01", title: "NDA", body: "Mutual confidentiality before any sensitive document exchange." },
  { n: "02", title: "Data room", body: "Corporate records, concession and approvals, tariff instruments, instrument enumeration, collections evidence, procurement and the scenario workbook." },
  { n: "03", title: "Regulator sessions", body: "Meetings with the FMITI Department of Weights & Measures and with ICRC as PPP authority." },
  { n: "04", title: "Site visits", body: "Lagos Apapa and the Abuja pilot lab, plus witnessed factory acceptance testing in China once equipment is ordered." },
  { n: "05", title: "Escrow & close", body: "Trustee-arranged escrow with milestone release controls, then staged financial close against verified deliverables." },
];

function OsLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-mint ${className}`}>
      <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-full bg-brand shadow-[0_0_10px_rgba(24,194,90,.8)]" />
      {children}
    </p>
  );
}

function SceneTag({ name, detail, className = "" }: { name: string; detail: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] ${className}`}>
      <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-full bg-brand shadow-[0_0_10px_rgba(24,194,90,.8)]" />
      <span className="font-semibold text-cream">{name}</span>
      <span className="text-mint/80">{detail}</span>
    </div>
  );
}

export default function InvestorsPage() {
  return (
    <PageShell
      title="Investor Relations: NGN 50B Legal Metrology Raise | CDS IGRL"
      description="The proposed NGN 50 billion expansion of Nigeria's legal metrology services, with the transaction structure, illustrative economics and diligence documents for prospective investors and lenders."
      path="/investors"
    >
      {/* HERO — homepage scene treatment */}
      <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden px-6 pt-44 pb-32 md:px-24">
        <img
          src="/investors/scenes/trade.jpg"
          alt="Beam balance on a calibration bench, fair trade measurement scene"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[#050E17]/75" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#050E17]/70 via-transparent to-ink" />
        <div aria-hidden className="os-grid absolute inset-0" />

        <div className="hero-content relative z-10 mx-auto w-full max-w-6xl text-center">
          <OsLabel className="mb-8 justify-center">Investor Relations</OsLabel>
          <h1 className="mb-8 text-[clamp(2.25rem,9vw,6.5rem)] font-black leading-[0.85] tracking-tighter">
            FUND THE
            <br />
            <span className="text-brand">STANDARD.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl font-medium leading-relaxed text-white/75 md:text-2xl">
            A proposed NGN 50 billion capital raise to modernize Nigeria's legal metrology infrastructure, structured as a
            ten-year gross-revenue participation and presented for discussion and due diligence.
          </p>
          <div className="flex flex-col justify-center gap-5 md:flex-row">
            <ButtonLink to="/get-started">Request an introduction</ButtonLink>
            <a
              href="/investors/CDS-IGRL-Investment-Memorandum.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 md:px-12"
            >
              Read the memorandum
            </a>
          </div>

          <div className="mx-auto mt-16 w-full max-w-md">
            <div className="relative h-[2px] overflow-hidden rounded-sm bg-mint/15">
              <i className="meter-fill block h-full w-full bg-brand shadow-[0_0_12px_rgba(24,194,90,.6)]" />
            </div>
            <div aria-hidden className="tick-rule mt-2 h-[7px]" />
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
              <span>Proposed raise</span>
              <b className="font-semibold text-brand">NGN 50B</b>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 z-10 hidden md:block md:left-24">
          <SceneTag name="Fair Trade" detail="Beam balance" />
          <div className="mt-3 h-[2px] w-[150px] overflow-hidden rounded-sm bg-mint/15">
            <i className="meter-fill block h-full w-full bg-mint" />
          </div>
        </div>
      </section>

      {/* STATUS STRIP */}
      <section aria-label="Diligence status" className="relative border-y border-white/10 bg-[#0B1B2B]/60 px-6 py-6 backdrop-blur-xl md:px-24">
        <p className="mx-auto max-w-6xl text-center text-sm leading-relaxed text-white/70 md:text-base">
          <span className="mr-3 inline-block align-middle font-mono text-[10px] font-black uppercase tracking-[0.3em] text-brand">Diligence draft</span>
          This page summarizes a document prepared for discussion only. It is not an offer, a legal opinion or evidence
          of an executed guarantee. Terms shown are proposed, and figures are management targets or mathematical
          illustrations, not verified results.
        </p>
      </section>

      {/* OPPORTUNITY + SCENES */}
      <section data-reveal className="relative bg-ink px-6 py-24 md:px-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <OsLabel className="mb-8">The opportunity</OsLabel>
          <h2 className="reveal mb-8 max-w-4xl text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            A national measurement platform,
            <span className="text-brand"> proposed to be built.</span>
          </h2>
          <div className="reveal mb-12 grid gap-6 md:grid-cols-2">
            <p className="text-lg leading-relaxed text-white/65">
              CDS-IGRL is described in the source memorandum as the sole concessionaire appointed by the Federal
              Government of Nigeria to administer, modernize, expand and manage legal metrology services nationwide,
              working through the Federal Ministry of Industry, Trade &amp; Investment and its Department of Weights &amp;
              Measures. The appointment and the scope of exclusivity are source claims, subject to diligence.
            </p>
            <p className="text-lg leading-relaxed text-white/65">
              Official targets have long outpaced actual collections, and the cited bottleneck is equipment, mobility
              and technology, not policy. The proposed program answers with certified infrastructure: six zonal
              ISO 17025 laboratories, a fleet of mobile verification units, a national digital registry with
              e-certificates and e-payment, and trained inspectors across all 36 states and the FCT.
            </p>
          </div>
          <div className="reveal mb-4 flex flex-wrap gap-3">
            {["40M+ SMEs", "100k+ fuel pumps", "50k tankers", "12M electricity meters", "200M mobile lines", "5,000 manufacturers"].map((c) => (
              <span key={c} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold">
                {c}
              </span>
            ))}
          </div>
          <p className="reveal mb-16 max-w-3xl text-xs leading-relaxed text-white/45">
            Source memorandum market assertions, not contracted customers. Subscribers are not automatically
            separately chargeable instruments.
          </p>

          <OsLabel className="mb-6">Measurement scenes</OsLabel>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SCENES.map((s) => (
              <figure key={s.name} className="reveal group relative overflow-hidden rounded-xl border border-white/10">
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#050E17]/90 via-[#050E17]/20 to-transparent" />
                <figcaption className="absolute inset-x-3 bottom-3 font-mono text-[9px] uppercase tracking-[0.18em]">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand" />
                    <b className="font-semibold text-cream">{s.name}</b>
                  </span>
                  <span className="mt-1 block pl-[13px] text-mint/70">{s.detail}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PROPOSED STRUCTURE */}
      <section data-reveal className="relative bg-[#07131F] px-6 py-24 md:px-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <OsLabel className="mb-6">Proposed structure</OsLabel>
          <h2 className="reveal mb-10 max-w-4xl text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            How the raise would work.
          </h2>

          <div className={`reveal mb-10 p-8 md:p-12 ${GLASS}`}>
            <div aria-hidden className="mb-6 flex h-12 overflow-hidden rounded-xl border border-white/10">
              <div className="bg-white/25" style={{ width: "40%" }} />
              <div className="bg-brand" style={{ width: "10%" }} />
              <div className="bg-white/10" style={{ width: "50%" }} />
            </div>
            <ul className="grid gap-4 text-sm md:grid-cols-3">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-white/25" />
                <span className="text-white/80">
                  <strong className="font-black text-cream">FGN 40%</strong>, paid to the Treasury Single Account
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-brand" />
                <span className="text-white/80">
                  <strong className="font-black text-cream">Investor 10%</strong>, charged first against the concessionaire's share
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-white/10" />
                <span className="text-white/80">
                  <strong className="font-black text-cream">CDS-IGRL 50%</strong>, including the proposed OPEX reserve and distribution
                </span>
              </li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-white/50">
              Percentages of defined gross revenue, totalling 100% before separately resolved tax treatment. The term
              "gross" must be contractually defined before these allocations can be implemented.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className={`reveal p-8 ${GLASS}`}>
              <h3 className="mb-3 text-xl font-black">The raise</h3>
              <p className="leading-relaxed text-white/65">
                NGN 50 billion from one investor or a consortium, released in staged closes against milestones. The
                source names pension funds, banks, private equity and high-net-worth individuals as candidates.
              </p>
            </div>
            <div className={`reveal p-8 ${GLASS}`}>
              <h3 className="mb-3 text-xl font-black">The participation</h3>
              <p className="leading-relaxed text-white/65">
                A 10% share of defined gross revenue, charged first against the concessionaire's share for a fixed ten
                years inside a proposed twenty-year concession. How it is characterized for tax and law remains with
                transaction counsel.
              </p>
            </div>
            <div className={`reveal p-8 ${GLASS}`}>
              <h3 className="mb-3 text-xl font-black">The settlement</h3>
              <p className="leading-relaxed text-white/65">
                A tripartite escrow under a CBN-appointed trustee with a proposed monthly auto-sweep. Bank and trustee
                identities differ across the source sections, and no commitment is verified. This term must be
                reconciled.
              </p>
            </div>
            <div className={`reveal p-8 ${GLASS}`}>
              <h3 className="mb-3 text-xl font-black">The security</h3>
              <p className="leading-relaxed text-white/65">
                Proposed: receivables domiciliation, lien over the equipment, corporate and director guarantees,
                all-risk and political-risk cover, and a performance bond. "Senior secured" is not established without
                perfected documentation.
              </p>
            </div>
          </div>
          <p className="reveal mt-8 max-w-3xl text-sm text-white/55">
            Every term above is a proposal from the source memorandum. Nothing is executed; a reconciled term sheet
            and legal review precede any close.
          </p>
        </div>
      </section>

      {/* ILLUSTRATIVE ECONOMICS */}
      <section data-reveal className="relative overflow-hidden bg-ink px-6 py-24 md:px-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(700px 340px at 88% 0%, rgba(24,194,90,.14), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <OsLabel className="mb-8">Illustrations, not forecasts</OsLabel>
          <h2 className="reveal mb-6 max-w-4xl text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            The target case, <span className="text-brand">recalculated.</span>
          </h2>
          <p className="reveal mb-12 max-w-3xl text-lg leading-relaxed text-white/65">
            On the source's constant NGN 35B/month gross target, with NGN 50B fully funded at month zero. Arithmetic
            only. No ramp, costs or staging are reflected.
          </p>

          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {METRICS.map((m) => (
              <div key={m.label} className={`reveal p-7 ${GLASS}`}>
                <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-brand">{m.label}</p>
                <p className={`${m.compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"} mb-3 font-black tracking-tighter text-cream tabular-nums`}>
                  {m.value}
                </p>
                <p className="text-xs leading-relaxed text-white/50">{m.note}</p>
              </div>
            ))}
          </div>

          <div className="reveal mb-6 flex flex-wrap items-center gap-3">
            {SCENARIOS.map((s) => (
              <span key={s.name} className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mint tabular-nums">
                {s.name}: {s.moic} MOIC · payback {s.payback}
              </span>
            ))}
            <span className="text-xs text-white/45">Companion cases in the workbook, all illustrative.</span>
          </div>

          <p className="reveal max-w-4xl text-sm leading-relaxed text-white/50">
            These are timing illustrations, not forecasts or promises of return. They assume constant collections from
            month one, with no ramp, no costs deducted from the investor share and no terminal principal. Actual funded
            distributions depend on agreed terms, staged rollout and collections. Distribution commencement is a term
            to be negotiated, and the source's day-one payout is not supported by its own rollout. See §3 of the
            memorandum and the workbook's Headline, Ramp and Downside cases.
          </p>
        </div>
      </section>

      {/* USE OF FUNDS */}
      <section data-reveal className="relative bg-[#07131F] px-6 py-24 md:px-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <OsLabel className="mb-6">Use of funds</OsLabel>
          <h2 className="reveal mb-12 max-w-3xl text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            Where NGN 50B is proposed to go.
          </h2>
          <div className="grid gap-6">
            {USE_OF_FUNDS.map((u) => (
              <div key={u.amount} className="reveal">
                <div className="mb-2 flex items-baseline justify-between gap-6">
                  <p className="text-sm font-bold text-white/85 md:text-base">{u.label}</p>
                  <p className="whitespace-nowrap font-mono text-sm font-semibold tabular-nums text-mint">{u.amount} · {u.pct}%</p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand" style={{ width: `${u.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 max-w-3xl text-sm text-white/55">
            Management allocation targets, not actual spend. Procurement specifications, Incoterms, factory acceptance,
            warranty and retention terms are subject to diligence.
          </p>
        </div>
      </section>

      {/* PROPOSED PROTECTIONS */}
      <section data-reveal className="relative bg-ink px-6 py-24 md:px-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <OsLabel className="mb-8">Proposed protections</OsLabel>
          <h2 className="reveal mb-12 max-w-4xl text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            Clauses 12.1–12.6, <span className="text-brand">summarized.</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {CLAUSES.map((c) => (
              <div key={c.n} className={`reveal p-8 ${GLASS}`}>
                <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-brand">Clause {c.n}</p>
                <h3 className="mb-3 text-2xl font-black tracking-tight">{c.title}</h3>
                <p className="leading-relaxed text-white/65">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 max-w-3xl text-sm leading-relaxed text-white/50">
            Source-memorandum proposals, preserved for diligence. These are not executed instruments, and a draft
            guarantee clause is not evidence of enforceable sovereign backing.
          </p>
        </div>
      </section>

      {/* DILIGENCE PROCESS */}
      <section data-reveal className="relative bg-[#07131F] px-6 py-24 md:px-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <OsLabel className="mb-6">Diligence-first</OsLabel>
          <h2 className="reveal mb-12 max-w-3xl text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            Controlled diligence, then close.
          </h2>
          <div className="reveal border-y border-white/10">
            {PROCESS.map((p) => (
              <div key={p.n} className="grid gap-4 border-b border-white/10 py-8 last:border-b-0 md:grid-cols-[8rem_1fr] md:gap-10">
                <span className="pt-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-brand">Step {p.n}</span>
                <div>
                  <h3 className="mb-2 text-2xl font-black tracking-tight md:text-3xl">{p.title}</h3>
                  <p className="max-w-2xl leading-relaxed text-white/65">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 max-w-3xl text-sm text-white/55">
            Recommended outcome: authorize diligence expenditure and document negotiation, not unconditional capital
            release on present claims.
          </p>
        </div>
      </section>

      {/* DOCUMENT PACKAGE */}
      <section data-reveal className="relative overflow-hidden bg-ink px-6 py-24 md:px-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(700px 340px at 12% 0%, rgba(24,194,90,.12), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <OsLabel className="mb-8">Document package</OsLabel>
          <h2 className="reveal mb-12 max-w-4xl text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            The diligence draft, <span className="text-brand">full detail.</span>
          </h2>

          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <div className={`reveal flex flex-col p-8 md:p-10 ${GLASS}`}>
              <span aria-hidden className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-brand text-ink">
                <FileText size={22} strokeWidth={2} />
              </span>
              <h3 className="mb-3 text-2xl font-black tracking-tight">Investment memorandum</h3>
              <p className="mb-6 flex-1 leading-relaxed text-white/65">
                The expanded diligence draft: source claims flagged, arithmetic corrected, proposed controls
                set out. The complete original text is preserved in Appendix A.
              </p>
              <p className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-white/45">PDF · 31 pages · 544 KB</p>
              <a
                href="/investors/CDS-IGRL-Investment-Memorandum.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-[10px] font-black uppercase tracking-widest text-ink transition-all hover:bg-cream"
              >
                Open the memorandum <ArrowRight size={14} aria-hidden />
              </a>
            </div>

            <div className={`reveal flex flex-col p-8 md:p-10 ${GLASS}`}>
              <span aria-hidden className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-brand text-ink">
                <FileSpreadsheet size={22} strokeWidth={2} />
              </span>
              <h3 className="mb-3 text-2xl font-black tracking-tight">Cash-flow model</h3>
              <p className="mb-6 flex-1 leading-relaxed text-white/65">
                The illustrative workbook with Headline, Ramp and Downside cases, funding and waterfall tabs, and
                audit checks. Entitlement projections only; the workbook flags funding gaps rather than hiding them.
              </p>
              <p className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-white/45">XLSX · 12 sheets · 280 KB</p>
              <a
                href="/investors/CDS-IGRL-Cashflow-Model.xlsx"
                download
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
              >
                Download the model (XLSX)
              </a>
            </div>
          </div>

          <div className={`reveal mb-10 grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10 ${GLASS}`}>
            <div>
              <h3 className="mb-2 text-2xl font-black tracking-tight">Full diligence data room</h3>
              <p className="max-w-2xl leading-relaxed text-white/65">
                Corporate records, concession and approvals, tariff instruments, instrument enumeration, collections
                evidence, procurement and calibration documentation. Released under NDA.
              </p>
            </div>
            <ButtonLink to="/get-started" variant="ghost">Request access</ButtonLink>
          </div>

          <p className="reveal flex max-w-3xl items-start gap-3 text-sm leading-relaxed text-white/55">
            <Lock size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
            Both documents are marked confidential and shared for discussion and due diligence only. Please do not
            distribute them, and confirm the current version with the CDS-IGRL team before relying on any figure.
          </p>
        </div>
      </section>

      {/* CTA — homepage scene treatment */}
      <section data-reveal className="relative overflow-hidden px-6 py-32 md:px-24">
        <img
          src="/investors/scenes/calibration.jpg"
          alt="Calibration gauge with a certification stamp"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[#050E17]/80" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <div aria-hidden className="os-grid absolute inset-0" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="reveal mb-6 text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">Start with the evidence.</h2>
          <p className="reveal mx-auto mb-12 max-w-2xl text-xl text-white/65">
            Start with an NDA, the data room and a working session on the model. Look at the numbers and the open
            items before any funding decision.
          </p>
          <div className="reveal flex flex-col justify-center gap-5 md:flex-row">
            <ButtonLink to="/get-started">Request an introduction</ButtonLink>
            <a
              href="/investors/CDS-IGRL-Investment-Memorandum.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 md:px-12"
            >
              Read the memorandum
            </a>
          </div>
          <p className="reveal mt-8 text-sm text-white/45">
            Or write to <a href="mailto:info@cdsigrl.org" className="text-brand transition-colors hover:text-cream">info@cdsigrl.org</a>.
          </p>
        </div>
        <div className="absolute right-6 bottom-8 z-10 hidden md:block md:right-24">
          <SceneTag name="Certified Accuracy" detail="Gauge + stamp" />
        </div>
      </section>
    </PageShell>
  );
}
