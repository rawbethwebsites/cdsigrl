import { ConvexError } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

export async function findTraveller(ctx: QueryCtx, token: string) {
  if (!token) return null;
  return await ctx.db
    .query("travellers")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
}

export async function requireTraveller(ctx: QueryCtx, token: string) {
  const t = await findTraveller(ctx, token);
  if (!t) throw new ConvexError("This link is not valid. Ask the trip leader for your personal link.");
  return t;
}

export async function requireAdmin(ctx: QueryCtx, token: string) {
  const t = await requireTraveller(ctx, token);
  if (t.role !== "admin") throw new ConvexError("Only the trip leader can do this.");
  return t;
}

/* ---------------- points & achievements ---------------- */

export const POINTS = {
  checkIn: 50,
  checkScored: 10,
  checkNote: 5,
  impression: 15,
  photo: 5,
  callAnswered: 20,
  quickAnswer: 10, // answered within 5 minutes
  tour: 25,
  factoryComplete: 50,
  storybook: 50,
};

export const LEVELS: [number, string][] = [
  [0, "Delegate"],
  [150, "Inspector"],
  [400, "Senior Inspector"],
  [800, "Chief Inspector"],
  [1300, "Master Metrologist"],
];

export const BADGES: { id: string; mark: string; name: string; how: string }[] = [
  { id: "boarding", mark: "BP", name: "Boarding Pass", how: "Check in to the mission" },
  { id: "early", mark: "ER", name: "Early Riser", how: "Answer a roll call within 5 minutes" },
  { id: "punctual", mark: "OT", name: "Always on Time", how: "Answer 5 roll calls" },
  { id: "first", mark: "1st", name: "First Measurement", how: "Score your first factory check" },
  { id: "full", mark: "FI", name: "Full Inspection", how: "Score every check at one factory" },
  { id: "five", mark: "5F", name: "Five Factories", how: "Score checks at 5 factories" },
  { id: "audit", mark: "CA", name: "Complete Audit", how: "Score every check at every factory" },
  { id: "photo", mark: "PH", name: "Photographer", how: "Add 10 photos" },
  { id: "chron", mark: "CH", name: "Chronicler", how: "Write 5 overall impressions" },
  { id: "explorer", mark: "EX", name: "Explorer", how: "Join a tour" },
  { id: "story", mark: "SB", name: "Storyteller", how: "Open your printed storybook" },
];

export async function computeStats(ctx: QueryCtx, t: Doc<"travellers">) {
  const stops = await ctx.db.query("stops").collect();
  const entries = await ctx.db.query("entries").withIndex("by_traveller", (q) => q.eq("travellerId", t._id)).collect();
  const photos = await ctx.db.query("photos").withIndex("by_traveller", (q) => q.eq("travellerId", t._id)).collect();
  const answers = await ctx.db.query("answers").withIndex("by_traveller", (q) => q.eq("travellerId", t._id)).collect();
  const requests = await ctx.db.query("tourRequests").withIndex("by_traveller", (q) => q.eq("travellerId", t._id)).collect();

  const byStop = new Map(entries.map((e) => [e.stopKey, e]));
  let checks = 0, notes = 0, impressions = 0, facsTouched = 0, facsDone = 0;
  const factories = stops.filter((s) => s.type === "factory");
  const factoryProgress: Record<string, { scored: number; total: number }> = {};
  for (const e of entries) {
    for (const it of e.items) {
      if (it.score > 0) checks++;
      if (it.note.trim().length >= 3) notes++;
    }
    if (e.note.trim().length >= 10) impressions++;
  }
  for (const f of factories) {
    const e = byStop.get(f._id);
    const scored = e ? e.items.filter((it) => it.score > 0 && it.i < f.sees.length).length : 0;
    factoryProgress[f._id] = { scored, total: f.sees.length };
    if (scored) facsTouched++;
    if (f.sees.length && scored >= f.sees.length) facsDone++;
  }
  let quick = 0;
  for (const a of answers) {
    const c = await ctx.db.get(a.callId);
    if (c && a.at - c.sentAt <= 5 * 60_000) quick++;
  }
  const tours = requests.filter((r) => r.status === "confirmed").length;

  const breakdown = [
    { label: "Checked in", n: t.checkedInAt ? 1 : 0, each: POINTS.checkIn },
    { label: "Factory checks scored", n: checks, each: POINTS.checkScored },
    { label: "Notes on checks", n: notes, each: POINTS.checkNote },
    { label: "Overall impressions", n: impressions, each: POINTS.impression },
    { label: "Factories fully inspected", n: facsDone, each: POINTS.factoryComplete },
    { label: "Photos", n: photos.length, each: POINTS.photo },
    { label: "Roll calls answered", n: answers.length, each: POINTS.callAnswered },
    { label: "Quick answers (under 5 min)", n: quick, each: POINTS.quickAnswer },
    { label: "Tours joined", n: tours, each: POINTS.tour },
    { label: "Storybook opened", n: t.bookSavedAt ? 1 : 0, each: POINTS.storybook },
  ];
  const points = breakdown.reduce((a, b) => a + b.n * b.each, 0);

  const earned: Record<string, boolean> = {
    boarding: !!t.checkedInAt,
    early: quick >= 1,
    punctual: answers.length >= 5,
    first: checks >= 1,
    full: facsDone >= 1,
    five: facsTouched >= 5,
    audit: factories.length > 0 && facsDone === factories.length,
    photo: photos.length >= 10,
    chron: impressions >= 5,
    explorer: tours >= 1,
    story: !!t.bookSavedAt,
  };
  const badges = BADGES.filter((b) => earned[b.id]).map((b) => b.id);

  let level = LEVELS[0], next: [number, string] | null = null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i][0]) { level = LEVELS[i]; next = LEVELS[i + 1] ?? null; }
  }

  return {
    points,
    level: level[1],
    levelFloor: level[0],
    nextLevel: next ? { at: next[0], name: next[1] } : null,
    badges,
    breakdown,
    factoryProgress,
    factoriesDone: facsDone,
    factoriesTotal: factories.length,
  };
}

export function publicTraveller(t: Doc<"travellers">) {
  return { _id: t._id as Id<"travellers">, name: t.name, title: t.title ?? "", role: t.role };
}
