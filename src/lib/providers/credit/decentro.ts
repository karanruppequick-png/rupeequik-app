import { CreditBureauProvider, CreditReport, CreditBureauInput, getScoreCategory } from "./types";

interface DecentroConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  moduleSecretFinancial: string;
  providerSecret: string;
}

interface DecentroResponse {
  response_code?: string;
  response_message?: string;
  data?: {
    cCRResponse?: {
      status?: string;
      cIRReportDataLst?: {
        error?: { errorCode?: string; errorDesc?: string };
        cIRReportData?: {
          iDAndContactInfo?: {
            personalInfo?: {
              name?: { fullName?: string; firstName?: string; middleName?: string; lastName?: string };
              dateOfBirth?: string;
              gender?: string;
              age?: { age?: string };
              occupation?: string;
            };
            identityInfo?: {
              pANId?: { seq?: string; reportedDate?: string; idNumber?: string }[];
              passport?: { seq?: string; reportedDate?: string; idNumber?: string }[];
              driverLicense?: { seq?: string; reportedDate?: string; idNumber?: string }[];
              nationalIDCard?: { seq?: string; reportedDate?: string; idNumber?: string }[];
              voterId?: { seq?: string; reportedDate?: string; idNumber?: string }[];
              rationCard?: { seq?: string; reportedDate?: string; idNumber?: string }[];
              otherId?: { seq?: string; reportedDate?: string; idNumber?: string }[];
            };
            addressInfo?: {
              seq?: string;
              reportedDate?: string;
              address?: string;
              state?: string;
              postal?: string;
              type?: string;
            }[];
            phoneInfo?: {
              seq?: string;
              reportedDate?: string;
              typeCode?: string;
              number?: string;
            }[];
            emailAddressInfo?: {
              seq?: string;
              reportedDate?: string;
              emailAddress?: string;
            }[];
          };
          retailAccountsSummary?: {
            noOfAccounts?: string;
            noOfActiveAccounts?: string;
            noOfWriteOffs?: string;
            totalPastDue?: string;
            totalBalanceAmount?: string;
            totalSanctionAmount?: string;
            totalCreditLimit?: string;
            noOfPastDueAccounts?: string;
            recentAccount?: string;
            oldestAccount?: string;
            totalMonthlyPaymentAmount?: string;
            singleHighestCredit?: string;
            singleHighestSanctionAmount?: string;
            totalHighCredit?: string;
            averageOpenBalance?: string;
            singleHighestBalance?: string;
            noOfZeroBalanceAccounts?: string;
          };
          scoreDetails?: {
            type?: string;
            version?: string;
            name?: string;
            value?: string | number;
            scoringElements?: {
              type?: string;
              seq?: string;
              code?: string;
              description?: string;
            }[];
          }[];
          otherKeyInd?: {
            ageOfOldestTrade?: string;
            numberOfOpenTrades?: string;
            allLinesEVERWritten?: string;
            allLinesEVERWrittenIn9Months?: string;
            allLinesEVERWrittenIn6Months?: string;
          };
          recentActivities?: {
            accountsDeliquent?: string;
            accountsOpened?: string;
            totalInquiries?: string;
            accountsUpdated?: string;
          };
        };
      }[];
    };
    reportOrderNumber?: string;
    [key: string]: unknown;
  };
  decentroTxnId?: string;
  status?: string;
  error?: string;
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

    const reportResponse = await fetch(
      `${this.config.baseUrl}/v2/financial_services/credit_bureau/credit_report/summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client_id": this.config.clientId,
          "client_secret": this.config.clientSecret,
          "module_secret": this.config.moduleSecretFinancial,
          "provider_secret": this.config.providerSecret,
        },
        body: JSON.stringify({
          reference_id: input.referenceId,
          consent: input.consent,
          consent_purpose: input.consentPurpose,
          name: input.name,
          mobile: input.mobile,
          inquiry_purpose: input.inquiryPurpose,
          date_of_birth: input.dateOfBirth,
          document_type: input.documentType ?? "PAN",
          document_id: input.documentId ?? input.pan,
        }),
      }
    );

    if (!reportResponse.ok) {
      let message = `Decentro HTTP ${reportResponse.status}`;
      try {
        const err = (await reportResponse.json()) as Record<string, unknown>;
        message = String(err.response_message ?? err.error ?? err.response_code ?? message);
      } catch {
        // use default
      }
      throw new Error(message);
    }

    const reportData = (await reportResponse.json()) as DecentroResponse;

    // S00000 = success, E00000 = success with data, E* = failure
    const code = reportData.response_code ?? "";
    if (code.startsWith("E") && code !== "E00000") {
      throw new Error(reportData.response_message ?? reportData.error ?? "Decentro API error");
    }

    const raw = reportData.data ?? {};
    const cCRResponse = raw.cCRResponse;
    const reportList = cCRResponse?.cIRReportDataLst;
    const firstReport = reportList?.[0];

    // Check for bureau-level errors (e.g., "Consumer not found in bureau")
    if (firstReport?.error) {
      const bureauErr = firstReport.error;
      if (bureauErr.errorCode && bureauErr.errorCode !== "00" && bureauErr.errorCode !== "1") {
        return {
          score: 0,
          scoreCategory: getScoreCategory(0),
          bureau: "equifax",
          reportData: {
            error: bureauErr.errorDesc ?? "Consumer not found in bureau",
            reportOrderNumber: raw.reportOrderNumber,
          },
        };
      }
    }

    const cirData = firstReport?.cIRReportData;

    // Extract score
    const scoreDetails = cirData?.scoreDetails;
    const firstScore = scoreDetails?.[0];
    const rawScore = firstScore?.value;
    const score = typeof rawScore === "number"
      ? rawScore
      : rawScore !== undefined
      ? parseInt(String(rawScore), 10)
      : 0;

    // Extract personal info
    const personalInfo = cirData?.iDAndContactInfo?.personalInfo;
    const nameData = personalInfo?.name;
    const fullName = nameData?.fullName?.trim()
      ?? [nameData?.firstName, nameData?.middleName, nameData?.lastName].filter(Boolean).join(" ")
      ?? input.name;

    // Extract account summary
    const summary = cirData?.retailAccountsSummary;
    const toNum = (val: string | undefined) => (val ? parseInt(val, 10) : 0);

    // Extract scoring elements (why the score)
    const scoringElements = scoreDetails?.[0]?.scoringElements ?? [];

    // Extract recent activities
    const recent = cirData?.recentActivities;
    const otherInd = cirData?.otherKeyInd;
    const addressInfo = cirData?.iDAndContactInfo?.addressInfo;
    const emailInfo = cirData?.iDAndContactInfo?.emailAddressInfo;

    // Build flat reportData matching what the page expects
    const reportDataFlat = {
      scoreCategory: getScoreCategory(score),
      personalInfo: {
        name: fullName,
        pan: input.pan,
        mobile: input.mobile,
        dateOfBirth: personalInfo?.dateOfBirth ?? input.dateOfBirth,
        gender: personalInfo?.gender ?? "",
        age: personalInfo?.age?.age ? parseInt(personalInfo.age.age, 10) : undefined,
        occupation: personalInfo?.occupation,
        addresses: (addressInfo ?? []).map(a => ({
          address: a.address ?? "",
          state: a.state ?? "",
          postal: a.postal ?? "",
          type: a.type ?? "",
        })),
        email: emailInfo?.[0]?.emailAddress ?? undefined,
      },
      summary: {
        totalAccounts: toNum(summary?.noOfAccounts),
        activeAccounts: toNum(summary?.noOfActiveAccounts),
        closedAccounts: toNum(summary?.noOfAccounts) - toNum(summary?.noOfActiveAccounts),
        totalBalance: toNum(summary?.totalBalanceAmount),
        totalSanctioned: toNum(summary?.totalSanctionAmount),
        totalCreditLimit: toNum(summary?.totalCreditLimit),
        totalPastDue: parseFloat(summary?.totalPastDue ?? "0"),
        overdueAccounts: toNum(summary?.noOfPastDueAccounts),
        recentInquiries: toNum(recent?.totalInquiries),
        monthlyPayment: parseFloat(summary?.totalMonthlyPaymentAmount ?? "0"),
        oldestTradeAge: toNum(otherInd?.ageOfOldestTrade),
        openTrades: toNum(otherInd?.numberOfOpenTrades),
        allLinesWritten: parseFloat(otherInd?.allLinesEVERWritten ?? "0"),
        oldestAccountAge: summary?.oldestAccount,
        recentAccountAge: summary?.recentAccount,
      },
      // accounts / enquiries will be empty for now — populated from detailed report if needed
      accounts: [],
      enquiries: [],
      scoringElements: scoringElements.map((el) => ({
        code: el.code ?? "",
        description: el.description ?? "",
      })),
      reportDate: new Date().toISOString(),
    };

    return {
      score,
      scoreCategory: getScoreCategory(score),
      bureau: "equifax",
      onTimePaymentRate: undefined,
      creditUtilization: undefined,
      reportData: reportDataFlat,
    };
  }
}