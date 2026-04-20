import { useState } from "react";
import { CheckCircle, Users, BookOpen, FileText, ExternalLink } from "lucide-react";
import { THW_WORKER_TYPES, THWWorkerTypeInfo } from "../data/thwWorkerTypes";

const CATEGORY_FILTERS = [
  "All",
  "Community & Navigation",
  "Peer & Recovery",
  "Doulas",
  "Tribal",
];

function categoryGroup(w: THWWorkerTypeInfo): string {
  if (w.id === "tribal_thw") return "Tribal";
  if (w.id === "birth_doula") return "Doulas";
  if (["peer_support_specialist", "peer_wellness_specialist", "family_support_specialist", "youth_support_specialist"].includes(w.id)) return "Peer & Recovery";
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
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{worker.subtitle}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">ORS 414.025</span>
            {worker.ilosEligible && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">ILOS Eligible</span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">{worker.description}</p>

      <div className="flex flex-wrap gap-1">
        {worker.cptCodes.slice(0, 3).map(c => (
          <span key={c} className="text-xs bg-secondary text-primary px-1.5 py-0.5 rounded font-mono border border-border">{c}</span>
        ))}
        {worker.cptCodes.length > 3 && (
          <span className="text-xs text-muted-foreground">+{worker.cptCodes.length - 3} more</span>
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
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-start gap-3 z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
            style={{ backgroundColor: worker.color }}
          >
            {worker.abbreviation}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground text-lg leading-tight">{worker.title}</h2>
            <p className="text-muted-foreground text-xs mt-0.5">{worker.subtitle}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl font-bold px-1 flex-shrink-0">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              Oregon Recognized — ORS 414.025
            </span>
            <span className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold border ${worker.ilosEligible ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
              {worker.ilosEligible ? "ILOS Eligible" : "ILOS Not Established"}
            </span>
          </div>

          <div className="bg-secondary/50 border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Legal Authority</p>
            <p className="text-sm font-mono text-foreground">{worker.legalBasis}</p>
          </div>

          {worker.subtype && (
            <div className="bg-secondary/50 border border-border rounded-lg px-4 py-3">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">OHA-Recognized Subtypes</p>
              <p className="text-sm text-foreground">{worker.subtype}</p>
            </div>
          )}

          <p className="text-sm text-foreground leading-relaxed">{worker.description}</p>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Billing Codes (CPT)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {worker.cptCodes.map(c => (
                <span key={c} className="text-sm bg-secondary text-primary px-3 py-1.5 rounded-lg font-mono font-semibold border border-border">{c}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">SDOH Z Codes</h3>
            <div className="flex flex-wrap gap-2">
              {worker.zCodes.map(c => (
                <span key={c} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded font-mono border border-border">{c}</span>
              ))}
            </div>
          </div>

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

          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">SDOH Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {worker.sdohFocus.map((s, i) => (
                <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-secondary rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Certifying / Overseeing Body</p>
            <p className="text-sm font-medium text-foreground">{worker.certifyingBody}</p>
          </div>

          <a
            href={worker.registryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            <FileText className="w-4 h-4" />
            Search OHA THW Registry
            <ExternalLink className="w-3 h-3" />
          </a>
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
  const totalCodes = [...new Set(THW_WORKER_TYPES.flatMap(w => w.cptCodes))].length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">THW Workforce Directory</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          All {THW_WORKER_TYPES.length} Traditional Health Worker types recognized under Oregon law — ORS 414.025 &amp; OAR 410-180
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary rounded-xl p-5 text-white">
          <p className="text-4xl font-bold">{THW_WORKER_TYPES.length}</p>
          <p className="text-white/70 text-sm mt-0.5">ORS-Recognized Types</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-4xl font-bold text-emerald-600">{THW_WORKER_TYPES.length}</p>
          <p className="text-muted-foreground text-sm mt-0.5">OHA Registry Listed</p>
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

      <div className="bg-secondary border border-border rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-bold text-primary mb-2 text-sm uppercase tracking-wide">ORS 414.025 — Traditional Health Workers</h2>
            <p className="text-sm text-foreground leading-relaxed max-w-3xl">
              Oregon Revised Statute 414.025 and OAR 410-180 define eight Traditional Health Worker types: Community Health Workers, Peer Support Specialists (including Certified Recovery Mentors), Peer Wellness Specialists, Personal Health Navigators, Birth Doulas, Family Support Specialists, Youth Support Specialists, and Tribal Traditional Health Workers. All are eligible for certification through OHA and listing in the state THW Registry.
            </p>
          </div>
          <a
            href="https://traditionalhealthworkerregistry.oregon.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium whitespace-nowrap flex-shrink-0"
          >
            <ExternalLink className="w-3 h-3" />
            OHA THW Registry
          </a>
        </div>
      </div>

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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(worker => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onClick={() => setSelected(worker)}
          />
        ))}
      </div>

      <div className="bg-muted/40 border border-border rounded-xl p-4 text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          THW types defined under <strong>ORS 414.025</strong> and <strong>OAR 410-180-0305</strong>.
          Find certified THWs at{" "}
          <a href="https://traditionalhealthworkerregistry.oregon.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            traditionalhealthworkerregistry.oregon.gov
          </a>
        </p>
        <p className="text-xs text-muted-foreground/60">
          Claim data shown is for demonstration purposes only. Actual THW billing records are confidential.
        </p>
      </div>

      {selected && <WorkerDetail worker={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
