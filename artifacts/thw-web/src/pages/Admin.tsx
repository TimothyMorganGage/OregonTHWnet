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

export default function Admin() {
  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(TOKEN_KEY) ?? "";
  });
  const [tokenInput, setTokenInput] = useState("");
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "declined">("pending");

  const refresh = useCallback(async (authToken: string) => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/members`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        setError("Invalid admin token. Try again.");
        setToken("");
        window.sessionStorage.removeItem(TOKEN_KEY);
        return;
      }
      if (res.status === 503) {
        setError("Admin is not yet configured on the server. The site organizer needs to set the ADMIN_TOKEN secret.");
        return;
      }
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = (await res.json()) as { members: AdminMember[] };
      setMembers(json.members);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) refresh(token);
  }, [token, refresh]);

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
    setMembers([]);
  }

  async function patchMember(id: string, patch: Partial<Pick<AdminMember, "reviewStatus" | "ohaVerified" | "reviewerNotes">>) {
    try {
      const res = await fetch(`${API_BASE}/admin/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      const res = await fetch(`${API_BASE}/admin/members.csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
            <h1 className="text-xl font-bold text-foreground">Cooperative organizer login</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your admin token to review membership applications. The token was set as a server
            secret — only the cooperative organizer should have access.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Admin token"
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
          <h1 className="text-3xl font-bold text-foreground mt-1">Membership applications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review prospective and current THW co-op members. Verify OHA registry status before
            approving.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refresh(token)}
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

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-800">{error}</p>
        </div>
      )}

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
    </div>
  );
}
