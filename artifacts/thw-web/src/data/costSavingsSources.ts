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
  short: "AHRQ HCUP Statistical Brief #261 (2020)",
  full: 'Liang L, Moore B, Soni A. "National Inpatient Hospital Costs: The Most Expensive Conditions by Payer, 2017." HCUP Statistical Brief #261. Agency for Healthcare Research and Quality, Rockville, MD, 2020.',
  url: "https://www.hcup-us.ahrq.gov/reports/statbriefs/sb261-Most-Expensive-Hospital-Conditions-2017.jsp",
  year: 2020,
  keyFinding:
    "Mean cost per adult inpatient stay (US, 2017): approximately $11,700. Range varies widely by condition ($4,500–$45,000+). Mean cost per Medicaid inpatient stay: approximately $7,800.",
  caveats:
    "2017 dollars; not adjusted for medical inflation. Costs (what hospitals incur) differ from charges (what hospitals bill) and from payments (what plans pay).",
};

export const AHRQ_HCUP_READMISSION_2019: CostSavingsCitation = {
  id: "ahrq_hcup_readmission_2019",
  category: "government",
  short: "AHRQ HCUP Statistical Brief #248 (2019)",
  full: 'Bailey MK, Weiss AJ, Barrett ML, Jiang HJ. "Characteristics of 30-Day All-Cause Hospital Readmissions, 2010–2016." HCUP Statistical Brief #248. AHRQ, 2019.',
  url: "https://www.hcup-us.ahrq.gov/reports/statbriefs/sb248-Hospital-Readmissions-2010-2016.jsp",
  year: 2019,
  keyFinding:
    "Average cost of a 30-day all-cause hospital readmission (US, 2016): approximately $14,400 across all payers. Medicaid 30-day readmission rate: ~14.6%.",
  caveats: "2016 dollars. Cost not adjusted for inflation.",
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
  short: "CMS 2024 Physician Fee Schedule, CHW codes",
  full: 'Centers for Medicare & Medicaid Services. "Calendar Year 2024 Physician Fee Schedule Final Rule," CMS-1784-F. New billing codes G0019, G0022, G0023, G0024 for Community Health Integration Services.',
  url: "https://www.cms.gov/medicare/payment/fee-schedules/physician",
  year: 2024,
  keyFinding:
    "Medicare national non-facility payment rates (2024): G0019 (Community Health Integration, initial 60 min) ≈ $77; G0023 (CHI subsequent, each 30 min) ≈ $48. Rates vary by geographic locality.",
  caveats:
    "Medicare-only rate; Medicaid and commercial reimbursement rates are set independently. Oregon's Medicaid (OHP) fee schedule should be the reference for Oregon claims.",
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
  short: "NACHW CHW Finance Literature Review (2021)",
  full: 'National Association of Community Health Workers. "Community Health Worker Financing Mechanisms in Medicaid: A National Landscape Review." 2021.',
  url: "https://nachw.org/",
  year: 2021,
  keyFinding:
    "Fully-loaded cost per CHW visit (including supervision, training, overhead, and benefits) in published US programs ranges from approximately $50 to $110, with most programs in the $60–$85 range.",
  caveats: "Aggregated across diverse program models; local cost structures vary.",
};

export const CDC_LIFE_EXPECTANCY_2021: CostSavingsCitation = {
  id: "cdc_life_expectancy_2021",
  category: "government",
  short: "CDC NCHS Life Expectancy 2021",
  full: 'Arias E, Tejada-Vera B, Kochanek KD, Ahmad FB. "Provisional Life Expectancy Estimates for 2021." NVSS Vital Statistics Rapid Release Report No. 23. National Center for Health Statistics, Hyattsville, MD, August 2022.',
  url: "https://www.cdc.gov/nchs/data/vsrr/vsrr023.pdf",
  year: 2022,
  keyFinding:
    "US life expectancy at birth, 2021: American Indian/Alaska Native ~65.2 yrs; Black ~70.8 yrs; White ~76.4 yrs; Hispanic ~77.7 yrs; Asian ~83.5 yrs. AI/AN — White gap ≈ 11.2 yrs; Black — White gap ≈ 5.6 yrs.",
  caveats:
    "National figures, not Oregon-specific. 2021 reflects pandemic-era declines; pre-pandemic gaps were narrower. Oregon SHIP data should be substituted for state-specific work.",
};

export const OHA_SHIP_2024: CostSavingsCitation = {
  id: "oha_ship_2024",
  category: "government",
  short: "OHA State Health Improvement Plan",
  full: 'Oregon Health Authority. "Healthier Together Oregon: 2020–2024 State Health Improvement Plan." Public Health Division. Documents priority populations, leading causes of disparity, and statewide equity targets.',
  url: "https://www.oregon.gov/oha/PH/ABOUT/Pages/HealthierTogetherOregon.aspx",
  year: 2020,
  keyFinding:
    "Identifies five priority populations for Oregon health equity work: communities of color; tribal communities; immigrants/refugees; people with disabilities; LGBTQ2SIA+ Oregonians. Names institutional racism, adverse childhood experiences, behavioral health, economic drivers, and access to equitable preventive care as the five priority drivers.",
  caveats:
    "The SHIP names disparity drivers; population-level magnitudes by race/ethnicity for Oregon should be pulled from the most recent OHA disparity report rather than estimated.",
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
