import { cn } from "@/utils/cn";

export default function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-block bg-gold text-ink text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.4em] px-5 md:px-6 py-2 rounded-full", className)}>
      {children}
    </div>
  );
}
