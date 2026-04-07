import { FORECAST_DATA } from "../data/sampleData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
        <p className="text-muted-foreground text-sm mt-0.5">Oregon THW Network — 2024 to 2030 projection</p>
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

      {/* Assumptions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-bold text-foreground mb-4">Model Assumptions</h2>
        <ul className="space-y-2">
          {[
            "Annual 15–20% growth in THW-recognizing insurance plans",
            "Oregon legislative mandates expanding FFS codes through 2027",
            "Federal CMS THW billing guidance (2025–2026) unlocks national FFS",
            "ILOS contracts grow from 2 plans (2024) to 38+ plans (2030)",
            "Combined ROI improves from 3.5x → 17x as approval rates reach ~99%",
            "ILOS avoidance savings grow as plan scope expands to inpatient & specialty",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
