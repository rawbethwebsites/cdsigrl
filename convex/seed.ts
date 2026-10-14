import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Draft plan for 19–31 Oct 2026. Factory names, flights and hotels are
// placeholders for the trip leader to replace in Trip Control.
const DD = [
  "Certificates on file: OIML, MID, CE, ISO 9001 (ask for copies)",
  "Production line and monthly capacity for our volumes",
  "In-house calibration lab (ISO/IEC 17025)",
  "Tropicalized build: runs at 55°C, IP65 rated",
  "Indicative pricing: EXW, FOB, CIF Lagos, DDP Abuja (12-month firm, up to 25% volume discount)",
  "Payment terms: 30/70 standard; 20/30/50 LC above $1M; 90-day credit on government projects",
  "Training: free 14-day factory training for 10 engineers a year, 21-day on-site training in Nigeria",
  "Warranty 30 months, 10-year spare parts, 72-hour engineer response in Nigeria",
  "Export packing with shock/tilt indicators; full SONCAP import documents",
  "Joint Service Center in Abuja within 180 days",
];

type Stop = { date: string; time: string; end?: string; tz: string; type: string; title: string; city: string; place: string; details: string; sees: string[]; alarm: number };
const s = (date: string, time: string, tz: string, type: string, title: string, city: string, place: string, details = "", sees: string[] = [], alarm = 30, end?: string): Stop =>
  ({ date, time, tz, type, title, city, place, details, sees, alarm, ...(end ? { end } : {}) });
const fac = (date: string, time: string, end: string, city: string, sector: string, equip: string, extra: string[]): Stop =>
  s(date, time, "CST", "factory", `Factory visit: ${sector}`, city, `Factory to be confirmed · ${sector}`,
    `Due diligence on ${equip}. Ask for the company profile, OIML certificates, factory video and CIF Lagos pricing if not already sent.`,
    [...extra, ...DD], 45, end);

const STOPS: Stop[] = [
  s("2026-10-19", "14:00", "WAT", "briefing", "Meet at the airport & document check", "Abuja", "Nnamdi Azikiwe International Airport (ABV)", "Bring: passport with China visa, invitation letters, printed executive summary, business cards, universal power adapters, some USD cash.", ["Passport, visa and invitation letter", "Printed copies of the 11-sector requirement brief", "Laptop, chargers and adapters"], 120),
  s("2026-10-19", "17:30", "WAT", "flight", "Flight to Addis Ababa", "Abuja", "ABV → Addis Ababa (ADD)", "Airline and flight number to be confirmed. Check bags through to Guangzhou.", [], 180),
  s("2026-10-20", "01:00", "EAT", "flight", "Connecting flight to Guangzhou", "Addis Ababa", "ADD → Guangzhou Baiyun (CAN)", "Overnight flight. Rest; tomorrow evening has a team briefing.", [], 90),
  s("2026-10-20", "16:30", "CST", "transfer", "Arrive in China · meet driver & interpreter", "Guangzhou", "Guangzhou Baiyun International Airport", "Clear immigration, collect bags, buy a local SIM or turn on roaming. Driver waits at arrivals with a CDS-IGRL sign."),
  s("2026-10-20", "18:30", "CST", "hotel", "Hotel check-in", "Guangzhou", "Hotel to be confirmed · Tianhe district", "", [], 15),
  s("2026-10-20", "20:00", "CST", "briefing", "Welcome dinner & team briefing", "Guangzhou", "Hotel meeting room", "Who leads which sector, how we score factories (1 to 5 per check), what we never commit to on the floor.", ["Sector leads agreed", "Scoring method agreed"], 30, "21:30"),
  fac("2026-10-21", "09:30", "12:30", "Shenzhen", "Electricity", "energy meter test benches, reference standards and CT/PT analyzers", ["Energy meter test bench demo", "Reference standard accuracy class"]),
  fac("2026-10-21", "14:30", "17:30", "Shenzhen", "Telecom", "RF power and spectrum analyzer verification and CDR timing systems", ["Spectrum analyzer verification setup", "CDR timing system demo"]),
  fac("2026-10-22", "09:30", "12:30", "Shenzhen", "Medical", "medical scales, BP testers, infusion pump analyzers and radiation calibrators", ["Medical scale and BP tester range"]),
  fac("2026-10-22", "14:30", "17:30", "Shenzhen", "Gaming", "RNG verification and slot machine fairness testing systems", ["RNG verification test run"]),
  fac("2026-10-23", "09:00", "12:00", "Guangzhou", "Taxi meter & transport", "taxi meter rollers (OIML R21), ride-hailing app verification and speedometer/tachograph testers", ["Taxi meter roller demo (OIML R21)"]),
  s("2026-10-23", "15:30", "CST", "flight", "Domestic flight to Hangzhou", "Guangzhou", "CAN → Hangzhou Xiaoshan (HGH)", "About 2 hours. Flight to be confirmed.", [], 150),
  s("2026-10-23", "19:30", "CST", "hotel", "Hotel check-in, Hangzhou", "Hangzhou", "Hotel to be confirmed", "", [], 15),
  fac("2026-10-24", "09:30", "12:30", "Hangzhou", "Agriculture", "grain moisture testers, livestock scales, milk analyzers and produce grading scales", ["Grain moisture tester demo"]),
  s("2026-10-24", "14:00", "CST", "free", "Free afternoon", "Hangzhou", "", "Rest, or join a tour from the Tours tab.", [], 0),
  s("2026-10-25", "10:00", "CST", "free", "Rest day", "Hangzhou", "", "Sunday. No visits planned.", [], 0),
  s("2026-10-25", "18:00", "CST", "briefing", "Mid-trip review: first shortlist", "Hangzhou", "Hotel meeting room", "Compare scores from the first six factories. Agree what to push on next week.", ["Shortlist after week one", "Questions to send back to factories"], 30, "19:30"),
  s("2026-10-26", "07:30", "CST", "transfer", "Drive to Ningbo", "Ningbo", "Road transfer Hangzhou → Ningbo", "About 2 hours."),
  fac("2026-10-26", "10:00", "13:00", "Ningbo", "Water", "water meter test benches (15mm–500mm), bulk flow metering and water tanker calibration", ["Water meter test bench (15mm–500mm)"]),
  s("2026-10-26", "16:00", "CST", "transfer", "Train to Shanghai", "Shanghai", "High-speed train Ningbo → Shanghai", "About 2 hours. Hotel check-in on arrival.", [], 60),
  fac("2026-10-27", "09:30", "12:30", "Changzhou", "General trade", "weighbridges (60–150T), fuel dispenser test measures and LPG/CNG systems", ["Weighbridge load test"]),
  fac("2026-10-27", "14:30", "17:00", "Changzhou", "Road construction", "Weigh-In-Motion, asphalt batching plant calibration and compression test verification", ["Weigh-In-Motion demo"]),
  fac("2026-10-28", "09:30", "12:30", "Shanghai", "Calibration labs", "E1–M1 master weights, mass comparators and pressure/temperature/dimensional calibration", ["Mass comparator demo", "ISO/IEC 17025 lab tour"]),
  fac("2026-10-28", "14:30", "17:30", "Shanghai", "Wet & dry tanks", "road tanker calibration (1,000L–50,000L), prover tanks and silo weighing", ["Prover tank and tanker calibration rig"]),
  s("2026-10-29", "10:00", "CST", "meeting", "Partner negotiations with the shortlist", "Shanghai", "Venue to be confirmed", "Pricing, payment terms, training, warranty and the Abuja service center. No signatures without approval from the head of delegation.", ["Best CIF Lagos / DDP Abuja offer", "Payment and LC terms agreed", "Training and tech transfer commitments", "Warranty and service commitments"], 45, "16:00"),
  s("2026-10-29", "19:00", "CST", "meal", "Farewell dinner with partners", "Shanghai", "Restaurant to be confirmed", "", [], 45),
  s("2026-10-30", "09:30", "CST", "meeting", "Final decision & next steps", "Shanghai", "Hotel meeting room", "Agree preferred partner per sector and the follow-up list.", ["Preferred partner per sector", "Documents still owed by factories"], 30, "12:00"),
  s("2026-10-30", "21:30", "CST", "flight", "Flight home", "Shanghai", "Shanghai Pudong (PVG) → Addis Ababa → Abuja", "Be at the airport 3 hours early. Flight to be confirmed.", [], 240),
  s("2026-10-31", "13:00", "WAT", "transfer", "Arrive home in Abuja", "Abuja", "Nnamdi Azikiwe International Airport (ABV)", "Welcome home. Finish your notes and open your storybook."),
];

const TOURS = [
  { title: "Canton Tower & Pearl River night cruise", city: "Guangzhou", date: "2026-10-21", time: "19:30", duration: "3 hours", teaser: "See Guangzhou lit up from the river, then the view from one of the tallest towers in China." },
  { title: "West Lake boat ride & Longjing tea village", city: "Hangzhou", date: "2026-10-24", time: "14:30", duration: "4 hours", teaser: "A slow afternoon on Hangzhou's famous lake, then tea tasting where Dragon Well tea is grown." },
  { title: "Water town day trip", city: "Hangzhou", date: "2026-10-25", time: "09:00", duration: "Full day", teaser: "Canals, stone bridges and old streets on the rest day." },
  { title: "The Bund & Huangpu River night cruise", city: "Shanghai", date: "2026-10-27", time: "19:30", duration: "2.5 hours", teaser: "Shanghai's skyline from the water, then a walk along the Bund." },
  { title: "Shanghai Tower observation deck & Maglev ride", city: "Shanghai", date: "2026-10-30", time: "13:30", duration: "3 hours", teaser: "The city from above, and a ride on one of the fastest trains in the world before the flight home." },
];

/** npx convex run seed:trip — loads the draft itinerary once (skips if stops exist). */
export const trip = internalMutation({
  args: {},
  handler: async (ctx) => {
    if (await ctx.db.query("stops").first()) return "Itinerary already loaded; nothing changed.";
    for (const [i, st] of STOPS.entries()) await ctx.db.insert("stops", { ...st, order: i });
    for (const t of TOURS) await ctx.db.insert("tours", { ...t, tz: "CST", price: "Price on request", details: "Meeting point to be confirmed by the trip leader.", visible: true });
    if (!(await ctx.db.query("meta").first()))
      await ctx.db.insert("meta", { name: "China Partner Mission 2026", dates: "19–31 Oct 2026", route: ["Abuja", "Guangzhou", "Shenzhen", "Hangzhou", "Ningbo", "Shanghai", "Abuja"] });
    return `Loaded ${STOPS.length} stops and ${TOURS.length} tours.`;
  },
});

/** npx convex run seed:leader '{"name":"Rob"}' — creates a trip leader and prints their sign-in path. */
export const leader = internalMutation({
  args: { name: v.string(), title: v.optional(v.string()) },
  handler: async (ctx, { name, title }) => {
    const token = crypto.randomUUID().replace(/-/g, "");
    await ctx.db.insert("travellers", { name, title: title ?? "Trip leader", role: "admin", token });
    return `/mission?k=${token}`;
  },
});
