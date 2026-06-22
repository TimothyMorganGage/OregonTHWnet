import { Router, type IRouter } from "express";
import {
  db,
  teamMembersTable,
  newTeamMemberSchema,
  updateTeamMemberSchema,
} from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAdmin, generateAccessCode, FOUNDER } from "../lib/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Identify the currently signed-in team member so the UI can show their email.
router.get("/admin/me", requireAdmin, (req, res) => {
  const tm = req.teamMember!;
  res.json({
    email: tm.email,
    role: tm.role,
    active: tm.active,
    addedAt: tm.addedAt.toISOString(),
    lastUsedAt: tm.lastUsedAt ? tm.lastUsedAt.toISOString() : null,
  });
});

// List every team member. Access codes are NEVER returned by this endpoint —
// they are only shown once at creation/rotation time.
router.get("/admin/team-members", requireAdmin, async (_req, res) => {
  try {
    const rows = await db
      .select({
        email: teamMembersTable.email,
        role: teamMembersTable.role,
        active: teamMembersTable.active,
        addedBy: teamMembersTable.addedBy,
        addedAt: teamMembersTable.addedAt,
        lastUsedAt: teamMembersTable.lastUsedAt,
        notes: teamMembersTable.notes,
      })
      .from(teamMembersTable)
      .orderBy(desc(teamMembersTable.addedAt));
    res.json({
      members: rows.map((r) => ({
        ...r,
        addedAt: r.addedAt.toISOString(),
        lastUsedAt: r.lastUsedAt ? r.lastUsedAt.toISOString() : null,
      })),
    });
  } catch (err) {
    logger.error({ err }, "Failed to list team members");
    res.status(500).json({ error: "Failed to list team members" });
  }
});

// Add a new team member. The server generates a fresh random access code and
// returns it exactly once in this response — share it with the new team
// member through a private channel; it cannot be retrieved later.
router.post("/admin/team-members", requireAdmin, async (req, res) => {
  const parsed = newTeamMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid team member", details: parsed.error.flatten() });
    return;
  }
  const email = parsed.data.email.trim().toLowerCase();
  const accessCode = generateAccessCode();
  try {
    const [inserted] = await db
      .insert(teamMembersTable)
      .values({
        email,
        accessCode,
        role: parsed.data.role,
        active: true,
        addedBy: req.teamMember!.email,
        notes: parsed.data.notes ?? null,
      })
      .onConflictDoNothing()
      .returning();
    if (!inserted) {
      res.status(409).json({ error: "A team member with that email already exists." });
      return;
    }
    res.status(201).json({
      member: {
        email: inserted.email,
        role: inserted.role,
        active: inserted.active,
        addedBy: inserted.addedBy,
        addedAt: inserted.addedAt.toISOString(),
        lastUsedAt: null,
        notes: inserted.notes,
      },
      accessCode, // Shown ONCE — UI must surface this to the founder for hand-off.
    });
  } catch (err) {
    logger.error({ err }, "Failed to add team member");
    res.status(500).json({ error: "Failed to add team member" });
  }
});

// Update a team member: deactivate (revoke access), reactivate, or change notes.
router.patch("/admin/team-members/:email", requireAdmin, async (req, res) => {
  const parsed = updateTeamMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid update", details: parsed.error.flatten() });
    return;
  }
  // Express already decodes route params once. Calling decodeURIComponent
  // again would double-decode (e.g. "test%25user@example.com" would throw)
  // so we just normalize to lowercase here.
  const target = String(req.params.email).toLowerCase();
  // Guardrail: no self-deactivation by the founder. Otherwise a stray click
  // could lock the cooperative out of its own admin permanently.
  if (target === FOUNDER && parsed.data.active === false) {
    res.status(400).json({ error: "The founding organizer's access cannot be revoked from the UI." });
    return;
  }
  if (target === req.teamMember!.email && parsed.data.active === false) {
    res.status(400).json({ error: "You cannot revoke your own access while signed in." });
    return;
  }
  try {
    const updates: Record<string, unknown> = {};
    if (parsed.data.active !== undefined) updates.active = parsed.data.active;
    if (parsed.data.role !== undefined) updates.role = parsed.data.role;
    if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    const [updated] = await db
      .update(teamMembersTable)
      .set(updates)
      .where(eq(teamMembersTable.email, target))
      .returning({
        email: teamMembersTable.email,
        role: teamMembersTable.role,
        active: teamMembersTable.active,
        addedBy: teamMembersTable.addedBy,
        addedAt: teamMembersTable.addedAt,
        lastUsedAt: teamMembersTable.lastUsedAt,
        notes: teamMembersTable.notes,
      });
    if (!updated) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json({
      member: {
        ...updated,
        addedAt: updated.addedAt.toISOString(),
        lastUsedAt: updated.lastUsedAt ? updated.lastUsedAt.toISOString() : null,
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to update team member");
    res.status(500).json({ error: "Failed to update team member" });
  }
});

// Generate a fresh access code for an existing team member. Useful when a
// code has been compromised or a team member has lost theirs. The previous
// code is invalidated immediately.
router.post("/admin/team-members/:email/rotate", requireAdmin, async (req, res) => {
  const target = String(req.params.email).toLowerCase();
  const accessCode = generateAccessCode();
  try {
    const [updated] = await db
      .update(teamMembersTable)
      .set({ accessCode, active: true })
      .where(eq(teamMembersTable.email, target))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }
    res.json({
      member: {
        email: updated.email,
        role: updated.role,
        active: updated.active,
        addedBy: updated.addedBy,
        addedAt: updated.addedAt.toISOString(),
        lastUsedAt: updated.lastUsedAt ? updated.lastUsedAt.toISOString() : null,
        notes: updated.notes,
      },
      accessCode,
    });
  } catch (err) {
    logger.error({ err }, "Failed to rotate access code");
    res.status(500).json({ error: "Failed to rotate access code" });
  }
});

export default router;
