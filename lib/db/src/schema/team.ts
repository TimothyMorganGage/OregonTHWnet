import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

// Team-member access list. Anyone whose row exists with active = true and
// whose access_code matches the bearer token presented to /api/admin/* may
// administer the cooperative. The founding organizer is seeded automatically
// on server startup using the ADMIN_TOKEN env var as their initial code; new
// team members are added later via the admin UI which generates a fresh
// random access code per person.
export const teamMembersTable = pgTable("team_members", {
  email: text("email").primaryKey(),
  accessCode: text("access_code").notNull().unique(),
  role: text("role").notNull().default("admin"),
  active: boolean("active").notNull().default(true),
  addedBy: text("added_by"),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  notes: text("notes"),
});

export const newTeamMemberSchema = z.object({
  email: z.string().email().max(200),
  role: z.enum(["admin"]).default("admin"),
  notes: z.string().max(500).optional().nullable(),
});

export const updateTeamMemberSchema = z.object({
  active: z.boolean().optional(),
  role: z.enum(["admin"]).optional(),
  notes: z.string().max(500).optional().nullable(),
});

export type TeamMember = typeof teamMembersTable.$inferSelect;
export type InsertTeamMember = typeof teamMembersTable.$inferInsert;
export type NewTeamMemberInput = z.infer<typeof newTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
