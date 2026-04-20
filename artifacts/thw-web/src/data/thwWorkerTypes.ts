/**
 * Oregon Traditional Health Worker Types — Full OAR 410-180-0305 Taxonomy
 *
 * Sources:
 *   - ORS 414.025 (statutory definitions)
 *   - OAR 410-180-0305 (administrative rules — defines subtype certifications)
 *   - OHA THW Registry: https://traditionalhealthworkerregistry.oregon.gov
 *   - Oregon Traditional Health Workers Commission (ORS 413.600)
 *
 * Oregon's THW framework works in two layers:
 *
 *   1. ORS 414.025 + OAR 410-180-0305 name eight broad THW categories
 *      (CHW, PHN, BD, FSS, YSS, TTHW, PSS, PWS).
 *   2. The OHA-approved certifying body for the peer categories — MHACBO
 *      (Mental Health & Addiction Certification Board of Oregon) — issues
 *      distinct subtype certifications WITHIN PSS and PWS that determine
 *      billing scope, reimbursement, and registry placement under OHP.
 *
 * Counting each MHACBO-issued certification (recognized by OHA via OAR
 * delegation) plus the standalone categories yields the 14 distinct
 * credentials enumerated below:
 *
 *   - Community Health Worker (CHW)
 *   - Personal Health Navigator (PHN)
 *   - Birth Doula (BD)
 *   - Family Support Specialist (FSS)
 *   - Youth Support Specialist (YSS)
 *   - Tribal Traditional Health Worker (TTHW)
 *   - Peer Support Specialist subtypes (5):
 *       Adult Mental Health, Adult Addictions, Family, Youth,
 *       Certified Recovery Mentor (CRM specialization)
 *   - Peer Wellness Specialist subtypes (3): Adult, Family, Youth
 *
 * The Cooperative Expansion Roadmap below documents 4 allied roles the
 * cooperative is advocating to add to ORS 414.025. They are NOT currently
 * ORS-recognized and are clearly labeled as such throughout the platform.
 */

export interface THWWorkerTypeInfo {
  id: string;
  title: string;
  abbreviation: string;
  subtitle: string;
  description: string;
  legalBasis: string;
  populations: string[];
  cptCodes: string[];
  zCodes: string[];
  hedisCategories: string[];
  ilosEligible: boolean;
  certifyingBody: string;
  registryUrl: string;
  color: string;
  sdohFocus: string[];
  parentCategory?: string;
  healthDisparityFocus: string;
}

export interface AdvocacyRoleInfo {
  id: string;
  title: string;
  abbreviation: string;
  subtitle: string;
  rationale: string;
  currentStatus: string;
  populations: string[];
  healthDisparityFocus: string;
  color: string;
}

export const THW_WORKER_TYPES: THWWorkerTypeInfo[] = [
  {
    id: "community_health_worker",
    title: "Community Health Worker",
    abbreviation: "CHW",
    subtitle: "Frontline community health liaison",
    description:
      "A frontline public health worker who is a trusted member of and/or has an unusually close understanding of the community served. To the extent practicable, shares ethnicity, language, socioeconomic status, and life experiences with residents of the community. Provides culturally appropriate health education, assists community residents in receiving care, may give peer counseling and guidance on health behaviors, and may provide direct services such as first aid or blood pressure screening.",
    legalBasis: "ORS 414.025(5); OAR 410-180-0305(4)",
    populations: ["Medicaid members", "uninsured residents", "BIPOC communities", "rural Oregonians", "immigrants and refugees"],
    cptCodes: ["G0019", "G0023", "T1016", "T1017", "G9012"],
    zCodes: ["Z59.0", "Z59.4", "Z60.2", "Z63.0", "Z75.3"],
    hedisCategories: ["Preventive Care", "Care Coordination", "Social Determinants of Health"],
    ilosEligible: true,
    certifyingBody: "OHA-approved CHW training program (OAR 410-180-0400)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#1a7a5e",
    sdohFocus: ["Housing instability", "Food insecurity", "Transportation", "Language access", "Immigration status"],
    healthDisparityFocus: "Closes preventable-care gaps for BIPOC, immigrant, and rural OHP members.",
  },
  {
    id: "personal_health_navigator",
    title: "Personal Health Navigator",
    abbreviation: "PHN",
    subtitle: "Health system navigation & care decision support",
    description:
      "An individual who provides information, assistance, tools, and support to enable a patient to make the best health care decisions. Navigates health systems, coordinates benefits, and advocates for members—particularly those managing complex conditions or transitioning between care settings.",
    legalBasis: "ORS 414.025(17); OAR 410-180-0305(9)",
    populations: ["Complex-care members", "high utilizers of ED services", "individuals with multiple chronic conditions", "post-hospitalization transitions"],
    cptCodes: ["99401", "99402", "T1016", "G9012"],
    zCodes: ["Z75.3", "Z74.2", "Z59.7"],
    hedisCategories: ["Care Coordination", "Transitions of Care", "Follow-Up After Hospitalization"],
    ilosEligible: false,
    certifyingBody: "OHA-approved PHN training program (OAR 410-180-0400)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#b45309",
    sdohFocus: ["Benefit navigation", "Care transitions", "Health literacy", "Chronic disease management"],
    healthDisparityFocus: "Reduces avoidable readmissions and ED use among high-need members.",
  },
  {
    id: "pss_adult_mh",
    title: "Peer Support Specialist — Adult Mental Health",
    abbreviation: "PSS-MH",
    subtitle: "Adult mental health peer recovery support",
    description:
      "A Peer Support Specialist with the OHA Adult Mental Health subtype certification. Provides supportive services to adults who are current or former consumers of mental health services, drawing on their own lived experience of recovery to offer hope, mentorship, and practical support.",
    legalBasis: "ORS 414.025(21); OAR 410-180-0305(11); OAR 309-019",
    populations: ["Adults with mental health diagnoses", "individuals leaving inpatient psychiatric care", "veterans"],
    cptCodes: ["H0038", "96152", "T1016", "99484"],
    zCodes: ["Z81.1", "Z86.59", "Z91.19"],
    hedisCategories: ["Behavioral Health Integration", "Antidepressant Medication Management", "Follow-Up After Mental Health Hospitalization"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#7c3aed",
    sdohFocus: ["Stable housing", "Social isolation", "Employment", "Stigma"],
    parentCategory: "Peer Support Specialist (PSS)",
    healthDisparityFocus: "Addresses the inpatient-readmission gap for adults with serious mental illness.",
  },
  {
    id: "pss_adult_addictions",
    title: "Peer Support Specialist — Adult Addictions",
    abbreviation: "PSS-AA",
    subtitle: "Adult substance use disorder peer support",
    description:
      "A Peer Support Specialist with the OHA Adult Addictions subtype certification. Supports adults in recovery from substance use disorders using their own recovery experience to provide engagement, retention, and relapse prevention support.",
    legalBasis: "ORS 414.025(21); OAR 410-180-0305(11); OAR 309-019",
    populations: ["Adults in SUD recovery", "individuals on MAT/MOUD", "people leaving treatment", "justice-involved adults"],
    cptCodes: ["H0038", "H0025", "T1016", "H0005"],
    zCodes: ["Z71.41", "Z71.51", "Z86.59"],
    hedisCategories: ["Substance Use Disorder Treatment", "Initiation & Engagement of SUD Treatment", "Transitions of Care"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#6d28d9",
    sdohFocus: ["Recovery housing", "Employment", "Criminal legal involvement", "MAT access"],
    parentCategory: "Peer Support Specialist (PSS)",
    healthDisparityFocus: "Closes SUD treatment retention gaps that drive Oregon's overdose mortality crisis.",
  },
  {
    id: "pss_family",
    title: "Peer Support Specialist — Family",
    abbreviation: "PSS-F",
    subtitle: "Family-focused peer recovery support",
    description:
      "A Peer Support Specialist with the OHA Family subtype certification. Provides peer support to family members affected by a loved one's mental health or substance use condition, helping families navigate treatment systems and develop resilience.",
    legalBasis: "ORS 414.025(21); OAR 410-180-0305(11)",
    populations: ["Families of adults in MH/SUD treatment", "co-occurring caregiver-and-patient households"],
    cptCodes: ["H0038", "T1016", "99484"],
    zCodes: ["Z63.8", "Z63.79", "Z81.8"],
    hedisCategories: ["Behavioral Health Integration", "Care Coordination"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#8b5cf6",
    sdohFocus: ["Caregiver burden", "Family system stability", "Secondary trauma"],
    parentCategory: "Peer Support Specialist (PSS)",
    healthDisparityFocus: "Reduces caregiver burnout that destabilizes family-based recovery.",
  },
  {
    id: "pss_youth",
    title: "Peer Support Specialist — Youth",
    abbreviation: "PSS-Y",
    subtitle: "Adolescent & transition-age youth peer support",
    description:
      "A Peer Support Specialist with the OHA Youth subtype certification. Provides peer support to youth and transition-age young adults experiencing mental health or substance use challenges, drawing on their own youth-onset recovery experience.",
    legalBasis: "ORS 414.025(21); OAR 410-180-0305(11)",
    populations: ["Adolescents in MH/SUD treatment", "transition-age youth (TAY) 14–25", "youth leaving juvenile justice"],
    cptCodes: ["H0038", "96152", "T1016"],
    zCodes: ["Z62.820", "Z55.9", "Z81.1"],
    hedisCategories: ["Adolescent Well-Care", "Behavioral Health Integration", "Follow-Up After Mental Health Hospitalization"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#a78bfa",
    sdohFocus: ["School engagement", "Family conflict", "Peer relationships", "Identity formation"],
    parentCategory: "Peer Support Specialist (PSS)",
    healthDisparityFocus: "Closes the youth mental-health treatment engagement gap.",
  },
  {
    id: "pss_crm",
    title: "Peer Support Specialist — Certified Recovery Mentor",
    abbreviation: "PSS-CRM",
    subtitle: "OHA-recognized CRM specialization within PSS",
    description:
      "An OHA-recognized specialization within Peer Support Specialist focused specifically on substance use recovery mentorship. CRMs work primarily in addictions services, residential treatment, and reentry programs, often supporting people during the highest-risk first 90 days post-treatment.",
    legalBasis: "ORS 414.025(21); OAR 410-180-0305(11); OAR 309-019-0125",
    populations: ["People exiting residential SUD treatment", "post-incarceration reentry", "individuals on MAT/MOUD"],
    cptCodes: ["H0038", "H0025", "T1016", "H0005", "T1017"],
    zCodes: ["Z71.41", "Z65.1", "Z71.51"],
    hedisCategories: ["Substance Use Disorder Treatment", "Transitions of Care", "Initiation & Engagement of SUD Treatment"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO) — CRM endorsement",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#5b21b6",
    sdohFocus: ["Reentry support", "Recovery housing", "Overdose prevention", "MAT linkage"],
    parentCategory: "Peer Support Specialist (PSS)",
    healthDisparityFocus: "Targets the post-treatment overdose mortality cliff, especially for reentry populations.",
  },
  {
    id: "pws_adult",
    title: "Peer Wellness Specialist — Adult",
    abbreviation: "PWS-A",
    subtitle: "Adult health-home integrated peer support",
    description:
      "A Peer Wellness Specialist serving adults in person-driven health home teams. PWS workers integrate behavioral health and primary care, supporting whole-person well-being for adults with serious mental illness or co-occurring chronic conditions.",
    legalBasis: "ORS 414.025(22); OAR 410-180-0305(12)",
    populations: ["Adults with serious mental illness (SMI)", "health home enrollees", "dual-eligible Medicaid/Medicare members"],
    cptCodes: ["G0023", "99490", "H0038", "99484"],
    zCodes: ["Z81.8", "Z87.39", "Z91.89"],
    hedisCategories: ["Behavioral Health Integration", "Care Coordination", "Antidepressant Medication Management"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#0369a1",
    sdohFocus: ["Mental health stability", "Medication adherence", "Social connectedness", "Housing"],
    parentCategory: "Peer Wellness Specialist (PWS)",
    healthDisparityFocus: "Closes the 25-year life-expectancy gap for adults with SMI.",
  },
  {
    id: "pws_family",
    title: "Peer Wellness Specialist — Family",
    abbreviation: "PWS-F",
    subtitle: "Family-system health home support",
    description:
      "A Peer Wellness Specialist serving families and caregivers, integrating behavioral and physical health care within family-centered health homes. Supports caregivers managing complex pediatric or multi-generational health needs.",
    legalBasis: "ORS 414.025(22); OAR 410-180-0305(12)",
    populations: ["Families with children in health homes", "multi-generational households with complex care needs"],
    cptCodes: ["G0023", "99490", "H0038"],
    zCodes: ["Z63.8", "Z62.820"],
    hedisCategories: ["Care Coordination", "Behavioral Health Integration", "Child & Adolescent Well-Care"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#0284c7",
    sdohFocus: ["Caregiver burden", "Family functioning", "Pediatric care coordination"],
    parentCategory: "Peer Wellness Specialist (PWS)",
    healthDisparityFocus: "Reduces caregiver-driven readmissions in pediatric and multi-generational households.",
  },
  {
    id: "pws_youth",
    title: "Peer Wellness Specialist — Youth",
    abbreviation: "PWS-Y",
    subtitle: "Youth-focused integrated wellness peer support",
    description:
      "A Peer Wellness Specialist serving youth and transition-age young adults within health home teams, integrating behavioral health and primary care for adolescents managing complex psychiatric or co-occurring conditions.",
    legalBasis: "ORS 414.025(22); OAR 410-180-0305(12)",
    populations: ["Youth with SMI/SED diagnoses", "transition-age youth in care coordination"],
    cptCodes: ["G0023", "H0038", "96152"],
    zCodes: ["Z62.820", "Z81.8", "Z55.9"],
    hedisCategories: ["Adolescent Well-Care", "Behavioral Health Integration", "Follow-Up After Mental Health Hospitalization"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#38bdf8",
    sdohFocus: ["School engagement", "Transition planning", "Family support", "Medication adherence"],
    parentCategory: "Peer Wellness Specialist (PWS)",
    healthDisparityFocus: "Improves continuity of care for youth aging out of pediatric mental health services.",
  },
  {
    id: "birth_doula",
    title: "Birth Doula",
    abbreviation: "BD",
    subtitle: "Pregnancy, birth & postpartum support",
    description:
      "A birth companion who provides personal, nonmedical support to individuals and families throughout pregnancy, childbirth, and the immediate postpartum experience. Oregon Medicaid (OHP) covers doula services under OAR 410-130-0530, recognizing their proven impact in reducing C-section rates, preterm birth, and maternal morbidity—particularly for BIPOC birthing people who face disproportionate rates of maternal mortality.",
    legalBasis: "ORS 414.025(3); OAR 410-130-0530; OAR 410-180-0305(3)",
    populations: ["Pregnant OHP members", "BIPOC birthing people", "adolescent parents", "unhoused pregnant individuals"],
    cptCodes: ["99401", "T1015", "S9088"],
    zCodes: ["Z34.01", "Z34.31", "Z23", "Z76.81"],
    hedisCategories: ["Prenatal Care", "Postpartum Care", "Maternal Health Equity"],
    ilosEligible: true,
    certifyingBody: "DONA International, CAPPA, Doulas of North America, or OHA-approved program",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#be185d",
    sdohFocus: ["Maternal mortality equity", "Birth trauma prevention", "Infant health outcomes", "Family stability"],
    healthDisparityFocus: "Closes the 3x maternal mortality gap experienced by Black birthing Oregonians.",
  },
  {
    id: "family_support_specialist",
    title: "Family Support Specialist",
    abbreviation: "FSS",
    subtitle: "Caregiver peer support — children with MH/SUD history",
    description:
      "An individual who, based on similar life experiences, provides support services to and has experience parenting a child who is a current or former consumer of mental health or addiction treatment, or who faces difficulties accessing education, health, and wellness services due to behavioral health barriers.",
    legalBasis: "ORS 414.025(10); ORS 414.665; OAR 410-180-0305(6)",
    populations: ["Caregivers of children with MH/SUD history", "foster and adoptive families", "families involved with DHS/child welfare"],
    cptCodes: ["H0038", "T1016", "99484"],
    zCodes: ["Z63.8", "Z63.4", "Z81.8"],
    hedisCategories: ["Behavioral Health Integration", "Care Coordination", "Child & Adolescent Well-Care"],
    ilosEligible: true,
    certifyingBody: "MHACBO (Family Support Specialist certification)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#d97706",
    sdohFocus: ["Caregiver stress", "Family systems stability", "Child welfare involvement", "School-based services"],
    healthDisparityFocus: "Reduces foster-care reentry and stabilizes children with behavioral health needs.",
  },
  {
    id: "youth_support_specialist",
    title: "Youth Support Specialist",
    abbreviation: "YSS",
    subtitle: "Lived-experience peer support for youth",
    description:
      "An individual who, based on similar lived experience, provides supportive services to a youth facing or who has faced difficulties accessing education, health, and wellness services due to mental health or behavioral health barriers. Must themselves be a current or former consumer of those services.",
    legalBasis: "ORS 414.025(31); ORS 414.665; OAR 410-180-0305(13)",
    populations: ["Youth ages 14–25", "transition-age youth (TAY)", "justice-involved youth", "youth experiencing homelessness"],
    cptCodes: ["H0038", "96152", "T1016"],
    zCodes: ["Z62.820", "Z59.0", "Z55.9"],
    hedisCategories: ["Adolescent Well-Care", "Behavioral Health Integration", "Follow-Up After Mental Health Hospitalization"],
    ilosEligible: true,
    certifyingBody: "MHACBO (Youth Support Specialist certification)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#0891b2",
    sdohFocus: ["Youth homelessness", "Education access", "Justice system involvement", "Substance use"],
    healthDisparityFocus: "Closes well-care visit gaps for unhoused, justice-involved, and TAY youth.",
  },
  {
    id: "tribal_thw",
    title: "Tribal Traditional Health Worker",
    abbreviation: "TTHW",
    subtitle: "Tribally-based, culturally grounded health support",
    description:
      "Oregon recognizes nine federally recognized tribal nations. TTHW certification pathways and scopes of practice are determined in partnership with individual tribal nations on a government-to-government basis. TTHWs integrate culturally grounded healing practices with health services, supporting enrolled tribal members and urban Native communities. OHA coordinates with tribes under Oregon's Tribal Government-to-Government Policy.",
    legalBasis: "ORS 414.025(28); OAR 410-180; Oregon Tribal Government-to-Government Policy",
    populations: ["Enrolled tribal members", "Native American and Alaska Native Oregonians", "Urban Indian Health patients", "rural reservation communities"],
    cptCodes: ["G0019", "G0023", "T1016", "T1017"],
    zCodes: ["Z60.3", "Z75.3", "Z59.0"],
    hedisCategories: ["Preventive Care", "Care Coordination", "Social Determinants of Health"],
    ilosEligible: true,
    certifyingBody: "Individual tribal nation + OHA coordination (government-to-government)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#92400e",
    sdohFocus: ["Tribal sovereignty", "Cultural healing practices", "Historical trauma", "Language preservation", "Rural access"],
    healthDisparityFocus: "Honors tribal sovereignty and addresses historical-trauma-driven disparities.",
  },
];

export const ADVOCACY_EXPANSION_ROLES: AdvocacyRoleInfo[] = [
  {
    id: "postpartum_doula",
    title: "Postpartum Doula",
    abbreviation: "PPD",
    subtitle: "Newborn-period family support — advocacy priority",
    rationale:
      "Birth doulas under OAR 410-130-0530 cover the immediate postpartum period only. A standalone postpartum doula scope would extend support through 6–12 weeks postpartum — the window when most maternal deaths actually occur. The cooperative is advocating for OHA to expand reimbursement parity.",
    currentStatus: "Workforce active in Oregon. Not yet a distinct ORS 414.025 category.",
    populations: ["Birthing OHP members through 12 weeks postpartum", "BIPOC postpartum parents", "parents with postpartum depression or psychosis"],
    healthDisparityFocus:
      "65% of pregnancy-related deaths occur AFTER birth — current Birth Doula scope ends too early to close this gap.",
    color: "#db2777",
  },
  {
    id: "full_spectrum_doula",
    title: "Full-Spectrum / Abortion Doula",
    abbreviation: "FSD",
    subtitle: "Full reproductive health spectrum — advocacy priority",
    rationale:
      "Full-spectrum doulas support pregnancy outcomes including miscarriage, abortion, stillbirth, and adoption. Oregon's Reproductive Health Equity Act (HB 3391) protects access; cooperative advocacy seeks parallel reimbursement parity in ORS 414.025.",
    currentStatus: "Workforce active under Reproductive Health Equity Act. Not yet a distinct ORS 414.025 category.",
    populations: ["People experiencing pregnancy loss", "people accessing abortion care", "stillbirth and infant-loss families", "birthparents in adoption"],
    healthDisparityFocus:
      "Equity in reproductive grief and abortion support — currently unfunded for Medicaid members.",
    color: "#e11d48",
  },
  {
    id: "end_of_life_doula",
    title: "End-of-Life Doula",
    abbreviation: "EOLD",
    subtitle: "Death and dying support — advocacy priority",
    rationale:
      "End-of-life doulas provide nonmedical companionship, advance-care-planning support, and bereavement care in the final months of life. Oregon's Death With Dignity Act (ORS 127.800–897) establishes a framework that EOLDs naturally complement. The cooperative seeks ORS 414.025 inclusion to enable Medicaid hospice supplemental reimbursement.",
    currentStatus: "Active workforce; INELDA-certified practitioners statewide. Not yet ORS-recognized.",
    populations: ["Hospice-eligible OHP members", "patients pursuing Death With Dignity", "families navigating bereavement"],
    healthDisparityFocus:
      "Closes the dignified-dying gap for Medicaid members who cannot afford private end-of-life support.",
    color: "#7e22ce",
  },
  {
    id: "gender_doula",
    title: "Gender Doula",
    abbreviation: "GD",
    subtitle: "Gender-affirming care companion — advocacy priority",
    rationale:
      "Gender doulas provide nonmedical support to transgender, nonbinary, and gender-expansive people through social, medical, or surgical transition — including pre-op education, surgical recovery companionship, and family-system navigation. The cooperative is advocating for ORS 414.025 inclusion alongside Oregon's nation-leading gender-affirming care coverage under HB 2002.",
    currentStatus:
      "Emerging workforce. Recognized in some health systems as supportive companions; no ORS 414.025 status and no Medicaid reimbursement pathway.",
    populations: ["Transgender, nonbinary, and gender-expansive Oregonians", "people pursuing gender-affirming surgery", "youth and TAY in social transition", "families of trans youth"],
    healthDisparityFocus:
      "Reduces post-surgical complications and isolation for trans Oregonians whose care is medically covered but emotionally underfunded.",
    color: "#0d9488",
  },
];

export const THW_WORKER_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  THW_WORKER_TYPES.map((t) => [t.id, t.title])
);

/** Returns subtype entries grouped by parent category, plus standalone types separately. */
export function groupedWorkerTypes() {
  const groups = new Map<string, THWWorkerTypeInfo[]>();
  const standalone: THWWorkerTypeInfo[] = [];
  for (const t of THW_WORKER_TYPES) {
    if (t.parentCategory) {
      const list = groups.get(t.parentCategory) ?? [];
      list.push(t);
      groups.set(t.parentCategory, list);
    } else {
      standalone.push(t);
    }
  }
  return { groups, standalone };
}
