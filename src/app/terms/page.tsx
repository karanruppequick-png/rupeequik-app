import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — RupeeQuik",
  description: "RupeeQuik terms of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#1C295E] mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p>Last updated: May 2026</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">1. Acceptance of Terms</h2>
          <p>By using RupeeQuik, you agree to these terms. If you do not agree, please do not use our services.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">2. Services</h2>
          <p>RupeeQuik provides a digital marketplace for comparing and applying for loans, credit cards, and other financial products. We are not a lender — we connect you with third-party financial institutions.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">3. Eligibility</h2>
          <p>You must be an Indian resident, at least 18 years old, and provide accurate information when using our services.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">4. Consent</h2>
          <p>By submitting your information, you consent to RupeeQuik acting as your authorized representative to receive your credit information from CIBIL, Equifax, Experian, or CRIF Highmark.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">5. Fees</h2>
          <p>RupeeQuik does not charge you for using our platform. Our revenue comes from commissions paid by lending partners.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">6. Disclaimers</h2>
          <p>We do not guarantee approval of any loan or credit product. All lending decisions are made by our partner financial institutions, not by RupeeQuik.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">7. Limitation of Liability</h2>
          <p>RupeeQuik shall not be held liable for any decisions made based on information provided through our platform.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">8. Contact</h2>
          <p>For questions, contact us at support@rupeequik.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}