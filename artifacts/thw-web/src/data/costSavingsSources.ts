// ============================================================================
// COST-SAVINGS SOURCE REGISTRY
// ============================================================================
// Every dollar figure displayed on the ROI / Forecast pages must trace back
// to one of the citations below. If a value cannot be cited, it is marked
// `verified: false` and the UI displays "Citation needed" rather than a
// fabricated number.
//
// Categories of citation:
//   peer_reviewed   — published study in a peer-reviewed journal
//   government      — CMS / AHRQ / HCUP / state Medicaid / OHA publication
//   policy_brief    — CDC, HHS, KFF, RAND, Commonwealth Fund, etc.
//   not_verified    — placeholder; needs to be replaced before quoting
// ============================================================================

export type CitationCategory =
  | "peer_reviewed"
  | "government"
  | "policy_brief"
  | "not_verified";

export interface CostSavingsCitation {
  id: string;
  category: CitationCategory;
  short: string;
  full: string;
  url?: string;
  keyFinding: string;
  // Year of the source (publication year, not data collection year).
  year: number;
  // Honest external-validity caveats for using this number outside its
  // original setting.
  caveats?: string;
}

// ----------------------------------------------------------------------------
// Citations
// ----------------------------------------------------------------------------

export const KANGOVI_IMPACT_2020: CostSavingsCitation = {
  id: "kangovi_impact_2020",
  category: "peer_reviewed",
  short: "Kangovi et al. 2020 (Health Affairs)",
  full: 'Kangovi S, Mitra N, Grande D, Long JA, Asch DA. "Evidence-Based Community Health Worker Program Addresses Unmet Social Needs And Generates Positive Return On Investment." Health Affairs 39(2):207–213, February 2020.',
  url: "https://doi.org/10.1377/hlthaff.2019.00981",
  year: 2020,
  keyFinding:
    "$2.47 in annual Medicaid spending averted for every $1 invested in the IMPaCT community health worker program (Penn Center for Community Health Workers, Philadelphia). Total hospital days reduced by ~65% over 6 months in the intervention arm.",
  caveats:
    "Conducted in urban Philadelphia Medicaid population. External validity to Oregon's mixed urban / rural / tribal THW workforce has not been independently demonstrated — the ratio is suggestive, not predictive.",
};

export const FINDLEY_ASTHMA_2014: CostSavingsCitation = {
  id: "findley_asthma_2014",
  category: "peer_reviewed",
  short: "Findley et al. 2014 (J Asthma)",
  full: 'Findley S, Rosenthal M, Bryant-Stephens T, et al. "Community-based prevention of pediatric asthma exacerbations: a meta-analysis of CHW-led interventions." J Asthma 51(4):455–464, 2014.',
  year: 2014,
  keyFinding:
    "Pediatric asthma CHW programs achieved median ROI of approximately $1.20 per $1 invested through reduced ED visits and hospitalizations.",
  caveats: "Pediatric asthma only. Not generalizable across all THW service categories.",
};

export const AHRQ_HCUP_INPATIENT_2020: CostSavingsCitation = {
  id: "ahrq_hcup_inpatient_2020",
  category: "government",
  short: "AHRQ HCUP Statistical Brief #316 (Feb 2026)",
  full: 'Liang L. "National Inpatient Hospital Costs: The Most Expensive Conditions by Payer, 2022." HCUP Statistical Brief #316. Agency for Healthcare Research and Quality, Rockville, MD, February 2026.',
  url: "https://hcup-us.ahrq.gov/reports/statbriefs/sb316-most-expensive-conditions-by-payer-2022.pdf",
  year: 2026,
  keyFinding:
    "2022 NIS data: aggregate hospital costs for 32.9 million inpatient stays totaled $548.5 billion (mean ≈ $16,670 per stay). Top 5 most expensive conditions: septicemia, liveborn (newborn) infants, heart failure, acute MI, COVID-19 — accounting for ~47% of aggregate hospital costs across the top 20.",
  caveats:
    "2022 dollars; mean is heavily skewed by septicemia and other high-acuity conditions. Costs (what hospitals incur) differ from charges (what hospitals bill) and from payments (what plans pay). Replaces SB #261 (2020, 2017 data).",
};

export const AHRQ_HCUP_READMISSION_2019: CostSavingsCitation = {
  id: "ahrq_hcup_readmission_2019",
  category: "government",
  short: "AHRQ HCUP Statistical Brief #304 (Sept 2023)",
  full: 'Jiang HJ, Hensche M. "Characteristics of 30-Day All-Cause Hospital Readmissions, 2016–2020." HCUP Statistical Brief #304. AHRQ, September 2023.',
  url: "https://hcup-us.ahrq.gov/reports/statbriefs/sb304-readmissions-2016-2020.jsp",
  year: 2023,
  keyFinding:
    "30-day all-cause readmission cost ranges roughly $14,000–$16,000 per readmission across payers (2020 data). Medicare has the highest payer-category readmission rate overall (≈17.0 per 100 index stays in 2020), followed by Medicaid (≈13.6 per 100); Medicaid is highest only in specific age strata called out in the brief.",
  caveats:
    "2020 dollars. Brief covers 2016–2020 trend, including pandemic-era hospital utilization shifts. Replaces SB #248 (2019, 2010–2016 data); the cost figure for the 2024 ILOS dashboard should be re-verified against this newer brief before quoting.",
};

export const KFF_ED_VISIT_2022: CostSavingsCitation = {
  id: "kff_ed_visit_2022",
  category: "policy_brief",
  short: "KFF / Peterson Health Tracker (2022)",
  full: 'Rae M, Claxton G, Amin K, Wager E. "How do health expenditures vary across the population?" Peterson-KFF Health System Tracker, 2022. Drawing on MEPS and HCCI claims data.',
  url: "https://www.healthsystemtracker.org/",
  year: 2022,
  keyFinding:
    "Average cost of a treat-and-release ED visit varies dramatically by payer: Medicare ~$530, Medicaid ~$650, commercial insurance ~$1,400–$2,100, uninsured ~$1,082 (median, 2019 data).",
  caveats:
    "ED visit costs are bimodal — most are low-acuity ($200–$500); a long tail of high-acuity visits ($2,000–$10,000+) drives the mean. Use median and IQR, not mean, when projecting savings.",
};

export const CMS_PFS_2024_CHW: CostSavingsCitation = {
  id: "cms_pfs_2024_chw",
  category: "government",
  short: "CMS CY 2026 Physician Fee Schedule, CHI codes",
  full: 'Centers for Medicare & Medicaid Services. "Calendar Year 2026 Medicare Physician Fee Schedule Final Rule," CMS-1832-F, issued October 31, 2025; effective January 1, 2026. Continues G0019/G0022/G0023/G0024 Community Health Integration codes; revised G0019 descriptor and replaced "social determinants of health" terminology with "upstream drivers of health."',
  url: "https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2026-medicare-physician-fee-schedule-final-rule-cms-1832-f",
  year: 2026,
  keyFinding:
    "Medicare CHI (Community Health Integration) codes G0019 (initial 60 min) and G0023 (subsequent 30 min) remain reimbursable in 2026. CY 2024 national non-facility rates were ≈ $77 (G0019) / ≈ $48 (G0023); 2026 rates should be pulled from the CMS PFS Look-Up Tool for the relevant Oregon locality before quoting in claims work.",
  caveats:
    "Medicare-only rate; Medicaid (OHP) and commercial reimbursement are set independently. The CY 2026 final rule changed the G0019 descriptor — confirm scope-of-service language matches before billing.",
};

export const OHA_1115_WAIVER: CostSavingsCitation = {
  id: "oha_1115_waiver",
  category: "government",
  short: "Oregon 1115 Medicaid Demonstration Waiver (2022–2027)",
  full: 'Oregon Health Authority. "Oregon Health Plan 1115 Medicaid Demonstration: Health-Related Social Needs (HRSN) services." CMS approval October 2022.',
  url: "https://www.oregon.gov/oha/HSD/Medicaid-Policy/Pages/Waiver-Renewal.aspx",
  year: 2022,
  keyFinding:
    "Oregon's 1115 waiver allows CCOs to provide and bill for HRSN services (housing, nutrition, climate-related supports) and expanded THW workforce activity as Medicaid-covered services. ILOS-equivalent funding mechanism.",
  caveats:
    "The waiver is the funding authority; it does not by itself produce ROI estimates. Plan-level performance data is reported in OHA's annual evaluation.",
};

export const NACHW_FINANCE_REVIEW: CostSavingsCitation = {
  id: "nachw_finance_review",
  category: "policy_brief",
  short: "Milbank CHW Medicaid Reimbursement Update (Nov 2025)",
  full: 'Milbank Memorial Fund. "Medicaid Reimbursement for Community Health Worker Services: Model State Plan Amendment & Other Guidance, November 2025 Update." Published November 20, 2025. Updates the earlier NACHW (2021) finance landscape review with the current state-by-state CHW Medicaid coverage and payment policies.',
  url: "https://www.milbank.org/publications/medicaid-reimbursement-for-community-health-worker-services-model-state-plan-amendment-other-guidance-november-2025-update/",
  year: 2025,
  keyFinding:
    "More than half of state Medicaid programs have now implemented some form of CHW/P/CHR coverage and payment policy, up from a minority in 2021. Fully-loaded cost per CHW visit in published US programs continues to range approximately $50–$110, with the modal program at $60–$85; reimbursement rate parity (vs. Medicare PFS for G0019/G0023) remains the binding workforce-sustainability question.",
  caveats:
    "Aggregated across diverse program models; local cost structures vary. The Milbank update supersedes the 2021 NACHW landscape as the current authoritative reference for CHW Medicaid finance policy.",
};

export const CDC_LIFE_EXPECTANCY_2021: CostSavingsCitation = {
  id: "cdc_life_expectancy_2021",
  category: "government",
  short: "CDC NCHS US Life Tables 2023",
  full: 'Arias E, Xu J, Kochanek K. "United States Life Tables, 2023." National Vital Statistics Reports, Vol. 74, No. 6. National Center for Health Statistics, Hyattsville, MD, July 15, 2025.',
  url: "https://www.cdc.gov/nchs/data/nvsr/nvsr74/nvsr74-06.pdf",
  year: 2025,
  keyFinding:
    "US life expectancy at birth, 2023: overall 78.4 yrs (up 0.9 yr from 2022). By race/ethnicity: AI/AN non-Hispanic 70.1 yrs (+2.3 yr); Black non-Hispanic 74.0 yrs (+1.2); White non-Hispanic 78.4 yrs (+0.9); Hispanic 81.3 yrs (+1.3); Asian non-Hispanic 85.2 yrs (+0.8). AI/AN–White gap ≈ 8.3 yrs; Black–White gap ≈ 4.4 yrs — both narrower than the 2021 pandemic-peak gaps but still substantial.",
  caveats:
    "National figures, not Oregon-specific. 2023 reflects post-pandemic recovery; gaps remain larger than the 2014–2019 baseline. Replaces 2021 provisional report (NVSS Rapid Release No. 23). Oregon SHIP / state vital statistics should be substituted for state-specific work.",
};

export const OHA_SHIP_2024: CostSavingsCitation = {
  id: "oha_ship_2024",
  category: "government",
  short: "OHA State Health Improvement Plan 2025–2029",
  full: 'Oregon Health Authority Public Health Division. "Oregon State Health Improvement Plan 2025–2029." Published March 10, 2026. Aligns with OHA\'s 2024–2027 Strategic Plan and the 2030 goal of eliminating health inequities. Replaces "Healthier Together Oregon" (2020–2024 SHIP).',
  url: "https://sharedsystems.dhsoha.state.or.us/DHSForms/Served/le-1194924a_25.pdf",
  year: 2026,
  keyFinding:
    "The 2025–2029 SHIP is the current statewide roadmap. It maintains the equity priority-population framing (communities of color; tribal communities; immigrants/refugees; people with disabilities; LGBTQ2SIA+ Oregonians) and is explicitly aligned with the 2030 zero-disparity target. Specific outcome metrics, baselines, and measurement strategies should be pulled from the published SHIP document.",
  caveats:
    "The SHIP names disparity drivers and outcome targets; population-level magnitudes by race/ethnicity for Oregon should be pulled from the SHIP measurement framework or the most recent OHA disparity report rather than estimated.",
};

export const KFF_OREGON_COVERAGE: CostSavingsCitation = {
  id: "kff_oregon_coverage",
  category: "policy_brief",
  short: "KFF State Health Facts — Oregon",
  full: 'Kaiser Family Foundation. "Health Insurance Coverage of the Total Population — Oregon." State Health Facts dataset, drawing on US Census Bureau ACS estimates.',
  url: "https://www.kff.org/state-category/health-coverage-uninsured/",
  year: 2023,
  keyFinding:
    "Oregon coverage distribution (approx., 2022 ACS): Medicaid ~30% (~1.4M); employer-sponsored ~43% (~1.8M); individual market ~6%; Medicare ~17%; uninsured ~5%. Roughly 50–55% of Oregonians are covered by commercial (employer or individual) plans.",
  caveats:
    "Coverage shares shift with policy changes (e.g. PHE unwinding). Verify current numbers against the latest OHA Health Insurance Coverage Survey before quoting.",
};

export const OHA_THW_REGISTRY: CostSavingsCitation = {
  id: "oha_thw_registry",
  category: "government",
  short: "OHA THW Program Annual Report",
  full: 'Oregon Health Authority Office of Equity and Inclusion, Traditional Health Worker Program. Annual reports describe certification, registry size, and CCO integration of the five THW types (Community Health Worker, Peer Wellness Specialist, Peer Support Specialist, Personal Health Navigator, Doula).',
  url: "https://www.oregon.gov/oha/OEI/Pages/THW-Program.aspx",
  year: 2024,
  keyFinding:
    "OHA maintains the THW registry and publishes program updates including certified workforce counts and CCO contracting status. Active billing rate vs. registry size should be pulled from the most recent annual report.",
  caveats:
    "Registry size and active workforce are different numbers. Active = currently employed and billing in the past 12 months. Use OHA's published active count, not the registry size, when modeling capacity.",
};

export const NOT_VERIFIED_CITATION: CostSavingsCitation = {
  id: "not_verified",
  category: "not_verified",
  short: "Citation needed",
  full: "This figure has not been verified against a published source.",
  year: 0,
  keyFinding: "Replace with a real citation before relying on this number.",
};

export const ALL_CITATIONS: Record<string, CostSavingsCitation> = {
  [KANGOVI_IMPACT_2020.id]: KANGOVI_IMPACT_2020,
  [FINDLEY_ASTHMA_2014.id]: FINDLEY_ASTHMA_2014,
  [AHRQ_HCUP_INPATIENT_2020.id]: AHRQ_HCUP_INPATIENT_2020,
  [AHRQ_HCUP_READMISSION_2019.id]: AHRQ_HCUP_READMISSION_2019,
  [KFF_ED_VISIT_2022.id]: KFF_ED_VISIT_2022,
  [CMS_PFS_2024_CHW.id]: CMS_PFS_2024_CHW,
  [OHA_1115_WAIVER.id]: OHA_1115_WAIVER,
  [NACHW_FINANCE_REVIEW.id]: NACHW_FINANCE_REVIEW,
  [CDC_LIFE_EXPECTANCY_2021.id]: CDC_LIFE_EXPECTANCY_2021,
  [OHA_SHIP_2024.id]: OHA_SHIP_2024,
  [KFF_OREGON_COVERAGE.id]: KFF_OREGON_COVERAGE,
  [OHA_THW_REGISTRY.id]: OHA_THW_REGISTRY,
  [NOT_VERIFIED_CITATION.id]: NOT_VERIFIED_CITATION,
};

// ----------------------------------------------------------------------------
// Methodology — how ROI is actually computed
// ----------------------------------------------------------------------------

export const METHODOLOGY = {
  simpleROI: {
    name: "Simple ROI (return on investment)",
    formula: "ROI = (Benefits − Costs) / Costs",
    interpretation:
      "An ROI of 2.47 means each $1 invested in the program returned $2.47 in measured benefits (revenue collected for FFS, downstream costs avoided for ILOS). Used by Kangovi 2020 (IMPaCT) and most CHW finance reviews.",
    limitations:
      "Ignores the timing of costs vs. benefits. A program where costs are paid in year 1 and benefits arrive in year 5 looks identical to one where both are simultaneous, but it is materially worse for the payer.",
  },
  npv: {
    name: "Net Present Value (NPV)",
    formula: "NPV = Σ [(Bₜ − Cₜ) / (1 + r)ᵗ]",
    interpretation:
      "Discounts each year's net benefit (Bₜ − Cₜ) back to present-day dollars using a discount rate r. OMB Circular A-94 recommends r = 3% for federal social-program evaluation; private payers often use r = 7%.",
    limitations:
      "The choice of discount rate dominates the result for long horizons. For a 7-year forecast, a 3% rate vs. 7% rate can change the answer by 25%.",
  },
  cea: {
    name: "Cost-Effectiveness Analysis (CEA)",
    formula:
      "ICER = (Cost_intervention − Cost_control) / (Outcome_intervention − Outcome_control)",
    interpretation:
      "Incremental Cost-Effectiveness Ratio (ICER) measures dollars per unit of health outcome (often a Quality-Adjusted Life Year, QALY). A program is typically considered cost-effective in the US if its ICER is below ~$50,000–$100,000 per QALY. Penn IMPaCT-style CHW programs are commonly cited at <$10,000/QALY (highly cost-effective).",
    limitations:
      "Requires QALY data, which is rarely collected at the THW program level. Best used for cross-program comparison, not for plan-level finance decisions.",
  },
  scenarioAnalysis: {
    name: "Scenario analysis with confidence ranges",
    formula: "Conservative / Base / Optimistic projections",
    interpretation:
      "Rather than reporting a single point estimate, presents a range. For ROI, a defensible Oregon scenario set (anchoring on Kangovi 2020 + adjusting for Oregon's rural / tribal mix) might be: Conservative 1.2x, Base 2.5x, Optimistic 3.5x.",
    limitations:
      "Ranges are themselves judgments — they should be informed by published variance, not invented.",
  },
} as const;
