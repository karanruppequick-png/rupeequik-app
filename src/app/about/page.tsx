import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About RupeeQuik",
  description: "Learn about RupeeQuik — India's credit marketplace.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#1C295E] py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About RupeeQuik</h1>
          <p className="text-white/70 max-w-xl mx-auto px-4">India&apos;s transparent credit marketplace — helping you find the right loan, credit card, or insurance product.</p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[#1C295E] mb-4">Who We Are</h2>
            <p className="text-slate-600 leading-relaxed">RupeeQuik is a digital-first credit marketplace that connects Indian consumers with leading banks and financial institutions. We believe in transparency — comparing products by total cost, not just discounts.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1C295E] mb-4">What We Do</h2>
            <p className="text-slate-600 leading-relaxed">We aggregate financial products from 20+ bank partners, offering personal loans, home loans, business loans, and credit cards. Our soft credit check shows eligible offers without impacting your CIBIL score.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1C295E] mb-4">Why Choose Us</h2>
            <p className="text-slate-600 leading-relaxed">No fees, no spam, no hidden charges. We are authorized by our lending partners and operate in full compliance with RBI digital lending guidelines.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1C295E] mb-4">Contact</h2>
            <p className="text-slate-600">Email: support@rupeequik.com</p>
            <p className="text-slate-600">Phone: +91-XXXXXXXXXX</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}