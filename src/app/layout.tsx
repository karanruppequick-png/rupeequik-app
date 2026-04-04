import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RupeeQuik - India's Best Credit Marketplace | Compare Loans & Credit Cards",
    template: "%s | RupeeQuik",
  },
  description: "Compare and apply for the best personal loans, business loans, home loans, and credit cards from 20+ top banks in India. Check your free CIBIL score. Lowest interest rates starting at 8.75% p.a.",
  keywords: [
    "personal loan", "business loan", "home loan", "credit card",
    "loan comparison", "credit score", "CIBIL score", "free credit score",
    "loan apply online", "instant loan approval", "low interest rate loan",
    "best credit card India", "compare loans India", "RupeeQuik",
    "personal loan online", "home loan EMI calculator", "credit card apply online",
    "loan eligibility check", "instant personal loan", "credit marketplace India",
  ],
  authors: [{ name: "RupeeQuik", url: siteUrl }],
  creator: "RupeeQuik",
  publisher: "RupeeQuik",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "RupeeQuik - India's Best Credit Marketplace",
    description: "Compare personal loans, business loans, home loans & credit cards from 20+ banks. Check free CIBIL score. Instant approval. Lowest rates from 8.75% p.a.",
    url: '/',
    siteName: 'RupeeQuik',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "RupeeQuik - India's Best Credit Marketplace",
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "RupeeQuik - India's Best Credit Marketplace",
    description: "Compare loans & credit cards from 20+ banks. Check free CIBIL score. Instant approval.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console and Bing verification codes here
    // google: 'your-google-verification-code',
    // other: { 'msvalidate.01': 'your-bing-verification-code' },
  },
  category: 'finance',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'RupeeQuik',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: "India's Best Credit Marketplace - Compare and apply for personal loans, business loans, home loans, and credit cards from top banks.",
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  serviceType: ['Loan Comparison', 'Credit Card Comparison', 'Credit Score Check'],
  sameAs: [
    // Add your social media URLs here
    // 'https://www.facebook.com/rupeequik',
    // 'https://twitter.com/rupeequik',
    // 'https://www.linkedin.com/company/rupeequik',
    // 'https://www.instagram.com/rupeequik',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RupeeQuik',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
