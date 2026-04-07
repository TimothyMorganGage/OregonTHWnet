import { useState } from "react";
import { TrendingUp, Minus } from "lucide-react";
import { HEDIS_MEASURES } from "../data/sampleData";

const CATEGORIES = ["All", "Chronic Disease Management", "Behavioral Health", "Preventive Care", "Maternal Health", "Equity & Access", "Substance Use"];

export default function HEDISPage() {
  const [selected, setSelected] = useState("All");

  const filtered = selected === "All" ? HEDIS_MEASURES : HEDIS_MEASURES.filter(m => m.category === selected);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">HEDIS Measures</h1>
        <p className="text-muted-foreground text-sm mt-0.5">THW impact on {HEDIS_MEASURES.length} quality measures across all plans</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              selected === cat
                ? "bg-primary text-white border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* THW impact banner */}
      <div className="bg-primary/8 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
        <p className="text-sm text-primary">
          THWs positively impact all <strong>{HEDIS_MEASURES.length} HEDIS measures</strong> — both via direct FFS billing and ILOS cost substitution. Average THW impact: +{(HEDIS_MEASURES.reduce((s, m) => s + m.thwImpact, 0) / HEDIS_MEASURES.length).toFixed(1)}%
        </p>
      </div>

      {/* Measures grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map(measure => {
          const progress = (measure.currentRate / measure.targetRate) * 100;
          const aboveNational = measure.currentRate >= measure.nationalAvg;
          return (
            <div key={measure.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-bold">{measure.abbreviation}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-sm leading-snug">{measure.name}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0 ${measure.trending === "up" ? "bg-emerald-100" : "bg-gray-100"}`}>
                      {measure.trending === "up" ? (
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Minus className="w-3 h-3 text-gray-500" />
                      )}
                      <span className={`text-xs font-bold ${measure.trending === "up" ? "text-emerald-600" : "text-gray-500"}`}>
                        +{measure.thwImpact}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{measure.category}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{measure.description}</p>

              {/* Rate comparison */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{measure.currentRate}%</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold ${aboveNational ? "text-emerald-600" : "text-amber-600"}`}>{measure.nationalAvg}%</p>
                  <p className="text-xs text-muted-foreground">Nat. Avg</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground/60">{measure.targetRate}%</p>
                  <p className="text-xs text-muted-foreground">Target</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress to target</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>

              {/* CPT codes */}
              {measure.relatedCPTCodes.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Codes:</span>
                  {measure.relatedCPTCodes.map(c => (
                    <span key={c} className="text-xs bg-secondary text-primary px-2 py-0.5 rounded font-mono font-medium">{c}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
