import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/utils/cn";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/equipment", label: "Equipment" },
  { to: "/approach", label: "Approach" },
  { to: "/clients", label: "Who We Serve" },
];

export default function SiteHeader({ backHref, backLabel = "All Services" }: { backHref?: string; backLabel?: string }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[100] backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto h-14 md:h-16 px-6 md:px-10 flex items-center justify-between gap-6">
          <Link to="/" aria-label="CDS IGRL home"><Logo /></Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  cn("text-[11px] font-semibold tracking-wide transition-colors", isActive ? "text-gold" : "text-white/75 hover:text-white")
                }
              >
                {n.label}
              </NavLink>
            ))}
            {backHref && (
              <Link to={backHref} className="text-[11px] font-semibold tracking-wide text-white/50 hover:text-gold">← {backLabel}</Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/get-started"
              className="whitespace-nowrap bg-gold text-ink px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
            >
              <span className="sm:hidden">Contact</span>
              <span className="hidden sm:inline">Talk to Our Team</span>
            </Link>
            <button
              className="md:hidden text-white p-1"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setOpen(false)} />
          <div className="absolute top-3 left-3 right-3 rounded-2xl border border-white/10 bg-coal/95 p-5">
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button aria-label="Close menu" className="text-white p-1" onClick={() => setOpen(false)}><X size={22} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[...NAV, { to: "/get-started", label: "Contact" }].map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-xl border px-4 py-4 text-[11px] font-black uppercase tracking-widest",
                    pathname === n.to ? "border-gold/60 bg-gold/10 text-gold" : "border-white/10 bg-white/5 text-white"
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
