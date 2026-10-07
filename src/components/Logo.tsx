import { cn } from "@/utils/cn";

/* CDS IGRL mark: a gauge-dial "C" with a calibrated needle. Source of truth: public/os/logo.svg */
export const MARK = {
  arc: "M73.04 29.26A31 31 0 1 0 73.04 70.74",
  ticks: "M60.75 31.38L58 36.14M53.73 28.83L53.21 31.78M46.27 28.83L46.79 31.78M39.25 31.38L42 36.14M33.53 36.18L35.83 38.11M29.8 42.65L32.62 43.67M28.5 50L34 50M29.8 57.35L32.62 56.33M33.53 63.82L35.83 61.89M39.25 68.62L42 63.86M46.27 71.17L46.79 68.22M53.73 71.17L53.21 68.22M60.75 68.62L58 63.86",
  needle: "M48.5 47.17L73.84 37.32L51.5 52.83Z",
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-8 w-8", className)} role="img" aria-label="CDS IGRL">
      <rect width="100" height="100" rx="22" fill="#0B0A07" />
      <path d={MARK.arc} fill="none" stroke="#F5C518" strokeWidth="9" strokeLinecap="round" />
      <path d={MARK.ticks} stroke="#F5C518" strokeOpacity=".55" strokeWidth="2.2" strokeLinecap="round" />
      <path d={MARK.needle} fill="#FFF8E6" />
      <circle cx="50" cy="50" r="5.2" fill="#FFF8E6" />
      <circle cx="50" cy="50" r="2" fill="#0B0A07" />
    </svg>
  );
}

export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("text-lg font-black tracking-tight", dark ? "text-ink" : "text-white")}>CDS IGRL</span>
        <span className={cn("mt-1 text-[9px] font-semibold uppercase tracking-[0.22em]", dark ? "text-ink/60" : "text-white/60")}>Legal Metrology</span>
      </span>
    </span>
  );
}
