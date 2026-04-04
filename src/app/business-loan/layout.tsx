import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com';

export const metadata: Metadata = {
  title: "Business Loan Online - Interest Rates from 11.25% p.a. | Compare & Apply",
  description: "Apply for business loan up to ₹50 Lakhs from HDFC, ICICI, Axis & 20+ banks. Compare business loan interest rates starting 11.25% p.a. Quick approval. Minimal documentation. Grow your business today.",
  keywords: [
    "business loan", "business loan online", "MSME loan",
    "business loan interest rate", "business loan eligibility",
    "small business loan", "business loan apply online",
    "HDFC business loan", "ICICI business loan", "SBI business loan",
    "working capital loan", "business loan comparison India",
    "startup loan", "collateral free business loan",
  ],
  alternates: {
    canonical: '/business-loan',
  },
  openGraph: {
    title: "Business Loan Online - Rates from 11.25% | RupeeQuik",
    description: "Compare business loans from 20+ banks. Get up to ₹50 Lakhs with rates starting 11.25% p.a. Quick approval.",
    url: '/business-loan',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Business Loan - RupeeQuik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Business Loan Online - Rates from 11.25% | RupeeQuik",
    description: "Compare business loans from 20+ banks. Grow your business with lowest rates.",
  },
};

const businessLoanJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'Business Loan',
  description: 'Compare and apply for business loans up to ₹50 Lakhs from top banks in India with interest rates starting from 11.25% p.a.',
  provider: {
    '@type': 'FinancialService',
    name: 'RupeeQuik',
    url: siteUrl,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '100000',
    highPrice: '5000000',
    offerCount: '20+',
  },
  interestRate: {
    '@type': 'QuantitativeValue',
    minValue: 11.25,
    unitText: '% p.a.',
  },
  feesAndCommissionsSpecification: 'Processing fee up to 2%',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Business Loan', item: `${siteUrl}/business-loan` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the eligibility for a business loan in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Business loan eligibility depends on your business vintage (typically 2+ years), annual turnover, credit score (700+), and profitability. Self-employed professionals, sole proprietors, partnerships, and companies can apply.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a business loan without collateral?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, many banks on RupeeQuik offer unsecured business loans up to ₹50 Lakhs without any collateral requirement. These loans typically have slightly higher interest rates but offer faster processing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the interest rate for business loans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Business loan interest rates start from 11.25% p.a. and vary based on your business profile, credit score, loan amount, and the lending bank. Compare rates on RupeeQuik across 20+ banks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to get a business loan approved?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Business loan approval can take 24 hours to 7 days depending on the bank, loan amount, and documentation. Many digital lenders on RupeeQuik offer approval within 24-48 hours.',
      },
    },
  ],
};

export default function BusinessLoanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="business-loan-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLoanJsonLd) }}
      />
      <Script
        id="business-loan-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="business-loan-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
