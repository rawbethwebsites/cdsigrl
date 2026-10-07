import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

const base = "inline-flex items-center justify-center px-10 md:px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all";

const variants = {
  primary: "bg-brand text-ink hover:bg-cream",
  primaryLight: "bg-ink text-brand hover:bg-brand hover:text-ink",
  ghost: "border-2 border-white/20 text-white hover:bg-white/10",
  ghostLight: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
};

export function ButtonLink({ to, variant = "primary", className, children }: {
  to: string; variant?: keyof typeof variants; className?: string; children: React.ReactNode;
}) {
  return <Link to={to} className={cn(base, variants[variant], className)}>{children}</Link>;
}
