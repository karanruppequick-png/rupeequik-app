import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com';

export const metadata: Metadata = {
  title: "Personal Loan Online - Interest Rates from 10.25% p.a. | Compare & Apply",
  description: "Apply for instant personal loan up to ₹50 Lakhs from HDFC, ICICI, Axis, SBI & 20+ banks. Compare interest rates starting 10.25% p.a. Quick approval in 24 hours. Minimal documentation. Check eligibility now.",
  keywords: [
    "personal loan", "personal loan online", "instant personal loan",
    "personal loan interest rate", "personal loan eligibility",
    "personal loan EMI calculator", "personal loan apply online",
    "HDFC personal loan", "ICICI personal loan", "SBI personal loan",
    "low interest personal loan", "personal loan comparison India",
  ],
  alternates: {
    canonical: '/personal-loan',
  },
  openGraph: {
    title: "Personal Loan Online - Rates from 10.25% | RupeeQuik",
    description: "Compare personal loans from 20+ banks. Get up to ₹50 Lakhs with rates starting 10.25% p.a. Instant approval in 24 hours.",
    url: '/personal-loan',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Personal Loan - RupeeQuik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Personal Loan Online - Rates from 10.25% | RupeeQuik",
    description: "Compare personal loans from 20+ banks. Instant approval. Lowest rates.",
  },
};

const personalLoanJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'Personal Loan',
  description: 'Compare and apply for instant personal loans up to ₹50 Lakhs from top banks in India with interest rates starting from 10.25% p.a.',
  provider: {
    '@type': 'FinancialService',
    name: 'RupeeQuik',
    url: siteUrl,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '50000',
    highPrice: '5000000',
    offerCount: '20+',
  },
  interestRate: {
    '@type': 'QuantitativeValue',
    minValue: 10.25,
    unitText: '% p.a.',
  },
  feesAndCommissionsSpecification: 'Processing fee up to 2%',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Personal Loan', item: `${siteUrl}/personal-loan` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the minimum salary required for a personal loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most banks require a minimum monthly salary of ₹15,000 to ₹25,000 for personal loan eligibility. The exact requirement varies by bank and loan amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the interest rate for personal loans in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Personal loan interest rates in India start from 10.25% p.a. and can go up to 24% p.a. depending on your credit score, income, and the bank you choose. RupeeQuik helps you compare rates across 20+ banks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can I get a personal loan approved?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With RupeeQuik, you can get personal loan approval within 24 hours. Some banks offer instant approval with a 100% digital process and minimal documentation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are required for a personal loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typically you need PAN card, Aadhaar card, salary slips (last 3 months), bank statements (last 6 months), and a passport-size photograph. Many banks on RupeeQuik offer minimal documentation loans.',
      },
    },
  ],
};

export default function PersonalLoanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="personal-loan-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personalLoanJsonLd) }}
      />
      <Script
        id="personal-loan-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="personal-loan-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
