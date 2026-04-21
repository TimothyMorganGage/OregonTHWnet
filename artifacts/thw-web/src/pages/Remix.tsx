import {
  Share2,
  Sparkles,
  Mail,
  ExternalLink,
  Building2,
  Landmark,
  Hospital,
  CheckCircle2,
  ArrowRight,
  Code2,
  Palette,
  KeyRound,
  Users,
  ShieldCheck,
  MessagesSquare,
  FileText,
  TrendingUp,
} from "lucide-react";

const COOP_ORGANIZER_EMAIL = "tmgtyw@gmail.com";
// Replace with the actual public Replit URL of this project once it is
// published. The "Remix" button on a Replit cover page lets visitors fork
// the entire project — code, schema, secrets template — into their own
// account in one click.
const REPLIT_PROJECT_URL = "https://replit.com/";

const AUDIENCES = [
  {
    Icon: Building2,
    title: "State health authorities",
    body: "Adapt the registry, taxonomy, and CCO/MCO contracting tools to your state's CHW/CHR/peer-support law. Built around Oregon's ORS 414.025 — easy to swap.",
  },
  {
    Icon: Landmark,
    title: "Tribal nations & UIHO",
    body: "Configure the worker taxonomy around tribal community health representatives (CHRs), traditional healers, and culturally specific roles your nation already credentials.",
  },
  {
    Icon: Hospital,
    title: "Allied health authorities",
    body: "County health departments, CCOs, FQHCs, and advocacy coalitions can stand up a network for the workforce they convene — even if it isn't yet recognized by Medicaid.",
  },
];

const WHATS_IN_THE_BOX = [
  { Icon: Users, label: "THW workforce taxonomy with credentials, scope, and supervisory requirements" },
  { Icon: ShieldCheck, label: "Cooperative membership intake with team-gated organizer review console" },
  { Icon: FileText, label: "Claims tracker (CPT + state-specific Z-code mapping)" },
  { Icon: TrendingUp, label: "ROI forecaster (FFS + In-Lieu-Of-Services projections)" },
  { Icon: MessagesSquare, label: "Public member forum routed to the organizer's inbox" },
  { Icon: KeyRound, label: "Per-team-member access codes — invite, rotate, revoke" },
];

const CUSTOMIZE_ROWS: Array<{ what: string; oregon: string; you: string }> = [
  { what: "State / jurisdiction name", oregon: "Oregon", you: "Your state, tribe, or service area" },
  { what: "Authorizing law", oregon: "ORS 414.025", you: "Your enabling statute or tribal code" },
  { what: "Recognizing agency", oregon: "Oregon Health Authority (OHA)", you: "Your health authority or tribal health dept." },
  { what: "Worker registry", oregon: "OHA THW Registry", you: "Your jurisdiction's CHW / CHR / peer registry" },
  { what: "Counties / regions", oregon: "36 Oregon counties", you: "Your counties, reservations, or service areas" },
  { what: "Recognized roles", oregon: "14 OHA-recognized + 4 advocacy roles", you: "Your recognized + emerging roles" },
  { what: "Organizer email", oregon: COOP_ORGANIZER_EMAIL, you: "Your cooperative's contact" },
  { what: "Brand color & name", oregon: "Oregon THW Alliance Platform", you: "Your network's name & palette" },
];

const REMIX_STEPS = [
  {
    title: "Click Remix on the Replit project",
    body: "You'll get a complete copy of the codebase — web app, mobile app, API server, and database schema — in your own Replit account.",
  },
  {
    title: "Customize the workforce taxonomy",
    body: "Edit the worker types, county list, and authorizing law in the data files to match your jurisdiction. Replace the OHA Registry link with yours.",
  },
  {
    title: "Set your organizer email and access code",
    body: "Add your cooperative organizer's email everywhere it's referenced and set a fresh ADMIN_TOKEN secret — that becomes your founding access code.",
  },
  {
    title: "Publish and start inviting team members",
    body: "Press Publish in Replit, share the URL with your community, and use the admin Team tab to invite the rest of your reviewers.",
  },
];

const FILES_TO_EDIT = [
  { path: "artifacts/thw-web/src/data/thwWorkerTypes.ts", what: "Worker taxonomy & advocacy roles" },
  { path: "artifacts/thw-web/src/data/oregonCounties.ts", what: "County / region list" },
  { path: "artifacts/thw-web/src/components/Layout.tsx", what: "Sidebar brand name" },
  { path: "artifacts/thw-web/src/index.css", what: "Brand color (--primary)" },
  { path: "artifacts/thw-web/src/pages/Join.tsx", what: "Cooperative organizer email + intake copy" },
  { path: "artifacts/api-server/src/lib/auth.ts", what: "FOUNDER_EMAIL constant" },
];

export default function Remix() {
  const inviteEmailSubject = encodeURIComponent("Interested in remixing the THW Network platform");
  const inviteEmailBody = encodeURIComponent(
    [
      "Hello Oregon THW Cooperative,",
      "",
      "I represent [your state / tribe / health authority] and I'd like to remix your THW Network platform for our jurisdiction.",
      "",
      "About us:",
      "  • Organization:",
      "  • Jurisdiction:",
      "  • Workforce we'd serve:",
      "  • Approximate # of THW / CHW / CHR / peer support workers:",
      "",
      "Questions:",
      "  1.",
      "  2.",
      "",
      "Thank you for building this in the open.",
    ].join("\n"),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide inline-flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" />
          Remix this platform
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Build a THW Network for your state, tribe, or health authority.
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          The Oregon THW Alliance Platform is open for any jurisdiction to remix. Take the
          codebase, swap in your own law, registry, and workforce taxonomy, and stand up a
          cooperative-grade tool for your Traditional Health Workers in an afternoon — not in two
          years of contracted procurement.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={REPLIT_PROJECT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Remix on Replit
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={`mailto:${COOP_ORGANIZER_EMAIL}?subject=${inviteEmailSubject}&body=${inviteEmailBody}`}
            className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" />
            Talk to the Oregon co-op
          </a>
        </div>
      </section>

      {/* Audiences */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Who this is for</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {AUDIENCES.map(({ Icon, title, body }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's in the box */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">What's in the box</h2>
        <p className="text-muted-foreground">
          Every remix starts with the full Oregon platform. You inherit:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {WHATS_IN_THE_BOX.map(({ Icon, label }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-lg p-4 flex items-start gap-3"
            >
              <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customization mapping */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <Palette className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Customize for your jurisdiction</h2>
            <p className="text-muted-foreground mt-1">
              These are the eight things you'll change to make the platform yours. Everything else
              works out of the box.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-foreground">What to swap</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Oregon ships with</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">You replace with</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CUSTOMIZE_ROWS.map((row) => (
                <tr key={row.what}>
                  <td className="px-4 py-3 font-medium text-foreground">{row.what}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.oregon}</td>
                  <td className="px-4 py-3 text-foreground italic">{row.you}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to remix */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">How to remix</h2>
        <div className="space-y-3">
          {REMIX_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="bg-card border border-border rounded-xl p-5 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Files to edit */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <Code2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Files you'll touch</h2>
            <p className="text-muted-foreground mt-1">
              For technical teams: here's exactly where the Oregon-specific values live.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {FILES_TO_EDIT.map((f) => (
            <div key={f.path} className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
              <code className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded">{f.path}</code>
              <span className="text-sm text-muted-foreground">{f.what}</span>
            </div>
          ))}
        </div>
      </section>

      {/* License + collaboration */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-foreground">Built in the open, for the workforce.</h3>
            <p className="text-sm text-foreground">
              The Oregon THW Cooperative built this platform for ourselves and is sharing it freely
              with every state, tribal nation, and health authority that wants to advance their own
              traditional and community health worker workforce. Use it, change it, share what you
              learn. If your remix improves a measure or fixes a denial pattern, send the change
              back so every network gets stronger.
            </p>
          </div>
        </div>
        <a
          href={`mailto:${COOP_ORGANIZER_EMAIL}?subject=${inviteEmailSubject}&body=${inviteEmailBody}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Email the Oregon cooperative
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
