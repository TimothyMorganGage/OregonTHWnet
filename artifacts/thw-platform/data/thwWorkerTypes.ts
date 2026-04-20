/**
 * Oregon Traditional Health Worker Types
 *
 * Sources:
 *   - ORS 414.025 (statutory definitions)
 *   - OAR 410-180-0305 (administrative rules)
 *   - OHA THW Registry: https://traditionalhealthworkerregistry.oregon.gov
 *   - Oregon Traditional Health Workers Commission (ORS 413.600)
 *
 * Eight types are recognized under Oregon law. Peer Support Specialists and
 * Peer Wellness Specialists each have OHA-recognized subtypes:
 *   Adult Mental Health | Adult Addictions | Family Support | Youth Support
 * Certified Recovery Mentor (CRM) is an OHA specialization within PSS.
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
  subtype?: string;
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
  },
  {
    id: "peer_support_specialist",
    title: "Peer Support Specialist",
    abbreviation: "PSS",
    subtitle: "Lived-experience mental health & addiction recovery support",
    description:
      "An individual who provides supportive services to a current or former consumer of mental health or addiction treatment services. PSS workers draw on their own lived experience of recovery to offer hope, mentorship, and practical support. OHA subtypes: Adult Mental Health, Adult Addictions, Family Support, Youth Support. Certified Recovery Mentor (CRM) is an OHA-recognized specialization within this category for individuals in addiction recovery.",
    legalBasis: "ORS 414.025(21); OAR 410-180-0305(11)",
    populations: ["Adults with mental health diagnoses", "individuals in addiction recovery", "justice-involved individuals", "veterans"],
    cptCodes: ["H0038", "H0025", "99484", "96152", "T1016"],
    zCodes: ["Z81.1", "Z86.59", "Z87.891", "Z91.19"],
    hedisCategories: ["Behavioral Health Integration", "Substance Use Disorder Treatment", "Transitions of Care"],
    ilosEligible: true,
    certifyingBody: "Mental Health & Addiction Certification Board of Oregon (MHACBO)",
    registryUrl: "https://traditionalhealthworkerregistry.oregon.gov",
    color: "#7c3aed",
    sdohFocus: ["Recovery capital", "Stable housing", "Criminal legal involvement", "Social isolation", "Employment"],
    subtype: "Adult Mental Health | Adult Addictions | Certified Recovery Mentor (CRM)",
  },
  {
    id: "peer_wellness_specialist",
    title: "Peer Wellness Specialist",
    abbreviation: "PWS",
    subtitle: "Integrated behavioral & primary care peer support",
    description:
      "An individual who has lived experience with a psychiatric condition plus intensive training. Works as part of a person-driven health home team, integrating behavioral health and primary care to assist and advocate for individuals in achieving whole-person well-being. Distinct from PSS in its focus on health homes and psychiatric conditions.",
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
    subtype: "Adult Mental Health | Adult Addictions",
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
  },
  {
    id: "birth_doula",
    title: "Birth Doula",
    abbreviation: "BD",
    subtitle: "Pregnancy, birth & postpartum support",
    description:
      "A birth companion who provides personal, nonmedical support to individuals and families throughout pregnancy, childbirth, and postpartum experience. Oregon Medicaid (OHP) covers doula services under OAR 410-130-0530, recognizing their proven impact in reducing C-section rates, preterm birth, and maternal morbidity—particularly for BIPOC birthing people who face disproportionate rates of maternal mortality.",
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
  },
  {
    id: "family_support_specialist",
    title: "Family Support Specialist",
    abbreviation: "FSS",
    subtitle: "Caregiver peer support — children with MH/SUD history",
    description:
      "An individual who, based on similar life experiences, provides support services to and has experience parenting a child who is a current or former consumer of mental health or addiction treatment, or who faces difficulties accessing education, health, and wellness services due to behavioral health barriers. May be either a PSS or PWS meeting additional FSS qualification criteria.",
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
  },
  {
    id: "youth_support_specialist",
    title: "Youth Support Specialist",
    abbreviation: "YSS",
    subtitle: "Lived-experience peer support for youth",
    description:
      "An individual who, based on similar lived experience, provides supportive services to a youth facing or who has faced difficulties accessing education, health, and wellness services due to mental health or behavioral health barriers. Must themselves be a current or former consumer of those services. May be either a PSS or PWS meeting YSS qualification criteria.",
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
  },
];

export const THW_WORKER_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  THW_WORKER_TYPES.map(t => [t.id, t.title])
);
