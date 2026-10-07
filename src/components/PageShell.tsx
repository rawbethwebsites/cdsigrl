import { useRef, type ReactNode } from "react";
import SEO from "./SEO";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { useReveal } from "@/utils/useReveal";

type Props = {
  title: string;
  description: string;
  path: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
};

export default function PageShell({ title, description, path, backHref, backLabel, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useReveal(containerRef, [path]);

  return (
    <div ref={containerRef} className="bg-ink text-white min-h-screen selection:bg-brand selection:text-ink">
      <SEO title={title} description={description} path={path} />
      <SiteHeader backHref={backHref} backLabel={backLabel} />
      <main className="relative z-10">
        {children}
        <SiteFooter />
      </main>
    </div>
  );
}
