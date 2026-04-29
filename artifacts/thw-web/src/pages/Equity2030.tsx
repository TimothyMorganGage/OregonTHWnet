import { ALL_CITATIONS } from "../data/costSavingsSources";
import { Info, BookOpen, AlertTriangle, Target, TrendingDown, Users, DollarSign } from "lucide-react";

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

// ---------------------------------------------------------------------------
// REQUIRED DENIAL-RATE TRAJECTORY BY PAYER SEGMENT
// ---------------------------------------------------------------------------
// The thesis: a THW workforce can only close disparities if it can sustain
// itself financially. Sustainability requires that the majority of submitted
// claims pay. If denial rates exceed ~20–25% sustained, workforce growth
// stalls and individual workers leave. The trajectory below is what would
// have to be true *per payer segment* for the cooperative to reach a
// disparity-closing workforce density by 2030.
//
// Numbers are illustrative planning targets, anchored on:
//   - Penn IMPaCT density target (1 CHW per ~250 high-need patients) — Kangovi 2020
//   - Workforce sustainability threshold from CHW finance literature (NACHW 2021)
//   - Oregon coverage distribution (KFF) — i.e. ~30% Medicaid, ~50% commercial
// Real Oregon-specific denial rates by payer must come from CCO encounter
// data and OHA THW Program reporting.
// ---------------------------------------------------------------------------
type DenialTrajectoryRow = {
  year: number;
  medicaidDenial: number;      // OHP / CCO claims for THW codes
  commercialDenial: number;    // Employer-sponsored + individual market
  medicareAdvantageDenial: number;
  combinedDenial: number;      // Coverage-weighted average
  activeTHWWorkforce: number;  // Sustainable count given the denial profile
  prioritypopReached: number;  // % of priority-population members with THW access
};

const DENIAL_TRAJECTORY: DenialTrajectoryRow[] = [
  { year: 2026, medicaidDenial: 25, commercialDenial: 60, medicareAdvantageDenial: 40, combinedDenial: 41, activeTHWWorkforce: 480, prioritypopReached: 12 },
  { year: 2027, medicaidDenial: 18, commercialDenial: 45, medicareAdvantageDenial: 28, combinedDenial: 30, activeTHWWorkforce: 720, prioritypopReached: 22 },
  { year: 2028, medicaidDenial: 10, commercialDenial: 28, medicareAdvantageDenial: 15, combinedDenial: 18, activeTHWWorkforce: 1200, prioritypopReached: 40 },
  { year: 2029, medicaidDenial: 5, commercialDenial: 15, medicareAdvantageDenial: 8, combinedDenial: 9, activeTHWWorkforce: 1900, prioritypopReached: 65 },
  { year: 2030, medicaidDenial: 2, commercialDenial: 8, medicareAdvantageDenial: 4, combinedDenial: 5, activeTHWWorkforce: 2800, prioritypopReached: 92 },
];

// ---------------------------------------------------------------------------
// LEVERS — what has to happen and who controls it
// ---------------------------------------------------------------------------
type Lever = {
  area: "Medicaid" | "Commercial" | "Medicare Advantage" | "Cross-payer";
  what: string;
  who: string;
  by: number;
  status: "underway" | "needs advocacy" | "blocked";
};

const LEVERS: Lever[] = [
  {
    area: "Medicaid",
    what: "All 16 Oregon CCOs configure their adjudication systems to recognize G0019/G0023 plus T1015/T1016/T1017 with no prior auth for credentialed THWs",
    who: "OHA + CCO contracting; the cooperative + provider associations",
    by: 2027,
    status: "underway",
  },
  {
    area: "Medicaid",
    what: "OHP fee schedule publishes parity rates for THW services (≥ 90% of Medicare PFS for G0019/G0023; defined ILOS rates for T1015/T1016/T1017)",
    who: "OHA Health Systems Division; legislature in 2027 budget cycle",
    by: 2027,
    status: "needs advocacy",
  },
  {
    area: "Commercial",
    what: "Oregon Insurance Code amended to require commercial plans to recognize and reimburse THW services (mirror of mental health parity model)",
    who: "Oregon legislature (HB-style action); Oregon DCBS Insurance Commissioner",
    by: 2028,
    status: "needs advocacy",
  },
  {
    area: "Commercial",
    what: "Top 5 commercial carriers in Oregon (Providence, Regence, Kaiser, Moda, PacificSource commercial line) publish provider manuals listing THW codes",
    who: "Carrier medical policy teams; advocacy through Oregon Association of Hospitals & Health Systems",
    by: 2028,
    status: "needs advocacy",
  },
  {
    area: "Commercial",
    what: "Self-funded ERISA plans (large Oregon employers — Nike, Intel, Providence as employer, etc.) add THW services to their TPA benefit configurations",
    who: "Employers + their benefits consultants; cannot be mandated by state law",
    by: 2029,
    status: "blocked",
  },
  {
    area: "Medicare Advantage",
    what: "Oregon Medicare Advantage plans update systems to process G0019/G0023 (CMS already pays them in fee-for-service Medicare)",
    who: "MA plan medical policy teams; CMS guidance reinforcement",
    by: 2027,
    status: "underway",
  },
  {
    area: "Cross-payer",
    what: "Statewide credentialing registry (OHA THW registry) integrated with payer credentialing systems via NPI lookup, so plans can verify THW status at claim adjudication",
    who: "OHA + payers + clearinghouses",
    by: 2027,
    status: "needs advocacy",
  },
  {
    area: "Cross-payer",
    what: "ILOS funding mechanism extended past the 1115 waiver expiration (Oct 2027) — either via waiver renewal or state plan amendment",
    who: "OHA + CMS",
    by: 2027,
    status: "underway",
  },
];

export default function Equity2030() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Equity 2030</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          What denial-rate trajectory by payer is required for THWs to plausibly close Oregon's health disparities by 2030
        </p>
      </div>

      {/* Disclosure banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-amber-900 space-y-1.5">
          <p className="font-semibold">This is a planning model, not a prediction</p>
          <p>
            The page below answers the conditional question{" "}
            <em>"what would have to be true about denial rates for the THW workforce to reach
            disparity-closing density by 2030?"</em> It is anchored on the IMPaCT density target,
            CHW workforce sustainability literature, and Oregon coverage distribution. Oregon-specific
            denial rates by payer segment are not yet published by OHA; the trajectory targets are
            illustrative until CCO encounter data and the OHA THW Program annual report fill them in.
          </p>
        </div>
      </div>

      {/* The thesis */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">The argument in three steps</h2>
        </div>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
            <div>
              <p className="font-semibold text-foreground">Disparities are driven by access; access is driven by workforce density.</p>
              <p className="text-muted-foreground mt-0.5">
                Penn IMPaCT and similar Medicaid CHW programs reduced ED utilization, hospital days,
                and chronic-disease complications when deployed at roughly{" "}
                <span className="font-semibold text-foreground">1 CHW per ~250 high-need patients</span>.
                Oregon's priority populations include communities of color, tribal communities, immigrants/refugees,
                people with disabilities, and LGBTQ2SIA+ Oregonians. <CitationPill citationKey="kangovi_impact_2020" />{" "}
                <CitationPill citationKey="oha_ship_2024" />
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
            <div>
              <p className="font-semibold text-foreground">Workforce density is gated by financial sustainability.</p>
              <p className="text-muted-foreground mt-0.5">
                A THW earning a livable wage in Oregon needs ≥75% of submitted visits to pay.
                Above ~25% sustained denial, individual workers leave the field; above ~40%, the
                cooperative cannot recruit. Combined denial rate is the binding constraint on workforce growth.{" "}
                <CitationPill citationKey="nachw_finance_review" />
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">3</span>
            <div>
              <p className="font-semibold text-foreground">Disparities cross coverage type, so private-pay parity is non-optional.</p>
              <p className="text-muted-foreground mt-0.5">
                ~50–55% of Oregonians are covered by commercial (employer or individual-market)
                plans. A Medicaid-only THW workforce can serve ~30% of the population. Closing
                disparities requires commercial recognition of THW codes, which is currently the
                slowest-moving lever. <CitationPill citationKey="kff_oregon_coverage" />
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* Disparity baseline cards */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-3">The disparity gap to close</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <DisparityCard
            metric="Life expectancy gap"
            current="~11 years"
            currentNote="AI/AN vs. White (US, 2021)"
            target="≤ 3 years"
            citation="cdc_life_expectancy_2021"
          />
          <DisparityCard
            metric="Life expectancy gap"
            current="~5.6 years"
            currentNote="Black vs. White (US, 2021)"
            target="≤ 1 year"
            citation="cdc_life_expectancy_2021"
          />
          <DisparityCard
            metric="Oregon-specific gaps"
            current="Not yet pulled"
            currentNote="OHP enrollment, infant & maternal mortality, behavioral health crisis access by race"
            target="Pull from OHA disparity report"
            citation="not_verified"
          />
        </div>
      </div>

      {/* Required denial-rate trajectory table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Required denial-rate trajectory by payer segment</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            What approval performance would have to be true year-by-year, per payer segment,
            for the THW workforce to grow to disparity-closing density by 2030.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wide">Medicaid (OHP)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-amber-700 uppercase tracking-wide">Commercial</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-700 uppercase tracking-wide">Medicare Adv.</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-violet-700 uppercase tracking-wide">Combined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wide">Active THWs</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wide">Pop. reached</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DENIAL_TRAJECTORY.map(row => {
                const isGoal = row.year === 2030;
                const isNow = row.year === 2026;
                return (
                  <tr key={row.year} className={isGoal ? "bg-violet-50" : isNow ? "bg-secondary/40" : "hover:bg-muted/20"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{row.year}</span>
                        {isNow && <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">NOW</span>}
                        {isGoal && <span className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded">GOAL</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700">{row.medicaidDenial}%</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-700">{row.commercialDenial}%</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-700">{row.medicareAdvantageDenial}%</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-violet-700">{row.combinedDenial}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{row.activeTHWWorkforce.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{row.prioritypopReached}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Combined denial</strong> is a coverage-weighted average using approximate Oregon
            coverage shares (~30% Medicaid, ~50% commercial, ~17% Medicare). <CitationPill citationKey="kff_oregon_coverage" />
          </p>
          <p>
            <strong>Active THWs</strong> assumes the workforce can sustain at the size where the
            combined denial rate keeps ≥75% of billed visits paid. <CitationPill citationKey="nachw_finance_review" />
          </p>
          <p>
            <strong>Population reached</strong> is the share of Oregon priority-population members
            with at least quarterly THW contact at IMPaCT density (1 THW : ~250 patients).{" "}
            <CitationPill citationKey="kangovi_impact_2020" />
          </p>
        </div>
      </div>

      {/* The private-pay bottleneck */}
      <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-700" />
          <h2 className="font-bold text-foreground">Why private pay is the bottleneck</h2>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          A workforce funded only by Medicaid (OHP) can serve roughly 30% of Oregonians and a
          higher share of the priority populations — but not all of them. Tribal members with
          IHS coverage, refugees in the first 5 years post-arrival, BIPOC Oregonians with
          employer-sponsored insurance, mixed-status families, working-poor adults above the
          OHP eligibility cliff, and rural communities served by employer plans (logging, ag,
          fishing) are <strong>not</strong> reachable by a Medicaid-only THW workforce.
        </p>
        <div className="grid md:grid-cols-3 gap-3 pt-2">
          <div className="bg-white border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Medicaid only</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">~30%</p>
            <p className="text-xs text-muted-foreground mt-1">of Oregonians reachable</p>
            <p className="text-xs text-foreground mt-2 leading-snug">Closes some disparity gaps; insufficient for full closure.</p>
          </div>
          <div className="bg-white border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Medicaid + Medicare</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">~47%</p>
            <p className="text-xs text-muted-foreground mt-1">of Oregonians reachable</p>
            <p className="text-xs text-foreground mt-2 leading-snug">Covers older priority-population members; still misses the working poor.</p>
          </div>
          <div className="bg-white border border-violet-300 rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">All payers including commercial</p>
            <p className="text-2xl font-bold text-violet-700 mt-1">~95%</p>
            <p className="text-xs text-muted-foreground mt-1">of Oregonians reachable</p>
            <p className="text-xs text-foreground mt-2 leading-snug">Required for disparity closure. Currently the slowest-moving lever.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic pt-2">
          Coverage shares: <CitationPill citationKey="kff_oregon_coverage" />. Population-reach
          calculation assumes equal access within each coverage type, which is a simplification —
          self-funded ERISA plans and short-term plans are likely to lag commercial fully-insured
          even after parity legislation passes.
        </p>
      </div>

      {/* The lever table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">What has to happen, and who controls each lever</h2>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Segment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">What has to happen</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Who controls it</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEVERS.map((lever, i) => {
                const segmentColor =
                  lever.area === "Medicaid" ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : lever.area === "Commercial" ? "bg-amber-100 text-amber-800 border-amber-200"
                    : lever.area === "Medicare Advantage" ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-violet-100 text-violet-800 border-violet-200";
                const statusColor =
                  lever.status === "underway" ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : lever.status === "needs advocacy" ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-red-100 text-red-800 border-red-200";
                return (
                  <tr key={i} className="hover:bg-muted/20 align-top">
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wide ${segmentColor}`}>
                        {lever.area}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground leading-snug">{lever.what}</td>
                    <td className="px-4 py-3 text-muted-foreground leading-snug">{lever.who}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">{lever.by}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wide whitespace-nowrap ${statusColor}`}>
                        {lever.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* The honest shortfall */}
      <div className="bg-card border border-red-200 bg-red-50/30 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-700" />
          <h2 className="font-bold text-foreground">What this model does <em>not</em> claim</h2>
        </div>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex gap-2.5">
            <span className="text-red-600 font-bold">·</span>
            <span>
              That the denial-rate trajectory above is achievable. The 2028 commercial target (28%
              from 60%) is contingent on legislative action that has not been introduced. The 2029
              ERISA target is contingent on voluntary employer adoption that nobody can mandate.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-red-600 font-bold">·</span>
            <span>
              That a sufficiently large THW workforce, by itself, closes disparities. Workforce is
              necessary but not sufficient — clean water, housing, food security, criminal justice
              reform, and educational equity all sit upstream.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-red-600 font-bold">·</span>
            <span>
              That the Penn IMPaCT density target (1 CHW : 250 patients) translates directly to
              Oregon's mix of urban, rural, and tribal communities. Tribal community health
              representatives in IHS-served areas may operate at different ratios; rural frontier
              counties may need higher density per capita due to travel distance.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-red-600 font-bold">·</span>
            <span>
              That denial-rate reduction alone produces income parity for THWs. Reimbursement rates,
              not just approval rates, determine livable wage. OHP fee schedule parity with Medicare
              PFS for G0019/G0023 is a separate lever.
            </span>
          </li>
        </ul>
      </div>

      {/* Sources */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Sources used on this page</h2>
        </div>
        <ol className="space-y-3 text-sm">
          {[
            "kangovi_impact_2020",
            "nachw_finance_review",
            "cdc_life_expectancy_2021",
            "oha_ship_2024",
            "kff_oregon_coverage",
            "oha_thw_registry",
            "oha_1115_waiver",
            "cms_pfs_2024_chw",
          ].map(key => {
            const c = ALL_CITATIONS[key];
            if (!c) return null;
            return (
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
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function DisparityCard({ metric, current, currentNote, target, citation }: {
  metric: string;
  current: string;
  currentNote: string;
  target: string;
  citation: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{metric}</p>
      <div>
        <p className="text-3xl font-bold text-red-700">{current}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{currentNote}</p>
      </div>
      <div className="h-px bg-border" />
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">2030 target</p>
        <p className="text-lg font-semibold text-emerald-700">{target}</p>
      </div>
      <CitationPill citationKey={citation} />
    </div>
  );
}
