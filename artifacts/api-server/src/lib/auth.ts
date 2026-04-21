import { randomBytes } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { db, teamMembersTable, type TeamMember } from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";
import { logger } from "./logger";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      teamMember?: TeamMember;
    }
  }
}

const FOUNDER_EMAIL = "tmgtyw@gmail.com";

export function generateAccessCode(): string {
  return randomBytes(24).toString("hex");
}

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization ?? "";
  if (!header.startsWith("Bearer ")) return null;
  const tok = header.slice(7).trim();
  return tok || null;
}

let founderSeeded = false;

// Seed the founding organizer once. Insert tmgtyw@gmail.com using ADMIN_TOKEN
// as the initial access code IF the founder row does not already exist. We
// key on the founder's own email (NOT on table-emptiness) so that adding
// other team members directly to the DB cannot accidentally lock the founder
// out. After the first successful seed, the DB is the single source of truth
// for the founder's access code: rotating ADMIN_TOKEN in the env will NOT
// rotate the founder's code (use the admin UI's "Rotate code" instead).
export async function seedFounderIfMissing(): Promise<void> {
  if (founderSeeded) return;
  try {
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) {
      logger.warn(
        "ADMIN_TOKEN not set; cannot seed founding organizer. Admin will be unreachable until a team member is added directly to the database.",
      );
      founderSeeded = true;
      return;
    }
    const [existingFounder] = await db
      .select({ accessCode: teamMembersTable.accessCode })
      .from(teamMembersTable)
      .where(eq(teamMembersTable.email, FOUNDER_EMAIL))
      .limit(1);
    if (!existingFounder) {
      await db
        .insert(teamMembersTable)
        .values({
          email: FOUNDER_EMAIL,
          accessCode: adminToken,
          role: "admin",
          active: true,
          addedBy: null,
          notes: "Founding cooperative organizer (seeded from ADMIN_TOKEN).",
        })
        .onConflictDoNothing();
      logger.info({ email: FOUNDER_EMAIL }, "Seeded founding organizer into team_members");
    } else if (existingFounder.accessCode !== adminToken) {
      // Help the operator notice that env-var rotation no longer takes effect.
      logger.warn(
        { email: FOUNDER_EMAIL },
        "ADMIN_TOKEN env var differs from founder's stored access code. The DB value takes precedence — rotate via the admin UI, not by editing the secret.",
      );
    }
    founderSeeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed founding organizer");
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = bearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing access code" });
    return;
  }
  try {
    const [member] = await db
      .select()
      .from(teamMembersTable)
      .where(and(eq(teamMembersTable.accessCode, token), eq(teamMembersTable.active, true)))
      .limit(1);
    if (!member) {
      res.status(401).json({ error: "Invalid or revoked access code" });
      return;
    }
    req.teamMember = member;
    // Fire-and-forget: track last activity so the founder can spot stale codes.
    db.update(teamMembersTable)
      .set({ lastUsedAt: sql`now()` })
      .where(eq(teamMembersTable.email, member.email))
      .catch((err) => logger.warn({ err }, "Failed to update lastUsedAt"));
    next();
  } catch (err) {
    logger.error({ err }, "Auth lookup failed");
    res.status(500).json({ error: "Authentication failed" });
  }
}

export const FOUNDER = FOUNDER_EMAIL;
