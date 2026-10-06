import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

export default function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative px-6 md:px-24 pt-40 md:pt-48 pb-24 overflow-hidden">
      <div aria-hidden className="absolute -top-40 right-[-10rem] w-[40rem] h-[40rem] rounded-full bg-gold/10 blur-[120px]" />
      <div className="hero-content relative max-w-5xl mx-auto text-center">
        <Eyebrow className="mb-8">{eyebrow}</Eyebrow>
        <h1 className="text-[clamp(2.25rem,9vw,6.5rem)] font-black leading-[0.85] tracking-tighter mb-8">{title}</h1>
        {children}
      </div>
    </section>
  );
}
