import { Link } from "wouter";
import { TrendingDown, TrendingUp, CheckCircle, AlertTriangle, DollarSign, FileText, ArrowRight, Activity } from "lucide-react";
import { SAMPLE_CLAIMS, FORECAST_DATA, HEDIS_MEASURES, DENIAL_RECORDS } from "../data/sampleData";

const current = FORECAST_DATA.find(f => f.year === 2026)!;
const target = FORECAST_DATA.find(f => f.year === 2030)!;

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function StatCard({ label, value, sub, color = "primary" }: { label: string; value: string; sub: string; color?: string }) {
  const colors: Record<string, string> = {
    primary: "text-primary",
    destructive: "text-destructive",
    amber: "text-amber-600",
    green: "text-emerald-600",
  };
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colors[color] ?? colors.primary}`}>{value}</p>
      <p className="text-muted-foreground text-xs mt-1">{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const totalClaims = SAMPLE_CLAIMS.length;
  const approved = SAMPLE_CLAIMS.filter(c => c.status === "approved").length;
  const denied = SAMPLE_CLAIMS.filter(c => c.status === "denied").length;
  const openDenials = DENIAL_RECORDS.filter(d => d.status === "open" || d.status === "appealing").length;
  const totalBilled = SAMPLE_CLAIMS.reduce((s, c) => s + c.billedAmount, 0);
  const approvalRate = Math.round((approved / totalClaims) * 100);

  const topHedis = HEDIS_MEASURES.filter(h => h.trending === "up").slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Oregon THW Network</p>
          <h1 className="text-3xl font-bold text-foreground mt-0.5">Dashboard</h1>
        </div>
        <span className="text-xs bg-secondary text-primary px-3 py-1.5 rounded-full font-semibold border border-border">
          April 2026
        </span>
      </div>

      {/* 2030 Zero Denial Banner */}
      <div className="bg-primary rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-5 h-5 opacity-80" />
          <span className="text-sm font-semibold opacity-80 uppercase tracking-wide">Zero Denial Forecast Progress</span>
        </div>
        <div className="flex flex-wrap gap-8 mb-4">
          <div>
            <p className="text-4xl font-bold">{current.denialRate}%</p>
            <p className="text-white/60 text-xs mt-1">Current Denial Rate</p>
          </div>
          <div className="flex items-center">
            <ArrowRight className="w-5 h-5 opacity-50" />
          </div>
          <div>
            <p className="text-4xl font-bold">{target.denialRate}%</p>
            <p className="text-white/60 text-xs mt-1">2030 Target</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-4xl font-bold">{current.thwRecognitionCount}</p>
            <p className="text-white/60 text-xs mt-1">Plans Recognizing THWs</p>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all"
            style={{ width: `${current.approvalRate}%` }}
          />
        </div>
        <p className="text-white/60 text-xs mt-2">{current.approvalRate}% approval rate achieved — {target.approvalRate}% target by 2030</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Claims" value={String(totalClaims)} sub="This period" />
        <StatCard label="Approval Rate" value={`${approvalRate}%`} sub={`${approved} approved`} color="green" />
        <StatCard label="Total Billed" value={fmt(totalBilled)} sub="All claims" color="primary" />
        <StatCard label="Open Denials" value={String(openDenials)} sub="Need action" color="destructive" />
      </div>

      {/* ROI snapshot + HEDIS side by side */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ROI snapshot */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">2026 ROI Snapshot</h2>
            <Link href="/roi" className="text-xs text-primary hover:underline flex items-center gap-1">
              Full Analysis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-secondary rounded-lg">
              <p className="text-2xl font-bold text-primary">{current.ffsROI}x</p>
              <p className="text-xs text-muted-foreground mt-0.5">FFS ROI</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{current.ilosROI}x</p>
              <p className="text-xs text-muted-foreground mt-0.5">ILOS ROI</p>
            </div>
            <div className="text-center p-3 bg-violet-50 rounded-lg">
              <p className="text-2xl font-bold text-violet-700">{current.combinedROI}x</p>
              <p className="text-xs text-muted-foreground mt-0.5">Combined</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">FFS Revenue</span>
              <span className="font-semibold text-foreground">{fmt(current.ffsRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">ILOS Avoided Cost</span>
              <span className="font-semibold text-foreground">{fmt(current.ilosAvoidedCost)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1 pt-2 border-t border-border">
              <span className="font-medium text-foreground">Net Benefit</span>
              <span className="font-bold text-primary">{fmt(current.combinedNetBenefit)}</span>
            </div>
          </div>
        </div>

        {/* HEDIS highlights */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">HEDIS Impact</h2>
            <Link href="/hedis" className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topHedis.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-bold">{m.abbreviation}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <span className="text-emerald-600 text-xs font-bold ml-2 flex-shrink-0">+{m.thwImpact}%</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(m.currentRate / m.targetRate) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{m.currentRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent claims */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-foreground">Recent Claims</h2>
          <Link href="/claims" className="text-xs text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {SAMPLE_CLAIMS.slice(0, 5).map(claim => {
            const statusColors: Record<string, string> = {
              approved: "bg-emerald-100 text-emerald-700",
              denied: "bg-red-100 text-red-700",
              submitted: "bg-blue-100 text-blue-700",
              draft: "bg-gray-100 text-gray-600",
              appealed: "bg-amber-100 text-amber-700",
            };
            return (
              <div key={claim.id} className="flex items-center gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{claim.clientName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{claim.insurancePlan} · {claim.dateOfService}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">${claim.billedAmount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 inline-block ${statusColors[claim.status]}`}>
                    {claim.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
