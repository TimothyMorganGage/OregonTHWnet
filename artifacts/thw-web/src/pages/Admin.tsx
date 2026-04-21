import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  ExternalLink,
  Lock,
  AlertTriangle,
  Users,
  UserPlus,
  KeyRound,
  Copy,
  ClipboardCheck,
  Mail,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { THW_WORKER_TYPES, ADVOCACY_EXPANSION_ROLES } from "../data/thwWorkerTypes";

interface AdminMember {
  id: string;
  fullName: string;
  thwType: string;
  certificationStatus: "certified" | "in_progress" | "prospective";
  ohaRegistryNumber: string | null;
  county: string;
  languages: string[];
  populationsServed: string[];
  email: string;
  phone: string | null;
  organization: string | null;
  consentDataSharing: boolean;
  consentMembership: boolean;
  reviewStatus: "pending" | "approved" | "declined";
  ohaVerified: boolean;
  reviewerNotes: string | null;
  reviewedAt: string | null;
  joinedAt: string;
}

interface TeamMember {
  email: string;
  role: string;
  active: boolean;
  addedBy: string | null;
  addedAt: string;
  lastUsedAt: string | null;
  notes: string | null;
}

interface MeResponse {
  email: string;
  role: string;
  active: boolean;
  addedAt: string;
  lastUsedAt: string | null;
}

const API_BASE = "/api";
const TOKEN_KEY = "oregon_thw_admin_token";

function roleLabel(thwType: string): { label: string; kind: "ohaRecognized" | "advocacy" | "unknown" } {
  const oha = THW_WORKER_TYPES.find((t) => t.id === thwType);
  if (oha) return { label: oha.title, kind: "ohaRecognized" };
  const adv = ADVOCACY_EXPANSION_ROLES.find((r) => r.id === thwType);
  if (adv) return { label: adv.title, kind: "advocacy" };
  return { label: thwType, kind: "unknown" };
}

function StatusBadge({ status }: { status: AdminMember["reviewStatus"] }) {
  const map = {
    pending: { Icon: Clock, label: "Pending review", cls: "bg-amber-50 text-amber-800 border-amber-200" },
    approved: { Icon: CheckCircle2, label: "Approved", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    declined: { Icon: XCircle, label: "Declined", cls: "bg-rose-50 text-rose-800 border-rose-200" },
  } as const;
  const { Icon, label, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

type Tab = "applications" | "team";

export default function Admin() {
  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(TOKEN_KEY) ?? "";
  });
  const [tokenInput, setTokenInput] = useState("");
  const [me, setMe] = useState<MeResponse | null>(null);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "declined">("pending");
  const [tab, setTab] = useState<Tab>("applications");

  const authHeaders = useCallback(
    (extra?: HeadersInit): HeadersInit => ({
      ...(extra ?? {}),
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  const refreshAll = useCallback(
    async (authToken: string) => {
      if (!authToken) return;
      setLoading(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${authToken}` };
        const [meRes, membersRes, teamRes] = await Promise.all([
          fetch(`${API_BASE}/admin/me`, { headers }),
          fetch(`${API_BASE}/admin/members`, { headers }),
          fetch(`${API_BASE}/admin/team-members`, { headers }),
        ]);
        if (meRes.status === 401) {
          setError("Invalid or revoked access code. Ask the cooperative organizer to add you to the team.");
          setToken("");
          window.sessionStorage.removeItem(TOKEN_KEY);
          return;
        }
        if (!meRes.ok || !membersRes.ok || !teamRes.ok) {
          throw new Error(`Failed to load (${meRes.status}/${membersRes.status}/${teamRes.status})`);
        }
        const meJson = (await meRes.json()) as MeResponse;
        const membersJson = (await membersRes.json()) as { members: AdminMember[] };
        const teamJson = (await teamRes.json()) as { members: TeamMember[] };
        setMe(meJson);
        setMembers(membersJson.members);
        setTeam(teamJson.members);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (token) refreshAll(token);
  }, [token, refreshAll]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const t = tokenInput.trim();
    if (!t) return;
    window.sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setTokenInput("");
  }

  function handleLogout() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setMe(null);
    setMembers([]);
    setTeam([]);
  }

  async function patchMember(id: string, patch: Partial<Pick<AdminMember, "reviewStatus" | "ohaVerified" | "reviewerNotes">>) {
    try {
      const res = await fetch(`${API_BASE}/admin/members/${id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      const json = (await res.json()) as { member: AdminMember };
      setMembers((prev) => prev.map((m) => (m.id === id ? json.member : m)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function downloadCsv() {
    try {
      const res = await fetch(`${API_BASE}/admin/members.csv`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thw-coop-members-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  }

  const filtered = useMemo(() => {
    if (filter === "all") return members;
    return members.filter((m) => m.reviewStatus === filter);
  }, [members, filter]);

  const counts = useMemo(() => ({
    total: members.length,
    pending: members.filter((m) => m.reviewStatus === "pending").length,
    approved: members.filter((m) => m.reviewStatus === "approved").length,
    declined: members.filter((m) => m.reviewStatus === "declined").length,
  }), [members]);

  if (!token) {
    return (
      <div className="p-6 max-w-md mx-auto mt-12">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Team member sign-in</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your personal access code. Codes are issued only to team members invited by the
            cooperative organizer. If you don't have one, contact{" "}
            <a href="mailto:tmgtyw@gmail.com" className="text-primary hover:underline">
              tmgtyw@gmail.com
            </a>.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Your access code"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Sign in
            </button>
          </form>
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
            Organizer console
          </p>
          <h1 className="text-3xl font-bold text-foreground mt-1">Cooperative administration</h1>
          {me && (
            <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Signed in as <span className="font-medium text-foreground">{me.email}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => refreshAll(token)}
            className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={downloadCsv}
            className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-muted-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-1">
        <TabButton active={tab === "applications"} onClick={() => setTab("applications")} icon={Users}>
          Applications
          <span className="ml-1.5 text-xs text-muted-foreground">({counts.total})</span>
        </TabButton>
        <TabButton active={tab === "team"} onClick={() => setTab("team")} icon={Shield}>
          Team & access
          <span className="ml-1.5 text-xs text-muted-foreground">({team.length})</span>
        </TabButton>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-800">{error}</p>
        </div>
      )}

      {tab === "applications" && (
        <ApplicationsTab
          counts={counts}
          filter={filter}
          setFilter={setFilter}
          filtered={filtered}
          loading={loading}
          patchMember={patchMember}
        />
      )}

      {tab === "team" && (
        <TeamTab
          team={team}
          me={me}
          authHeaders={authHeaders}
          onChange={(updated) => setTeam(updated)}
          onError={setError}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Users;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

function ApplicationsTab({
  counts,
  filter,
  setFilter,
  filtered,
  loading,
  patchMember,
}: {
  counts: { total: number; pending: number; approved: number; declined: number };
  filter: "all" | "pending" | "approved" | "declined";
  setFilter: (f: "all" | "pending" | "approved" | "declined") => void;
  filtered: AdminMember[];
  loading: boolean;
  patchMember: (
    id: string,
    patch: Partial<Pick<AdminMember, "reviewStatus" | "ohaVerified" | "reviewerNotes">>,
  ) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          ["all", "All", counts.total],
          ["pending", "Pending", counts.pending],
          ["approved", "Approved", counts.approved],
          ["declined", "Declined", counts.declined],
        ] as const).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-left rounded-xl p-4 border transition-colors ${
              filter === key
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              {label}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
          </button>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-sm text-muted-foreground">
          No applications match this filter yet.
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((m) => {
          const role = roleLabel(m.thwType);
          return (
            <div key={m.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">{m.fullName}</h3>
                    <StatusBadge status={m.reviewStatus} />
                    {m.ohaVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                        <Shield className="w-3 h-3" />
                        OHA verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role.label}
                    {role.kind === "advocacy" && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Advocacy role
                      </span>
                    )}
                    {" — "}
                    {m.county} County
                  </p>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <p>Applied {new Date(m.joinedAt).toLocaleDateString()}</p>
                  {m.reviewedAt && <p>Reviewed {new Date(m.reviewedAt).toLocaleDateString()}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Contact</p>
                  <p className="text-foreground">
                    <a href={`mailto:${m.email}`} className="text-primary hover:underline">{m.email}</a>
                  </p>
                  {m.phone && <p className="text-muted-foreground">{m.phone}</p>}
                  {m.organization && <p className="text-muted-foreground">{m.organization}</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Certification</p>
                  <p className="text-foreground capitalize">{m.certificationStatus.replace("_", " ")}</p>
                  {m.ohaRegistryNumber ? (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Registry #: <span className="font-mono">{m.ohaRegistryNumber}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">No registry number provided</p>
                  )}
                  <a
                    href="https://traditionalhealthworkerregistry.oregon.gov"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  >
                    Verify in OHA Registry
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Languages</p>
                  <p className="text-sm text-foreground">{m.languages.length ? m.languages.join(", ") : "—"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Populations served</p>
                  <p className="text-sm text-foreground">{m.populationsServed.length ? m.populationsServed.join(", ") : "—"}</p>
                </div>
                <div className="md:col-span-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Membership consent: {m.consentMembership ? "yes" : "no"}</span>
                  <span>Data-sharing: {m.consentDataSharing ? "opted in" : "opted out"}</span>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={m.ohaVerified}
                    onChange={(e) => patchMember(m.id, { ohaVerified: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-foreground">I have verified this person in the OHA THW Registry</span>
                </label>

                <textarea
                  defaultValue={m.reviewerNotes ?? ""}
                  placeholder="Reviewer notes (private)…"
                  rows={2}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
                  onBlur={(e) => {
                    const v = e.currentTarget.value;
                    if (v !== (m.reviewerNotes ?? "")) {
                      patchMember(m.id, { reviewerNotes: v || null });
                    }
                  }}
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => patchMember(m.id, { reviewStatus: "approved" })}
                    disabled={m.reviewStatus === "approved"}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => patchMember(m.id, { reviewStatus: "declined" })}
                    disabled={m.reviewStatus === "declined"}
                    className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={() => patchMember(m.id, { reviewStatus: "pending" })}
                    disabled={m.reviewStatus === "pending"}
                    className="inline-flex items-center gap-1.5 border border-border bg-card text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Clock className="w-4 h-4" />
                    Move back to pending
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function TeamTab({
  team,
  me,
  authHeaders,
  onChange,
  onError,
}: {
  team: TeamMember[];
  me: MeResponse | null;
  authHeaders: (extra?: HeadersInit) => HeadersInit;
  onChange: (updated: TeamMember[]) => void;
  onError: (msg: string | null) => void;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteNotes, setInviteNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [issued, setIssued] = useState<{ email: string; accessCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    onError(null);
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/team-members`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ email, notes: inviteNotes.trim() || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? "Failed to add team member");
      }
      const json = (await res.json()) as { member: TeamMember; accessCode: string };
      onChange([json.member, ...team]);
      setIssued({ email: json.member.email, accessCode: json.accessCode });
      setInviteEmail("");
      setInviteNotes("");
      setCopied(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to add team member");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(member: TeamMember) {
    onError(null);
    try {
      const res = await fetch(
        `${API_BASE}/admin/team-members/${encodeURIComponent(member.email)}`,
        {
          method: "PATCH",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ active: !member.active }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? "Failed to update");
      }
      const json = (await res.json()) as { member: TeamMember };
      onChange(team.map((m) => (m.email === member.email ? json.member : m)));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function rotateCode(member: TeamMember) {
    onError(null);
    if (!confirm(`Generate a new access code for ${member.email}? The previous code will stop working immediately.`)) return;
    try {
      const res = await fetch(
        `${API_BASE}/admin/team-members/${encodeURIComponent(member.email)}/rotate`,
        { method: "POST", headers: authHeaders() },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? "Failed to rotate code");
      }
      const json = (await res.json()) as { member: TeamMember; accessCode: string };
      onChange(team.map((m) => (m.email === member.email ? json.member : m)));
      setIssued({ email: json.member.email, accessCode: json.accessCode });
      setCopied(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to rotate code");
    }
  }

  async function copyCode() {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onError("Could not copy to clipboard. Select the code and copy it manually.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <UserPlus className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Invite a team member</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Each team member gets their own personal access code. Share the code through a private
              channel (Signal, in person, encrypted email). The code is shown only once.
            </p>
          </div>
        </div>

        <form onSubmit={addMember} className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Email <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@example.org"
              required
              maxLength={200}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Notes (optional, private)
            </label>
            <input
              type="text"
              value={inviteNotes}
              onChange={(e) => setInviteNotes(e.target.value)}
              placeholder="e.g. board secretary, intake reviewer"
              maxLength={500}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <KeyRound className="w-4 h-4" />
              {submitting ? "Generating…" : "Generate access code"}
            </button>
          </div>
        </form>
      </div>

      {issued && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">
                Share this access code with {issued.email}
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                <strong>This code is shown only once.</strong> Copy it now and send it through a
                private, secure channel. If you lose it, use "Rotate code" below to generate a new one.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm font-mono text-amber-900 break-all select-all">
              {issued.accessCode}
            </code>
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
            >
              {copied ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => setIssued(null)}
              className="inline-flex items-center gap-1.5 border border-amber-300 bg-white text-amber-900 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-amber-100 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Current team ({team.length})</h2>
        <div className="space-y-2">
          {team.map((m) => {
            const isMe = me?.email === m.email;
            const isFounder = m.email === "tmgtyw@gmail.com";
            return (
              <div
                key={m.email}
                className={`bg-card border rounded-xl p-4 flex items-start justify-between gap-3 flex-wrap ${
                  m.active ? "border-border" : "border-border opacity-60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground truncate">{m.email}</p>
                    {isMe && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                        you
                      </span>
                    )}
                    {isFounder && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        founder
                      </span>
                    )}
                    {!m.active && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                        revoked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Added {new Date(m.addedAt).toLocaleDateString()}
                    {m.addedBy && ` by ${m.addedBy}`}
                    {m.lastUsedAt
                      ? ` • last active ${new Date(m.lastUsedAt).toLocaleDateString()}`
                      : " • never signed in"}
                  </p>
                  {m.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{m.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => rotateCode(m)}
                    className="inline-flex items-center gap-1 text-xs border border-border bg-card text-foreground px-2.5 py-1.5 rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Rotate code
                  </button>
                  {!isFounder && !isMe && (
                    <button
                      onClick={() => toggleActive(m)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                        m.active
                          ? "border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      {m.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {m.active ? "Revoke" : "Reactivate"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {team.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-sm text-muted-foreground">
              No team members yet. Use the form above to invite the first one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
