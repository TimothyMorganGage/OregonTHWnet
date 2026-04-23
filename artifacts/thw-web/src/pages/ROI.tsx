import { FORECAST_DATA, ILOS_MAPPINGS } from "../data/sampleData";
import { INSURANCE_PLANS } from "../data/sampleData";
import { ALL_CITATIONS, METHODOLOGY } from "../data/costSavingsSources";
import { DollarSign, Shield, Award, CheckCircle, Info, BookOpen, AlertTriangle } from "lucide-react";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function CitationPill({ citationKey }: { citationKey: string }) {
  const c = ALL_CITATIONS[citationKey];
  if (!c) return null;
  if (c.category === "not_verified") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300"
        title="This figure has not been verified against a published source. Replace before quoting."
      >
        <AlertTriangle className="w-2.5 h-2.5" />
        Citation needed
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-primary border border-border"
      title={`${c.full}\n\n${c.keyFinding}${c.caveats ? `\n\nCaveats: ${c.caveats}` : ""}`}
    >
      <BookOpen className="w-2.5 h-2.5" />
      {c.short}
    </span>
  );
}

export default function ROI() {
  const current = FORECAST_DATA.find(f => f.year === 2026)!;
  const ilosPlans = INSURANCE_PLANS.filter(p => p.supportsILOS).length;

  // Total ILOS savings includes only rows with both costs cited (skip "not_verified" zero rows).
  const verifiedMappings = ILOS_MAPPINGS.filter(
    m => m.replacedCostCitation !== "not_verified" && m.thwCostCitation !== "not_verified",
  );
  const totalILOSSavings = verifiedMappings.reduce(
    (sum, m) => sum + (m.replacedCostPerVisit - m.thwCostPerVisit) * m.annualUtilizationPerTHW,
    0,
  );
  const totalVisits = verifiedMappings.reduce((s, m) => s + m.annualUtilizationPerTHW, 0);
  const superiorCount = verifiedMappings.filter(m => m.outcomeEquivalence === "superior").length;
  const unverifiedCount = ILOS_MAPPINGS.length - verifiedMappings.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ROI Analysis</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Fee For Service and In Lieu of Services return on investment — 2026
        </p>
      </div>

      {/* Methodology + sourcing disclosure */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-amber-900 space-y-1.5">
            <p className="font-semibold">Methodology and sourcing</p>
            <p>
              Each dollar value below carries a citation pill. <span className="font-mono text-xs bg-secondary text-primary px-1 py-0.5 rounded border border-border">Source name</span>{" "}
              means the figure traces to a published source (Penn IMPaCT, AHRQ HCUP, KFF, CMS PFS).{" "}
              <span className="font-mono text-xs bg-amber-100 text-amber-800 px-1 py-0.5 rounded border border-amber-300">Citation needed</span>{" "}
              means the figure is a placeholder — confirm against a real source before quoting publicly.
              Hover any pill for the full citation.
            </p>
            <p>
              Combined ROI is anchored at the Penn IMPaCT-published 2.47:1 baseline (Kangovi et al. 2020,
              Health Affairs). Oregon-specific actuals are not yet available; the year-over-year
              trajectory is illustrative.
            </p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-primary rounded-2xl p-6 text-white">
        <p className="text-sm opacity-70 uppercase tracking-wide font-semibold mb-3">2026 ROI Snapshot</p>
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-5xl font-bold">{current.combinedROI}x</p>
            <p className="text-white/60 text-sm mt-1">Combined ROI (illustrative)</p>
          </div>
          <div>
            <p className="text-5xl font-bold">{fmt(current.combinedNetBenefit)}</p>
            <p className="text-white/60 text-sm mt-1">Net Benefit</p>
          </div>
          <div>
            <p className="text-5xl font-bold">{ilosPlans}</p>
            <p className="text-white/60 text-sm mt-1">ILOS-Enabled Plans</p>
          </div>
        </div>
      </div>

      {/* FFS vs ILOS cards */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* FFS */}
        <div className="bg-secondary rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Fee For Service</h2>
              <p className="text-xs text-muted-foreground">Direct billing revenue</p>
            </div>
          </div>
          <div>
            <p className="text-5xl font-bold text-primary">{current.ffsROI}x</p>
            <p className="text-sm text-muted-foreground mt-1">ROI ratio (illustrative)</p>
          </div>
          <div className="h-px bg-border" />
          <div className="space-y-2">
            <Stat label="Revenue" value={fmt(current.ffsRevenue)} />
            <Stat label="Visit Count" value={current.ffsVisitCount.toLocaleString()} />
            <Stat label="Avg Reimbursement" value={`$${current.ffsAvgReimbursement}/visit`} />
            <Stat label="Program Cost Basis" value={fmt(current.ffsCostBasis)} />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            FFS ROI = billing revenue ÷ program cost basis. Reimbursement rates anchor on
            Medicare 2024 PFS for the new CHW codes G0019/G0023; OHP and commercial rates may differ.
          </p>
        </div>

        {/* ILOS */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">In Lieu of Services</h2>
              <p className="text-xs text-muted-foreground">Healthcare cost avoidance</p>
            </div>
          </div>
          <div>
            <p className="text-5xl font-bold text-amber-600">{current.ilosROI}x</p>
            <p className="text-sm text-muted-foreground mt-1">ROI ratio (illustrative)</p>
          </div>
          <div className="h-px bg-amber-200" />
          <div className="space-y-2">
            <Stat label="Avoided Cost" value={fmt(current.ilosAvoidedCost)} />
            <Stat label="ILOS Visits" value={current.ilosVisitCount.toLocaleString()} />
            <Stat label="Avg Cost Avoidance" value={`$${current.ilosAvgAvoidance.toLocaleString()}/visit`} />
            <Stat label="Program Cost Basis" value={fmt(current.ilosCostBasis)} />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            ILOS ROI = avoided traditional service costs ÷ program cost basis. Penn IMPaCT
            (Kangovi 2020) demonstrated $2.47 saved per $1 invested for a comparable Medicaid CHW
            program; this dashboard targets a similar steady state for Oregon.
          </p>
        </div>
      </div>

      {/* Year-over-year ROI table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">ROI Trajectory 2024 → 2030 (illustrative)</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Anchored at Penn IMPaCT 2.47x baseline. Year-by-year values are planning targets, not Oregon actuals.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wide">FFS ROI</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-amber-600 uppercase tracking-wide">ILOS ROI</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-violet-700 uppercase tracking-wide">Combined</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Net Benefit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {FORECAST_DATA.map(f => {
              const isCurrent = f.year === 2026;
              const isGoal = f.year === 2030;
              return (
                <tr key={f.year} className={isGoal ? "bg-violet-50" : isCurrent ? "bg-secondary/60" : "hover:bg-muted/20"}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{f.year}</span>
                      {isCurrent && <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded">NOW</span>}
                      {isGoal && <span className="text-xs bg-violet-600 text-white px-1.5 py-0.5 rounded">GOAL</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-primary">{f.ffsROI}x</td>
                  <td className="px-5 py-3 font-semibold text-amber-600">{f.ilosROI}x</td>
                  <td className="px-5 py-3 font-bold text-violet-700">{f.combinedROI}x</td>
                  <td className="px-5 py-3 text-foreground">{fmt(f.combinedNetBenefit)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ILOS service mappings */}
      <div>
        <h2 className="text-xl font-bold text-foreground">ILOS Service Substitutions</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Each THW visit type, the higher-cost service it can replace, and the source for each cost figure.
          {unverifiedCount > 0 && (
            <span className="text-amber-700 font-medium"> {unverifiedCount} of {ILOS_MAPPINGS.length} substitutions are not yet sourced.</span>
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {ILOS_MAPPINGS.map(mapping => {
          const fullyVerified = mapping.replacedCostCitation !== "not_verified" && mapping.thwCostCitation !== "not_verified";
          const savings = mapping.replacedCostPerVisit - mapping.thwCostPerVisit;
          const savingsPct = mapping.replacedCostPerVisit > 0 ? Math.round((savings / mapping.replacedCostPerVisit) * 100) : 0;
          const annualSavings = savings * mapping.annualUtilizationPerTHW;
          const outcomeColor = mapping.outcomeEquivalence === "superior" ? "text-emerald-600 bg-emerald-50 border-emerald-200"
            : mapping.outcomeEquivalence === "equivalent" ? "text-primary bg-secondary border-border"
            : "text-amber-600 bg-amber-50 border-amber-200";

          return (
            <div key={mapping.id} className={`bg-card border rounded-xl p-5 space-y-4 ${fullyVerified ? "border-border" : "border-amber-200 bg-amber-50/30"}`}>
              {/* Service comparison */}
              <div className="flex gap-3">
                <div className="flex-1 bg-secondary rounded-lg p-3 space-y-2">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wide">THW Service (FFS)</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">{mapping.thwService}</p>
                  {mapping.thwCostPerVisit > 0 ? (
                    <p className="text-lg font-bold text-primary">${mapping.thwCostPerVisit}/visit</p>
                  ) : (
                    <p className="text-sm font-semibold text-muted-foreground italic">Not verified</p>
                  )}
                  <CitationPill citationKey={mapping.thwCostCitation} />
                </div>
                <div className="flex items-center flex-col justify-center text-muted-foreground text-xs gap-1">
                  <span>→</span>
                  <span className="font-bold text-amber-600 text-xs">ILOS</span>
                </div>
                <div className="flex-1 bg-red-50 border border-red-100 rounded-lg p-3 space-y-2">
                  <p className="text-xs text-red-600 font-semibold uppercase tracking-wide">Replaced Service</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">{mapping.replacedService}</p>
                  {mapping.replacedCostPerVisit > 0 ? (
                    <div>
                      <p className="text-lg font-bold text-red-600">${mapping.replacedCostPerVisit.toLocaleString()}/visit</p>
                      {mapping.replacedCostLow !== undefined && mapping.replacedCostHigh !== undefined && (
                        <p className="text-[11px] text-muted-foreground">
                          range ${mapping.replacedCostLow.toLocaleString()}–${mapping.replacedCostHigh.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-muted-foreground italic">Not verified</p>
                  )}
                  <CitationPill citationKey={mapping.replacedCostCitation} />
                </div>
              </div>

              {/* Savings metrics — only render numbers if both sides verified */}
              {fullyVerified ? (
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <p className="text-base font-bold text-emerald-600">${savings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Saved/Visit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-emerald-600">{savingsPct}%</p>
                    <p className="text-xs text-muted-foreground">Cost Cut</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-primary">{mapping.annualUtilizationPerTHW}</p>
                    <p className="text-xs text-muted-foreground">Visits/yr*</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-violet-700">{fmt(annualSavings)}</p>
                    <p className="text-xs text-muted-foreground">Annual Savings*</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-amber-800 bg-amber-100 border border-amber-200 rounded-md p-2.5 italic">
                  Per-visit and annual savings are not displayed because the cost figures are not yet sourced.
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded border font-medium flex items-center gap-1 ${outcomeColor}`}>
                  {mapping.outcomeEquivalence === "superior" ? <Award className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  {mapping.outcomeEquivalence.charAt(0).toUpperCase() + mapping.outcomeEquivalence.slice(1)} Outcome
                </span>
                <span className="text-xs bg-secondary text-primary px-2 py-1 rounded border border-border">{mapping.hedisCategory}</span>
                {mapping.utilizationCitation === "not_verified" && fullyVerified && (
                  <span className="text-[10px] text-amber-800 italic">*utilization is a workforce assumption, not a published rate</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">{mapping.outcomeNotes}</p>
            </div>
          );
        })}
      </div>

      {/* Total ILOS potential */}
      <div className="bg-primary rounded-2xl p-6 text-white">
        <p className="text-sm opacity-70 uppercase tracking-wide font-semibold mb-2">
          Annual ILOS Savings Potential — Verified Substitutions Only
        </p>
        <p className="text-6xl font-bold">{fmt(totalILOSSavings)}</p>
        <p className="text-white/60 text-sm mt-2">
          Combined avoided costs across {verifiedMappings.length} of {ILOS_MAPPINGS.length} substitution
          types. Workforce utilization figures are planning assumptions; verify locally before relying.
        </p>
        <div className="flex gap-8 mt-4">
          <div>
            <p className="text-2xl font-bold">{totalVisits}</p>
            <p className="text-white/60 text-sm">Substituted Visits/yr (assumption)</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{superiorCount}</p>
            <p className="text-white/60 text-sm">Superior-Outcome Services</p>
          </div>
        </div>
      </div>

      {/* Methodology section */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Econometric Methodology</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Four ways to measure CHW program return. This dashboard uses Simple ROI; the others are
          recommended next steps for funder-grade analysis.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.values(METHODOLOGY).map(m => (
            <div key={m.name} className="bg-muted/30 rounded-lg p-3 space-y-1.5">
              <p className="font-semibold text-sm text-foreground">{m.name}</p>
              <p className="text-xs font-mono text-primary bg-secondary/60 px-2 py-1 rounded inline-block">{m.formula}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.interpretation}</p>
              <p className="text-xs text-amber-800 italic leading-relaxed">
                <span className="font-semibold">Limit:</span> {m.limitations}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Citation bibliography */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Sources</h2>
        </div>
        <ol className="space-y-3 text-sm">
          {Object.values(ALL_CITATIONS)
            .filter(c => c.category !== "not_verified")
            .map(c => (
              <li key={c.id} className="border-l-2 border-primary/30 pl-3 space-y-1">
                <p className="font-semibold text-foreground">{c.short}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.full}</p>
                <p className="text-xs text-foreground leading-relaxed">
                  <span className="font-semibold">Key finding:</span> {c.keyFinding}
                </p>
                {c.caveats && (
                  <p className="text-xs text-amber-800 leading-relaxed italic">
                    <span className="font-semibold">Caveats:</span> {c.caveats}
                  </p>
                )}
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline break-all"
                  >
                    {c.url}
                  </a>
                )}
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
