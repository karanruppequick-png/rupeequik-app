"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.devOtp) setDevOtp(data.devOtp);
        setStep("otp");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, source: "register" }),
      });
      const data = await res.json();
      if (res.ok) {
        // User is now auto-logged in via cookie
        if (data.isNewUser) {
          setStep("details");
        } else {
          // Existing user - go to profile completion
          setStep("details");
        }
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name: name || undefined,
          email: email || undefined,
          password: password || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
        router.refresh();
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
          <p className="text-slate-500 mt-2">
            {step === "details" ? "Complete your profile" : "Create your free account"}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["phone", "otp", "details"].map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                step === s ? "w-8 bg-blue-600" : i < ["phone", "otp", "details"].indexOf(step) ? "w-2 bg-blue-600" : "w-2 bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2">
              <span className="shrink-0 mt-0.5 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Phone */}
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className="w-full px-3 py-3 outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">We&apos;ll send a verification OTP to this number</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {devOtp && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  <span className="font-bold">Dev Mode OTP:</span> {devOtp}
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Enter OTP sent to +91 {phone}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm text-center text-2xl font-bold tracking-[0.5em]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                  <><KeyRound className="w-4 h-4" /> Verify OTP</>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setDevOtp(""); }}
                className="w-full text-sm text-slate-500 hover:text-blue-600"
              >
                Change phone number
              </button>
            </form>
          )}

          {/* Step 3: Complete Profile */}
          {step === "details" && (
            <form onSubmit={handleCompleteProfile} className="space-y-5">
              <p className="text-sm text-slate-500 text-center mb-2">
                Phone verified! Add your details to complete registration.
              </p>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajesh Kumar"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email Address <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Create Password <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="relative border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <p className="text-xs text-slate-400 mt-1">You can always login with OTP if you skip this</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Complete Registration"}
              </button>

              <button
                type="button"
                onClick={() => { router.push("/dashboard"); router.refresh(); }}
                className="w-full text-sm text-slate-500 hover:text-blue-600"
              >
                Skip for now
              </button>
            </form>
          )}

          {step === "phone" && (
            <p className="text-center text-sm text-slate-500 mt-6 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}
