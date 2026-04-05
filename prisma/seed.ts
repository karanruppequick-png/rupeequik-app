import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@rupeequick.com" },
    update: {},
    create: {
      email: "admin@rupeequick.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  // Seed offers
  const offers = [
    {
      title: "Instant Personal Loan",
      category: "personal-loan",
      dsaName: "HDFC Bank",
      description: "Get instant personal loan up to ₹40 Lakhs with minimal documentation. Quick disbursal within 24 hours.",
      interestRate: "10.50% p.a.",
      benefits: "No collateral required, Flexible tenure up to 60 months",
      redirectUrl: "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan",
      status: "active",
      priority: 1,
    },
    {
      title: "Personal Loan for Salaried",
      category: "personal-loan",
      dsaName: "ICICI Bank",
      description: "Avail personal loan starting at attractive interest rates. Pre-approved offers for existing customers.",
      interestRate: "10.75% p.a.",
      benefits: "Zero foreclosure charges, Instant approval",
      redirectUrl: "https://www.icicibank.com/personal-banking/loans/personal-loan",
      status: "active",
      priority: 2,
    },
    {
      title: "Flexi Personal Loan",
      category: "personal-loan",
      dsaName: "Bajaj Finserv",
      description: "Get a personal loan up to ₹35 Lakhs with Flexi facility. Pay interest only on the amount you use.",
      interestRate: "11.00% p.a.",
      benefits: "Flexi loan facility, Part-prepayment option",
      redirectUrl: "https://www.bajajfinserv.in/personal-loan",
      status: "active",
      priority: 3,
    },
    {
      title: "Business Loan for SMEs",
      category: "business-loan",
      dsaName: "Lendingkart",
      description: "Quick business loans up to ₹2 Crore for small and medium businesses. Minimal paperwork required.",
      interestRate: "12.00% p.a.",
      benefits: "No collateral, Quick disbursal in 3 days",
      redirectUrl: "https://www.lendingkart.com/business-loan",
      status: "active",
      priority: 1,
    },
    {
      title: "MSME Business Loan",
      category: "business-loan",
      dsaName: "SBI",
      description: "Government-backed MSME loans with competitive interest rates and longer repayment tenure.",
      interestRate: "9.75% p.a.",
      benefits: "Government subsidy available, Up to 15 years tenure",
      redirectUrl: "https://www.sbi.co.in/web/business/sme",
      status: "active",
      priority: 2,
    },
    {
      title: "Working Capital Loan",
      category: "business-loan",
      dsaName: "Axis Bank",
      description: "Flexible working capital solutions for your business needs with overdraft facility.",
      interestRate: "11.50% p.a.",
      benefits: "Overdraft facility, Revolving credit line",
      redirectUrl: "https://www.axisbank.com/business-banking/loans",
      status: "active",
      priority: 3,
    },
    {
      title: "Amazon Pay ICICI Credit Card",
      category: "credit-card",
      dsaName: "ICICI Bank",
      description: "Earn up to 5% cashback on Amazon purchases. No joining fee for Prime members.",
      interestRate: "",
      benefits: "5% cashback on Amazon, 2% on bill payments, No annual fee",
      redirectUrl: "https://www.icicibank.com/card/credit-card",
      status: "active",
      priority: 1,
    },
    {
      title: "Flipkart Axis Bank Credit Card",
      category: "credit-card",
      dsaName: "Axis Bank",
      description: "Unlimited cashback on Flipkart, Myntra and select merchants. Lifetime free card.",
      interestRate: "",
      benefits: "5% cashback on Flipkart, 4% on preferred merchants",
      redirectUrl: "https://www.axisbank.com/credit-card",
      status: "active",
      priority: 2,
    },
    {
      title: "SBI SimplyCLICK Credit Card",
      category: "credit-card",
      dsaName: "SBI Card",
      description: "10X reward points on online spends with exclusive partner merchants.",
      interestRate: "",
      benefits: "10X rewards online, Welcome gift ₹500, Annual fee ₹499",
      redirectUrl: "https://www.sbicard.com/en/personal/credit-cards",
      status: "active",
      priority: 3,
    },
    {
      title: "Home Loan at Low Rates",
      category: "home-loan",
      dsaName: "SBI",
      description: "India's most trusted home loan provider. Attractive interest rates starting from 8.50% p.a.",
      interestRate: "8.50% p.a.",
      benefits: "Longest tenure up to 30 years, No prepayment penalty",
      redirectUrl: "https://www.sbi.co.in/web/personal-banking/loans/home-loans",
      status: "active",
      priority: 1,
    },
    {
      title: "Home Loan Balance Transfer",
      category: "home-loan",
      dsaName: "HDFC Ltd",
      description: "Transfer your existing home loan to HDFC and save on interest. Top-up facility available.",
      interestRate: "8.70% p.a.",
      benefits: "Save up to ₹5 Lakhs on interest, Free property insurance",
      redirectUrl: "https://www.hdfc.com/home-loan",
      status: "active",
      priority: 2,
    },
    {
      title: "Affordable Home Loan",
      category: "home-loan",
      dsaName: "LIC Housing Finance",
      description: "Home loans for affordable housing segment with government subsidy under PMAY.",
      interestRate: "8.65% p.a.",
      benefits: "PMAY subsidy eligible, Women co-applicant discount",
      redirectUrl: "https://www.lichousing.com",
      status: "active",
      priority: 3,
    },
  ];

  for (const offer of offers) {
    await prisma.offer.create({ data: offer });
  }

  console.log("Seed data created successfully!");
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export {};
