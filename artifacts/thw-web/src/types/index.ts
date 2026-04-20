export type ClaimStatus = "draft" | "submitted" | "approved" | "denied" | "appealed";

export type THWWorkerType =
  | "community_health_worker"
  | "peer_support_specialist"
  | "certified_recovery_mentor"
  | "family_support_specialist"
  | "youth_support_specialist"
  | "birth_doula"
  | "postpartum_doula"
  | "abortion_doula"
  | "end_of_life_doula"
  | "personal_health_navigator"
  | "peer_wellness_specialist"
  | "tribal_traditional_health_worker";

export type ServiceCategory =
  | "community_health"
  | "care_coordination"
  | "patient_education"
  | "screening"
  | "mental_health"
  | "substance_use"
  | "chronic_disease"
  | "maternal_child"
  | "youth_support"
  | "family_support"
  | "birth_support"
  | "recovery_support"
  | "navigation"
  | "tribal_health";

export interface CPTCode {
  code: string;
  description: string;
  category: ServiceCategory;
  hedisRelevant: boolean;
  hedisCategory?: string;
  avgReimbursement: number;
  denialRisk: "low" | "medium" | "high";
  billingModel?: "ffs" | "ilos" | "both";
}

export interface ZCode {
  code: string;
  description: string;
  category: ServiceCategory;
  sdohCategory: string;
}

export interface Claim {
  id: string;
  clientId: string;
  clientName: string;
  dateOfService: string;
  createdAt: string;
  updatedAt: string;
  status: ClaimStatus;
  cptCodes: string[];
  zCodes: string[];
  insurancePlan: string;
  billedAmount: number;
  paidAmount?: number;
  denialReason?: string;
  appealNotes?: string;
  notes: string;
  hedisCategories: string[];
  billingModel?: "ffs" | "ilos";
  thwWorkerType?: THWWorkerType;
}

export interface InsurancePlan {
  id: string;
  name: string;
  state: string;
  type: "commercial" | "medicaid" | "medicare" | "marketplace";
  thwCoverage: "full" | "partial" | "none" | "pending";
  coverageStartDate?: string;
  approvedCPTCodes: string[];
  denialRate: number;
  avgProcessingDays: number;
  notes: string;
  contactPhone?: string;
  contactEmail?: string;
  supportsILOS?: boolean;
}

export interface HEDISMeasure {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  description: string;
  currentRate: number;
  targetRate: number;
  nationalAvg: number;
  thwImpact: number;
  trending: "up" | "down" | "stable";
  relatedCPTCodes: string[];
}

export interface ILOSMapping {
  id: string;
  thwService: string;
  thwCPTCode: string;
  thwCostPerVisit: number;
  replacedService: string;
  replacedCostPerVisit: number;
  annualUtilizationPerTHW: number;
  outcomeEquivalence: "superior" | "equivalent" | "comparable";
  outcomeNotes: string;
  hedisCategory: string;
}

export interface ForecastPoint {
  year: number;
  denialRate: number;
  claimVolume: number;
  approvalRate: number;
  thwRecognitionCount: number;
  projectedRevenue: number;

  ffsRevenue: number;
  ffsCostBasis: number;
  ffsROI: number;
  ffsVisitCount: number;
  ffsAvgReimbursement: number;

  ilosAvoidedCost: number;
  ilosCostBasis: number;
  ilosROI: number;
  ilosVisitCount: number;
  ilosAvgAvoidance: number;

  combinedROI: number;
  combinedNetBenefit: number;
}

export interface DenialRecord {
  id: string;
  claimId: string;
  clientName: string;
  insurancePlan: string;
  denialDate: string;
  denialReason: string;
  cptCodes: string[];
  billedAmount: number;
  appealDeadline: string;
  status: "open" | "appealing" | "won" | "lost";
  appealNotes?: string;
}

export interface THWProvider {
  id: string;
  name: string;
  certificationNumber: string;
  certificationExpiry: string;
  specializations: ServiceCategory[];
  county: string;
  state: string;
  activeClaims: number;
  totalClaims: number;
  approvalRate: number;
}