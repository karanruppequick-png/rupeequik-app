import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.rupeequik.com'),
  title: "RupeeQuik - India's Best Credit Marketplace",
  description: "Compare and apply for the best personal loans, business loans, credit cards, and home loans from top banks and financial institutions in India.",
  openGraph: {
    title: "RupeeQuik - India's Best Credit Marketplace",
    description: "Compare and apply for the best personal loans, business loans, credit cards, and home loans.",
    url: '/',
    siteName: 'RupeeQuik',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
