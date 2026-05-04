import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchOffers, UserMatchProfile } from "@/lib/services/offer-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Check if any personalization data is provided
  const score = searchParams.get("score");
  const income = searchParams.get("income");
  const employmentType = searchParams.get("employmentType");
  const age = searchParams.get("age");
  const loanAmount = searchParams.get("loanAmount");
  const tenureMonths = searchParams.get("tenureMonths");
  const state = searchParams.get("state");
  const cityTier = searchParams.get("cityTier");
  const pincode = searchParams.get("pincode");
  const category = searchParams.get("category");
  const existingEMI = searchParams.get("existingEMI");
  const bureauVintage = searchParams.get("bureauVintage");
  const recentInquiries = searchParams.get("recentInquiries");
  const openLoans = searchParams.get("openLoans");
  const onTimePaymentRate = searchParams.get("onTimePaymentRate");
  const creditUtilization = searchParams.get("creditUtilization");
  const existingCreditCards = searchParams.get("existingCreditCards");
  const employerCategory = searchParams.get("employerCategory");
  const employmentTenure = searchParams.get("employmentTenure");
  const businessVintage = searchParams.get("businessVintage");
  const isNTC = searchParams.get("isNTC");

  const isPersonalized = !!(
    score || income || employmentType || age || loanAmount ||
    existingEMI || bureauVintage || recentInquiries || openLoans ||
    onTimePaymentRate || creditUtilization || existingCreditCards ||
    employerCategory || employmentTenure || businessVintage || isNTC
  );

  if (isPersonalized) {
    const profile: UserMatchProfile = {
      creditScore: score ? parseInt(score) : undefined,
      monthlyIncome: income ? parseInt(income) : undefined,
      employmentType: employmentType || undefined,
      age: age ? parseInt(age) : undefined,
      requestedLoanAmount: loanAmount ? parseInt(loanAmount) : undefined,
      requestedTenureMonths: tenureMonths ? parseInt(tenureMonths) : undefined,
      state: state || undefined,
      cityTier: cityTier || undefined,
      pincode: pincode || undefined,
      category: category || undefined,
      existingEMI: existingEMI ? parseFloat(existingEMI) : undefined,
      bureauVintageMonths: bureauVintage ? parseInt(bureauVintage) : undefined,
      recentInquiries: recentInquiries ? parseInt(recentInquiries) : undefined,
      openLoans: openLoans ? parseInt(openLoans) : undefined,
      onTimePaymentRate: onTimePaymentRate ? parseFloat(onTimePaymentRate) : undefined,
      creditUtilization: creditUtilization ? parseFloat(creditUtilization) : undefined,
      existingCreditCards: existingCreditCards ? parseInt(existingCreditCards) : undefined,
      employerCategory: employerCategory || undefined,
      employmentTenureMonths: employmentTenure ? parseInt(employmentTenure) : undefined,
      businessVintageYears: businessVintage ? parseInt(businessVintage) : undefined,
      isNTC: isNTC === "true" ? true : undefined,
    };

    const matchedOffers = await matchOffers(profile);

    const response = NextResponse.json({
      success: true,
      data: matchedOffers,
      matchStrategy: "personalized",
      totalMatched: matchedOffers.length,
    });

    response.headers.set("X-Match-Strategy", "personalized");
    return response;
  }

  // Generic mode — return all active offers as before
  const where: Record<string, unknown> = { status: "active" };
  if (category) where.category = category;

  const offers = await prisma.offer.findMany({
    where,
    orderBy: { priority: "asc" },
  });

  return NextResponse.json(offers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const offer = await prisma.offer.create({ data: body });

  return NextResponse.json(offer, { status: 201 });
}
