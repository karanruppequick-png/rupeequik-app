"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DSALoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/dsa-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.devOtp) setDevOtp(data.devOtp);
        setStep("otp");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/dsa-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dsa/dashboard");
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-2">DSA Portal</h1>
        <h2 className="text-xl text-slate-500 mb-6">
          {step === "phone" ? "Agent Login" : "Enter OTP"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {devOtp && step === "otp" && (
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm mb-4">
            Dev mode OTP: <span className="font-mono font-bold">{devOtp}</span>
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <div className="flex gap-2">
                <span className="border border-slate-300 bg-slate-50 px-3 py-2 rounded-lg text-sm text-slate-500 flex items-center">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit number"
                  required
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full py-3 bg-[#4A69FF] text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                OTP sent to +91 {phone}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-center text-lg tracking-widest font-mono"
                maxLength={6}
              />
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); }}
                className="text-sm text-[#4A69FF] mt-2 hover:underline"
              >
                Change number
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-[#4A69FF] text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
