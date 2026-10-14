import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// China Partner Mission dashboard (/mission). Each traveller signs in with a
// private link that carries their token; there are no passwords.
export default defineSchema({
  travellers: defineTable({
    name: v.string(),
    title: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("traveller")),
    token: v.string(),
    checkedInAt: v.optional(v.number()),
    lastSeenAt: v.optional(v.number()),
    bookSavedAt: v.optional(v.number()),
    seenBadges: v.optional(v.array(v.string())),
  }).index("by_token", ["token"]),

  meta: defineTable({
    name: v.string(),
    dates: v.string(),
    route: v.array(v.string()),
  }),

  stops: defineTable({
    date: v.string(), // YYYY-MM-DD in the stop's own time zone
    time: v.string(), // HH:MM
    end: v.optional(v.string()),
    tz: v.string(), // WAT | CST | EAT
    type: v.string(),
    title: v.string(),
    city: v.string(),
    place: v.string(),
    details: v.string(),
    sees: v.array(v.string()),
    alarm: v.number(), // minutes before
    order: v.number(),
  }).index("by_date", ["date"]),

  tours: defineTable({
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
  }),

  tourRequests: defineTable({
    tourId: v.id("tours"),
    travellerId: v.id("travellers"),
    status: v.union(v.literal("requested"), v.literal("confirmed"), v.literal("declined")),
    at: v.number(),
  })
    .index("by_traveller", ["travellerId"])
    .index("by_tour_traveller", ["tourId", "travellerId"]),

  // A traveller's private notes on one stop. stopKey is a stop id, or "tour:<tourId>".
  entries: defineTable({
    travellerId: v.id("travellers"),
    stopKey: v.string(),
    note: v.string(),
    items: v.array(v.object({ i: v.number(), note: v.string(), score: v.number() })),
    updatedAt: v.number(),
  })
    .index("by_traveller", ["travellerId"])
    .index("by_traveller_stop", ["travellerId", "stopKey"]),

  photos: defineTable({
    travellerId: v.id("travellers"),
    stopKey: v.string(),
    storageId: v.id("_storage"),
    at: v.number(),
  }).index("by_traveller", ["travellerId"]),

  // Roll calls the trip leader sends: wake-up, lobby, meeting, head count.
  calls: defineTable({
    kind: v.string(),
    message: v.string(),
    options: v.array(v.string()),
    sentAt: v.number(),
    active: v.boolean(),
    sentBy: v.id("travellers"),
  }).index("by_sentAt", ["sentAt"]),

  answers: defineTable({
    callId: v.id("calls"),
    travellerId: v.id("travellers"),
    choice: v.string(),
    at: v.number(),
  })
    .index("by_call", ["callId"])
    .index("by_traveller", ["travellerId"])
    .index("by_call_traveller", ["callId", "travellerId"]),

  pushSubs: defineTable({
    travellerId: v.id("travellers"),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
  })
    .index("by_traveller", ["travellerId"])
    .index("by_endpoint", ["endpoint"]),
});
