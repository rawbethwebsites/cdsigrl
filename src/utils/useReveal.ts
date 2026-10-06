import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * TBN scroll-in pattern: every `[data-reveal]` section fades its `.reveal`
 * children up (or `.reveal-left` children in from the left) when it enters.
 */
export function useReveal(containerRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((section) => {
        const up = section.querySelectorAll(".reveal");
        const left = section.querySelectorAll(".reveal-left");
        if (up.length)
          gsap.from(up, {
            scrollTrigger: { trigger: section, start: "top 75%" },
            y: 60, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out",
          });
        if (left.length)
          gsap.from(left, {
            scrollTrigger: { trigger: section, start: "top 75%" },
            x: -50, opacity: 0, stagger: 0.18, duration: 1, ease: "power3.out",
          });
      });
    }, root);

    ScrollTrigger.refresh();
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
