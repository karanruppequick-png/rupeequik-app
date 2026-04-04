import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com';

export const metadata: Metadata = {
  title: "Best Credit Cards in India 2025 - Compare & Apply Online | Exclusive Rewards",
  description: "Compare 590+ credit cards from HDFC, SBI, ICICI, Axis & top banks. Get up to 33% rewards, free lounge access, and cashback offers. Instant online approval. Apply for the best credit card now.",
  keywords: [
    "credit card", "best credit card India", "credit card apply online",
    "credit card comparison", "reward credit card", "travel credit card",
    "cashback credit card", "HDFC credit card", "SBI credit card",
    "ICICI credit card", "Axis credit card", "premium credit card",
    "credit card offers", "free credit card", "credit card with lounge access",
  ],
  alternates: {
    canonical: '/credit-card',
  },
  openGraph: {
    title: "Best Credit Cards in India - Compare 590+ Cards | RupeeQuik",
    description: "Compare credit cards from top banks. Get up to 33% rewards, free lounge access & cashback. Instant approval.",
    url: '/credit-card',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Best Credit Cards - RupeeQuik' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Best Credit Cards in India | RupeeQuik",
    description: "Compare 590+ credit cards. Exclusive rewards & cashback. Apply now.",
  },
};

const creditCardJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'Credit Cards',
  description: 'Compare and apply for the best credit cards from 78+ bank partners in India. Get up to 33% rewards, free lounge access, and exclusive cashback offers.',
  provider: {
    '@type': 'FinancialService',
    name: 'RupeeQuik',
    url: siteUrl,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    offerCount: '590+',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Credit Cards', item: `${siteUrl}/credit-card` },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How to choose the best credit card in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Choose a credit card based on your spending habits. For travel, pick cards with lounge access and travel rewards. For shopping, choose cashback cards. Consider annual fees, reward rates, and welcome benefits. RupeeQuik helps you compare 590+ cards to find the best match.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum salary required for a credit card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most banks require a minimum salary of ₹15,000 to ₹25,000 per month for basic credit cards. Premium cards may require ₹50,000+ monthly income. Some banks also offer credit cards against fixed deposits with no salary requirement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a credit card with a low CIBIL score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A CIBIL score of 750+ is ideal for credit card approval. However, some banks offer secured credit cards (against FD) for scores below 700. Check your free CIBIL score on RupeeQuik before applying.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does credit card approval take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credit card approval through RupeeQuik can be as fast as instant to 7 business days depending on the bank. Most digital applications get approved within 24-48 hours.',
      },
    },
  ],
};

export default function CreditCardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="credit-card-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creditCardJsonLd) }}
      />
      <Script
        id="credit-card-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="credit-card-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
