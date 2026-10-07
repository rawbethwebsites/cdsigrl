import { ButtonLink } from "./Buttons";

export default function CTASection({
  title = "Ready to get your measurements certified?",
  body = "One trusted partner from first assessment through certified installation and ongoing support.",
}: { title?: string; body?: string }) {
  return (
    <section data-reveal className="relative overflow-hidden bg-ink py-32 px-6 md:px-24 border-t border-white/5">
      <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="reveal text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] mb-6">{title}</h2>
        <p className="reveal text-xl text-white/65 mb-12 max-w-2xl mx-auto">{body}</p>
        <div className="reveal flex flex-col md:flex-row gap-5 justify-center">
          <ButtonLink to="/get-started">Request a Quote</ButtonLink>
          <ButtonLink to="/services" variant="ghost">View Services</ButtonLink>
        </div>
      </div>
    </section>
  );
}
