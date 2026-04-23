import { FORECAST_DATA } from "../data/sampleData";
import { ALL_CITATIONS } from "../data/costSavingsSources";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Info, BookOpen } from "lucide-react";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function Forecast() {
  const current = FORECAST_DATA.find(f => f.year === 2026)!;
  const goal = FORECAST_DATA.find(f => f.year === 2030)!;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Econometric Forecast</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Oregon THW Network — 2024 to 2030 illustrative projection</p>
      </div>

      {/* Sourcing disclosure */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-amber-900 space-y-1.5">
          <p className="font-semibold">Illustrative projection — not Oregon actuals</p>
          <p>
            Combined ROI is anchored at the Penn IMPaCT $2.47-per-$1 baseline reported in Kangovi
            et al. 2020 (Health Affairs). Oregon-specific THW program ROI data has not yet been
            published by OHA; the year-by-year trajectory below is a parametric S-curve growing
            from a denial-heavy startup phase toward a steady state slightly above the IMPaCT
            baseline. Workforce, claim volume, and recognized-plan counts are operational
            planning targets, not predictions.
          </p>
          <p className="font-semibold text-xs uppercase tracking-wide pt-1">
            Anchor citation: {ALL_CITATIONS.kangovi_impact_2020.short}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary rounded-xl p-5 text-white">
          <p className="text-xs opacity-70 uppercase tracking-wide font-semibold">2030 Denial Rate</p>
          <p className="text-4xl font-bold mt-1">{goal.denialRate}%</p>
          <p className="text-xs opacity-60 mt-1">from {current.denialRate}% today</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">2030 Combined ROI</p>
          <p className="text-4xl font-bold text-violet-700 mt-1">{goal.combinedROI}x</p>
          <p className="text-xs text-muted-foreground mt-1">from {current.combinedROI}x today</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">2030 Net Benefit</p>
          <p className="text-4xl font-bold text-primary mt-1">{fmt(goal.combinedNetBenefit)}</p>
          <p className="text-xs text-muted-foreground mt-1">from {fmt(current.combinedNetBenefit)} today</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Plans Recognizing THWs</p>
          <p className="text-4xl font-bold text-foreground mt-1">{goal.thwRecognitionCount}</p>
          <p className="text-xs text-muted-foreground mt-1">from {current.thwRecognitionCount} today</p>
        </div>
      </div>

      {/* Denial rate trend chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-bold text-foreground mb-4">Denial Rate Reduction 2024–2030</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={FORECAST_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="%" />
            <Tooltip
              formatter={(v: number) => [`${v}%`]}
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
            />
            <Legend />
            <Line type="monotone" dataKey="denialRate" name="Denial Rate" stroke="#e53e3e" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="approvalRate" name="Approval Rate" stroke="hsl(163 65% 29%)" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ROI trend chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-bold text-foreground mb-4">ROI Growth 2024–2030</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={FORECAST_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="x" />
            <Tooltip
              formatter={(v: number) => [`${v}x`]}
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
            />
            <Legend />
            <Line type="monotone" dataKey="ffsROI" name="FFS ROI" stroke="hsl(163 65% 29%)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="ilosROI" name="ILOS ROI" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="combinedROI" name="Combined ROI" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Year-by-year table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">Year-by-Year Detail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {["Year", "Denial Rate", "Approval Rate", "Claim Volume", "Plans", "FFS ROI", "ILOS ROI", "Combined ROI", "Net Benefit"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FORECAST_DATA.map(f => {
                const isCurrent = f.year === 2026;
                const isGoal = f.year === 2030;
                return (
                  <tr
                    key={f.year}
                    className={isGoal ? "bg-primary/8" : isCurrent ? "bg-secondary/60" : "hover:bg-muted/20"}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{f.year}</span>
                        {isCurrent && <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded font-medium">NOW</span>}
                        {isGoal && <span className="text-xs bg-violet-600 text-white px-1.5 py-0.5 rounded font-medium">GOAL</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">{f.denialRate}%</td>
                    <td className="px-4 py-3 text-emerald-600 font-medium">{f.approvalRate}%</td>
                    <td className="px-4 py-3 text-foreground">{f.claimVolume.toLocaleString()}</td>
                    <td className="px-4 py-3 text-foreground">{f.thwRecognitionCount}</td>
                    <td className="px-4 py-3 text-primary font-semibold">{f.ffsROI}x</td>
                    <td className="px-4 py-3 text-amber-600 font-semibold">{f.ilosROI}x</td>
                    <td className="px-4 py-3 text-violet-700 font-bold">{f.combinedROI}x</td>
                    <td className="px-4 py-3 text-foreground font-medium">{fmt(f.combinedNetBenefit)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Assumptions */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Model Assumptions</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          The forecast is a planning model, not a prediction. It rests on these assumptions —
          each of which the cooperative should pressure-test against Oregon-specific evidence
          before relying on the projection.
        </p>
        <ul className="space-y-2.5 pt-1">
          {[
            {
              text: "Combined ROI asymptotes at ~2.7x by 2030 — within the published range of CHW programs (Kangovi 2020 reports 2.47x; Whitley 2006 reports 2.28x; Findley 2014 reports 1.20x for asthma-only programs).",
              cite: "Anchored on cited literature",
            },
            {
              text: "Denial rate declines from ~41% (2024) to <1% (2030) as more plans recognize THW codes and credentialing matures. Magnitude of decline is a planning target, not an empirical projection.",
              cite: "Workforce assumption",
            },
            {
              text: "Plans recognizing THWs grow from ~18 (2024) to ~68 (2030). Depends on Oregon legislative action, CMS guidance, and CCO contracting — all outside the cooperative's direct control.",
              cite: "Workforce assumption",
            },
            {
              text: "Claim volume scales from ~8.4K (2024) to ~38K (2030). Depends on workforce size, panel intensity, and ILOS contract scope.",
              cite: "Workforce assumption",
            },
            {
              text: "FFS reimbursement averages anchor on CMS 2024 PFS rates for G0019 and G0023 (≈$77 / ≈$48 respectively). Oregon Medicaid (OHP) and commercial rates may differ and should override these defaults when known.",
              cite: "CMS 2024 PFS",
            },
            {
              text: "ILOS avoided-cost-per-visit defaults to ~$300–$400 (mix of ED avoidance, transitional care, and chronic disease management). Higher-acuity substitutions (inpatient avoidance, SNF day reduction) would raise this, but require local data to claim.",
              cite: "AHRQ HCUP, KFF",
            },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <span>{item.text}</span>
                <span className="text-xs text-muted-foreground italic ml-2">— {item.cite}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
          Recommended next step: replace each "workforce assumption" line with an Oregon-validated
          number sourced from the OHA 2024 THW Program Annual Report and CCO ILOS expenditure
          filings, then re-run the forecast as a scenario (conservative / base / optimistic) rather
          than a single point estimate.
        </p>
      </div>
    </div>
  );
}
