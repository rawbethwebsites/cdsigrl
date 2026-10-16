import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import { ButtonLink } from "@/components/Buttons";
import { ArrowRight, FileSpreadsheet, FileText, Lock } from "lucide-react";

type Metric = { value: string; label: string; note: string; compact?: boolean };

const METRICS: Metric[] = [
  {
    value: "NGN 50B",
    label: "Proposed investor capital",
    note: "Illustrative sizing; released in staged closes against milestones.",
  },
  {
    value: "NGN 420B",
    label: "Illustrated 10-year gross proceeds",
    note: "Entitlement case — 10% of the source's constant NGN 35B/month target.",
  },
  {
    value: "8.4\u00D7",
    label: "MOIC on gross proceeds",
    note: "NGN 420B divided by NGN 50B; no terminal principal repayment assumed.",
  },
  {
    value: "740%",
    label: "Simple net ROI — recalculated",
    note: "The source's 840% conflates MOIC with ROI; corrected arithmetic in the memorandum.",
  },
  {
    value: "14.3 mo",
    label: "Interpolated payback",
    note: "First whole monthly payment crossing capital occurs in month 15.",
  },
  {
    value: "125.2% / 83.8%",
    label: "Illustrated effective annual IRR",
    note: "Monthly vs year-end receipt timing. Neither reproduces the source's ~68%.",
    compact: true,
  },
];

const SCENARIOS = [
  { name: "Headline", moic: "8.4\u00D7", payback: "15 mo" },
  { name: "Ramp", moic: "7.87\u00D7", payback: "22 mo" },
  { name: "Downside", moic: "4.6\u00D7", payback: "35 mo" },
];

const USE_OF_FUNDS = [
  { label: "Equipment — weighbridges, provers, reference weights, flow rigs, mobile verification units", amount: "NGN 25B", pct: 50 },
  { label: "Infrastructure — six zonal ISO 17025 laboratories, field fleet, data centre and disaster recovery", amount: "NGN 10B", pct: 20 },
  { label: "Technology — national metrology portal, e-certificates, e-payment, AI verification, USSD and app", amount: "NGN 8B", pct: 16 },
  { label: "Human capital — inspector recruitment, OIML certification, factory training", amount: "NGN 4B", pct: 8 },
  { label: "Compliance — ICRC, performance bond, insurance, legal and audit", amount: "NGN 3B", pct: 6 },
];

const CLAUSES = [
  {
    n: "12.1",
    title: "Tenor & profit share",
    body: "A 20-year concession; the investor is admitted as a 10% gross-revenue profit-sharing partner for a fixed 10 years, computed as a first-line charge from the concessionaire's share, irrespective of payback speed.",
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
  { n: "04", title: "Site visits", body: "Lagos Apapa and the Abuja pilot lab — and witnessed factory acceptance testing in China at equipment-order stage." },
  { n: "05", title: "Escrow & close", body: "Trustee-arranged escrow with milestone release controls, then staged financial close against verified deliverables." },
];

export default function InvestorsPage() {
  return (
    <PageShell
      title="Investor Relations — NGN 50B Legal Metrology Raise | CDS IGRL"
      description="The proposed NGN 50 billion expansion of Nigeria's legal metrology services — transaction structure, illustrative economics and diligence documents for prospective investors and lenders."
      path="/investors"
    >
      <PageHero
        eyebrow="Investor Relations"
        title={
          <>
            FUND THE
            <br />
            <span className="text-brand">STANDARD.</span>
          </>
        }
      >
        <p className="text-xl md:text-2xl font-medium text-white/75 max-w-3xl mx-auto leading-relaxed">
          A proposed NGN 50 billion capital raise to modernize Nigeria's legal metrology infrastructure — structured as a
          ten-year gross-revenue participation, presented for discussion and due diligence.
        </p>
      </PageHero>

      <section aria-label="Diligence status" className="bg-coal/60 border-y border-white/10 py-6 px-6 md:px-24">
        <p className="max-w-6xl mx-auto text-center text-sm md:text-base text-white/70 leading-relaxed">
          <span className="inline-block text-brand font-black uppercase tracking-[0.3em] text-[10px] mr-3 align-middle">Diligence draft</span>
          This page summarizes a document prepared for discussion only — not an offer, legal opinion or evidence of an
          executed guarantee. Terms shown are proposed; figures are management targets or mathematical illustrations,
          not verified results.
        </p>
      </section>

      <section data-reveal className="bg-ink py-24 md:py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-8">The opportunity</Eyebrow>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-8 max-w-4xl">
            A national measurement platform,
            <span className="text-brand"> proposed to be built.</span>
          </h2>
          <div className="reveal grid gap-6 md:grid-cols-2 mb-12">
            <p className="text-lg text-white/65 leading-relaxed">
              CDS-IGRL is described in the source memorandum as the sole concessionaire appointed by the Federal
              Government of Nigeria — through the Federal Ministry of Industry, Trade &amp; Investment and its
              Department of Weights &amp; Measures — to administer, modernize, expand and manage legal metrology
              services nationwide. The appointment and the scope of exclusivity are source claims, subject to
              diligence.
            </p>
            <p className="text-lg text-white/65 leading-relaxed">
              Official targets have long outpaced actual collections, and the cited bottleneck is equipment, mobility
              and technology — not policy. The proposed program answers with certified infrastructure: six zonal
              ISO 17025 laboratories, a fleet of mobile verification units, a national digital registry with
              e-certificates and e-payment, and trained inspectors across all 36 states and the FCT.
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-3 mb-4">
            {["40M+ SMEs", "100k+ fuel pumps", "50k tankers", "12M electricity meters", "200M mobile lines", "5,000 manufacturers"].map((c) => (
              <span key={c} className="rounded-full bg-white/5 border border-white/10 px-6 py-3 text-sm font-bold">
                {c}
              </span>
            ))}
          </div>
          <p className="reveal text-xs text-white/45 max-w-3xl leading-relaxed">
            Source memorandum market assertions — not contracted customers. Subscribers are not automatically
            separately chargeable instruments.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-cream text-ink py-24 md:py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-brand-deep mb-6">Proposed structure</p>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-10 max-w-4xl">
            How the raise is proposed to work.
          </h2>

          <div className="reveal rounded-2xl bg-white shadow-lg shadow-ink/5 p-8 md:p-12 mb-10">
            <div aria-hidden className="flex h-12 rounded-xl overflow-hidden border border-ink/10 mb-6">
              <div className="bg-ink" style={{ width: "40%" }} />
              <div className="bg-brand" style={{ width: "10%" }} />
              <div className="bg-brand/20" style={{ width: "50%" }} />
            </div>
            <ul className="grid gap-4 md:grid-cols-3 text-sm">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-ink" />
                <span><strong className="font-black">FGN — 40%</strong> — to the Treasury Single Account</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-brand" />
                <span><strong className="font-black">Investor — 10%</strong> — first-line charge from the concessionaire's share</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-brand/20" />
                <span><strong className="font-black">CDS-IGRL — 50%</strong> — includes the proposed OPEX reserve and distribution</span>
              </li>
            </ul>
            <p className="mt-6 text-xs text-ink/50 leading-relaxed">
              Percentages of defined gross revenue; totals 100% before separately resolved tax treatment. "Gross" must
              be contractually defined before these allocations can be implemented.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="reveal rounded-2xl bg-white shadow-lg shadow-ink/5 p-8">
              <h3 className="text-xl font-black mb-3">The raise</h3>
              <p className="text-ink/65 leading-relaxed">
                NGN 50 billion, proposed from one investor or a consortium — pension funds, banks, private equity and
                high-net-worth individuals are the named candidates — released in staged closes against milestones.
              </p>
            </div>
            <div className="reveal rounded-2xl bg-white shadow-lg shadow-ink/5 p-8">
              <h3 className="text-xl font-black mb-3">The participation</h3>
              <p className="text-ink/65 leading-relaxed">
                10% of defined gross revenue as a first-line charge from the concessionaire's share, for a fixed ten
                years within a proposed twenty-year concession. Characterization for tax and law is for transaction
                counsel.
              </p>
            </div>
            <div className="reveal rounded-2xl bg-white shadow-lg shadow-ink/5 p-8">
              <h3 className="text-xl font-black mb-3">The settlement</h3>
              <p className="text-ink/65 leading-relaxed">
                A tripartite escrow under a CBN-appointed trustee with a proposed monthly auto-sweep. Bank and
                trustee identities differ across the source sections and no commitment is verified; this is a term to
                be reconciled.
              </p>
            </div>
            <div className="reveal rounded-2xl bg-white shadow-lg shadow-ink/5 p-8">
              <h3 className="text-xl font-black mb-3">The security</h3>
              <p className="text-ink/65 leading-relaxed">
                Proposed: receivables domiciliation, lien over the equipment, corporate and director guarantees,
                all-risk and political-risk cover, and a performance bond. "Senior secured" is not established
                without perfected documentation.
              </p>
            </div>
          </div>
          <p className="reveal mt-8 text-sm text-ink/55 max-w-3xl">
            Every term above is a proposal from the source memorandum. Nothing is executed; a reconciled term sheet
            and legal review precede any close.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-ink py-24 md:py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-8">Illustrations — not forecasts</Eyebrow>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6 max-w-4xl">
            The target case, <span className="text-brand">recalculated.</span>
          </h2>
          <p className="reveal text-lg text-white/65 max-w-3xl mb-12 leading-relaxed">
            On the source's constant NGN 35B/month gross target, with NGN 50B fully funded at month zero — arithmetic
            only, before real-world ramp, costs or staging.
          </p>

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {METRICS.map((m) => (
              <div key={m.label} className="reveal rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-brand/40">
                <p className={`${m.compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"} font-black tracking-tighter text-brand tabular-nums mb-3`}>
                  {m.value}
                </p>
                <p className="text-sm font-bold text-white/85 mb-2">{m.label}</p>
                <p className="text-xs text-white/50 leading-relaxed">{m.note}</p>
              </div>
            ))}
          </div>

          <div className="reveal flex flex-wrap items-center gap-3 mb-6">
            {SCENARIOS.map((s) => (
              <span key={s.name} className="rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-bold text-white/80 tabular-nums">
                {s.name}: {s.moic} MOIC · payback {s.payback}
              </span>
            ))}
            <span className="text-xs text-white/45">— companion cases in the workbook, all illustrative</span>
          </div>

          <p className="reveal text-sm text-white/50 max-w-4xl leading-relaxed">
            Not forecasts and not promised returns. The illustrations assume constant collections from month one, no
            ramp, no costs deducted from the investor share and no terminal principal. Actual funded distributions
            depend on agreed terms, staged rollout and collections — distribution commencement is a term to be
            negotiated, and the source's day-one payout is not supported by its own rollout. See §3 of the memorandum
            and the workbook's Headline, Ramp and Downside cases.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-cream text-ink py-24 md:py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-brand-deep mb-6">Use of funds</p>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-12 max-w-3xl">
            Where NGN 50B is proposed to go.
          </h2>
          <div className="grid gap-6">
            {USE_OF_FUNDS.map((u) => (
              <div key={u.amount} className="reveal">
                <div className="flex items-baseline justify-between gap-6 mb-2">
                  <p className="text-sm md:text-base font-bold">{u.label}</p>
                  <p className="text-sm font-black tabular-nums whitespace-nowrap">{u.amount} · {u.pct}%</p>
                </div>
                <div className="h-2.5 rounded-full bg-ink/10 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-deep" style={{ width: `${u.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 text-sm text-ink/55 max-w-3xl">
            Management allocation targets — not actual spend. Procurement specifications, Incoterms, factory acceptance,
            warranty and retention terms are subject to diligence.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-ink py-24 md:py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-8">Proposed protections</Eyebrow>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-12 max-w-4xl">
            Clauses 12.1–12.6, <span className="text-brand">summarized.</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {CLAUSES.map((c) => (
              <div key={c.n} className="reveal rounded-2xl border border-white/10 bg-white/5 p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-2">Clause {c.n}</p>
                <h3 className="text-2xl font-black tracking-tight mb-3">{c.title}</h3>
                <p className="text-white/65 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 text-sm text-white/50 max-w-3xl leading-relaxed">
            Source-memorandum proposals, preserved for diligence — not executed instruments. A draft guarantee clause
            is not evidence of enforceable sovereign backing.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-cream text-ink py-24 md:py-32 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-[10px] font-black uppercase tracking-[0.4em] text-brand-deep mb-6">Diligence-first</p>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-12 max-w-3xl">
            Controlled diligence, then close.
          </h2>
          <div className="grid gap-6">
            {PROCESS.map((p) => (
              <div key={p.n} className="reveal-left grid md:grid-cols-[10rem_1fr] gap-4 md:gap-12 rounded-2xl bg-white shadow-lg shadow-ink/5 p-8 md:p-10">
                <span className="text-6xl md:text-7xl font-black text-brand-deep leading-none tabular-nums">{p.n}</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{p.title}</h3>
                  <p className="text-ink/65 leading-relaxed max-w-2xl">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="reveal mt-8 text-sm text-ink/55 max-w-3xl">
            Recommended outcome: authorize diligence expenditure and document negotiation — not unconditional capital
            release on present claims.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-ink py-24 md:py-32 px-6 md:px-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Eyebrow className="mb-8">Document package</Eyebrow>
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-12 max-w-4xl">
            The diligence draft, <span className="text-brand">full detail.</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2 mb-10">
            <div className="reveal rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 flex flex-col">
              <span aria-hidden className="h-12 w-12 rounded-xl bg-brand text-ink grid place-items-center mb-6">
                <FileText size={22} strokeWidth={2} />
              </span>
              <h3 className="text-2xl font-black tracking-tight mb-3">Investment memorandum</h3>
              <p className="text-white/65 leading-relaxed mb-6 flex-1">
                The expanded 15-page diligence draft: source claims flagged, arithmetic corrected, proposed controls
                set out — with the complete original text preserved in Appendix A.
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45 mb-4">PDF · 15 pages · 122 KB</p>
              <a
                href="/investors/CDS-IGRL-Investment-Memorandum.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand text-ink hover:bg-cream transition-all"
              >
                Open the memorandum <ArrowRight size={14} aria-hidden />
              </a>
            </div>

            <div className="reveal rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 flex flex-col">
              <span aria-hidden className="h-12 w-12 rounded-xl bg-brand text-ink grid place-items-center mb-6">
                <FileSpreadsheet size={22} strokeWidth={2} />
              </span>
              <h3 className="text-2xl font-black tracking-tight mb-3">Cash-flow model</h3>
              <p className="text-white/65 leading-relaxed mb-6 flex-1">
                The illustrative workbook with Headline, Ramp and Downside cases, funding and waterfall tabs, and
                audit checks. Entitlement projections only — funding gaps are flagged, not hidden.
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45 mb-4">XLSX · 12 sheets · 280 KB</p>
              <a
                href="/investors/CDS-IGRL-Cashflow-Model.xlsx"
                download
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white/20 text-white hover:bg-white/10 transition-all"
              >
                Download the model (XLSX)
              </a>
            </div>
          </div>

          <div className="reveal rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center mb-10">
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Full diligence data room</h3>
              <p className="text-white/65 leading-relaxed max-w-2xl">
                Corporate records, concession and approvals, tariff instruments, instrument enumeration, collections
                evidence, procurement and calibration documentation — released under NDA.
              </p>
            </div>
            <ButtonLink to="/get-started" variant="ghost">Request access</ButtonLink>
          </div>

          <p className="reveal flex items-start gap-3 text-sm text-white/55 leading-relaxed max-w-3xl">
            <Lock size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
            Both documents are marked confidential and shared for discussion and due diligence only — please do not
            distribute. Confirm the current version with the CDS-IGRL team before relying on any figure.
          </p>
        </div>
      </section>

      <section data-reveal className="relative overflow-hidden bg-ink py-32 px-6 md:px-24 border-t border-white/5">
        <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] rounded-full bg-brand/10 blur-[120px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">Start with the evidence.</h2>
          <p className="reveal text-xl text-white/65 mb-12 max-w-2xl mx-auto">
            Begin with an NDA, the data room and a working session on the model — the numbers, the gaps and the open
            items — before any funding decision.
          </p>
          <div className="reveal flex flex-col md:flex-row gap-5 justify-center">
            <ButtonLink to="/get-started">Request an introduction</ButtonLink>
            <a
              href="/investors/CDS-IGRL-Investment-Memorandum.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 md:px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 border-white/20 text-white hover:bg-white/10"
            >
              Read the memorandum
            </a>
          </div>
          <p className="reveal mt-8 text-sm text-white/45">
            Or write to <a href="mailto:info@cdsigrl.org" className="text-brand hover:text-cream transition-colors">info@cdsigrl.org</a>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
