import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireTraveller } from "./lib";

export const uploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTraveller(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});

export const add = mutation({
  args: { token: v.string(), stopKey: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, { token, stopKey, storageId }) => {
    const t = await requireTraveller(ctx, token);
    await ctx.db.insert("photos", { travellerId: t._id, stopKey, storageId, at: Date.now() });
  },
});

export const remove = mutation({
  args: { token: v.string(), photoId: v.id("photos") },
  handler: async (ctx, { token, photoId }) => {
    const t = await requireTraveller(ctx, token);
    const p = await ctx.db.get(photoId);
    if (!p || p.travellerId !== t._id) throw new ConvexError("You can only remove your own photos.");
    await ctx.storage.delete(p.storageId);
    await ctx.db.delete(p._id);
  },
});
