export interface CreditReport {
  score: number;
  scoreCategory: string;
  bureau: string;
  reportData: Record<string, unknown>;
  onTimePaymentRate?: number;
  creditUtilization?: number;
}

export function getScoreCategory(score: number): string {
  if (score >= 800) return "Excellent";
  if (score >= 750) return "Very Good";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 550) return "Average";
  return "Poor";
}

export interface CreditBureauInput {
  name: string;
  mobile: string;
  pan: string;
  dateOfBirth: string;
  consent: boolean;
  referenceId: string;
  consentPurpose: string;
  inquiryPurpose: string;
  documentType?: string;
  documentId?: string;
}

export interface CreditBureauProvider {
  fetchReport(
    input: CreditBureauInput
  ): Promise<CreditReport>;
}