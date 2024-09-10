import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { isUserSubscribed } from "./users";
import { getUserId, getUser } from "./util";

export const createThumbnail = mutation({
  args: {
    title: v.string(),
    aImage: v.string(),
    bImage: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("you must be logged in");
    }

    const isSubscribed = await isUserSubscribed(ctx);

    if (!isSubscribed) {
      throw new Error("you must be subscribed to create thumbnail");
    }

    return await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: user.subject, // user.subect = clerk user id
      aImage: args.aImage,
      bImage: args.bImage,
      aVotes: 0,
      bVotes: 0,
      voteIds: [],
      profileImage: args.profileImage,
      comments: [],
    });
  },
});

export const getThumbnailsForUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    return await ctx.db
      .query("thumbnails")
      .filter((q) =>
        // find me user that matches
        q.eq(q.field("userId"), userId)
      )
      .collect();
  },
});

export const getThumbnail = query({
  args: { thumbnailId: v.id("thumbnails") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thumbnailId);
  },
});

export const getRecentThumbnails = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("thumbnails")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const voteOnTHumbnail = mutation({
  args: {
    thumbnailId: v.id("thumbnails"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("you must be logged in to vote");
    }

    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("invalid thumbnail id");
    }

    if (thumbnail.voteIds.includes(userId)) {
      throw new Error("you already voted");
    }

    if (thumbnail.aImage === args.imageId) {
      thumbnail.aVotes++;
      await ctx.db.patch(thumbnail._id, {
        aVotes: thumbnail.aVotes,
        voteIds: [...thumbnail.voteIds, userId],
      });
    } else {
      thumbnail.bVotes++;
      await ctx.db.patch(thumbnail._id, {
        bVotes: thumbnail.bVotes,
        voteIds: [...thumbnail.voteIds, userId],
      });
    }
  },
});

export const addComent = mutation({
  args: { thumbnailId: v.id("thumbnails"), text: v.string() },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) {
      throw new Error("you must be logged in");
    }

    const thumbnail = await ctx.db.get(args.thumbnailId);

    if (!thumbnail) {
      throw new Error("thumbnail by id did not exist");
    }
    if (!thumbnail.comments) {
      thumbnail.comments = [];
    }

    if (!thumbnail.comments) {
      thumbnail.comments = [];
    }

    thumbnail.comments.unshift({
      createdAt: Date.now(),
      text: args.text,
      userId: user.subject,
      name: user.name ?? "Annoymous",
      profileUrl: user.pictureUrl ?? "",
    });

    await ctx.db.patch(thumbnail._id, {
      comments: thumbnail.comments,
    });
  },
});
