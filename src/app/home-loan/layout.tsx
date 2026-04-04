import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com';

export const metadata: Metadata = {
  title: "Home Loan Online - Interest Rates from 8.75% p.a. | Compare & Apply",
  description: "Apply for home loan up to ₹3 Crores from HDFC, ICICI, SBI, Axis & 20+ banks. Compare home loan interest rates starting 8.75% p.a. Tenure up to 30 years. Low processing fees. Check eligibility now.",
  keywords: [
    "home loan", "home loan online", "housing loan",
    "home loan interest rate", "home loan eligibility",
    "home loan EMI calculator", "home loan apply online",
    "HDFC home loan", "SBI home loan", "ICICI home loan",
    "low interest home loan", "home loan comparison India",
    "home loan balance transfer", "property loan",
  ],
  alternates: {
    canonical: '/home-loan',
  },
  openGraph: {
    title: "Home Loan Online - Rates from 8.75% | RupeeQuik",
    description: "Compare home loans from 20+ banks. Get up to ₹3 Crores with rates starting 8.75% p.a. Tenure up to 30 years.",
    url: '/home-loan',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Home Loan - RupeeQuik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Home Loan Online - Rates from 8.75% | RupeeQuik",
    description: "Compare home loans from 20+ banks. Lowest rates. Quick approval.",
  },
};

const homeLoanJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'Home Loan',
  description: 'Compare and apply for home loans up to ₹3 Crores from top banks in India with interest rates starting from 8.75% p.a.',
  provider: {
    '@type': 'FinancialService',
    name: 'RupeeQuik',
    url: siteUrl,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '500000',
    highPrice: '30000000',
    offerCount: '20+',
  },
  interestRate: {
    '@type': 'QuantitativeValue',
    minValue: 8.75,
    unitText: '% p.a.',
  },
  feesAndCommissionsSpecification: 'Processing fee up to 0.5%',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Home Loan', item: `${siteUrl}/home-loan` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the current home loan interest rate in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home loan interest rates in India start from 8.75% p.a. Rates vary by bank, loan amount, tenure, and your credit profile. RupeeQuik helps you compare rates across 20+ banks to find the best deal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum home loan amount I can get?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can get a home loan up to ₹3 Crores or more depending on your income, credit score, and property value. Most banks offer up to 80-90% of the property value as a home loan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum tenure for a home loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home loans are available for a maximum tenure of up to 30 years, depending on the bank and your age at the time of loan maturity. Longer tenure means lower EMI but higher total interest paid.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are required for a home loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You typically need identity proof (PAN, Aadhaar), address proof, income proof (salary slips, ITR), bank statements (6 months), property documents, and photographs. Self-employed applicants need additional business documents.',
      },
    },
  ],
};

export default function HomeLoanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="home-loan-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeLoanJsonLd) }}
      />
      <Script
        id="home-loan-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="home-loan-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
