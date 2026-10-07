import PageShell from "@/components/PageShell";
import { SITE } from "@/data/content";

const PRIVACY = [
  ["Information we collect", "When you contact us through this website we collect the details you provide — such as your name, email address, phone number, organization, and message."],
  ["How we use it", "We use this information only to respond to your enquiry and to discuss a potential engagement. We do not sell or rent personal information."],
  ["Storage and security", "Enquiries are transmitted securely and retained only as long as needed to respond and maintain business records."],
  ["Your rights", `You may request access to, correction of, or deletion of your personal information at any time by emailing ${SITE.email}.`],
];

const TERMS = [
  ["Use of this website", "This website provides general information about CDS International Global Resources Limited and its services. Content is not professional advice for any specific situation."],
  ["Engagements", "Any supply, installation, calibration, or support engagement is governed by a separate written agreement between CDS International Global Resources Limited and the client."],
  ["Intellectual property", "All content on this site, including text and brand marks, belongs to CDS International Global Resources Limited unless otherwise stated."],
  ["Liability", "CDS International Global Resources Limited is not liable for decisions made solely on the basis of information published on this website."],
];

export default function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const isPrivacy = kind === "privacy";
  const items = isPrivacy ? PRIVACY : TERMS;
  const heading = isPrivacy ? "Privacy Policy" : "Terms of Use";
  return (
    <PageShell title={`${heading} | CDS International Global Resources Limited`} description={`${heading} for the CDS International Global Resources Limited website.`} path={`/${kind}`}>
      <section className="px-6 md:px-24 pt-40 pb-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">{heading}</h1>
          <p className="text-white/40 text-sm mb-16">Last updated October 2026</p>
          <div className="space-y-12">
            {items.map(([t, b]) => (
              <div key={t}>
                <h2 className="text-2xl font-bold mb-3 text-gold">{t}</h2>
                <p className="text-white/70 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-16 text-white/50">Questions? Contact <a href={`mailto:${SITE.email}`} className="text-gold underline">{SITE.email}</a>.</p>
        </div>
      </section>
    </PageShell>
  );
}
