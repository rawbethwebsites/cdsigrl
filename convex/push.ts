"use node";

import webpush from "web-push";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/** Sends a phone/desktop notification to every traveller who turned on alerts. */
export const notifyAll = internalAction({
  args: { title: v.string(), body: v.string(), exclude: v.optional(v.id("travellers")), tag: v.string() },
  handler: async (ctx, { title, body, exclude, tag }) => {
    const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY;
    if (!pub || !priv) return { sent: 0, skipped: "Alerts are not configured (VAPID keys missing)." };
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || "https://cdsigrl.org", pub, priv);
    const subs = await ctx.runQuery(internal.calls.subsFor, {});
    let sent = 0;
    for (const s of subs) {
      if (exclude && s.travellerId === exclude) continue;
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({ title, body, tag, url: "/mission" }),
          { TTL: 60 * 60, urgency: "high" },
        );
        sent++;
      } catch (err: unknown) {
        const code = (err as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) await ctx.runMutation(internal.alerts.dropSub, { endpoint: s.endpoint });
      }
    }
    return { sent };
  },
});
