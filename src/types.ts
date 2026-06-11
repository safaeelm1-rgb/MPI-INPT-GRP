/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BidAnomaly {
  id: string;
  title: string;
  buyer: string;
  region: string;
  budget: number; // in MAD
  date: string;
  sector: string;
  anomalyType: "collusion" | "excessive_conditions" | "underpricing" | "criteria_bias" | "process_delay";
  riskScore: number; // 0 - 100
  status: "RESOLVED" | "CRITICAL" | "UNDER_REVIEW" | "FLAGGED";
  description: string;
  details: string[];
}

export interface PmeProfile {
  id: string;
  name: string;
  sector: string;
  location: string;
  maxCapacity: number; // Max budget in MAD they can bid on
  annualRevenue: number;
  employeeCount: number;
  certified: boolean;
}

export interface MatchingBidSuggestion {
  bidId: string;
  title: string;
  buyer: string;
  budget: number;
  suitabilityScore: number; // 0 - 100
  reasonCount: string;
  reasons: string[];
  keyRequirements: string[];
}

export interface CpsAnalysisResult {
  summary: string;
  overallPmeAccessScore: number; // 0 - 100 (where 100 is fully accessible to PME/TPE)
  restrictiveClauses: Array<{
    id: string;
    text: string;
    category: "Financial Guarantees" | "Required References" | "Certification/Label" | "Technical Criteria";
    severity: "CRITICAL" | "WARNING" | "INFO";
    suggestion: string;
    referenceDecree: string; // references to Moroccan public procurement decree
  }>;
  standardizationSuggestions: Array<{
    originalSnippet: string;
    suggestedAlternative: string;
    benefit: string;
  }>;
  analysisDate: string;
}

export interface MarketStats {
  totalBidsAnalyzed: number;
  totalBudgetMAD: number;
  averageRiskScore: number;
  anomaliesDetectedCount: number;
  pmeInclusionRate: number; // percentage
}
