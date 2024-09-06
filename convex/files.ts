import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...

    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

export const getPublicUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    // Retrieve the public URL for the file
    const publicUrl = await ctx.storage.getUrl(storageId);
    return publicUrl;
  },
});
