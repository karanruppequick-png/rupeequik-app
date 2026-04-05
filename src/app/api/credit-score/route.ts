import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

function generateMockReport(pan: string, name: string, mobile: string, gender: string) {
  // Deterministic score from PAN hash
  let hash = 0;
  for (let i = 0; i < pan.length; i++) {
    hash = (hash * 31 + pan.charCodeAt(i)) & 0x7fffffff;
  }
  const score = 650 + (hash % 201); // 650-850

  const scoreCategory =
    score >= 800 ? "Excellent" :
    score >= 750 ? "Good" :
    score >= 700 ? "Fair" :
    score >= 650 ? "Poor" : "Very Poor";

  const accounts = [
    {
      type: "Home Loan",
      bank: "HDFC Bank",
      accountNumber: "XXXX" + pan.slice(5, 9),
      sanctionedAmount: 3500000,
      currentBalance: 2800000,
      status: "Active",
      openDate: "2022-03-15",
      paymentHistory: ["On Time", "On Time", "On Time", "On Time", "On Time", "On Time",
        "On Time", "On Time", "On Time", "On Time", "On Time", "On Time"],
    },
    {
      type: "Credit Card",
      bank: "ICICI Bank",
      accountNumber: "XXXX" + pan.slice(2, 6),
      sanctionedAmount: 200000,
      currentBalance: 45000,
      status: "Active",
      openDate: "2021-08-10",
      paymentHistory: ["On Time", "On Time", "Late", "On Time", "On Time", "On Time",
        "On Time", "On Time", "On Time", "On Time", "On Time", "On Time"],
    },
    {
      type: "Personal Loan",
      bank: "Axis Bank",
      accountNumber: "XXXX" + pan.slice(0, 4),
      sanctionedAmount: 500000,
      currentBalance: 0,
      status: "Closed",
      openDate: "2019-01-20",
      closeDate: "2022-01-20",
      paymentHistory: ["On Time", "On Time", "On Time", "On Time", "On Time", "On Time",
        "On Time", "On Time", "On Time", "On Time", "On Time", "On Time"],
    },
  ];

  const enquiries = [
    { date: "2025-11-15", institution: "Bajaj Finserv", purpose: "Personal Loan" },
    { date: "2025-08-22", institution: "HDFC Bank", purpose: "Credit Card" },
  ];

  return {
    score,
    scoreCategory,
    personalInfo: {
      name,
      pan,
      mobile,
      gender,
      dateOfBirth: "1990-05-14",
    },
    summary: {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((a) => a.status === "Active").length,
      closedAccounts: accounts.filter((a) => a.status === "Closed").length,
      totalBalance: accounts.reduce((sum, a) => sum + a.currentBalance, 0),
      totalSanctioned: accounts.reduce((sum, a) => sum + a.sanctionedAmount, 0),
      overdueAccounts: 0,
      recentEnquiries: enquiries.length,
    },
    accounts,
    enquiries,
    reportDate: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { mobile, pan, name, gender, consent } = body;

  if (!mobile || !pan || !name || !gender) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (consent !== "Y") {
    return NextResponse.json({ error: "Consent is required to check credit score" }, { status: 400 });
  }

  // Validate PAN format: 5 letters + 4 digits + 1 letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(pan.toUpperCase())) {
    return NextResponse.json({ error: "Invalid PAN format" }, { status: 400 });
  }

  // Rate limit: 1 check per PAN per 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCheck = await prisma.creditCheck.findFirst({
    where: {
      pan: pan.toUpperCase(),
      createdAt: { gte: thirtyDaysAgo },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentCheck) {
    return NextResponse.json({
      report: JSON.parse(recentCheck.reportData),
      cached: true,
      message: "You have already checked your credit score this month. Showing your existing report.",
    });
  }

  // Check admin setting for API mode
  const modeSetting = await prisma.setting.findUnique({ where: { key: "credit_api_mode" } });
  const mode = modeSetting?.value || "mock";

  let report;

  if (mode === "surepass") {
    // Future: Call SurePass API
    const apiKeySetting = await prisma.setting.findUnique({ where: { key: "surepass_api_key" } });
    const apiUrlSetting = await prisma.setting.findUnique({ where: { key: "surepass_api_url" } });

    if (!apiKeySetting?.value || !apiUrlSetting?.value) {
      return NextResponse.json(
        { error: "SurePass API is not configured. Please contact admin." },
        { status: 500 }
      );
    }

    try {
      const res = await fetch(apiUrlSetting.value, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKeySetting.value}`,
        },
        body: JSON.stringify({ mobile, pan: pan.toUpperCase(), name, gender, consent }),
      });

      if (!res.ok) {
        throw new Error(`SurePass API returned ${res.status}`);
      }

      const apiData = await res.json();
      // Transform SurePass response to our format — adjust mapping when integrating
      report = apiData;
    } catch (err) {
      console.error("SurePass API error:", err);
      return NextResponse.json(
        { error: "Failed to fetch credit report from provider. Please try again later." },
        { status: 502 }
      );
    }
  } else {
    report = generateMockReport(pan.toUpperCase(), name, mobile, gender);
  }

  // Link to authenticated user if available
  const authUser = await getAuthUser(request);

  // Save to database
  await prisma.creditCheck.create({
    data: {
      pan: pan.toUpperCase(),
      name,
      mobile,
      gender,
      score: report.score,
      reportData: JSON.stringify(report),
      source: mode,
      ...(authUser ? { userId: authUser.id } : {}),
    },
  });

  return NextResponse.json({ report, cached: false });
}
