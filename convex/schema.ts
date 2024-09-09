import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  thumbnails: defineTable({
    title: v.string(),
    userId: v.string(),
    aImage: v.string(),
    aVotes: v.number(),
    bVotes: v.number(),
    bImage: v.string(),
    voteIds: v.array(v.string()),
    profileImage: v.optional(v.string()),
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    subscriptionId: v.optional(v.string()),
    subscriptionExpiresOn: v.optional(v.number()),
    endsOn: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_subscriptionId", ["subscriptionId"]),
});
