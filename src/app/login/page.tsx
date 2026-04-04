"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error === "Invalid credentials" ? "Incorrect email or password" : data.error);
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
          <p className="text-slate-500 mt-2">Welcome back!</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2">
              <span className="shrink-0 mt-0.5 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email Address</label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="rajesh@example.com" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm" 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Password</label>
                <Link href="#" className="text-xs text-blue-600 font-medium hover:underline">Forgot password?</Link>
              </div>
              
              <div className="relative border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
                <input 
                  type={showPw ? "text" : "password"} 
                  required
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter your password" 
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
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-500 mt-6 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Sign up
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
