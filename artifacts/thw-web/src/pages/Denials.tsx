import { useState } from "react";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import { DENIAL_RECORDS } from "../data/sampleData";
import { DenialRecord } from "../types/index";

type DenialStatus = "open" | "appealing" | "won" | "lost";

const STATUS_CONFIG: Record<DenialStatus, { label: string; color: string; icon: React.ReactNode }> = {
  open: { label: "Open", color: "border-red-200 bg-red-50", icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
  appealing: { label: "Appealing", color: "border-amber-200 bg-amber-50", icon: <Clock className="w-4 h-4 text-amber-600" /> },
  won: { label: "Won", color: "border-emerald-200 bg-emerald-50", icon: <CheckCircle className="w-4 h-4 text-emerald-600" /> },
  lost: { label: "Lost", color: "border-gray-200 bg-gray-50", icon: <XCircle className="w-4 h-4 text-gray-400" /> },
};

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DenialCard({ denial, onAppeal, onWon }: { denial: DenialRecord; onAppeal: () => void; onWon: () => void }) {
  const config = STATUS_CONFIG[denial.status];
  const days = daysUntil(denial.appealDeadline);
  const urgent = denial.status === "open" && days < 14;

  return (
    <div className={`border rounded-xl p-5 space-y-4 ${config.color} ${urgent ? "ring-2 ring-red-400 ring-offset-1" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {config.icon}
          <div>
            <h3 className="font-bold text-foreground">{denial.clientName}</h3>
            <p className="text-sm text-muted-foreground">{denial.insurancePlan}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-foreground">${denial.billedAmount}</p>
          <p className="text-xs text-muted-foreground">billed</p>
        </div>
      </div>

      <div className="bg-white/70 rounded-lg p-3">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Denial Reason</p>
        <p className="text-sm text-foreground">{denial.denialReason}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {denial.cptCodes.map(c => (
          <span key={c} className="text-xs bg-white/80 text-primary px-2 py-0.5 rounded font-mono border border-border">{c}</span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Appeal deadline: <span className={`font-semibold ${urgent ? "text-red-600" : "text-foreground"}`}>{denial.appealDeadline}</span></span>
          {(denial.status === "open" || denial.status === "appealing") && (
            <span className={`text-xs font-bold ml-1 ${urgent ? "text-red-600" : days < 30 ? "text-amber-600" : "text-muted-foreground"}`}>
              ({days > 0 ? `${days}d left` : "PAST DUE"})
            </span>
          )}
        </div>
      </div>

      {denial.appealNotes && (
        <div className="bg-white/70 rounded-lg p-3">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Appeal Notes</p>
          <p className="text-sm text-foreground">{denial.appealNotes}</p>
        </div>
      )}

      {/* Actions */}
      {denial.status === "open" && (
        <button
          onClick={onAppeal}
          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Start Appeal
        </button>
      )}
      {denial.status === "appealing" && (
        <button
          onClick={onWon}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Mark as Won
        </button>
      )}
    </div>
  );
}

export default function Denials() {
  const [records, setRecords] = useState(DENIAL_RECORDS);

  const startAppeal = (id: string) => {
    setRecords(prev => prev.map(d => d.id === id ? { ...d, status: "appealing" as const } : d));
  };
  const markWon = (id: string) => {
    setRecords(prev => prev.map(d => d.id === id ? { ...d, status: "won" as const } : d));
  };

  const groups: DenialStatus[] = ["open", "appealing", "won", "lost"];
  const wins = records.filter(d => d.status === "won").length;
  const total = records.filter(d => d.status !== "open" || d.status === "appealing").length;

  const openCount = records.filter(d => d.status === "open").length;
  const appealingCount = records.filter(d => d.status === "appealing").length;
  const wonCount = records.filter(d => d.status === "won").length;
  const lostCount = records.filter(d => d.status === "lost").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Denial Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Track, appeal, and resolve denied claims</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{wonCount > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0}%</p>
          <p className="text-xs text-muted-foreground">Appeal win rate</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open", count: openCount, color: "text-red-600", bg: "bg-red-50" },
          { label: "Appealing", count: appealingCount, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Won", count: wonCount, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Lost", count: lostCount, color: "text-gray-500", bg: "bg-gray-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Urgent alert */}
      {records.some(d => d.status === "open" && daysUntil(d.appealDeadline) < 14) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Urgent:</strong> {records.filter(d => d.status === "open" && daysUntil(d.appealDeadline) < 14).length} open denial(s) with appeal deadline within 14 days. Act now.
          </p>
        </div>
      )}

      {/* Group by status */}
      {groups.map(status => {
        const group = records.filter(d => d.status === status);
        if (group.length === 0) return null;
        const config = STATUS_CONFIG[status];
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-3">
              {config.icon}
              <h2 className="font-bold text-foreground">{config.label}</h2>
              <span className="text-sm text-muted-foreground">({group.length})</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              {group.map(d => (
                <DenialCard
                  key={d.id}
                  denial={d}
                  onAppeal={() => startAppeal(d.id)}
                  onWon={() => markWon(d.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
