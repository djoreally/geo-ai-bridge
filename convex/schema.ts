
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vans: defineTable({
    plateNumber: v.string(),
    model: v.string(),
    capacity: v.number(),
    currentLocation: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    }),
    status: v.union(
      v.literal("available"),
      v.literal("on_job"),
      v.literal("maintenance"),
      v.literal("offline")
    ),
    fuelLevel: v.number(),
    mileage: v.number(),
    lastServiceDate: v.string(),
    nextServiceDue: v.string(),
    equipmentIds: v.array(v.id("equipment")),
    technicianId: v.optional(v.id("technicians")),
  }).index("by_status", ["status"]).index("by_technician", ["technicianId"]),

  jobs: defineTable({
    jobNumber: v.string(),
    clientId: v.id("clients"),
    technicianId: v.optional(v.id("technicians")),
    vanId: v.optional(v.id("vans")),
    serviceType: v.union(
      v.literal("oil_change"),
      v.literal("filter_replacement"),
      v.literal("maintenance"),
      v.literal("inspection")
    ),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    }),
    scheduledDate: v.string(),
    estimatedDuration: v.number(),
    actualStartTime: v.optional(v.string()),
    completionTime: v.optional(v.string()),
    notes: v.optional(v.string()),
    revenue: v.number(),
    costs: v.number(),
    requiredEquipment: v.array(v.id("equipment")),
  }).index("by_status", ["status"])
    .index("by_client", ["clientId"])
    .index("by_technician", ["technicianId"])
    .index("by_date", ["scheduledDate"]),

  technicians: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    status: v.union(
      v.literal("available"),
      v.literal("on_job"),
      v.literal("on_break"),
      v.literal("off_duty")
    ),
    skills: v.array(v.string()),
    certifications: v.array(v.string()),
    currentLocation: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    })),
    vanId: v.optional(v.id("vans")),
    rating: v.number(),
    completedJobs: v.number(),
    hireDate: v.string(),
  }).index("by_status", ["status"]).index("by_van", ["vanId"]),

  clients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    type: v.union(v.literal("individual"), v.literal("business")),
    status: v.union(v.literal("active"), v.literal("inactive")),
    locations: v.array(v.object({
      id: v.string(),
      name: v.string(),
      address: v.string(),
      lat: v.number(),
      lng: v.number(),
      isDefault: v.boolean(),
    })),
    totalJobs: v.number(),
    totalRevenue: v.number(),
    lastJobDate: v.optional(v.string()),
    preferredTechnician: v.optional(v.id("technicians")),
    notes: v.optional(v.string()),
  }).index("by_type", ["type"]).index("by_status", ["status"]),

  equipment: defineTable({
    name: v.string(),
    type: v.string(),
    serialNumber: v.string(),
    status: v.union(
      v.literal("available"),
      v.literal("in_use"),
      v.literal("maintenance"),
      v.literal("retired")
    ),
    condition: v.union(
      v.literal("excellent"),
      v.literal("good"),
      v.literal("fair"),
      v.literal("poor")
    ),
    lastMaintenanceDate: v.string(),
    nextMaintenanceDate: v.string(),
    vanId: v.optional(v.id("vans")),
    cost: v.number(),
    purchaseDate: v.string(),
  }).index("by_status", ["status"]).index("by_van", ["vanId"]),

  notifications: defineTable({
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("error"),
      v.literal("success")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    isRead: v.boolean(),
    userId: v.optional(v.string()),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_read", ["isRead"]),
});
