"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle, Copy, Share2 } from "lucide-react";

export default function DSAApplyPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", businessName: "" });
  const [loading, setLoading] = useState(false);
  const [partnerCode, setPartnerCode] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dsa/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPartnerCode(data.partnerCode);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto px-6 py-16">
        {partnerCode ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#1C295E] mb-2">Registration Submitted!</h1>
            <p className="text-slate-500 mb-6">Your partner code will be sent via SMS.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
              <p className="text-xs text-slate-400 mb-1">Your Partner Code</p>
              <p className="text-3xl font-bold font-mono tracking-wider text-[#1C295E]">{partnerCode}</p>
            </div>
            <p className="text-sm text-slate-500">Our team will verify your application within 2-3 business days. You will receive an SMS once your account is activated.</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-[#1C295E] mb-2">Join as DSA Partner</h1>
            <p className="text-slate-500 mb-8">Earn commission on every successful lead. Fill the form below to get started.</p>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20" placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Phone Number *</label>
                <div className="flex items-center gap-2">
                  <span className="border border-slate-300 bg-slate-50 px-3 py-3 rounded-lg text-sm text-slate-500">+91</span>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} required className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20" placeholder="10-digit number" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20" placeholder="optional@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Business Name</label>
                <input type="text" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20" placeholder="Your firm or company name" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#4A69FF] text-white font-bold rounded-lg hover:bg-[#2B3B8B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Application"}
              </button>
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}