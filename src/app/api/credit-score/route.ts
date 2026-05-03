import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getCreditProvider } from "@/lib/providers/credit";

const CREDIT_RATE_LIMIT_MAX = 3;
const CREDIT_RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { mobile, pan, name, gender, consent } = body;

  if (!mobile || !pan || !name || !gender) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (consent !== "Y" && consent !== true) {
    return NextResponse.json({ error: "Consent is required to check credit score" }, { status: 400 });
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(pan.toUpperCase())) {
    return NextResponse.json({ error: "Invalid PAN format" }, { status: 400 });
  }

  // Rate limit: max 3 checks per phone per 24 hours
  const windowStart = new Date(Date.now() - CREDIT_RATE_LIMIT_WINDOW_MS);
  const recentCount = await prisma.creditCheck.count({
    where: {
      mobile,
      createdAt: { gte: windowStart },
    },
  });

  if (recentCount >= CREDIT_RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Too many credit checks. Please try again after 24 hours." },
      { status: 429 }
    );
  }

  // Check 30-day cache by PAN
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const cachedCheck = await prisma.creditCheck.findFirst({
    where: {
      pan: pan.toUpperCase(),
      createdAt: { gte: thirtyDaysAgo },
    },
    orderBy: { createdAt: "desc" },
  });

  if (cachedCheck) {
    return NextResponse.json({
      report: JSON.parse(cachedCheck.reportData),
      cached: true,
      message: "You have already checked your credit score this month. Showing your existing report.",
    });
  }

  // Log consent
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    null;

  await prisma.consentLog.create({
    data: {
      consentType: "credit_check",
      purpose: "Credit Assessment",
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? null,
    },
  });

  // Get provider from env
  const creditProvider = getCreditProvider();

  const authUser = await getAuthUser(request);

  try {
    const creditReport = await creditProvider.fetchReport({
      name,
      mobile,
      pan: pan.toUpperCase(),
      dateOfBirth: "1990-01-01",
      consent: true,
    });

    // Save to database
    const saved = await prisma.creditCheck.create({
      data: {
        pan: pan.toUpperCase(),
        name,
        mobile,
        gender,
        score: creditReport.score,
        reportData: JSON.stringify(creditReport.reportData),
        source: creditReport.bureau,
        userId: authUser?.id ?? null,
      },
    });

    return NextResponse.json({ report: creditReport.reportData, cached: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch credit report";
    console.error("[credit-score] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}