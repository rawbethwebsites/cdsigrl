import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireTraveller } from "./lib";
import { internal } from "./_generated/api";

/** Public key the browser needs to subscribe to wake-up alerts. Empty when not configured. */
export const publicKey = query({
  args: {},
  handler: async () => process.env.VAPID_PUBLIC_KEY ?? "",
});

export const subscribe = mutation({
  args: { token: v.string(), endpoint: v.string(), p256dh: v.string(), auth: v.string() },
  handler: async (ctx, { token, endpoint, p256dh, auth }) => {
    const t = await requireTraveller(ctx, token);
    const existing = await ctx.db.query("pushSubs").withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint)).unique();
    if (existing) await ctx.db.patch(existing._id, { travellerId: t._id, p256dh, auth });
    else await ctx.db.insert("pushSubs", { travellerId: t._id, endpoint, p256dh, auth });
  },
});

export const dropSub = internalMutation({
  args: { endpoint: v.string() },
  handler: async (ctx, { endpoint }) => {
    const s = await ctx.db.query("pushSubs").withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint)).unique();
    if (s) await ctx.db.delete(s._id);
  },
});

const TZ: Record<string, number> = { WAT: 1, CST: 8, EAT: 3 };
function startsAt(date: string, time: string, tz: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, h - (TZ[tz] ?? 1), mi || 0);
}

/** Runs every minute: sends each stop's alarm to everyone with alerts on. */
export const stopAlarms = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const stops = await ctx.db.query("stops").collect();
    for (const s of stops) {
      if (!s.alarm) continue;
      const at = startsAt(s.date, s.time, s.tz);
      const ring = at - s.alarm * 60_000;
      if (ring <= now && ring > now - 60_000) {
        const mins = s.alarm >= 60 ? `${Math.round((s.alarm / 60) * 10) / 10} h` : `${s.alarm} min`;
        await ctx.scheduler.runAfter(0, internal.push.notifyAll, {
          title: `In ${mins}: ${s.title}`,
          body: `${s.time} ${s.tz}${s.place ? " · " + s.place : ""}`,
          tag: `stop-${s._id}`,
        });
      }
    }
  },
});
