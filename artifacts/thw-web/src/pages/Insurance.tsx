import { useState } from "react";
import { CheckCircle, Clock, XCircle, AlertCircle, Phone, Mail } from "lucide-react";
import { INSURANCE_PLANS } from "../data/sampleData";

const COVERAGE_ICON: Record<string, React.ReactNode> = {
  full: <CheckCircle className="w-4 h-4 text-emerald-600" />,
  partial: <AlertCircle className="w-4 h-4 text-amber-600" />,
  pending: <Clock className="w-4 h-4 text-blue-500" />,
  none: <XCircle className="w-4 h-4 text-red-500" />,
};

const COVERAGE_BADGE: Record<string, string> = {
  full: "bg-emerald-100 text-emerald-700 border-emerald-200",
  partial: "bg-amber-100 text-amber-700 border-amber-200",
  pending: "bg-blue-100 text-blue-700 border-blue-200",
  none: "bg-red-100 text-red-700 border-red-200",
};

const TYPE_BADGE: Record<string, string> = {
  medicaid: "bg-purple-100 text-purple-700",
  commercial: "bg-blue-100 text-blue-700",
  medicare: "bg-teal-100 text-teal-700",
  marketplace: "bg-orange-100 text-orange-700",
};

export default function Insurance() {
  const [stateFilter, setStateFilter] = useState("all");
  const [coverageFilter, setCoverageFilter] = useState("all");

  const filtered = INSURANCE_PLANS.filter(p => {
    const matchState = stateFilter === "all" || p.state === stateFilter;
    const matchCoverage = coverageFilter === "all" || p.thwCoverage === coverageFilter;
    return matchState && matchCoverage;
  });

  const fullCount = INSURANCE_PLANS.filter(p => p.thwCoverage === "full").length;
  const partialCount = INSURANCE_PLANS.filter(p => p.thwCoverage === "partial").length;
  const pendingCount = INSURANCE_PLANS.filter(p => p.thwCoverage === "pending").length;
  const noneCount = INSURANCE_PLANS.filter(p => p.thwCoverage === "none").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Insurance Plans</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{INSURANCE_PLANS.length} plans tracked across Oregon and national</p>
      </div>

      {/* Coverage summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Full Coverage", count: fullCount, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Partial Coverage", count: partialCount, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending", count: pendingCount, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "No Coverage", count: noneCount, color: "text-red-600", bg: "bg-red-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All States</option>
          <option value="Oregon">Oregon</option>
          <option value="National">National</option>
        </select>
        <select
          value={coverageFilter}
          onChange={e => setCoverageFilter(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Coverage</option>
          <option value="full">Full</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Plans grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map(plan => (
          <div key={plan.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-foreground">{plan.name}</h3>
                  {plan.supportsILOS && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold border border-primary/20">ILOS</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${TYPE_BADGE[plan.type]}`}>
                    {plan.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.state}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {COVERAGE_ICON[plan.thwCoverage]}
                <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${COVERAGE_BADGE[plan.thwCoverage]}`}>
                  {plan.thwCoverage}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Denial Rate</p>
                <p className={`text-xl font-bold ${plan.denialRate > 25 ? "text-red-600" : plan.denialRate > 10 ? "text-amber-600" : "text-emerald-600"}`}>
                  {plan.denialRate}%
                </p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Avg Processing</p>
                <p className="text-xl font-bold text-foreground">{plan.avgProcessingDays}d</p>
              </div>
            </div>

            {plan.approvedCPTCodes.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Approved CPT Codes</p>
                <div className="flex flex-wrap gap-1.5">
                  {plan.approvedCPTCodes.map(c => (
                    <span key={c} className="text-xs bg-secondary text-primary px-2 py-0.5 rounded font-mono font-medium border border-border">{c}</span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground leading-relaxed">{plan.notes}</p>

            {(plan.contactPhone || plan.contactEmail) && (
              <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                {plan.contactPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    {plan.contactPhone}
                  </span>
                )}
                {plan.contactEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    {plan.contactEmail}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
