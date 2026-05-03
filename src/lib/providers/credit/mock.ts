import { CreditBureauProvider, CreditReport, CreditBureauInput } from "./types";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

export class MockCreditProvider implements CreditBureauProvider {
  async fetchReport(input: CreditBureauInput): Promise<CreditReport> {
    console.log("[MockCredit] Generating mock score for", input.pan.slice(-4));

    await new Promise((resolve) => setTimeout(resolve, 800));

    const scoreHash = hashString(input.pan);
    const score = 550 + (scoreHash % 301); // 550–850

    const scoreCategory =
      score >= 800 ? "Excellent" :
      score >= 750 ? "Good" :
      score >= 700 ? "Fair" :
      score >= 650 ? "Poor" : "Very Poor";

    const onTimeRate = 75 + (scoreHash % 26); // 75–100
    const utilization = 10 + (scoreHash % 51); // 10–60

    const accounts = [
      {
        type: "Home Loan",
        bank: "HDFC Bank",
        accountNumber: "XXXX" + input.pan.slice(5, 9),
        sanctionedAmount: 3500000,
        currentBalance: 2800000,
        status: "Active",
        openDate: "2022-03-15",
        paymentHistory: Array.from({ length: 12 }, () => "On Time"),
      },
      {
        type: "Credit Card",
        bank: "ICICI Bank",
        accountNumber: "XXXX" + input.pan.slice(2, 6),
        sanctionedAmount: 200000,
        currentBalance: Math.round(200000 * (utilization / 100)),
        status: "Active",
        openDate: "2021-08-10",
        paymentHistory: Array.from({ length: 12 }, (_, i) =>
          i === 2 ? "Late" : "On Time"
        ),
      },
      {
        type: "Personal Loan",
        bank: "Axis Bank",
        accountNumber: "XXXX" + input.pan.slice(0, 4),
        sanctionedAmount: 500000,
        currentBalance: 0,
        status: "Closed",
        openDate: "2019-01-20",
        closeDate: "2022-01-20",
        paymentHistory: Array.from({ length: 12 }, () => "On Time"),
      },
    ];

    return {
      score,
      bureau: "mock",
      onTimePaymentRate: onTimeRate,
      creditUtilization: utilization,
      reportData: {
        scoreCategory,
        personalInfo: {
          name: input.name,
          pan: input.pan,
          mobile: input.mobile,
          dateOfBirth: input.dateOfBirth,
        },
        summary: {
          totalAccounts: accounts.length,
          activeAccounts: accounts.filter((a) => a.status === "Active").length,
          closedAccounts: accounts.filter((a) => a.status === "Closed").length,
          totalBalance: accounts.reduce((sum, a) => sum + a.currentBalance, 0),
          totalSanctioned: accounts.reduce((sum, a) => sum + a.sanctionedAmount, 0),
          overdueAccounts: 0,
          recentEnquiries: 2,
        },
        accounts,
        enquiries: [
          { date: "2025-11-15", institution: "Bajaj Finserv", purpose: "Personal Loan" },
          { date: "2025-08-22", institution: "HDFC Bank", purpose: "Credit Card" },
        ],
        reportDate: new Date().toISOString(),
      },
    };
  }
}