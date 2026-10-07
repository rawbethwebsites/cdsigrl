import { Link } from "react-router-dom";
import Logo from "./Logo";
import { SITE } from "@/data/content";

export default function SiteFooter() {
  return (
    <footer className="bg-black py-16 px-6 md:px-24 border-t border-white/5 relative z-20">
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-white/60 leading-relaxed">
            Legal metrology and precision measurement instruments for retail, industry, and science. Abuja-based, serving all 36 states.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-[10px] font-black tracking-[0.3em] uppercase text-white/60">
          <Link to="/services" className="hover:text-brand">Services</Link>
          <Link to="/equipment" className="hover:text-brand">Equipment</Link>
          <Link to="/approach" className="hover:text-brand">Approach</Link>
          <Link to="/about" className="hover:text-brand">About</Link>
          <Link to="/privacy" className="hover:text-brand">Privacy</Link>
          <Link to="/terms" className="hover:text-brand">Terms</Link>
        </div>
        <address className="not-italic flex flex-col gap-3 text-sm text-white/60">
          <span>{SITE.address}</span>
          <a href={SITE.phoneHref} className="hover:text-brand">{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} className="hover:text-brand">{SITE.email}</a>
        </address>
      </div>
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-black tracking-[0.3em] uppercase text-white/55">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>Built by The Boost Nation</span>
      </div>
    </footer>
  );
}
