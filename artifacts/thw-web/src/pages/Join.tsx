import { useEffect, useMemo, useState } from "react";
import {
  Users,
  TrendingUp,
  Shield,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Mail,
  LogIn,
} from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { THW_WORKER_TYPES, ADVOCACY_EXPANSION_ROLES, groupedWorkerTypes } from "../data/thwWorkerTypes";
import { useMembers, type CoopMember } from "../hooks/useMembers";

const COOP_ORGANIZER_EMAIL = "tmgtyw@gmail.com";

function buildApplicationEmail(member: CoopMember): { subject: string; body: string } {
  const wt = THW_WORKER_TYPES.find((t) => t.id === member.thwType);
  const advocacy = ADVOCACY_EXPANSION_ROLES.find((r) => r.id === member.thwType);
  const roleLabel = wt?.title ?? advocacy?.title ?? member.thwType;
  const roleKind = wt ? "OHA-recognized credential" : advocacy ? "Co-op advocacy role (not yet ORS-recognized)" : "Unspecified";
  const statusLabel =
    member.certificationStatus === "certified"
      ? "OHA Certified"
      : member.certificationStatus === "in_progress"
      ? "Certification in progress"
      : "Prospective THW";

  const subject = `[Oregon THW Co-op Application] ${member.fullName} — ${roleLabel}`;
  const body = [
    "Oregon THW Cooperative — new membership application",
    "",
    `Name:                ${member.fullName}`,
    `Email:               ${member.email ?? "(not provided)"}`,
    `Phone:               ${member.phone ?? "(not provided)"}`,
    `Organization:        ${member.organization ?? "(not provided)"}`,
    `County:              ${member.county}`,
    "",
    `THW role:            ${roleLabel}`,
    `Role kind:           ${roleKind}`,
    `Certification:       ${statusLabel}`,
    `OHA Registry #:      ${member.ohaRegistryNumber ?? "(not provided)"}`,
    "",
    `Languages:           ${member.languages.length ? member.languages.join(", ") : "(none listed)"}`,
    `Populations served:  ${member.populationsServed.length ? member.populationsServed.join(", ") : "(none listed)"}`,
    "",
    `Cooperative consent: ${member.consentMembership ? "YES" : "NO"}`,
    `Data-sharing consent:${member.consentDataSharing ? " YES (opted in)" : " no (opted out)"}`,
    "",
    `Submitted:           ${new Date(member.joinedAt).toLocaleString()}`,
    "",
    "— Sent from the Oregon THW Cooperative platform",
  ].join("\n");

  return { subject, body };
}

const OREGON_COUNTIES = [
  "Baker", "Benton", "Clackamas", "Clatsop", "Columbia", "Coos", "Crook",
  "Curry", "Deschutes", "Douglas", "Gilliam", "Grant", "Harney", "Hood River",
  "Jackson", "Jefferson", "Josephine", "Klamath", "Lake", "Lane", "Lincoln",
  "Linn", "Malheur", "Marion", "Morrow", "Multnomah", "Polk", "Sherman",
  "Tillamook", "Umatilla", "Union", "Wallowa", "Wasco", "Washington",
  "Wheeler", "Yamhill",
];

const COMMON_LANGUAGES = [
  "English", "Spanish", "Vietnamese", "Russian", "Mandarin", "Cantonese",
  "Korean", "Arabic", "Somali", "Swahili", "Amharic", "Tigrinya",
  "Ukrainian", "ASL", "Mam", "K'iche'",
];

const POPULATION_OPTIONS = [
  "Medicaid (OHP) members",
  "Pregnant and postpartum people",
  "Adults in SUD recovery",
  "People experiencing houselessness",
  "Justice-involved individuals",
  "Refugee and immigrant communities",
  "Tribal community members",
  "Children, youth, and families",
  "Older adults",
  "Adults with serious mental illness",
  "Migrant and seasonal farmworkers",
  "LGBTQ+ communities",
];

interface FormState {
  fullName: string;
  thwType: string;
  certificationStatus: "certified" | "in_progress" | "prospective";
  ohaRegistryNumber: string;
  county: string;
  languages: string[];
  populationsServed: string[];
  email: string;
  phone: string;
  organization: string;
  consentDataSharing: boolean;
  consentMembership: boolean;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  thwType: "",
  certificationStatus: "prospective",
  ohaRegistryNumber: "",
  county: "",
  languages: [],
  populationsServed: [],
  email: "",
  phone: "",
  organization: "",
  consentDataSharing: false,
  consentMembership: false,
};

function ValueProp({ icon: Icon, title, body }: { icon: typeof Users; title: string; body: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={
        "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
        (selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border hover:border-primary/50")
      }
    >
      {label}
    </button>
  );
}

function MemberCard({ member }: { member: CoopMember }) {
  const wt = THW_WORKER_TYPES.find((t) => t.id === member.thwType);
  const advocacyRole = ADVOCACY_EXPANSION_ROLES.find((r) => r.id === member.thwType);
  const roleLabel = wt?.title ?? advocacyRole?.title ?? member.thwType;
  const roleColor = wt?.color ?? advocacyRole?.color;
  const roleAbbrev = wt?.abbreviation ?? advocacyRole?.abbreviation;
  const statusLabel =
    member.certificationStatus === "certified"
      ? "OHA Certified"
      : member.certificationStatus === "in_progress"
      ? "Certification in progress"
      : "Prospective THW";
  const statusColor =
    member.certificationStatus === "certified"
      ? "bg-emerald-100 text-emerald-700"
      : member.certificationStatus === "in_progress"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start gap-3">
        {roleColor && roleAbbrev ? (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: roleColor }}
          >
            {roleAbbrev}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm truncate">{member.fullName}</p>
          <p className="text-muted-foreground text-xs">
            {roleLabel} · {member.county} County
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${statusColor}`}>
          {statusLabel}
        </span>
        {advocacyRole && (
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            Advocacy role
          </span>
        )}
        {member.consentDataSharing && (
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
            Sharing data
          </span>
        )}
      </div>
      {member.languages.length > 0 && (
        <p className="text-muted-foreground text-xs mt-2.5">
          <span className="font-medium text-foreground/80">Languages:</span> {member.languages.join(", ")}
        </p>
      )}
      {member.populationsServed.length > 0 && (
        <p className="text-muted-foreground text-xs mt-1">
          <span className="font-medium text-foreground/80">Serves:</span>{" "}
          {member.populationsServed.slice(0, 2).join(", ")}
          {member.populationsServed.length > 2 ? ` +${member.populationsServed.length - 2}` : ""}
        </p>
      )}
    </div>
  );
}

export default function Join() {
  const { members, addMember } = useMembers();
  const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submittedMember, setSubmittedMember] = useState<CoopMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Once signed in, prefill name + verified email from the authenticated
  // identity. The server attaches the verified email regardless, but
  // prefilling keeps the form consistent with what will be saved.
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      email: prev.email || user.email || "",
      fullName: prev.fullName || [user.firstName, user.lastName].filter(Boolean).join(" "),
    }));
  }, [user]);

  const stats = useMemo(() => {
    const counties = new Set(members.map((m) => m.county));
    const types = new Set(members.map((m) => m.thwType));
    const sharing = members.filter((m) => m.consentDataSharing).length;
    return {
      total: members.length,
      counties: counties.size,
      types: types.size,
      sharing,
    };
  }, [members]);

  function toggleArray(field: "languages" | "populationsServed", value: string) {
    setForm((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (!form.thwType) return setError("Please select your THW type.");
    if (!form.county) return setError("Please select the county where you work.");
    if (!form.email.trim()) return setError("Please enter a contact email.");
    if (form.certificationStatus !== "prospective") {
      if (form.languages.length === 0)
        return setError("Please select at least one language you use with clients.");
      if (form.populationsServed.length === 0)
        return setError("Please select at least one population you serve.");
    }
    if (!form.consentMembership)
      return setError("Please confirm cooperative membership consent to continue.");

    setSubmitting(true);
    try {
      const newMember = await addMember({
        fullName: form.fullName.trim(),
        thwType: form.thwType,
        certificationStatus: form.certificationStatus,
        ohaRegistryNumber: form.ohaRegistryNumber.trim() || null,
        county: form.county,
        languages: form.languages,
        populationsServed: form.populationsServed,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        organization: form.organization.trim() || null,
        consentDataSharing: form.consentDataSharing,
        consentMembership: form.consentMembership,
      });

      setSubmittedMember(newMember);
      setForm(EMPTY_FORM);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const { subject, body } = buildApplicationEmail(newMember);
        const mailto = `mailto:${COOP_ORGANIZER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application. Please try again or email the organizer directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
          Cooperative Membership
        </p>
        <h1 className="text-3xl font-bold text-foreground mt-0.5">Join the Oregon THW Cooperative</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          A worker-led cooperative for Traditional Health Workers measuring our own quality, ROI,
          and denial patterns — together. Pool your billing data with peers across Oregon to make
          the case for full reimbursement of THW work by 2030.
        </p>
      </div>

      {/* Confirmation banner */}
      {submittedMember && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              Welcome to the cooperative, {submittedMember.fullName}.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Your application was saved to the cooperative database and your email client should
              have opened with a copy addressed to the organizer at{" "}
              <a href={`mailto:${COOP_ORGANIZER_EMAIL}`} className="text-primary font-medium hover:underline">
                {COOP_ORGANIZER_EMAIL}
              </a>
              . Please send that email to complete your application — the organizer reviews
              applications within 5 business days and will reach out about OHA registry verification
              and the cooperative onboarding call.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Didn't see your email client open?{" "}
              <button
                type="button"
                onClick={() => {
                  const { subject, body } = buildApplicationEmail(submittedMember);
                  window.location.href = `mailto:${COOP_ORGANIZER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                className="text-primary font-medium hover:underline"
              >
                Click here to retry
              </button>
              .
            </p>
          </div>
        </div>
      )}

      {/* Direct contact panel — for people who don't want to fill the form */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
        <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            Prefer to reach out directly? Email the cooperative organizer.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Questions about membership, certification pathways, advocacy roles, or cooperative
            governance — write to{" "}
            <a
              href={`mailto:${COOP_ORGANIZER_EMAIL}?subject=${encodeURIComponent("Oregon THW Co-op — inquiry")}`}
              className="text-primary font-medium hover:underline"
            >
              {COOP_ORGANIZER_EMAIL}
            </a>
            . All applications submitted through the form below are also routed to this address.
          </p>
        </div>
      </div>

      {/* Co-op stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary text-white rounded-xl p-5">
          <p className="text-white/70 text-xs uppercase tracking-wide font-semibold">Members</p>
          <p className="text-3xl font-bold mt-1">{stats.total}</p>
          <p className="text-white/70 text-xs mt-1">Cooperative strong</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">Counties</p>
          <p className="text-3xl font-bold mt-1 text-foreground">{stats.counties}</p>
          <p className="text-muted-foreground text-xs mt-1">Of Oregon's 36 represented</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">THW Types</p>
          <p className="text-3xl font-bold mt-1 text-foreground">{stats.types}</p>
          <p className="text-muted-foreground text-xs mt-1">Of {THW_WORKER_TYPES.length} OHA-recognized credentials + {ADVOCACY_EXPANSION_ROLES.length} advocacy roles</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">Sharing Data</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">{stats.sharing}</p>
          <p className="text-muted-foreground text-xs mt-1">Contributing to econometrics</p>
        </div>
      </div>

      {/* Value props */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">What the cooperative does for you</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ValueProp
            icon={TrendingUp}
            title="Pooled denial analytics"
            body="See which payers and CPT/Z code combinations get denied across the network — so you don't have to discover patterns alone."
          />
          <ValueProp
            icon={Shield}
            title="Quality measure tracking"
            body="HEDIS contributions, FFS+ILOS ROI, and SDOH outcomes auto-aggregate from member-reported data."
          />
          <ValueProp
            icon={HeartHandshake}
            title="Collective bargaining power"
            body="Member-owned, member-governed. Your data fuels advocacy with CCOs, OHA, and the legislature."
          />
          <ValueProp
            icon={Sparkles}
            title="Path to certification"
            body="Prospective THWs get peer mentorship and a roadmap to OHA registry listing under ORS 414.025."
          />
        </div>
      </div>

      {/* Application form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground">Apply for cooperative membership</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Open to all certified, in-progress, and prospective Traditional Health Workers in Oregon.
        </p>

        {authLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Checking your sign-in status…</p>
        ) : !isAuthenticated ? (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-start gap-3">
              <LogIn className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Sign in to apply for cooperative membership
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Cooperative registration is secured through your verified account. Sign in to
                  begin your application — your verified email is attached to your membership
                  record automatically, so the organizer always knows applications come from a
                  real, authenticated person.
                </p>
                <button
                  type="button"
                  onClick={login}
                  className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Log in to continue
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between flex-wrap gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5">
              <p className="text-sm text-foreground">
                Signed in as{" "}
                <span className="font-semibold">
                  {user?.email ??
                    ([user?.firstName, user?.lastName].filter(Boolean).join(" ") || "your account")}
                </span>
              </p>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-medium text-muted-foreground hover:text-foreground underline"
              >
                Log out
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Identity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Full name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Contact email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="you@example.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="(541) 555-0100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Organization or independent practice (optional)
              </label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Lane County CHW Collective"
              />
            </div>
          </div>

          {/* THW type + certification */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                THW type (per ORS 414.025) <span className="text-destructive">*</span>
              </label>
              <select
                value={form.thwType}
                onChange={(e) => setForm({ ...form, thwType: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select your role…</option>
                <optgroup label="Standalone OHA-recognized credentials">
                  {groupedWorkerTypes().standalone.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.abbreviation})
                    </option>
                  ))}
                </optgroup>
                {Array.from(groupedWorkerTypes().groups.entries()).map(([parent, list]) => (
                  <optgroup key={parent} label={`${parent} — OHA subtypes`}>
                    {list.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.abbreviation})
                      </option>
                    ))}
                  </optgroup>
                ))}
                <optgroup label="Co-op advocacy roles (not yet ORS-recognized)">
                  {ADVOCACY_EXPANSION_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.abbreviation}) — advocacy
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-[11px] text-muted-foreground mt-1">
                {THW_WORKER_TYPES.length} OHA-recognized credentials + {ADVOCACY_EXPANSION_ROLES.length}{" "}
                advocacy-priority roles. Advocacy roles join the cooperative for organizing power; only
                ORS-recognized credentials are currently Medicaid-billable.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Certification status <span className="text-destructive">*</span>
              </label>
              <select
                value={form.certificationStatus}
                onChange={(e) =>
                  setForm({
                    ...form,
                    certificationStatus: e.target.value as FormState["certificationStatus"],
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="prospective">Prospective — exploring becoming a THW</option>
                <option value="in_progress">In progress — completing OHA-approved training</option>
                <option value="certified">Certified — listed on the OHA THW Registry</option>
              </select>
            </div>
            {form.certificationStatus === "certified" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  OHA registry number (optional)
                </label>
                <input
                  type="text"
                  value={form.ohaRegistryNumber}
                  onChange={(e) => setForm({ ...form, ohaRegistryNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. THW-CHW-12345"
                />
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  Look up your number at
                  <a
                    href="https://traditionalhealthworkerregistry.oregon.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    traditionalhealthworkerregistry.oregon.gov
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Primary county served <span className="text-destructive">*</span>
              </label>
              <select
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select a county…</option>
                {OREGON_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Languages */}
          <div role="group" aria-labelledby="join-languages-label">
            <p id="join-languages-label" className="block text-sm font-medium text-foreground mb-2">
              Languages you use with clients{" "}
              {form.certificationStatus === "prospective" ? (
                <span className="text-muted-foreground font-normal">(optional for prospective members)</span>
              ) : (
                <span className="text-destructive" aria-hidden="true">*</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_LANGUAGES.map((lang) => (
                <Chip
                  key={lang}
                  label={lang}
                  selected={form.languages.includes(lang)}
                  onToggle={() => toggleArray("languages", lang)}
                />
              ))}
            </div>
          </div>

          {/* Populations */}
          <div role="group" aria-labelledby="join-populations-label">
            <p id="join-populations-label" className="block text-sm font-medium text-foreground mb-2">
              Populations you serve{" "}
              {form.certificationStatus === "prospective" ? (
                <span className="text-muted-foreground font-normal">(optional for prospective members)</span>
              ) : (
                <span className="text-destructive" aria-hidden="true">*</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULATION_OPTIONS.map((pop) => (
                <Chip
                  key={pop}
                  label={pop}
                  selected={form.populationsServed.includes(pop)}
                  onToggle={() => toggleArray("populationsServed", pop)}
                />
              ))}
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-3 border-t border-border pt-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consentMembership}
                onChange={(e) => setForm({ ...form, consentMembership: e.target.checked })}
                className="mt-1 w-4 h-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm text-foreground">
                <span className="font-medium">Cooperative membership consent.</span>{" "}
                <span className="text-muted-foreground">
                  I want to join the Oregon THW Cooperative as a worker-member and abide by its
                  one-member-one-vote governance.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consentDataSharing}
                onChange={(e) => setForm({ ...form, consentDataSharing: e.target.checked })}
                className="mt-1 w-4 h-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm text-foreground">
                <span className="font-medium">Econometric data-sharing consent (optional).</span>{" "}
                <span className="text-muted-foreground">
                  I agree to contribute my de-identified billing, denial, and HEDIS outcome data to
                  the cooperative's quality-measurement pool. I can withdraw at any time.
                </span>
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-muted-foreground">
              Your application is saved to the cooperative database and a copy is emailed to the
              organizer at {COOP_ORGANIZER_EMAIL}.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit membership application"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
            </form>
          </>
        )}
      </div>

      {/* Member directory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Cooperative member directory</h2>
          <span className="text-xs text-muted-foreground">{members.length} members</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
