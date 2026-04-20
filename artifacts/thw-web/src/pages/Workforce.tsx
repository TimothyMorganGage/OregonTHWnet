import { useState } from "react";
import { CheckCircle, XCircle, Users, BookOpen, Stethoscope } from "lucide-react";
import { THW_WORKER_TYPES, THWWorkerTypeInfo } from "../data/thwWorkerTypes";

const CATEGORY_FILTERS = [
  "All",
  "Community & Navigation",
  "Peer & Recovery",
  "Doulas",
  "Tribal",
];

function categoryGroup(w: THWWorkerTypeInfo): string {
  if (w.id === "tribal_traditional_health_worker") return "Tribal";
  if (w.id.includes("doula")) return "Doulas";
  if (["peer_support_specialist", "certified_recovery_mentor", "peer_wellness_specialist"].includes(w.id)) return "Peer & Recovery";
  return "Community & Navigation";
}

function WorkerCard({ worker, onClick }: { worker: THWWorkerTypeInfo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-5 text-left hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
          style={{ backgroundColor: worker.color }}
        >
          {worker.abbreviation}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
            {worker.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {worker.oregonRecognized && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">OR Recognized</span>
            )}
            {worker.ilosEligible && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">ILOS Eligible</span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">{worker.description}</p>

      <div className="flex flex-wrap gap-1">
        {worker.primaryCPTCodes.slice(0, 3).map(c => (
          <span key={c} className="text-xs bg-secondary text-primary px-1.5 py-0.5 rounded font-mono border border-border">{c}</span>
        ))}
        {worker.primaryCPTCodes.length > 3 && (
          <span className="text-xs text-muted-foreground">+{worker.primaryCPTCodes.length - 3} more</span>
        )}
      </div>
    </button>
  );
}

function WorkerDetail({ worker, onClose }: { worker: THWWorkerTypeInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg h-full overflow-y-auto shadow-xl border-l border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-start gap-3 z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
            style={{ backgroundColor: worker.color }}
          >
            {worker.abbreviation}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground text-lg leading-tight">{worker.title}</h2>
            <p className="text-muted-foreground text-xs mt-0.5">{worker.certifyingBody}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl font-bold px-1 flex-shrink-0">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold border ${worker.oregonRecognized ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
              {worker.oregonRecognized ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {worker.oregonRecognized ? "Oregon Recognized" : "Not Yet Recognized in OR"}
            </span>
            <span className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold border ${worker.ilosEligible ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
              {worker.ilosEligible ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {worker.ilosEligible ? "ILOS Eligible" : "ILOS Not Yet Established"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground leading-relaxed">{worker.description}</p>

          {/* Key services */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Key Services</h3>
            </div>
            <ul className="space-y-1.5">
              {worker.keyServices.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: worker.color }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* CPT Codes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Primary CPT Codes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {worker.primaryCPTCodes.map(c => (
                <span key={c} className="text-sm bg-secondary text-primary px-3 py-1.5 rounded-lg font-mono font-semibold border border-border">{c}</span>
              ))}
            </div>
          </div>

          {/* Supporting Z Codes */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Common SDOH Z Codes</h3>
            <div className="flex flex-wrap gap-2">
              {worker.supportingZCodes.map(c => (
                <span key={c} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded font-mono border border-border">{c}</span>
              ))}
            </div>
          </div>

          {/* HEDIS categories */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">HEDIS Measure Domains</h3>
            <div className="flex flex-wrap gap-2">
              {worker.hedisCategories.map(c => (
                <span key={c} className="text-xs px-2 py-1 rounded border font-medium" style={{ backgroundColor: `${worker.color}18`, color: worker.color, borderColor: `${worker.color}40` }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Populations served */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Populations Served</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {worker.populations.map((p, i) => (
                <span key={i} className="text-xs bg-secondary text-foreground px-2 py-1 rounded border border-border">{p}</span>
              ))}
            </div>
          </div>

          {/* SDOH focus */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">SDOH Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {worker.sdohFocus.map((s, i) => (
                <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{s}</span>
              ))}
            </div>
          </div>

          {/* Certifying body */}
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Certifying / Overseeing Body</p>
            <p className="text-sm font-medium text-foreground">{worker.certifyingBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Workforce() {
  const [selected, setSelected] = useState<THWWorkerTypeInfo | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ilosFilter, setIlosFilter] = useState(false);

  const filtered = THW_WORKER_TYPES.filter(w => {
    const matchCat = categoryFilter === "All" || categoryGroup(w) === categoryFilter;
    const matchIlos = !ilosFilter || w.ilosEligible;
    return matchCat && matchIlos;
  });

  const ilosCount = THW_WORKER_TYPES.filter(w => w.ilosEligible).length;
  const orRecognizedCount = THW_WORKER_TYPES.filter(w => w.oregonRecognized).length;
  const totalCodes = [...new Set(THW_WORKER_TYPES.flatMap(w => w.primaryCPTCodes))].length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">THW Workforce Directory</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          All Traditional Health Worker types recognized by Oregon's THW Alliance — {THW_WORKER_TYPES.length} specialist roles
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary rounded-xl p-5 text-white">
          <p className="text-4xl font-bold">{THW_WORKER_TYPES.length}</p>
          <p className="text-white/70 text-sm mt-0.5">THW Specialist Types</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-4xl font-bold text-emerald-600">{orRecognizedCount}</p>
          <p className="text-muted-foreground text-sm mt-0.5">OR State Recognized</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-4xl font-bold text-amber-600">{ilosCount}</p>
          <p className="text-muted-foreground text-sm mt-0.5">ILOS Eligible Types</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-4xl font-bold text-foreground">{totalCodes}</p>
          <p className="text-muted-foreground text-sm mt-0.5">Unique CPT Codes</p>
        </div>
      </div>

      {/* Definition banner */}
      <div className="bg-secondary border border-border rounded-xl p-5">
        <h2 className="font-bold text-primary mb-2 text-sm uppercase tracking-wide">What is a Traditional Health Worker?</h2>
        <p className="text-sm text-foreground leading-relaxed">
          Traditional Health Workers (THWs) are community members who serve as bridges between health and social services and the community. Oregon law (ORS 414.025) defines THWs as a category that includes Community Health Workers, Peer Support Specialists, Certified Recovery Mentors, Family Support Specialists, Youth Support Specialists, Doulas, Personal Health Navigators, Peer Wellness Specialists, Tribal Traditional Health Workers, and others. THWs reduce health disparities by meeting community members where they are — culturally, geographically, and linguistically.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                categoryFilter === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIlosFilter(!ilosFilter)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            ilosFilter
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-card text-muted-foreground border-border hover:border-amber-400"
          }`}
        >
          ILOS Eligible Only
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(worker => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onClick={() => setSelected(worker)}
          />
        ))}
      </div>

      {/* ORS cite */}
      <div className="text-center py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          THW types defined under <strong>Oregon Revised Statutes 414.025</strong> and the Oregon Health Authority THW Policy & Program.
          Coverage recognition governed by OHA CCO contracts and insurance plan THW policies.
        </p>
      </div>

      {selected && <WorkerDetail worker={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
