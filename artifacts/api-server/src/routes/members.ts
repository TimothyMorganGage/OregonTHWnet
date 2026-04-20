import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, membersTable, memberApplicationSchema, memberReviewSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    res.status(503).json({ error: "Admin endpoints disabled (ADMIN_TOKEN not configured)" });
    return;
  }
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function newId(): string {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = Array.isArray(value) ? value.join("; ") : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

router.get("/members", async (_req, res) => {
  try {
    const rows = await db.select().from(membersTable).orderBy(desc(membersTable.joinedAt));
    const publicRows = rows.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      thwType: r.thwType,
      certificationStatus: r.certificationStatus,
      ohaRegistryNumber: r.ohaRegistryNumber,
      county: r.county,
      languages: r.languages,
      populationsServed: r.populationsServed,
      organization: r.organization,
      consentDataSharing: r.consentDataSharing,
      consentMembership: r.consentMembership,
      reviewStatus: r.reviewStatus,
      ohaVerified: r.ohaVerified,
      joinedAt: r.joinedAt.toISOString(),
    }));
    res.json({ members: publicRows });
  } catch (err) {
    logger.error({ err }, "Failed to list members");
    res.status(500).json({ error: "Failed to list members" });
  }
});

router.post("/members", async (req, res) => {
  const parsed = memberApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid application", details: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  if (!data.consentMembership) {
    res.status(400).json({ error: "Cooperative membership consent is required" });
    return;
  }
  try {
    const [inserted] = await db
      .insert(membersTable)
      .values({
        id: newId(),
        fullName: data.fullName,
        thwType: data.thwType,
        certificationStatus: data.certificationStatus,
        ohaRegistryNumber: data.ohaRegistryNumber ?? null,
        county: data.county,
        languages: data.languages,
        populationsServed: data.populationsServed,
        email: data.email,
        phone: data.phone ?? null,
        organization: data.organization ?? null,
        consentDataSharing: data.consentDataSharing,
        consentMembership: data.consentMembership,
      })
      .returning();
    res.status(201).json({
      member: {
        id: inserted.id,
        fullName: inserted.fullName,
        thwType: inserted.thwType,
        certificationStatus: inserted.certificationStatus,
        ohaRegistryNumber: inserted.ohaRegistryNumber,
        county: inserted.county,
        languages: inserted.languages,
        populationsServed: inserted.populationsServed,
        email: inserted.email,
        phone: inserted.phone,
        organization: inserted.organization,
        consentDataSharing: inserted.consentDataSharing,
        consentMembership: inserted.consentMembership,
        reviewStatus: inserted.reviewStatus,
        ohaVerified: inserted.ohaVerified,
        joinedAt: inserted.joinedAt.toISOString(),
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to insert member");
    res.status(500).json({ error: "Failed to record application" });
  }
});

router.get("/admin/members", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(membersTable).orderBy(desc(membersTable.joinedAt));
    res.json({
      members: rows.map((r) => ({
        ...r,
        joinedAt: r.joinedAt.toISOString(),
        reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
      })),
    });
  } catch (err) {
    logger.error({ err }, "Failed to list admin members");
    res.status(500).json({ error: "Failed to list members" });
  }
});

router.patch("/admin/members/:id", requireAdmin, async (req, res) => {
  const parsed = memberReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid review payload", details: parsed.error.flatten() });
    return;
  }
  try {
    const updates: Record<string, unknown> = { reviewedAt: new Date() };
    if (parsed.data.reviewStatus !== undefined) updates.reviewStatus = parsed.data.reviewStatus;
    if (parsed.data.ohaVerified !== undefined) updates.ohaVerified = parsed.data.ohaVerified;
    if (parsed.data.reviewerNotes !== undefined) updates.reviewerNotes = parsed.data.reviewerNotes;
    const [updated] = await db
      .update(membersTable)
      .set(updates)
      .where(eq(membersTable.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Member not found" });
      return;
    }
    res.json({
      member: {
        ...updated,
        joinedAt: updated.joinedAt.toISOString(),
        reviewedAt: updated.reviewedAt ? updated.reviewedAt.toISOString() : null,
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to update member");
    res.status(500).json({ error: "Failed to update member" });
  }
});

router.get("/admin/members.csv", requireAdmin, async (_req, res) => {
  try {
    const rows = await db.select().from(membersTable).orderBy(desc(membersTable.joinedAt));
    const headers = [
      "id", "fullName", "email", "phone", "organization", "county",
      "thwType", "certificationStatus", "ohaRegistryNumber",
      "languages", "populationsServed",
      "consentDataSharing", "consentMembership",
      "reviewStatus", "ohaVerified", "reviewerNotes",
      "joinedAt", "reviewedAt",
    ];
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push([
        r.id, r.fullName, r.email, r.phone, r.organization, r.county,
        r.thwType, r.certificationStatus, r.ohaRegistryNumber,
        r.languages, r.populationsServed,
        r.consentDataSharing, r.consentMembership,
        r.reviewStatus, r.ohaVerified, r.reviewerNotes,
        r.joinedAt.toISOString(), r.reviewedAt ? r.reviewedAt.toISOString() : "",
      ].map(csvEscape).join(","));
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="thw-coop-members-${new Date().toISOString().slice(0,10)}.csv"`);
    res.send(lines.join("\n"));
  } catch (err) {
    logger.error({ err }, "Failed to export CSV");
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

export default router;
