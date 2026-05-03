import { CreditBureauProvider, CreditReport, CreditBureauInput } from "./types";

interface DecentroConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  moduleSecret: string;
  providerSecret: string;
}

interface DecentroApiResponse {
  response_code?: string;
  response_message?: string;
  data?: {
    score?: number;
    report?: Record<string, unknown>;
    bureau?: string;
    [key: string]: unknown;
  };
  error?: string;
}

export class DecentroProvider implements CreditBureauProvider {
  private readonly config: DecentroConfig;

  constructor(config: DecentroConfig) {
    this.config = config;
  }

  async fetchReport(input: CreditBureauInput): Promise<CreditReport> {
    console.log("[Decentro] Fetching credit report for", input.pan.slice(-4));

    if (!input.consent) {
      throw new Error("Consent is required to fetch credit report");
    }

    const response = await fetch(`${this.config.baseUrl}/v2/kyc/credit_report/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": this.config.clientId,
        "client-secret": this.config.clientSecret,
        "module-secret": this.config.moduleSecret,
        "provider-secret": this.config.providerSecret,
      },
      body: JSON.stringify({
        name: input.name,
        date_of_birth: input.dateOfBirth,
        mobile: input.mobile,
        pan: input.pan,
        consent: "Y",
        purpose: "Credit Assessment",
      }),
    });

    if (!response.ok) {
      let message = `Decentro HTTP ${response.status}`;
      try {
        const err = (await response.json()) as DecentroApiResponse;
        message = err.response_message ?? err.error ?? message;
      } catch {
        // use default message
      }
      throw new Error(message);
    }

    const data = (await response.json()) as DecentroApiResponse;

    if (data.response_code !== "200" && data.response_code !== "SUC001") {
      const message = data.response_message ?? data.error ?? "Decentro API error";
      throw new Error(message);
    }

    const raw = data.data ?? {};
    const score = typeof raw.score === "number" ? raw.score : 0;
    const bureau = typeof raw.bureau === "string" ? raw.bureau : "decentro";

    return {
      score,
      bureau,
      onTimePaymentRate: raw.onTimePaymentRate as number | undefined,
      creditUtilization: raw.creditUtilization as number | undefined,
      reportData: raw.report as Record<string, unknown> ?? raw,
    };
  }
}