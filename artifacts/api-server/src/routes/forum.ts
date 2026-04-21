import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { db, forumPostsTable, forumPostSchema } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/forum/posts", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(forumPostsTable)
      .orderBy(desc(forumPostsTable.createdAt))
      .limit(200);
    res.json({
      posts: rows.map((r) => ({
        id: r.id,
        authorName: r.authorName,
        // Author email is intentionally omitted from the public listing — only
        // the cooperative organizer (notified by email) sees the contact.
        subject: r.subject,
        message: r.message,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    logger.error({ err }, "Failed to list forum posts");
    res.status(500).json({ error: "Failed to load forum posts" });
  }
});

router.post("/forum/posts", async (req, res) => {
  const parsed = forumPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid post", details: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  try {
    const [inserted] = await db
      .insert(forumPostsTable)
      .values({
        id: `f_${randomUUID()}`,
        authorName: data.authorName,
        authorEmail: data.authorEmail ?? null,
        subject: data.subject,
        message: data.message,
      })
      .returning();
    res.status(201).json({
      post: {
        id: inserted.id,
        authorName: inserted.authorName,
        authorEmail: inserted.authorEmail,
        subject: inserted.subject,
        message: inserted.message,
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to insert forum post");
    res.status(500).json({ error: "Failed to publish post" });
  }
});

export default router;
