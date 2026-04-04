import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com';

export const metadata: Metadata = {
  title: "Free CIBIL Score Check Online - Instant Credit Report | No Impact on Score",
  description: "Check your free CIBIL credit score online instantly with RupeeQuik. Get detailed credit report powered by TransUnion CIBIL. No impact on your credit score. 256-bit encrypted. 100% free.",
  keywords: [
    "CIBIL score", "free CIBIL score", "credit score check",
    "credit score online", "CIBIL score check free", "credit report",
    "TransUnion CIBIL", "check credit score", "CIBIL score login",
    "free credit report", "credit score India", "CIBIL score range",
    "how to check CIBIL score", "improve credit score",
  ],
  alternates: {
    canonical: '/credit-score',
  },
  openGraph: {
    title: "Free CIBIL Score Check Online | RupeeQuik",
    description: "Check your free CIBIL credit score instantly. Detailed credit report. No impact on score. 100% free.",
    url: '/credit-score',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free CIBIL Score Check - RupeeQuik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free CIBIL Score Check Online | RupeeQuik",
    description: "Check your CIBIL score for free. Instant report. No impact on score.",
  },
};

const creditScoreJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RupeeQuik Free CIBIL Score Checker',
  description: 'Check your free CIBIL credit score online instantly with detailed credit report. Powered by TransUnion CIBIL.',
  url: `${siteUrl}/credit-score`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  provider: {
    '@type': 'FinancialService',
    name: 'RupeeQuik',
    url: siteUrl,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Free Credit Score Check', item: `${siteUrl}/credit-score` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is checking CIBIL score on RupeeQuik free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, checking your CIBIL score on RupeeQuik is 100% free. It is a soft inquiry that does not affect your credit score in any way.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a good CIBIL score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CIBIL scores range from 300 to 900. A score of 750 and above is considered good and increases your chances of loan and credit card approval. Scores above 800 are excellent and may get you the best interest rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does checking CIBIL score affect my credit rating?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Checking your own CIBIL score through RupeeQuik is a soft inquiry and does not impact your credit score. Only hard inquiries made by lenders when you apply for credit can temporarily affect your score.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I improve my CIBIL score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To improve your CIBIL score: pay all EMIs and credit card bills on time, keep credit utilization below 30%, maintain a healthy mix of secured and unsecured loans, avoid multiple loan applications in a short period, and regularly check your credit report for errors.',
      },
    },
  ],
};

export default function CreditScoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="credit-score-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creditScoreJsonLd) }}
      />
      <Script
        id="credit-score-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="credit-score-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
