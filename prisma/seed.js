const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@rupeequick.com" },
    update: {},
    create: { email: "admin@rupeequick.com", password: hashedPassword, name: "Admin" },
  });

  const offers = [
    { title: "Instant Personal Loan", category: "personal-loan", dsaName: "HDFC Bank", description: "Get instant personal loan up to 40 Lakhs with minimal documentation. Quick disbursal within 24 hours.", interestRate: "10.50%", benefits: "No collateral required, Flexible tenure up to 60 months", redirectUrl: "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan", status: "active", priority: 1 },
    { title: "Personal Loan for Salaried", category: "personal-loan", dsaName: "ICICI Bank", description: "Avail personal loan starting at attractive interest rates. Pre-approved offers for existing customers.", interestRate: "10.25%", benefits: "Zero foreclosure charges, Instant approval", redirectUrl: "https://www.icicibank.com/personal-banking/loans/personal-loan", status: "active", priority: 2 },
    { title: "Flexi Personal Loan", category: "personal-loan", dsaName: "Bajaj Finserv", description: "Get a personal loan up to 35 Lakhs with Flexi facility.", interestRate: "11.00%", benefits: "Flexi loan facility, Part-prepayment option", redirectUrl: "https://www.bajajfinserv.in/personal-loan", status: "active", priority: 3 },
    { title: "Quick Personal Loan", category: "personal-loan", dsaName: "Axis Bank", description: "Personal loan up to 15 Lakhs in just 15 minutes. Completely digital process.", interestRate: "10.75%", benefits: "Quick approval in 36 hours, Flexible repayment", redirectUrl: "https://www.axisbank.com/retail/loans/personal-loan", status: "active", priority: 4 },
    { title: "SBI Personal Loan", category: "personal-loan", dsaName: "SBI Bank", description: "Trusted personal loans from India's largest bank.", interestRate: "10.80%", benefits: "Longest tenure up to 72 months, Low processing fee", redirectUrl: "https://www.sbi.co.in/web/personal-banking/loans/personal-loans", status: "active", priority: 5 },
    { title: "Business Loan for SMEs", category: "business-loan", dsaName: "HDFC Bank", description: "Quick business loans up to 50 Lakhs for small and medium businesses.", interestRate: "12.00%", benefits: "No collateral, Quick disbursal in 3 days", redirectUrl: "https://www.hdfcbank.com/sme/borrow", status: "active", priority: 1 },
    { title: "MSME Business Loan", category: "business-loan", dsaName: "ICICI Bank", description: "Government-backed MSME loans with competitive interest rates.", interestRate: "9.75%", benefits: "Government subsidy available, Up to 15 years tenure", redirectUrl: "https://www.icicibank.com/business-banking", status: "active", priority: 2 },
    { title: "Working Capital Loan", category: "business-loan", dsaName: "Axis Bank", description: "Flexible working capital solutions for your business needs.", interestRate: "11.50%", benefits: "Overdraft facility, Revolving credit line", redirectUrl: "https://www.axisbank.com/business-banking/loans", status: "active", priority: 3 },
    { title: "SBI Business Loan", category: "business-loan", dsaName: "SBI Bank", description: "Affordable business loans with competitive rates from SBI.", interestRate: "10.80%", benefits: "Low processing fee, Long tenure options", redirectUrl: "https://www.sbi.co.in/web/business", status: "active", priority: 4 },
    { title: "Bajaj Business Loan", category: "business-loan", dsaName: "Bajaj Finserv", description: "Collateral-free business loan up to 80 Lakhs.", interestRate: "11.00%", benefits: "No collateral, Flexi facility available", redirectUrl: "https://www.bajajfinserv.in/business-loan", status: "active", priority: 5 },
    { title: "Amazon Pay ICICI Credit Card", category: "credit-card", dsaName: "ICICI Bank", description: "Earn up to 5% cashback on Amazon purchases.", interestRate: "", benefits: "5% cashback on Amazon, 2% on bill payments, No annual fee", redirectUrl: "https://www.icicibank.com/card/credit-card", status: "active", priority: 1 },
    { title: "Flipkart Axis Bank Credit Card", category: "credit-card", dsaName: "Axis Bank", description: "Unlimited cashback on Flipkart, Myntra and select merchants.", interestRate: "", benefits: "5% cashback on Flipkart, 4% on preferred merchants", redirectUrl: "https://www.axisbank.com/credit-card", status: "active", priority: 2 },
    { title: "HDFC Regalia Gold Credit Card", category: "credit-card", dsaName: "HDFC Bank", description: "Premium credit card with travel and lifestyle benefits.", interestRate: "", benefits: "5X rewards on travel, Unlimited lounge access", redirectUrl: "https://www.hdfcbank.com/personal/pay/cards/credit-cards", status: "active", priority: 3 },
    { title: "SBI SimplyCLICK Credit Card", category: "credit-card", dsaName: "SBI Card", description: "10X reward points on online spends.", interestRate: "", benefits: "10X rewards online, Welcome gift Rs.500", redirectUrl: "https://www.sbicard.com", status: "active", priority: 4 },
    { title: "HDFC Millennia Credit Card", category: "credit-card", dsaName: "HDFC Bank", description: "Cashback on all online spends and smart buy offers.", interestRate: "", benefits: "5% cashback online, 1% offline, No annual fee first year", redirectUrl: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia", status: "active", priority: 5 },
    { title: "Home Loan at Low Rates", category: "home-loan", dsaName: "SBI Bank", description: "India's most trusted home loan provider. Rates from 8.50%.", interestRate: "8.50%", benefits: "Tenure up to 30 years, No prepayment penalty", redirectUrl: "https://www.sbi.co.in/web/personal-banking/loans/home-loans", status: "active", priority: 1 },
    { title: "Home Loan Balance Transfer", category: "home-loan", dsaName: "HDFC Bank", description: "Transfer your home loan to HDFC and save on interest.", interestRate: "8.70%", benefits: "Save up to 5 Lakhs, Free property insurance", redirectUrl: "https://www.hdfc.com/home-loan", status: "active", priority: 2 },
    { title: "Affordable Home Loan", category: "home-loan", dsaName: "ICICI Bank", description: "Home loans for affordable housing with PMAY subsidy.", interestRate: "8.65%", benefits: "PMAY subsidy eligible, Women co-applicant discount", redirectUrl: "https://www.icicibank.com/home-loan", status: "active", priority: 3 },
    { title: "Axis Home Loan", category: "home-loan", dsaName: "Axis Bank", description: "Quick home loan approvals with attractive rates.", interestRate: "8.75%", benefits: "Quick approval, Flexible EMI options", redirectUrl: "https://www.axisbank.com/retail/loans/home-loan", status: "active", priority: 4 },
    { title: "Kotak Home Loan", category: "home-loan", dsaName: "Kotak Mahindra Bank", description: "Home loans with doorstep service and quick processing.", interestRate: "8.80%", benefits: "Doorstep service, Balance transfer facility", redirectUrl: "https://www.kotak.com/en/personal-banking/loans/home-loan.html", status: "active", priority: 5 },
  ];

  for (const offer of offers) {
    await prisma.offer.create({ data: offer });
  }
  console.log("Seed completed! Admin: admin@rupeequick.com / admin123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
