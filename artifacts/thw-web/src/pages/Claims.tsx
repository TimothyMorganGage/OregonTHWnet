import { useState } from "react";
import { Search, Filter, Info } from "lucide-react";
import { SAMPLE_CLAIMS } from "../data/sampleData";
import { THW_WORKER_TYPES, THW_WORKER_TYPE_LABELS } from "../data/thwWorkerTypes";
import { Claim, ClaimStatus } from "../types/index";

const STATUS_OPTIONS: { value: ClaimStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "approved", label: "Approved" },
  { value: "submitted", label: "Submitted" },
  { value: "denied", label: "Denied" },
  { value: "draft", label: "Draft" },
  { value: "appealed", label: "Appealed" },
];

const MODEL_OPTIONS = [
  { value: "all", label: "All Models" },
  { value: "ffs", label: "Fee For Service" },
  { value: "ilos", label: "In Lieu of Services" },
];

const THW_TYPE_OPTIONS = [
  { value: "all", label: "All THW Types" },
  ...THW_WORKER_TYPES.map(t => ({ value: t.id, label: t.title })),
];

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  denied: "bg-red-100 text-red-700 border-red-200",
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  appealed: "bg-amber-100 text-amber-700 border-amber-200",
};

function ClaimDetail({ claim, onClose }: { claim: Claim; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md h-full overflow-y-auto shadow-xl border-l border-border">
        <div className="p-5 border-b border-border flex items-start justify-between">
          <div>
            <h2 className="font-bold text-foreground text-lg">{claim.clientName}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Claim {claim.id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl font-bold px-2">&times;</button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className={`text-sm px-3 py-1 rounded-full font-semibold border ${STATUS_COLORS[claim.status]}`}>
              {claim.status.toUpperCase()}
            </span>
            <div className="flex items-center gap-2">
              {claim.thwWorkerType && (() => {
                const wt = THW_WORKER_TYPES.find(t => t.id === claim.thwWorkerType);
                return wt ? (
                  <span className="text-xs text-white px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: wt.color }}>
                    {wt.abbreviation} · {wt.title}
                  </span>
                ) : null;
              })()}
              <span className="text-xs bg-secondary text-primary px-2 py-1 rounded-full font-medium">
                {claim.billingModel?.toUpperCase() ?? "FFS"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Billed</p>
              <p className="text-xl font-bold text-foreground">${claim.billedAmount}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-xl font-bold text-primary">{claim.paidAmount ? `$${claim.paidAmount}` : "—"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Row label="Insurance Plan" value={claim.insurancePlan} />
            <Row label="Date of Service" value={claim.dateOfService} />
            <Row label="Client ID" value={claim.clientId} />
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">CPT Codes</p>
            <div className="flex flex-wrap gap-2">
              {claim.cptCodes.map(c => (
                <span key={c} className="text-xs bg-secondary text-primary px-2 py-1 rounded border border-border font-mono font-medium">{c}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Z Codes (SDOH)</p>
            <div className="flex flex-wrap gap-2">
              {claim.zCodes.map(c => (
                <span key={c} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded border border-border font-mono">{c}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">HEDIS Categories</p>
            <div className="flex flex-wrap gap-2">
              {claim.hedisCategories.map(c => (
                <span key={c} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">{c}</span>
              ))}
            </div>
          </div>

          {claim.notes && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-foreground bg-secondary rounded-lg p-3">{claim.notes}</p>
            </div>
          )}

          {claim.denialReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">Denial Reason</p>
              <p className="text-sm text-red-700">{claim.denialReason}</p>
            </div>
          )}

          {claim.appealNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Appeal Notes</p>
              <p className="text-sm text-amber-700">{claim.appealNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function Claims() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [thwTypeFilter, setThwTypeFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Claim | null>(null);

  const filtered = SAMPLE_CLAIMS.filter(c => {
    const matchSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.insurancePlan.toLowerCase().includes(search.toLowerCase()) ||
      c.cptCodes.some(code => code.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchModel = modelFilter === "all" || c.billingModel === modelFilter;
    const matchType = thwTypeFilter === "all" || c.thwWorkerType === thwTypeFilter;
    return matchSearch && matchStatus && matchModel && matchType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Claims</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{SAMPLE_CLAIMS.length} total claims</p>
        </div>
      </div>

      {/* Demo data disclosure */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5 text-sm">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-amber-900">
          <span className="font-semibold">Demo data — no real client information.</span>{" "}
          The records below are fabricated examples ("Client A" through "Client L"). No real person, encounter, or chart is represented, and no consent has been obtained.
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by client, plan, or CPT code..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={modelFilter}
          onChange={e => setModelFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {MODEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={thwTypeFilter}
          onChange={e => setThwTypeFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {THW_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Claims table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">THW Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Plan</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">CPT Codes</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Model</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(claim => (
              <tr
                key={claim.id}
                onClick={() => setSelected(claim)}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">{claim.clientName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{claim.dateOfService}</p>
                </td>
                <td className="px-5 py-4 hidden xl:table-cell">
                  {claim.thwWorkerType ? (() => {
                    const wt = THW_WORKER_TYPES.find(t => t.id === claim.thwWorkerType);
                    return wt ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium text-white whitespace-nowrap"
                        style={{ backgroundColor: wt.color }}
                      >
                        {wt.abbreviation}
                      </span>
                    ) : null;
                  })() : <span className="text-muted-foreground text-xs">—</span>}
                  {claim.thwWorkerType && (
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-32 truncate">
                      {THW_WORKER_TYPE_LABELS[claim.thwWorkerType]}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                  <p className="truncate max-w-40">{claim.insurancePlan}</p>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {claim.cptCodes.slice(0, 2).map(c => (
                      <span key={c} className="text-xs bg-secondary text-primary px-1.5 py-0.5 rounded font-mono">{c}</span>
                    ))}
                    {claim.cptCodes.length > 2 && <span className="text-xs text-muted-foreground">+{claim.cptCodes.length - 2}</span>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${claim.billingModel === "ilos" ? "bg-amber-100 text-amber-700" : "bg-secondary text-primary"}`}>
                    {(claim.billingModel ?? "ffs").toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <p className="font-semibold text-foreground">${claim.billedAmount}</p>
                  {claim.paidAmount && <p className="text-xs text-emerald-600">${claim.paidAmount} paid</p>}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${STATUS_COLORS[claim.status]}`}>
                    {claim.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No claims match your filters</p>
          </div>
        )}
      </div>

      {selected && <ClaimDetail claim={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
