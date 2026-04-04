"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (formData.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-2">
               <span className="bg-blue-600 text-white rounded px-2 py-0.5 text-2xl">₹</span> RupeeQuick
            </h1>
          </Link>
          <p className="text-slate-500 mt-2">Create your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2">
              <span className="shrink-0 mt-0.5 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Rajesh Kumar" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm" 
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                placeholder="rajesh@example.com" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm" 
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Phone Number</label>
              <div className="flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
                <div className="bg-slate-50 px-4 py-3 border-r border-slate-200 text-slate-500 font-medium text-sm flex items-center justify-center">
                  +91
                </div>
                <input 
                  type="tel" 
                  required
                  maxLength={10}
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })} 
                  placeholder="9876543210" 
                  className="w-full px-3 py-3 outline-none text-sm" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Create Password</label>
              <div className="relative border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
                <input 
                  type={showPw ? "text" : "password"} 
                  required
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  placeholder="At least 6 characters" 
                  className="w-full px-4 py-3 pr-12 outline-none text-sm" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors mt-8 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-500 mt-6 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}
