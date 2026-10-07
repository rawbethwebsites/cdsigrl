import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import PageShell from "@/components/PageShell";
import Eyebrow from "@/components/Eyebrow";
import { ButtonLink } from "@/components/Buttons";
import { PILLARS, SITE } from "@/data/content";
import { cn } from "@/utils/cn";

const ORG_TYPES = ["Retail / Supermarket", "Food & Beverage Production", "Oil & Gas / Energy", "Healthcare / Laboratory", "Agriculture / Agro-processing", "Logistics / Mining", "Government / Regulator", "Other"];

type Status = "idle" | "sending" | "sent" | "error";

const field = "w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors";
const label = "block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-3";

export default function GetStartedPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [pillars, setPillars] = useState<string[]>([]);

  const toggle = (t: string) => setPillars((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company_website")) return; // honeypot
    const formData = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      organization: String(fd.get("organization") || ""),
      organizationType: String(fd.get("orgType") || ""),
      areasOfInterest: pillars,
      message: String(fd.get("message") || ""),
    };
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: window.location.hostname, formData }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <PageShell
      title="Request a Quote | CDS IGRL"
      description="Request a quote from CDS IGRL about your legal metrology needs — scales, flow meters, weighbridges, meters, and precision instruments."
      path="/get-started"
    >
      <section className="relative overflow-hidden px-6 md:px-24 pt-36 md:pt-44 pb-32">
        <div aria-hidden className="absolute -top-40 left-[-10rem] w-[40rem] h-[40rem] rounded-full bg-gold/10 blur-[120px]" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-16">
          <div className="hero-content">
            <Eyebrow className="mb-8">Request a Conversation</Eyebrow>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.88] tracking-tighter mb-8">TALK TO<br /><span className="text-gold">OUR TEAM.</span></h1>
            <p className="text-xl text-white/70 leading-relaxed mb-12 max-w-md">
              Tell us what you need to measure. We will come back with an honest view of the right instruments for your site — and how
              we would build past them.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start"><MapPin className="text-gold mt-0.5" size={20} /><span className="text-white/80">{SITE.address}</span></li>
              <li className="flex gap-4 items-center"><Phone className="text-gold" size={20} /><a href={SITE.phoneHref} className="text-white/80 hover:text-gold">{SITE.phone}</a></li>
              <li className="flex gap-4 items-center"><Mail className="text-gold" size={20} /><a href={`mailto:${SITE.email}`} className="text-white/80 hover:text-gold">{SITE.email}</a></li>
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
            {status === "sent" ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="mx-auto text-gold mb-6" size={56} />
                <h2 className="text-3xl font-black tracking-tight mb-4">Thank you — we have it.</h2>
                <p className="text-white/65 mb-10 max-w-sm mx-auto">A member of the CDS IGRL team will be in touch shortly.</p>
                <ButtonLink to="/services" variant="ghost">Explore Our Services</ButtonLink>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-6">
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label htmlFor="name" className={label}>Full name *</label><input id="name" name="name" required className={field} placeholder="Your name" /></div>
                  <div><label htmlFor="email" className={label}>Email *</label><input id="email" name="email" type="email" required className={field} placeholder="you@organization.org" /></div>
                  <div><label htmlFor="phone" className={label}>Phone</label><input id="phone" name="phone" type="tel" className={field} placeholder="+234 …" /></div>
                  <div><label htmlFor="organization" className={label}>Organization *</label><input id="organization" name="organization" required className={field} placeholder="Organization name" /></div>
                </div>
                <div>
                  <label htmlFor="orgType" className={label}>Organization type</label>
                  <select id="orgType" name="orgType" className={cn(field, "appearance-none")} defaultValue="">
                    <option value="" disabled className="bg-coal">Select one</option>
                    {ORG_TYPES.map((o) => <option key={o} className="bg-coal">{o}</option>)}
                  </select>
                </div>
                <fieldset>
                  <legend className={label}>Areas of interest</legend>
                  <div className="flex flex-wrap gap-2">
                    {PILLARS.map((p) => {
                      const on = pillars.includes(p.title);
                      return (
                        <button
                          type="button"
                          key={p.slug}
                          aria-pressed={on}
                          onClick={() => toggle(p.title)}
                          className={cn(
                            "rounded-full px-4 py-2 text-xs font-bold border transition-colors",
                            on ? "bg-gold text-ink border-gold" : "border-white/15 text-white/70 hover:border-white/40"
                          )}
                        >
                          {p.title}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <div><label htmlFor="message" className={label}>What do you need to measure? *</label><textarea id="message" name="message" required rows={5} className={cn(field, "resize-none")} placeholder="What are you trying to build, fix, or scale?" /></div>

                {status === "error" && (
                  <p className="text-sm text-red-300">
                    Something went wrong sending your message. Please email us directly at{" "}
                    <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a>.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-gold text-ink px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cream transition-all disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
