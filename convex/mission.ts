import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { BADGES, computeStats, findTraveller, publicTraveller, requireTraveller } from "./lib";

const ONLINE_MS = 2 * 60_000;

/** Who is using this link, plus their score. null when the link is not valid. */
export const me = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const t = await findTraveller(ctx, token);
    if (!t) return null;
    const stats = await computeStats(ctx, t);
    return {
      ...publicTraveller(t),
      checkedIn: !!t.checkedInAt,
      seenBadges: t.seenBadges ?? [],
      stats,
      badgeCatalog: BADGES,
    };
  },
});

export const trip = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const t = await requireTraveller(ctx, token);
    const meta = await ctx.db.query("meta").first();
    const stops = await ctx.db.query("stops").collect();
    const tours = (await ctx.db.query("tours").collect()).filter((x) => x.visible || t.role === "admin");
    const myRequests = await ctx.db
      .query("tourRequests")
      .withIndex("by_traveller", (q) => q.eq("travellerId", t._id))
      .collect();
    return {
      meta: meta ?? { name: "China Partner Mission 2026", dates: "", route: [] },
      stops,
      tours,
      myRequests: myRequests.map((r) => ({ tourId: r.tourId, status: r.status })),
    };
  },
});

export const journal = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const t = await requireTraveller(ctx, token);
    const entries = await ctx.db.query("entries").withIndex("by_traveller", (q) => q.eq("travellerId", t._id)).collect();
    const photos = await ctx.db.query("photos").withIndex("by_traveller", (q) => q.eq("travellerId", t._id)).collect();
    return {
      entries: entries.map((e) => ({ stopKey: e.stopKey, note: e.note, items: e.items })),
      photos: await Promise.all(
        photos.map(async (p) => ({ _id: p._id, stopKey: p.stopKey, url: await ctx.storage.getUrl(p.storageId) })),
      ),
    };
  },
});

export const checkIn = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const t = await requireTraveller(ctx, token);
    if (!t.checkedInAt) await ctx.db.patch(t._id, { checkedInAt: Date.now(), lastSeenAt: Date.now() });
  },
});

export const heartbeat = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const t = await findTraveller(ctx, token);
    if (t && (!t.lastSeenAt || Date.now() - t.lastSeenAt > ONLINE_MS / 2)) await ctx.db.patch(t._id, { lastSeenAt: Date.now() });
  },
});

export const saveEntry = mutation({
  args: {
    token: v.string(),
    stopKey: v.string(),
    note: v.string(),
    items: v.array(v.object({ i: v.number(), note: v.string(), score: v.number() })),
  },
  handler: async (ctx, { token, stopKey, note, items }) => {
    const t = await requireTraveller(ctx, token);
    if (note.length > 20_000 || items.length > 60) throw new ConvexError("That note is too long.");
    const clean = items.map((it) => ({ i: it.i, note: it.note.slice(0, 5000), score: Math.max(0, Math.min(5, Math.round(it.score))) }));
    const existing = await ctx.db
      .query("entries")
      .withIndex("by_traveller_stop", (q) => q.eq("travellerId", t._id).eq("stopKey", stopKey))
      .unique();
    if (existing) await ctx.db.patch(existing._id, { note, items: clean, updatedAt: Date.now() });
    else await ctx.db.insert("entries", { travellerId: t._id, stopKey, note, items: clean, updatedAt: Date.now() });
  },
});

export const requestTour = mutation({
  args: { token: v.string(), tourId: v.id("tours") },
  handler: async (ctx, { token, tourId }) => {
    const t = await requireTraveller(ctx, token);
    const existing = await ctx.db
      .query("tourRequests")
      .withIndex("by_tour_traveller", (q) => q.eq("tourId", tourId).eq("travellerId", t._id))
      .unique();
    if (!existing) await ctx.db.insert("tourRequests", { tourId, travellerId: t._id, status: "requested", at: Date.now() });
  },
});

export const cancelTour = mutation({
  args: { token: v.string(), tourId: v.id("tours") },
  handler: async (ctx, { token, tourId }) => {
    const t = await requireTraveller(ctx, token);
    const existing = await ctx.db
      .query("tourRequests")
      .withIndex("by_tour_traveller", (q) => q.eq("tourId", tourId).eq("travellerId", t._id))
      .unique();
    if (existing && existing.status === "requested") await ctx.db.delete(existing._id);
  },
});

export const markBadgesSeen = mutation({
  args: { token: v.string(), badges: v.array(v.string()) },
  handler: async (ctx, { token, badges }) => {
    const t = await requireTraveller(ctx, token);
    await ctx.db.patch(t._id, { seenBadges: [...new Set([...(t.seenBadges ?? []), ...badges])] });
  },
});

export const markBookOpened = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const t = await requireTraveller(ctx, token);
    if (!t.bookSavedAt) await ctx.db.patch(t._id, { bookSavedAt: Date.now() });
  },
});

/** The delegation's standings: everyone who has checked in, by points. */
export const standings = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const me = await requireTraveller(ctx, token);
    const all = await ctx.db.query("travellers").collect();
    const rows = [];
    for (const t of all) {
      if (!t.checkedInAt) continue;
      const s = await computeStats(ctx, t);
      rows.push({
        _id: t._id,
        name: t.name,
        title: t.title ?? "",
        points: s.points,
        level: s.level,
        badges: s.badges.length,
        online: !!t.lastSeenAt && Date.now() - t.lastSeenAt < ONLINE_MS,
        isMe: t._id === me._id,
      });
    }
    return rows.sort((a, b) => b.points - a.points);
  },
});
