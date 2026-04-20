import { useEffect, useState, useCallback } from "react";

export interface CoopMember {
  id: string;
  fullName: string;
  thwType: string;
  certificationStatus: "certified" | "in_progress" | "prospective";
  ohaRegistryNumber?: string;
  county: string;
  languages: string[];
  populationsServed: string[];
  email: string;
  phone?: string;
  organization?: string;
  consentDataSharing: boolean;
  consentMembership: boolean;
  joinedAt: string;
}

const STORAGE_KEY = "oregon_thw_coop_members_v1";

const SEED_MEMBERS: CoopMember[] = [
  {
    id: "m_seed_001",
    fullName: "Aisha Okafor",
    thwType: "community_health_worker",
    certificationStatus: "certified",
    ohaRegistryNumber: "THW-CHW-04821",
    county: "Multnomah",
    languages: ["English", "Yoruba"],
    populationsServed: ["African immigrant families", "Medicaid-enrolled adults"],
    email: "demo+aisha@example.org",
    organization: "Northeast Portland Community Health",
    consentDataSharing: true,
    consentMembership: true,
    joinedAt: "2026-01-12T10:00:00Z",
  },
  {
    id: "m_seed_002",
    fullName: "Carlos Mendez",
    thwType: "peer_support_specialist",
    certificationStatus: "certified",
    ohaRegistryNumber: "THW-PSS-02134",
    county: "Washington",
    languages: ["English", "Spanish"],
    populationsServed: ["Adults in SUD recovery", "Justice-involved individuals"],
    email: "demo+carlos@example.org",
    organization: "Washington County Recovery Network",
    consentDataSharing: true,
    consentMembership: true,
    joinedAt: "2026-02-03T14:30:00Z",
  },
  {
    id: "m_seed_003",
    fullName: "Leilani Kahale",
    thwType: "birth_doula",
    certificationStatus: "certified",
    ohaRegistryNumber: "THW-BD-00917",
    county: "Lane",
    languages: ["English"],
    populationsServed: ["Pregnant people on OHP", "First-time parents"],
    email: "demo+leilani@example.org",
    consentDataSharing: true,
    consentMembership: true,
    joinedAt: "2026-02-19T09:15:00Z",
  },
];

function load(): CoopMember[] {
  if (typeof window === "undefined") return SEED_MEMBERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_MEMBERS;
    const parsed = JSON.parse(raw) as CoopMember[];
    return Array.isArray(parsed) ? parsed : SEED_MEMBERS;
  } catch {
    return SEED_MEMBERS;
  }
}

function persist(members: CoopMember[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {
    // ignore quota errors in demo
  }
}

export function useMembers() {
  const [members, setMembers] = useState<CoopMember[]>(() => load());

  useEffect(() => {
    persist(members);
  }, [members]);

  const addMember = useCallback((input: Omit<CoopMember, "id" | "joinedAt">) => {
    const newMember: CoopMember = {
      ...input,
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      joinedAt: new Date().toISOString(),
    };
    setMembers((prev) => [newMember, ...prev]);
    return newMember;
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const resetToSeed = useCallback(() => {
    setMembers(SEED_MEMBERS);
  }, []);

  return { members, addMember, removeMember, resetToSeed };
}
