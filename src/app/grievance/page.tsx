import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grievance Redressal — RupeeQuik",
  description: "RBI-mandated grievance redressal information for RupeeQuik.",
};

export default function GrievancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#1C295E] mb-4">Grievance Redressal</h1>
        <p className="text-slate-500 mb-8">In compliance with RBI Master Direction on Digital Lending.</p>

        <div className="space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1C295E] mb-2">Grievance Officer</h2>
            <p className="text-slate-700">Name: Grievance Officer</p>
            <p className="text-slate-700">Email: grievance@rupeequik.com</p>
            <p className="text-slate-700">Phone: +91-XXXX-XXXXXX</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1C295E] mb-2">Escalation Timeline</h2>
            <p className="text-slate-700">First Response: Within 24 hours</p>
            <p className="text-slate-700">Resolution: Within 30 days</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1C295E] mb-2">RBI Ombudsman</h2>
            <p className="text-slate-700">If your grievance is not resolved within 30 days, you may approach the RBI Ombudsman under the Integrated Ombudsman Scheme.</p>
            <p className="text-slate-700 mt-2">Learn more: <a href="https://cms.rbi.org.in" className="text-[#4A69FF] underline" target="_blank" rel="noopener noreferrer">cms.rbi.org.in</a></p>
          </div>

          <div className="prose prose-slate max-w-none space-y-4">
            <h2 className="text-xl font-semibold text-[#1C295E]">Grievance Categories</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Unauthorized data sharing or collection</li>
              <li>Non-compliance with consent requirements</li>
              <li>Non-disbursement of sanctioned loan amount</li>
              <li>Charging of hidden fees</li>
              <li>Harassment by recovery agents</li>
              <li>Incorrect credit bureau information</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}