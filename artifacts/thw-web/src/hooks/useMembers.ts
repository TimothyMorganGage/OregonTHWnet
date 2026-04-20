import { useCallback, useEffect, useState } from "react";

export interface CoopMember {
  id: string;
  fullName: string;
  thwType: string;
  certificationStatus: "certified" | "in_progress" | "prospective";
  ohaRegistryNumber?: string | null;
  county: string;
  languages: string[];
  populationsServed: string[];
  email: string;
  phone?: string | null;
  organization?: string | null;
  consentDataSharing: boolean;
  consentMembership: boolean;
  reviewStatus?: "pending" | "approved" | "declined";
  ohaVerified?: boolean;
  joinedAt: string;
}

const API_BASE = `${import.meta.env.BASE_URL}api`;

async function fetchMembers(): Promise<CoopMember[]> {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error(`Failed to load members (${res.status})`);
  const json = (await res.json()) as { members: CoopMember[] };
  return json.members;
}

async function postMember(input: Omit<CoopMember, "id" | "joinedAt" | "reviewStatus" | "ohaVerified">): Promise<CoopMember> {
  const res = await fetch(`${API_BASE}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Failed to submit application");
  }
  const json = (await res.json()) as { member: CoopMember };
  return json.member;
}

export function useMembers() {
  const [members, setMembers] = useState<CoopMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchMembers();
      setMembers(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addMember = useCallback(
    async (input: Omit<CoopMember, "id" | "joinedAt" | "reviewStatus" | "ohaVerified">) => {
      const created = await postMember(input);
      setMembers((prev) => [created, ...prev]);
      return created;
    },
    [],
  );

  return { members, loading, error, addMember, refresh };
}
