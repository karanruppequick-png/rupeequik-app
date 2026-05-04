import { CreditBureauProvider, CreditReport, CreditBureauInput } from "./types";

interface DecentroConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  moduleSecretKyc: string;
  moduleSecretFinancial: string;
  providerSecret: string;
}

export class DecentroProvider implements CreditBureauProvider {
  private readonly config: DecentroConfig;

  constructor(config: DecentroConfig) {
    this.config = config;
  }

  async fetchReport(input: CreditBureauInput): Promise<CreditReport> {
    console.log("[Decentro] Fetching Equifax credit report for", input.pan.slice(-4));

    if (!input.consent) {
      throw new Error("Consent is required to fetch credit report");
    }

    // Step 1: Get auth token from Decentro
    const tokenResponse = await fetch(`${this.config.baseUrl}/v2/oauth/generate_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        module_secret: this.config.moduleSecretKyc,
        grant_type: "client_credentials",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Decentro auth failed: HTTP ${tokenResponse.status}`);
    }

    const tokenData = (await tokenResponse.json()) as { data?: { access_token?: string } };
    const accessToken = tokenData?.data?.access_token;
    if (!accessToken) {
      throw new Error("Decentro did not return an access token");
    }

    // Step 2: Fetch Equifax credit report
    const reportResponse = await fetch(
      `${this.config.baseUrl}/v2/financial_services/credit/report/equifax`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-id": this.config.clientId,
          "client-secret": this.config.clientSecret,
          "module-secret": this.config.moduleSecretFinancial,
          "provider-secret": this.config.providerSecret,
          "authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: input.name,
          date_of_birth: input.dateOfBirth,
          mobile: input.mobile,
          pan: input.pan,
          consent: "Y",
          purpose: "Credit Assessment for RupeeQuik",
        }),
      }
    );

    if (!reportResponse.ok) {
      let message = `Decentro HTTP ${reportResponse.status}`;
      try {
        const err = (await reportResponse.json()) as Record<string, unknown>;
        message = String(err.response_message ?? err.error ?? message);
      } catch {
        // use default
      }
      throw new Error(message);
    }

    const reportData = (await reportResponse.json()) as {
      response_code?: string;
      response_message?: string;
      data?: {
        score?: number;
        bureau_score?: number;
        equifax_score?: number;
        report?: Record<string, unknown>;
        [key: string]: unknown;
      };
      error?: string;
    };

    if (
      reportData.response_code !== "200" &&
      reportData.response_code !== "SUC001" &&
      reportData.response_code !== "KYC_SUC_001"
    ) {
      const message =
        reportData.response_message ?? reportData.error ?? "Decentro API error";
      throw new Error(message);
    }

    const raw = reportData.data ?? {};

    // Prefer equifax_score, fall back to bureau_score or score
    const score =
      typeof raw.equifax_score === "number"
        ? raw.equifax_score
        : typeof raw.bureau_score === "number"
        ? raw.bureau_score
        : typeof raw.score === "number"
        ? raw.score
        : 0;

    return {
      score,
      bureau: "equifax",
      onTimePaymentRate: raw.onTimePaymentRate as number | undefined,
      creditUtilization: raw.creditUtilization as number | undefined,
      reportData: raw.report as Record<string, unknown> ?? raw,
    };
  }
}
