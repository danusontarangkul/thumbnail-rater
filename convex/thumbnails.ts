import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createThumbnail = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("you must be logged in");
    }
    await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: user.subject, // user.subect = clerk user id
    });
  },
});

export const getThumbnailsForUser = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return [];
      //   throw new Error("you must be logged in");
    }

    return await ctx.db
      .query("thumbnails")
      .filter((q) =>
        // find me user that matches
        q.eq(q.field("userId"), user.subject)
      )
      .collect();
  },
});
