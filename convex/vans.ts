
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("vans").collect();
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vans")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const create = mutation({
  args: {
    plateNumber: v.string(),
    model: v.string(),
    capacity: v.number(),
    currentLocation: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    }),
    status: v.string(),
    fuelLevel: v.number(),
    mileage: v.number(),
    lastServiceDate: v.string(),
    nextServiceDue: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vans", {
      ...args,
      equipmentIds: [],
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("vans"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});
