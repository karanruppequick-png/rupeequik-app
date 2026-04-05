"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff, Phone, Mail, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState<"otp" | "password">("otp");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const isPhone = /^\d{10}$/.test(identifier);
  const isEmail = identifier.includes("@");
  const identifierValid = isPhone || isEmail;

  const handleSendOtp = async () => {
    if (!isPhone) {
      setError("OTP login is only available with a 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: identifier }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        if (data.devOtp) setDevOtp(data.devOtp);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifierValid) {
      setError("Please enter a valid email or 10-digit phone number");
      return;
    }

    if (method === "otp" && !otpSent) {
      await handleSendOtp();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          method,
          ...(method === "otp" ? { otp } : { password }),
        }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        if (data.needsOtp) {
          setMethod("otp");
          setError("No password set. Please login with OTP.");
        } else {
          setError(data.error || "Login failed");
        }
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
            {/* Identifier input */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Phone Number or Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {isPhone ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setOtpSent(false);
                    setOtp("");
                    setDevOtp("");
                  }}
                  placeholder="Enter phone number or email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm"
                />
              </div>
            </div>

            {/* Method toggle - only show when identifier is valid */}
            {identifierValid && (
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setMethod("otp"); setOtpSent(false); setOtp(""); }}
                  className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    method === "otp"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                  disabled={!isPhone}
                >
                  <KeyRound className="w-3.5 h-3.5" /> Login with OTP
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("password")}
                  className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    method === "password"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Password
                </button>
              </div>
            )}

            {/* OTP flow */}
            {method === "otp" && identifierValid && (
              <>
                {otpSent ? (
                  <div>
                    {devOtp && (
                      <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                        <span className="font-bold">Dev Mode OTP:</span> {devOtp}
                      </div>
                    )}
                    <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                      Enter 4-digit OTP sent to +91 {identifier}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="Enter OTP"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-sm text-center text-2xl font-bold tracking-[0.5em]"
                    />
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(""); setDevOtp(""); }}
                      className="text-xs text-blue-600 font-medium hover:underline mt-2"
                    >
                      Resend OTP
                    </button>
                  </div>
                ) : (
                  !isPhone && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                      OTP login is available only with phone number. Please enter your 10-digit mobile number or switch to password login.
                    </p>
                  )
                )}
              </>
            )}

            {/* Password flow */}
            {method === "password" && identifierValid && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">Password</label>
                </div>
                <div className="relative border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all bg-white">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !identifierValid}
            className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors mt-8 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : method === "otp" && !otpSent ? (
              "Send OTP"
            ) : (
              "Sign In"
            )}
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
