import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const personalLoans = [
      {
        title: 'HDFC Bank',
        category: 'personal-loan',
        dsaName: 'HDFC Bank',
        description: 'Personal Loan for all your needs',
        interestRate: '10.50%',
        cashback: '₹2,000',
        maxAmount: '₹50 Lakhs',
        tenure: '5 Years',
        processingFee: 'Up to 2%',
        emi: '16,134',
        bgLogo: 'bg-blue-100 text-blue-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 24 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=hdfc',
        priority: 1
      },
      {
        title: 'ICICI Bank',
        category: 'personal-loan',
        dsaName: 'ICICI Bank',
        description: 'Instant Personal Loan',
        interestRate: '10.25%',
        cashback: '₹1,500',
        maxAmount: '₹40 Lakhs',
        tenure: '4 Years',
        processingFee: 'Up to 1.5%',
        emi: '15,000',
        bgLogo: 'bg-orange-100 text-orange-600',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 48 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=icici',
        priority: 2
      },
      {
        title: 'Axis Bank',
        category: 'personal-loan',
        dsaName: 'Axis Bank',
        description: 'Fast Personal Loan',
        interestRate: '10.75%',
        cashback: '₹2,500',
        maxAmount: '₹60 Lakhs',
        tenure: '6 Years',
        processingFee: 'Up to 1.75%',
        emi: '16,500',
        bgLogo: 'bg-red-100 text-red-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 36 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=axis',
        priority: 3
      },
      {
        title: 'SBI Bank',
        category: 'personal-loan',
        dsaName: 'SBI Bank',
        description: 'Reliable Personal Loan',
        interestRate: '10.80%',
        cashback: '₹1,000',
        maxAmount: '₹75 Lakhs',
        tenure: '7 Years',
        processingFee: 'Up to 1%',
        emi: '17,000',
        bgLogo: 'bg-indigo-100 text-indigo-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 72 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=sbi',
        priority: 4
      }
    ];

    const businessLoans = [
      {
        title: 'HDFC Bank',
        category: 'business-loan',
        dsaName: 'HDFC Bank',
        description: 'Business Loan for Growth',
        interestRate: '11.25%',
        cashback: '₹2,000',
        maxAmount: '₹50 Lakhs',
        tenure: '5 Years',
        processingFee: 'Up to 2%',
        emi: '16,134',
        bgLogo: 'bg-blue-100 text-blue-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 24 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=hdfc',
        priority: 1
      },
      {
        title: 'ICICI Bank',
        category: 'business-loan',
        dsaName: 'ICICI Bank',
        description: 'Expand your business',
        interestRate: '11.50%',
        cashback: '₹1,500',
        maxAmount: '₹40 Lakhs',
        tenure: '4 Years',
        processingFee: 'Up to 1.5%',
        emi: '15,000',
        bgLogo: 'bg-orange-100 text-orange-600',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 48 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=icici',
        priority: 2
      },
      {
        title: 'Axis Bank',
        category: 'business-loan',
        dsaName: 'Axis Bank',
        description: 'Capital for Business',
        interestRate: '11.75%',
        cashback: '₹2,500',
        maxAmount: '₹60 Lakhs',
        tenure: '6 Years',
        processingFee: 'Up to 1.75%',
        emi: '16,500',
        bgLogo: 'bg-red-100 text-red-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 36 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=axis',
        priority: 3
      },
      {
        title: 'SBI Bank',
        category: 'business-loan',
        dsaName: 'SBI Bank',
        description: 'Grow your venture',
        interestRate: '11.45%',
        cashback: '₹1,000',
        maxAmount: '₹75 Lakhs',
        tenure: '7 Years',
        processingFee: 'Up to 1%',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 72 Hours,Flexible Repayment Options',
        emi: '17,000',
        bgLogo: 'bg-indigo-100 text-indigo-700',
        redirectUrl: '/apply?bank=sbi',
        priority: 4
      }
    ];

    const homeLoans = [
      {
        title: 'HDFC Bank',
        category: 'home-loan',
        dsaName: 'HDFC Bank',
        description: 'Home Loan for Dream House',
        interestRate: '8.75%',
        cashback: '₹2,000',
        maxAmount: '₹2 Crores',
        tenure: '20 Years',
        processingFee: 'Up to 0.5%',
        emi: '17,674',
        bgLogo: 'bg-blue-100 text-blue-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 24 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=hdfc',
        priority: 1
      },
      {
        title: 'ICICI Bank',
        category: 'home-loan',
        dsaName: 'ICICI Bank',
        description: 'Own your home today',
        interestRate: '8.85%',
        cashback: '₹1,500',
        maxAmount: '₹3 Crores',
        tenure: '25 Years',
        processingFee: 'Up to 0.5%',
        emi: '16,500',
        bgLogo: 'bg-orange-100 text-orange-600',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 48 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=icici',
        priority: 2
      },
      {
        title: 'Axis Bank',
        category: 'home-loan',
        dsaName: 'Axis Bank',
        description: 'Easy Home Loans',
        interestRate: '8.90%',
        cashback: '₹2,500',
        maxAmount: '₹5 Crores',
        tenure: '30 Years',
        processingFee: 'Up to 0.75%',
        emi: '16,134',
        bgLogo: 'bg-red-100 text-red-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 36 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=axis',
        priority: 3
      },
      {
        title: 'SBI Bank',
        category: 'home-loan',
        dsaName: 'SBI Bank',
        description: 'Best rates for Home Loans',
        interestRate: '8.55%',
        cashback: '₹1,000',
        maxAmount: '₹10 Crores',
        tenure: '30 Years',
        processingFee: 'Up to 0.35%',
        emi: '15,000',
        bgLogo: 'bg-indigo-100 text-indigo-700',
        benefits: '100% Digital Process,Minimal Documentation,Quick Approval in 72 Hours,Flexible Repayment Options',
        redirectUrl: '/apply?bank=sbi',
        priority: 4
      }
    ];

    const creditCards = [
      {
        title: 'HDFC Regalia Gold Credit Card',
        category: 'credit-card',
        dsaName: 'HDFC Bank',
        description: 'Travel and Lifestyle Rewards',
        bgLogo: 'bg-[#1e1b4b]',
        benefits: 'Earn 20 Reward points on every ₹150 spent,Exclusive lounge access with free priority pass,Earn 5X value back on select premium brands,Joining Fees: ₹2,500 + Taxes,Annual/Renewal Fee: ₹2,500 + Taxes',
        redirectUrl: '/apply?card=hdfc-regalia-gold',
        priority: 1
      },
      {
        title: 'SBI AURUM Credit Card',
        category: 'credit-card',
        dsaName: 'SBI Bank',
        description: 'Luxury Rewards',
        bgLogo: 'bg-[#0f172a]',
        benefits: 'Earn 40 Reward points on every ₹100 spent,Unlimited lounge access and free spa sessions,Upto 40% value back on curated luxury brands,Joining Fees: ₹9,999 + Taxes,Annual/Renewal Fee: ₹9,999 + Taxes',
        redirectUrl: '/apply?card=sbi-aurum',
        priority: 2
      },
      {
        title: 'Axis Bank Atlas Credit Card',
        category: 'credit-card',
        dsaName: 'Axis Bank',
        description: 'Ultimate Travel Card',
        bgLogo: 'bg-[#991b1b]',
        benefits: 'Earn 5 EDGE Miles on every ₹100 spent on travel,Free Priority Pass with 4 free guest visits,Earn 2X EDGE Miles on international spends,Joining Fees: ₹5,000 + Taxes,Annual/Renewal Fee: ₹5,000 + Taxes',
        redirectUrl: '/apply?card=axis-atlas',
        priority: 3
      },
      {
        title: 'ICICI Sapphiro Credit Card',
        category: 'credit-card',
        dsaName: 'ICICI Bank',
        description: 'Lifestyle and Entertainment',
        bgLogo: 'bg-[#1d4ed8]',
        benefits: 'Earn 20 Reward points on every ₹100 spent,Complimentary lounge access & free movie tickets,Upto 15% value back on dining and lifestyle,Joining Fees: ₹6,500 + Taxes,Annual/Renewal Fee: ₹6,500 + Taxes',
        redirectUrl: '/apply?card=icici-sapphiro',
        priority: 4
      }
    ];

    const allOffers = [...personalLoans, ...businessLoans, ...homeLoans, ...creditCards];

    // Clear existing to avoid duplicates if re-run
    await prisma.offer.deleteMany({
      where: {
        category: { in: ['personal-loan', 'business-loan', 'home-loan', 'credit-card'] }
      }
    });

    // Bulk create
    const result = await prisma.offer.createMany({
      data: allOffers
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
