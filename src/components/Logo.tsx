import { cn } from "@/utils/cn";

export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="#F5C518" opacity={dark ? 1 : 0.14} />
        <path d="M16 6L7 26h4.2l1.8-4.5h6L20.8 26H25L16 6zm0 5.6l2.1 7.4H13.9L16 11.6z" fill={dark ? "#080808" : "#F5C518"} />
      </svg>
      <span className={cn("text-lg font-black tracking-tight", dark ? "text-ink" : "text-white")}>CDS IGRL</span>
    </span>
  );
}
