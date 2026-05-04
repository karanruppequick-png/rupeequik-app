import { prisma } from "@/lib/prisma";

export interface UserMatchProfile {
  creditScore?: number;
  bureauVintageMonths?: number;
  recentInquiries?: number;
  openLoans?: number;
  onTimePaymentRate?: number;
  creditUtilization?: number;
  isNTC?: boolean;
  existingCreditCards?: number;

  monthlyIncome?: number;
  employmentType?: string;
  employmentTenureMonths?: number;
  businessVintageYears?: number;
  employerCategory?: string;
  existingEMI?: number;

  requestedLoanAmount?: number;
  requestedTenureMonths?: number;
  category?: string;

  state?: string;
  cityTier?: string;
  pincode?: string;

  age?: number;
}

export interface MatchedOffer {
  id: string;
  title: string;
  category: string;
  dsaName: string;
  description: string;
  interestRate: string | null;
  benefits: string | null;
  imageUrl: string | null;
  redirectUrl: string;
  status: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  minAge?: number | null;
  maxAge?: number | null;
  minCreditScore?: number | null;
  maxCreditScore?: number | null;
  minBureauVintageMonths?: number | null;
  maxRecentInquiries?: number | null;
  maxOpenLoans?: number | null;
  allowNTCUsers?: boolean;
  minOnTimePaymentRate?: number | null;
  maxCreditUtilization?: number | null;
  minMonthlyIncome?: number | null;
  maxFOIR?: number | null;
  employmentTypes?: string;
  minEmploymentTenureMonths?: number | null;
  minBusinessVintageYears?: number | null;
  employerCategories?: string;
  minLoanAmount?: number | null;
  maxLoanAmount?: number | null;
  minTenureMonths?: number | null;
  maxTenureMonths?: number | null;
  minInterestRate?: number | null;
  maxInterestRate?: number | null;
  processingFeePercent?: number | null;
  isSecured?: boolean;
  collateralType?: string | null;
  allowedStates?: string;
  allowedCityTiers?: string;
  excludedPincodes?: string;
  maxExistingCreditCards?: number | null;
  isNewToCreditFriendly?: boolean;
  isFeatured?: boolean;
  badgeText?: string | null;

  isEligible: boolean;
  preApproved: boolean;
  approvalLikelihood: "very_high" | "high" | "medium" | "low";
  matchScore: number;
  estimatedRate?: string;
}

interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

function checkEligibility(offer: any, profile: UserMatchProfile): EligibilityResult {
  const reasons: string[] = [];

  // Age
  if (profile.age !== undefined && offer.minAge != null) {
    if (profile.age < offer.minAge) reasons.push("Minimum age requirement not met");
  }
  if (profile.age !== undefined && offer.maxAge != null) {
    if (profile.age > offer.maxAge) reasons.push("Maximum age limit exceeded");
  }

  // Credit score
  if (profile.creditScore !== undefined && offer.minCreditScore != null) {
    if (profile.creditScore < offer.minCreditScore) reasons.push("Credit score below minimum required");
  }
  if (profile.creditScore !== undefined && offer.maxCreditScore != null) {
    if (profile.creditScore > offer.maxCreditScore) reasons.push("Score too high for this product");
  }

  // NTC — special case
  if (!offer.allowNTCUsers && profile.isNTC === true) {
    reasons.push("Credit history required for this product");
  }

  // Bureau vintage
  if (profile.bureauVintageMonths !== undefined && offer.minBureauVintageMonths != null) {
    if (profile.bureauVintageMonths < offer.minBureauVintageMonths) reasons.push("Credit history too new");
  }

  // Recent inquiries
  if (profile.recentInquiries !== undefined && offer.maxRecentInquiries != null) {
    if (profile.recentInquiries > offer.maxRecentInquiries) reasons.push("Too many recent credit inquiries");
  }

  // Open loans
  if (profile.openLoans !== undefined && offer.maxOpenLoans != null) {
    if (profile.openLoans > offer.maxOpenLoans) reasons.push("Too many active loans");
  }

  // On-time payment rate
  if (profile.onTimePaymentRate !== undefined && offer.minOnTimePaymentRate != null) {
    if (profile.onTimePaymentRate < offer.minOnTimePaymentRate) reasons.push("Payment history below requirement");
  }

  // Credit utilization
  if (profile.creditUtilization !== undefined && offer.maxCreditUtilization != null) {
    if (profile.creditUtilization > offer.maxCreditUtilization) reasons.push("Credit utilization too high");
  }

  // Income
  if (profile.monthlyIncome !== undefined && offer.minMonthlyIncome != null) {
    if (profile.monthlyIncome < offer.minMonthlyIncome) reasons.push("Monthly income below minimum");
  }

  // FOIR — only check if we have BOTH income AND existingEMI
  if (offer.maxFOIR != null && profile.monthlyIncome != null && profile.existingEMI !== undefined) {
    const foir = (profile.existingEMI / profile.monthlyIncome) * 100;
    if (foir > offer.maxFOIR) reasons.push("Existing obligations too high");
  }

  // Employment type
  const types: string[] = JSON.parse(offer.employmentTypes || "[]");
  if (types.length > 0 && profile.employmentType) {
    if (!types.includes(profile.employmentType)) reasons.push("Employment type not eligible");
  }

  // Employment tenure
  if (profile.employmentTenureMonths !== undefined && offer.minEmploymentTenureMonths != null) {
    if (profile.employmentTenureMonths < offer.minEmploymentTenureMonths) reasons.push("Insufficient time in current job");
  }

  // Business vintage
  if (profile.businessVintageYears !== undefined && offer.minBusinessVintageYears != null) {
    if (profile.businessVintageYears < offer.minBusinessVintageYears) reasons.push("Business too new");
  }

  // Employer category
  const cats: string[] = JSON.parse(offer.employerCategories || "[]");
  if (cats.length > 0 && !cats.includes("any") && profile.employerCategory) {
    if (!cats.includes(profile.employerCategory)) reasons.push("Employer type not eligible");
  }

  // Loan amount
  if (profile.requestedLoanAmount !== undefined && offer.minLoanAmount != null) {
    if (profile.requestedLoanAmount < offer.minLoanAmount) reasons.push("Requested amount below minimum");
  }
  if (profile.requestedLoanAmount !== undefined && offer.maxLoanAmount != null) {
    if (profile.requestedLoanAmount > offer.maxLoanAmount) reasons.push("Requested amount exceeds maximum");
  }

  // Geography — states
  const states: string[] = JSON.parse(offer.allowedStates || "[]");
  if (states.length > 0 && profile.state) {
    if (!states.includes(profile.state)) reasons.push("Not available in your state");
  }

  // Geography — city tiers
  const tiers: string[] = JSON.parse(offer.allowedCityTiers || "[]");
  if (tiers.length > 0 && profile.cityTier) {
    if (!tiers.includes(profile.cityTier)) reasons.push("Not available in your city tier");
  }

  // Geography — excluded pincodes
  const excluded: string[] = JSON.parse(offer.excludedPincodes || "[]");
  if (excluded.length > 0 && profile.pincode) {
    if (excluded.includes(profile.pincode)) reasons.push("Not available in your area");
  }

  // Credit cards
  if (profile.existingCreditCards !== undefined && offer.maxExistingCreditCards != null) {
    if (profile.existingCreditCards > offer.maxExistingCreditCards) reasons.push("Too many existing credit cards");
  }

  return { eligible: reasons.length === 0, reasons };
}

function calculateMatchScore(offer: any, profile: UserMatchProfile): number {
  let score = 50;

  // Credit score buffer above minimum
  if (profile.creditScore !== undefined && offer.minCreditScore != null) {
    const buffer = profile.creditScore - offer.minCreditScore;
    if (buffer >= 100) score += 20;
    else if (buffer >= 50) score += 12;
    else if (buffer >= 0) score += 5;
  }

  // Income buffer above minimum
  if (profile.monthlyIncome !== undefined && offer.minMonthlyIncome != null) {
    const ratio = profile.monthlyIncome / offer.minMonthlyIncome;
    if (ratio >= 2) score += 15;
    else if (ratio >= 1.5) score += 8;
    else if (ratio >= 1) score += 3;
  }

  // Lender priority
  if (offer.priority <= 3) score += 10;
  else if (offer.priority <= 5) score += 5;

  // NTC friendly bonus
  if (profile.isNTC && offer.isNewToCreditFriendly) score += 10;

  // Good FOIR
  if (profile.monthlyIncome != null && profile.existingEMI !== undefined) {
    const foir = (profile.existingEMI / profile.monthlyIncome) * 100;
    if (foir < 30) score += 8;
    else if (foir < 40) score += 4;
  }

  return Math.min(100, Math.max(0, score));
}

export async function matchOffers(profile: UserMatchProfile): Promise<MatchedOffer[]> {
  const whereClause = profile.category ? { status: "active", category: profile.category } : { status: "active" };

  const offers = await prisma.offer.findMany({ where: whereClause });

  // Part A — eligibility check
  const eligible: any[] = [];
  const ineligible: any[] = [];

  for (const offer of offers) {
    const result = checkEligibility(offer, profile);
    if (result.eligible) {
      eligible.push(offer);
    } else {
      ineligible.push({ offer, reasons: result.reasons });
    }
  }

  // Part B — scoring (eligible only)
  for (const offer of eligible) {
    (offer as any)._matchScore = calculateMatchScore(offer, profile);
  }

  // Part C — sort eligible by matchScore DESC, priority ASC, rate ASC
  eligible.sort((a: any, b: any) => {
    if (b._matchScore !== a._matchScore) return b._matchScore - a._matchScore;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return (a.interestRate || "999").localeCompare(b.interestRate || "999");
  });

  // Part D — fallback: fill to min 3 with universal offers
  if (eligible.length < 3) {
    const universalOffers = await prisma.offer.findMany({
      where: {
        status: "active",
        minCreditScore: null,
        minMonthlyIncome: null,
        employmentTypes: "[]",
        ...(profile.category ? { category: profile.category } : {}),
      },
    });

    for (const offer of universalOffers) {
      if (eligible.length >= 3) break;
      const alreadyIncluded = eligible.some((e) => e.id === offer.id);
      if (!alreadyIncluded) {
        (offer as any)._matchScore = 30;
        eligible.push(offer);
      }
    }
  }

  // Part E — assemble MatchedOffer objects
  const result: MatchedOffer[] = eligible.map((offer: any) => {
    const matchScore = offer._matchScore;

    // Pre-approved check
    const preApproved =
      profile.creditScore !== undefined &&
      profile.creditScore >= 750 &&
      offer.minCreditScore != null &&
      profile.creditScore > offer.minCreditScore + 80;

    // Approval likelihood
    let approvalLikelihood: "very_high" | "high" | "medium" | "low";
    if (matchScore >= 85) approvalLikelihood = "very_high";
    else if (matchScore >= 70) approvalLikelihood = "high";
    else if (matchScore >= 55) approvalLikelihood = "medium";
    else approvalLikelihood = "low";

    // Estimated rate
    let estimatedRate: string | undefined;
    if (offer.minInterestRate != null && offer.maxInterestRate != null && profile.creditScore !== undefined) {
      const scoreRatio = (profile.creditScore - 300) / 600;
      const estimatedMin = offer.maxInterestRate - scoreRatio * (offer.maxInterestRate - offer.minInterestRate);
      const estimatedMax = estimatedMin + 2;
      estimatedRate = `${estimatedMin.toFixed(1)}% - ${estimatedMax.toFixed(1)}%`;
    }

    return {
      ...offer,
      isEligible: true,
      preApproved,
      approvalLikelihood,
      matchScore,
      estimatedRate,
    };
  });

  return result;
}