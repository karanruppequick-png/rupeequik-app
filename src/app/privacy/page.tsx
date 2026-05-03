import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — RupeeQuik",
  description: "RupeeQuik privacy policy and data protection practices.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#1C295E] mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p>Last updated: May 2026</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">1. Information We Collect</h2>
          <p>RupeeQuik collects information you provide directly, including your name, phone number, email address, PAN, and income details when you apply for financial products through our platform.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">2. How We Use Your Information</h2>
          <p>We use your information to facilitate loan applications, check credit scores, match you with suitable financial products, and communicate with you about offers. We may also use your data for analytics and service improvement.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">3. Data Sharing</h2>
          <p>We share your data with our lending partners and financial institutions only with your explicit consent for the purpose of processing your loan or credit application. We do not sell your personal data to third parties.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">4. Data Security</h2>
          <p>We implement industry-standard encryption and security measures to protect your personal information. Your data is handled in accordance with RBI digital lending guidelines.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">5. Cookies</h2>
          <p>We use cookies to maintain your session and remember preferences. You can disable cookies through your browser settings.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@rupeequik.com for any data-related requests.</p>
          <h2 className="text-xl font-semibold text-[#1C295E]">7. Contact</h2>
          <p>For privacy concerns, reach us at privacy@rupeequik.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}