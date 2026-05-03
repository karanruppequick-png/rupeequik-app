export interface CreditReport {
  score: number;
  bureau: string;
  reportData: Record<string, unknown>;
  onTimePaymentRate?: number;
  creditUtilization?: number;
}

export interface CreditBureauInput {
  name: string;
  mobile: string;
  pan: string;
  dateOfBirth: string;
  consent: boolean;
}

export interface CreditBureauProvider {
  fetchReport(
    input: CreditBureauInput
  ): Promise<CreditReport>;
}