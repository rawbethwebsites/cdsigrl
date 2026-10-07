# CDS IGRL — Plan to Client-Delivery Ready

**Site:** https://cdsigrl.theboostnation.space
**Repo:** rawbethwebsites/cdsigrl · **Local:** `/Users/mac/Documents/PROJECTS/cdsigrl`
**Baseline:** Astudity template cloned, OS boot bug fixed (commit `60a38da`). Structure + layout intact. Content swap is ~70% done.
**Audit date:** 2026-10-07

---

## Approach

The template is structurally sound and the boot-blocking JS bug is resolved. What remains is
(a) one **hard blocker** that makes the contact form silently dead, (b) a set of **leftover
Astudity words** still visible to the client across 10 files, and (c) **missing deliverables**
the old CDS site had (locked equipment catalogue, real brand assets, clean meta).

No layout or component architecture changes are required — this is content, brand assets,
and form wiring.

## Scope

**In**
- Wire the contact form to a live channel (currently returns HTTP 500)
- Purge all remaining Astudity-era wording from React pages and the OS desktop page
- Rebuild brand assets (favicon, logo mark, OG image) for CDS IGRL
- Restore the equipment catalogue as a proper `/equipment` route
- Remove the `/classic` nav item that exposes template lineage
- Fix real contact details (phone, address) + accessibility/contrast passes

**Out**
- Redesigning the OS desktop concept, wallpaper engine, or 3D hero orb
- Adding new pages beyond `/equipment`
- Any change to the dark/gold visual system, typography, or component structure

---

## P0 — Blockers (must fix before showing client)

- [ ] **B1. Contact form is dead.** `api/lead.js` returns HTTP 500 because `TELEGRAM_BOT_TOKEN`
      and `TELEGRAM_CHAT_ID` are not set on the Vercel project (`vercel env ls` → none).
      User sees an error; no lead ever arrives. *Decision needed: Telegram channel, or email
      via Brevo/SendGrid, or both?*
- [ ] **B2. Phone number is not dialable.** `+234 800 CDS IGRL` is a vanity string and the
      `tel:` href is still the masked `+234****7760` in `public/index.html`. Needs a real line.
- [ ] **B3. Address unconfirmed.** Using "House 21, Megro Crescent, Maitama, Abuja" from the
      old site — verify before it ships on a client deliverable.

## P0 — Leftover Astudity wording (client-visible)

- [ ] **C1. `src/components/SiteFooter.tsx`** — "Institutional build for governments, funds, and enterprises."
- [ ] **C2. `src/components/CTASection.tsx`** — default title "Ready to build an institution that lasts?" + body
- [ ] **C3. `src/pages/HomePage.tsx`** — eyebrow "Institutional Build Partner"; H1 "END-TO-END INSTITUTIONAL BUILD."; section "The 8 pillars of institutional build."; "Building institutions, not just fixing them."; "Every mandate is an end-to-end build…"; "Clients building institutions that matter."; `STATS` array (`8 / End-to-End / Global + Local`)
- [ ] **C4. `src/pages/ServicesPage.tsx`** — "THE 8 PILLARS OF INSTITUTIONAL BUILD."; description; testimonial lines ("strategy, structure, systems, governance, capital…"); CTA "Not sure which pillars you need?"
- [ ] **C5. `src/pages/ServiceDetailPage.tsx`** — eyebrow "Pillar {n}"; "All 8 Pillars"; "Discuss Your Mandate"; "Next Pillar" (×2)
- [ ] **C6. `src/pages/ClientsPage.tsx`** — title/description/hero "CLIENTS BUILDING INSTITUTIONS THAT MATTER."
- [ ] **C7. `src/pages/GetStartedPage.tsx`** — `ORG_TYPES` (Government/DFI/Enterprise/SPV); "Tell us about your mandate"; label "Your mandate *"
- [ ] **C8. `src/pages/AboutPage.tsx`** — mission quote; "strategy, institution design, technology, PPP advisory, investor engagement… governance… capital"
- [ ] **C9. `src/pages/LegalPage.tsx`** — "advisory or implementation engagement"
- [ ] **C10. `public/index.html`** — notch aria-labels "pillar"; terminal help "the 8 core capabilities"; quick-chat buttons "PPP advisory? / Investor readiness?"; pillar window eyebrow "Pillar {n}"; Spotlight label "Pillar "+p.n; `/* cycles the 8 pillars */`
- [ ] **C11. `public/os/wallpaper.js`** — scene name "Institutional Identity" → "Measurement Identity"
- [ ] **C12. Rename `Pillar`→`Service` type** in `src/data/content.ts` (internal, low risk, avoids future confusion)

## P0 — Missing deliverables the old site had

- [ ] **D1. Equipment catalogue.** Old repo shipped a 22-item, password-gated
      `equipment.html` (6 categories, password `METRO2026`) with What It Does / Uses in Nigeria /
      Compliance fields. The new site has **nothing** — the client's core product list is gone.
      Rebuild as a proper `/equipment` route on the new design system, ungated or
      gated-behind-a-real-form (recommend: ungated, it's marketing collateral).
- [ ] **D2. OG / social image.** `public/og-image.jpg` is byte-identical to Astudity's
      (md5 `b6565b1c…`). Shares the wrong brand on every WhatsApp/LinkedIn/X link preview.
- [ ] **D3. Favicon + logo mark.** `favicon.svg` / `public/os/logo.svg` still draw Astudity's
      "A" chevron. Needs the official CDS IGRL mark (per TBN convention: client logo first).
- [ ] **D4. Remove `/classic` from `SiteHeader` NAV.** It exposes the template lineage and
      leads to a redundant homepage.

## P1 — Polish for a credible handover

- [ ] **P1.1 Contrast.** `text-white/30`, `/40`, `/45` appear 7× and fall below the 4.5:1
      body-text threshold on black. Raise the floor to `/60`.
- [ ] **P1.2 Swap the 🏛️ emoji** in the OS "Request a quote" widget for an inline SVG
      (brand rule: no emoji as structural icons). `📍📞✉️` in the mail template are fine.
- [ ] **P1.3 Stats integrity.** HomePage `STATS` says "8 / End-to-End / Global + Local" for a
      6-service company. Replace with real numbers: 6 categories, 22+ instrument types,
      36-state coverage, 100% compliance-checked.
- [ ] **P1.4 Mobile QA** at 375px + landscape on every route; confirm OS desktop is usable
      on touch (dock, windows, notch).
- [ ] **P1.5 Reduced-motion + `node --check`** on `public/index.html` after every OS edit
      (this file broke once already — always syntax-check before deploy).

## P2 — Nice to have

- [ ] **P2.1** `robots.txt` + `sitemap.xml`
- [ ] **P2.2** 404 route (currently `*` silently redirects to the OS)
- [ ] **P2.3** Focus trap in the OS mobile menu / modal
- [ ] **P2.4** Confirm Vercel Analytics is receiving events
- [ ] **P2.5** Lighthouse pass (perf budget is heavy: 3D orb + 1.35 MB single-file bundle)

---

## Execution order

1. Resolve **B1–B3** (needs your input — see Open Questions)
2. **C1–C12** content purge — one pass, then `npm run build` + `node --check`
3. **D2–D4** brand assets + nav cleanup
4. **D1** equipment catalogue (largest single item)
5. **P1** polish, then mobile QA
6. Deploy, verify live, write vault handoff note

## Validation

- [ ] `npm run build` clean, `node --check` passes on `public/index.html`
- [ ] Submit the contact form on production → confirm the message actually arrives
- [ ] `grep -ri "astudity\|institution\|mandate\|Pillar\|DFI\|PPP" src public` → zero hits
- [ ] Visit every route on desktop + 375px mobile
- [ ] Social preview test on the production URL (og-image)
- [ ] `curl -sI` returns 200 on the custom domain after deploy

## Open Questions

1. **Lead delivery channel** — Telegram (needs bot token + chat id), email (Brevo/SendGrid), or both?
2. **Real phone number + confirm the Abuja address** for the client's letterhead.
3. **Equipment catalogue** — ungated public page, or keep it password-gated like the old site?
4. **Do you have the official CDS IGRL logo file** (SVG/PNG)? Needed for D2/D3 — I should not
   recreate a client logo in SVG.
