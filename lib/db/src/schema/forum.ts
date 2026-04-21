import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const forumPostsTable = pgTable("forum_posts", {
  id: text("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const forumPostSchema = z.object({
  authorName: z.string().min(1).max(120),
  authorEmail: z.string().email().max(200).optional().nullable(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export type InsertForumPost = typeof forumPostsTable.$inferInsert;
export type ForumPost = typeof forumPostsTable.$inferSelect;
export type ForumPostInput = z.infer<typeof forumPostSchema>;
