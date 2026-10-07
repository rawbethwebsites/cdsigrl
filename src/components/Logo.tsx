import { cn } from "@/utils/cn";

export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 100 100" className="h-8 w-8" role="img" aria-label="CDS IGRL">
        <rect width="100" height="100" rx="20" fill={dark ? "#061b31" : "#061b31"} />
        <text x="50" y="68" fontFamily="Georgia, serif" fontSize="50" fontWeight="bold"
              fill="#ffffff" textAnchor="middle">C</text>
        <text x="50" y="68" fontFamily="Georgia, serif" fontSize="50" fontWeight="bold"
              fill="#15be53" textAnchor="middle" dx="18">D</text>
      </svg>
      <span className={cn("text-lg font-black tracking-tight", dark ? "text-ink" : "text-white")}>CDS IGRL</span>
    </span>
  );
}
