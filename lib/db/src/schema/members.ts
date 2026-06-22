import { pgTable, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const membersTable = pgTable("coop_members", {
  id: text("id").primaryKey(),
  // Replit Auth user id (claims.sub) of the signed-in applicant. Registration
  // is gated behind Replit Auth, so every new application carries the verified
  // identity of the authenticated user who submitted it.
  userId: text("user_id"),
  fullName: text("full_name").notNull(),
  thwType: text("thw_type").notNull(),
  certificationStatus: text("certification_status").notNull(),
  ohaRegistryNumber: text("oha_registry_number"),
  county: text("county").notNull(),
  languages: jsonb("languages").$type<string[]>().notNull().default([]),
  populationsServed: jsonb("populations_served").$type<string[]>().notNull().default([]),
  email: text("email").notNull(),
  phone: text("phone"),
  organization: text("organization"),
  consentDataSharing: boolean("consent_data_sharing").notNull().default(false),
  consentMembership: boolean("consent_membership").notNull().default(false),

  reviewStatus: text("review_status").notNull().default("pending"),
  ohaVerified: boolean("oha_verified").notNull().default(false),
  reviewerNotes: text("reviewer_notes"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberApplicationSchema = z.object({
  fullName: z.string().min(1).max(200),
  thwType: z.string().min(1).max(100),
  certificationStatus: z.enum(["certified", "in_progress", "prospective"]),
  ohaRegistryNumber: z.string().max(100).optional().nullable(),
  county: z.string().min(1).max(100),
  languages: z.array(z.string().max(100)).max(50).default([]),
  populationsServed: z.array(z.string().max(200)).max(50).default([]),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().nullable(),
  organization: z.string().max(200).optional().nullable(),
  consentDataSharing: z.boolean(),
  consentMembership: z.boolean(),
});

export const memberReviewSchema = z.object({
  reviewStatus: z.enum(["pending", "approved", "declined"]).optional(),
  ohaVerified: z.boolean().optional(),
  reviewerNotes: z.string().max(2000).optional().nullable(),
});

export type InsertMember = typeof membersTable.$inferInsert;
export type Member = typeof membersTable.$inferSelect;
export type MemberApplication = z.infer<typeof memberApplicationSchema>;
export type MemberReview = z.infer<typeof memberReviewSchema>;
