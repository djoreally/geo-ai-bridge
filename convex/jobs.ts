
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("jobs").collect();
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const create = mutation({
  args: {
    jobNumber: v.string(),
    clientId: v.id("clients"),
    serviceType: v.string(),
    status: v.string(),
    priority: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    }),
    scheduledDate: v.string(),
    estimatedDuration: v.number(),
    revenue: v.number(),
    costs: v.number(),
    requiredEquipment: v.array(v.id("equipment")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobs", args);
  },
});
