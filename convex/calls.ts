import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { POINTS, requireAdmin, requireTraveller } from "./lib";

const CALL_TTL = 6 * 60 * 60_000;

/** The newest open roll call this traveller has not answered yet. */
export const pending = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const t = await requireTraveller(ctx, token);
    const recent = await ctx.db.query("calls").withIndex("by_sentAt").order("desc").take(5);
    for (const c of recent) {
      if (!c.active || c.sentBy === t._id || Date.now() - c.sentAt > CALL_TTL) continue;
      const a = await ctx.db
        .query("answers")
        .withIndex("by_call_traveller", (q) => q.eq("callId", c._id).eq("travellerId", t._id))
        .unique();
      if (!a) return c;
    }
    return null;
  },
});

export const answer = mutation({
  args: { token: v.string(), callId: v.id("calls"), choice: v.string() },
  handler: async (ctx, { token, callId, choice }) => {
    const t = await requireTraveller(ctx, token);
    const c = await ctx.db.get(callId);
    if (!c) throw new ConvexError("That call has ended.");
    const existing = await ctx.db
      .query("answers")
      .withIndex("by_call_traveller", (q) => q.eq("callId", callId).eq("travellerId", t._id))
      .unique();
    if (existing) return { points: 0, quick: false };
    const now = Date.now();
    await ctx.db.insert("answers", { callId, travellerId: t._id, choice: choice.slice(0, 80), at: now });
    await ctx.db.patch(t._id, { lastSeenAt: now });
    const quick = now - c.sentAt <= 5 * 60_000;
    return { points: POINTS.callAnswered + (quick ? POINTS.quickAnswer : 0), quick };
  },
});

export const send = mutation({
  args: { token: v.string(), kind: v.string(), message: v.string(), options: v.array(v.string()) },
  handler: async (ctx, { token, kind, message, options }) => {
    const admin = await requireAdmin(ctx, token);
    const opts = options.map((o) => o.trim()).filter(Boolean).slice(0, 4);
    if (!opts.length) throw new ConvexError("Add at least one reply button.");
    // Only one call is open at a time: sending a new one closes the previous.
    const open = await ctx.db.query("calls").withIndex("by_sentAt").order("desc").take(10);
    for (const c of open) if (c.active) await ctx.db.patch(c._id, { active: false });
    const id = await ctx.db.insert("calls", {
      kind: kind.slice(0, 60),
      message: message.slice(0, 500),
      options: opts,
      sentAt: Date.now(),
      active: true,
      sentBy: admin._id,
    });
    await ctx.scheduler.runAfter(0, internal.push.notifyAll, {
      title: kind,
      body: message,
      exclude: admin._id,
      tag: id,
    });
    return id;
  },
});

export const close = mutation({
  args: { token: v.string(), callId: v.id("calls") },
  handler: async (ctx, { token, callId }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(callId, { active: false });
  },
});

/** Live roll-call board for the trip leader: recent calls and who answered. */
export const board = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const admin = await requireAdmin(ctx, token);
    const travellers = (await ctx.db.query("travellers").collect()).filter((t) => t._id !== admin._id);
    const calls = await ctx.db.query("calls").withIndex("by_sentAt").order("desc").take(8);
    const out = [];
    for (const c of calls) {
      const answers = await ctx.db.query("answers").withIndex("by_call", (q) => q.eq("callId", c._id)).collect();
      out.push({
        ...c,
        rows: travellers.map((t) => {
          const a = answers.find((x) => x.travellerId === t._id);
          return { travellerId: t._id, name: t.name, choice: a?.choice ?? null, after: a ? a.at - c.sentAt : null };
        }),
      });
    }
    return {
      calls: out,
      people: travellers.map((t) => ({
        _id: t._id,
        name: t.name,
        online: !!t.lastSeenAt && Date.now() - t.lastSeenAt < 2 * 60_000,
        checkedIn: !!t.checkedInAt,
      })),
    };
  },
});

export const subsFor = internalQuery({
  args: {},
  handler: async (ctx) => await ctx.db.query("pushSubs").collect(),
});
