import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { db, membersTable, memberApplicationSchema, memberReviewSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function newId(): string {
  return `m_${randomUUID()}`;
}

// Escape a CSV value AND defang spreadsheet formula injection by prefixing
// any cell starting with =, +, -, @, tab, or CR with a single quote so Excel
// and Google Sheets do not evaluate it as a formula.
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = Array.isArray(value) ? value.join("; ") : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

router.get("/members", async (_req, res) => {
  try {
    // Public directory only includes APPROVED members. Pending and declined
    // applications are visible only to the cooperative organizer via the admin
    // endpoints below.
    const rows = await db
      .select()
      .from(membersTable)
      .where(eq(membersTable.reviewStatus, "approved"))
      .orderBy(desc(membersTable.joinedAt));
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
  // Registration is gated behind Replit Auth: applicants must sign in before
  // they can submit a cooperative membership application. The authenticated
  // identity (and verified email) is attached to the record server-side.
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Please sign in to apply for cooperative membership" });
    return;
  }
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
  // Registration must be tied to a verified identity. Reject if the
  // authenticated session has no verified email rather than silently
  // falling back to the free-text form value — otherwise "verified
  // identity" would not be strictly true.
  const verifiedEmail = req.user.email;
  if (!verifiedEmail) {
    res.status(403).json({
      error: "Your signed-in account has no verified email, so the application cannot be submitted.",
    });
    return;
  }
  try {
    const [inserted] = await db
      .insert(membersTable)
      .values({
        id: newId(),
        userId: req.user.id,
        fullName: data.fullName,
        thwType: data.thwType,
        certificationStatus: data.certificationStatus,
        ohaRegistryNumber: data.ohaRegistryNumber ?? null,
        county: data.county,
        languages: data.languages,
        populationsServed: data.populationsServed,
        email: verifiedEmail,
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
    // reviewedAt should track when a decision was made, not when notes were
    // last edited. Only stamp it when the review status itself changes.
    const updates: Record<string, unknown> = {};
    if (parsed.data.reviewStatus !== undefined) {
      updates.reviewStatus = parsed.data.reviewStatus;
      updates.reviewedAt = new Date();
    }
    if (parsed.data.ohaVerified !== undefined) updates.ohaVerified = parsed.data.ohaVerified;
    if (parsed.data.reviewerNotes !== undefined) updates.reviewerNotes = parsed.data.reviewerNotes;
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    const [updated] = await db
      .update(membersTable)
      .set(updates)
      .where(eq(membersTable.id, String(req.params.id)))
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
