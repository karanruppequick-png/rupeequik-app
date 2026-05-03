"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(data.error || "Failed to submit. Please try again.");
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
      <main className="flex-1 max-w-xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#1C295E] mb-2">Contact Us</h1>
        <p className="text-slate-500 mb-8">We typically respond within 24 hours.</p>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1C295E]">Message Sent!</h2>
            <p className="text-slate-500">We will get back to you within 24 hours.</p>
            <button onClick={() => setSuccess(false)} className="text-[#4A69FF] font-semibold hover:underline">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20" placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Phone</label>
              <div className="flex items-center gap-2">
                <span className="border border-slate-300 bg-slate-50 px-3 py-3 rounded-lg text-sm text-slate-500">+91</span>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} required className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20" placeholder="10-digit number" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20 resize-none" placeholder="How can we help?" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#4A69FF] text-white font-bold rounded-lg hover:bg-[#2B3B8B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message"}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}