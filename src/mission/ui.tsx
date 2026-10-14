import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

/* ---------- toasts: "+10 points" moments ---------- */
type Toast = { id: number; big?: string; text: string };
const listeners = new Set<(t: Toast) => void>();
let nextId = 1;
export function toast(text: string, big?: string) {
  const t = { id: nextId++, text, big };
  listeners.forEach((l) => l(t));
}
export function Toasts() {
  const [list, setList] = useState<Toast[]>([]);
  useEffect(() => {
    const on = (t: Toast) => {
      setList((l) => [...l.slice(-2), t]);
      setTimeout(() => setList((l) => l.filter((x) => x.id !== t.id)), 3800);
    };
    listeners.add(on);
    return () => { listeners.delete(on); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[60] flex flex-col items-end gap-2" aria-live="polite">
      <AnimatePresence>
        {list.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: -16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 40 }}
            className="flex items-center gap-3 rounded-2xl border border-brand/40 bg-coal px-5 py-3 text-lg font-semibold text-cream shadow-2xl">
            {t.big && <span className="text-3xl font-black text-brand">{t.big}</span>}
            <span>{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------- animated number ---------- */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) { el.textContent = value.toLocaleString(); prev.current = value; return; }
    const c = animate(prev.current, value, { duration: 1.1, ease: "easeOut", onUpdate: (v) => { el.textContent = Math.round(v).toLocaleString(); } });
    prev.current = value;
    return () => c.stop();
  }, [value, reduce]);
  return <span ref={ref} className={className}>{value.toLocaleString()}</span>;
}

export function Bar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-3 overflow-hidden rounded-full bg-white/10", className)}>
      <motion.div className="h-full rounded-full bg-brand" initial={false} animate={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} transition={{ type: "spring", stiffness: 80, damping: 18 }} />
    </div>
  );
}

/* ---------- medal ---------- */
export function Medal({ mark, size = "md", locked = false }: { mark: string; size?: "sm" | "md" | "lg"; locked?: boolean }) {
  const s = size === "lg" ? "h-32 w-32 text-4xl border-[6px]" : size === "sm" ? "h-10 w-10 text-xs border-2" : "h-16 w-16 text-lg border-4";
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full font-black tracking-tight", s,
      locked ? "border-dashed border-white/20 bg-white/5 text-white/30" : "border-amber-400 bg-gradient-to-br from-amber-200 to-amber-500 text-amber-950 shadow-[0_0_24px_rgba(251,191,36,.35)]")}>
      {mark}
    </span>
  );
}

/* ---------- full-screen overlay ---------- */
export function Overlay({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "alarm" }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={cn("fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4", tone === "alarm" ? "bg-red-950/90" : "bg-ink/90 backdrop-blur")}>
      <motion.div initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-coal p-7 text-center text-cream shadow-2xl sm:p-9">
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Burst() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const bits = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    return { x: Math.cos(a) * (120 + (i % 3) * 40), y: Math.sin(a) * (120 + (i % 4) * 30), c: ["bg-amber-400", "bg-brand", "bg-cream"][i % 3] };
  });
  return (
    <div className="pointer-events-none absolute left-1/2 top-24 h-0 w-0" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.i key={i} className={cn("absolute h-2.5 w-2.5 rounded-sm", b.c)} initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: b.x, y: b.y, opacity: 0, rotate: 220 }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }} />
      ))}
    </div>
  );
}

export function BigButton({ children, onClick, tone = "brand", className, disabled, type = "button" }: { children: ReactNode; onClick?: () => void; tone?: "brand" | "ghost" | "danger"; className?: string; disabled?: boolean; type?: "button" | "submit" }) {
  return (
    <motion.button type={type} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={disabled}
      className={cn("min-h-14 rounded-2xl px-6 py-3 text-lg font-bold transition-colors disabled:opacity-50",
        tone === "brand" && "bg-brand text-ink hover:bg-[#2bd36b]",
        tone === "ghost" && "border-2 border-white/20 text-cream hover:border-brand hover:text-brand",
        tone === "danger" && "border-2 border-red-400/60 text-red-300 hover:bg-red-500/10", className)}>
      {children}
    </motion.button>
  );
}
