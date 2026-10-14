import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib";

const stopFields = {
  date: v.string(),
  time: v.string(),
  end: v.optional(v.string()),
  tz: v.string(),
  type: v.string(),
  title: v.string(),
  city: v.string(),
  place: v.string(),
  details: v.string(),
  sees: v.array(v.string()),
  alarm: v.number(),
};
const tourFields = {
  title: v.string(),
  city: v.string(),
  date: v.string(),
  time: v.string(),
  tz: v.string(),
  duration: v.string(),
  price: v.string(),
  teaser: v.string(),
  details: v.string(),
  visible: v.boolean(),
};

/** Everyone on the trip with their personal sign-in token (shown only to the trip leader). */
export const travellers = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    const all = await ctx.db.query("travellers").collect();
    const subs = await ctx.db.query("pushSubs").collect();
    return all.map((t) => ({
      _id: t._id,
      name: t.name,
      title: t.title ?? "",
      role: t.role,
      token: t.token,
      checkedIn: !!t.checkedInAt,
      alerts: subs.some((s) => s.travellerId === t._id),
    }));
  },
});

export const addTraveller = mutation({
  args: { token: v.string(), name: v.string(), title: v.string(), role: v.union(v.literal("admin"), v.literal("traveller")) },
  handler: async (ctx, { token, name, title, role }) => {
    await requireAdmin(ctx, token);
    return await ctx.db.insert("travellers", { name: name.trim(), title: title.trim(), role, token: crypto.randomUUID().replace(/-/g, "") });
  },
});

export const removeTraveller = mutation({
  args: { token: v.string(), id: v.id("travellers") },
  handler: async (ctx, { token, id }) => {
    const admin = await requireAdmin(ctx, token);
    if (admin._id === id) return;
    await ctx.db.delete(id);
  },
});

export const saveStop = mutation({
  args: { token: v.string(), id: v.optional(v.id("stops")), ...stopFields },
  handler: async (ctx, { token, id, ...s }) => {
    await requireAdmin(ctx, token);
    if (id) await ctx.db.patch(id, s);
    else await ctx.db.insert("stops", { ...s, order: Date.now() });
  },
});

export const deleteStop = mutation({
  args: { token: v.string(), id: v.id("stops") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const saveTour = mutation({
  args: { token: v.string(), id: v.optional(v.id("tours")), ...tourFields },
  handler: async (ctx, { token, id, ...t }) => {
    await requireAdmin(ctx, token);
    if (id) await ctx.db.patch(id, t);
    else await ctx.db.insert("tours", t);
  },
});

export const deleteTour = mutation({
  args: { token: v.string(), id: v.id("tours") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const tourRequests = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    const reqs = await ctx.db.query("tourRequests").collect();
    return await Promise.all(
      reqs.map(async (r) => ({
        _id: r._id,
        status: r.status,
        traveller: (await ctx.db.get(r.travellerId))?.name ?? "Removed traveller",
        tour: (await ctx.db.get(r.tourId))?.title ?? "Removed tour",
      })),
    );
  },
});

export const setRequest = mutation({
  args: { token: v.string(), id: v.id("tourRequests"), status: v.union(v.literal("confirmed"), v.literal("declined")) },
  handler: async (ctx, { token, id, status }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { status });
  },
});

export const saveMeta = mutation({
  args: { token: v.string(), name: v.string(), dates: v.string(), route: v.array(v.string()) },
  handler: async (ctx, { token, ...m }) => {
    await requireAdmin(ctx, token);
    const cur = await ctx.db.query("meta").first();
    if (cur) await ctx.db.patch(cur._id, m);
    else await ctx.db.insert("meta", m);
  },
});
