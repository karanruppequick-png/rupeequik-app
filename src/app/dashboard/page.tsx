"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FileText, CreditCard, Shield, Activity, User, Eye, EyeOff, Check, Clock, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Lead {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  category: string | null;
  income: string | null;
  loanAmount: string | null;
  status: string;
  source: string;
  createdAt: string;
  offer: { id: string; title: string; dsaName: string; category: string } | null;
}

interface CreditCheck {
  id: string;
  pan: string;
  name: string;
  score: number;
  source: string;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  hasPassword: boolean;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  "otp-verified": { label: "OTP Verified", color: "bg-blue-100 text-blue-700" },
  "details-filled": { label: "Details Submitted", color: "bg-amber-100 text-amber-700" },
  "credit-checked": { label: "Credit Checked", color: "bg-purple-100 text-purple-700" },
  "redirected": { label: "Applied", color: "bg-emerald-100 text-emerald-700" },
  "approved": { label: "Approved", color: "bg-green-100 text-green-700" },
  "rejected": { label: "Rejected", color: "bg-red-100 text-red-700" },
};

const categoryLabels: Record<string, string> = {
  "personal-loan": "Personal Loan",
  "home-loan": "Home Loan",
  "business-loan": "Business Loan",
  "credit-card": "Credit Card",
  "credit-score": "Credit Score",
  "loan-apply": "Loan Application",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [creditChecks, setCreditChecks] = useState<CreditCheck[]>([]);
  const [loading, setLoading] = useState(true);

  // Password setting
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/user-me").then((r) => r.json()),
      fetch("/api/user/applications").then((r) => r.json()),
    ])
      .then(([userData, appData]) => {
        if (!userData.authenticated) {
          router.push("/login");
          return;
        }
        setUser(userData.user);
        setLeads(appData.leads || []);
        setCreditChecks(appData.creditChecks || []);
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    setPwLoading(true);
    setPwError("");
    setPwMessage("");
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPassword,
          ...(user?.hasPassword ? { currentPassword } : {}),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMessage("Password updated successfully!");
        setNewPassword("");
        setCurrentPassword("");
        setShowPasswordForm(false);
        // Refresh user data
        const meRes = await fetch("/api/auth/user-me");
        const meData = await meRes.json();
        if (meData.authenticated) setUser(meData.user);
      } else {
        setPwError(data.error || "Failed to update password");
      }
    } catch {
      setPwError("Network error. Please try again.");
    }
    setPwLoading(false);
  };

  const latestScore = creditChecks.length > 0 ? creditChecks[0].score : null;
  const scoreColor = latestScore
    ? latestScore >= 800 ? "text-emerald-400" : latestScore >= 750 ? "text-green-400" : latestScore >= 700 ? "text-amber-400" : "text-red-400"
    : "text-white/60";

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const needsProfileCompletion = !user.hasPassword || user.name === "User" || !user.email;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 lg:py-24 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Completion Banner */}
          {needsProfileCompletion && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm">Complete your profile</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {!user.hasPassword && "Set a password for easier login. "}
                    {user.name === "User" && "Add your name. "}
                    {!user.email && "Add your email for notifications."}
                  </p>
                </div>
              </div>
              <Link href="/register" className="text-xs font-bold text-amber-700 bg-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-300 transition-colors shrink-0">
                Complete Now
              </Link>
            </div>
          )}

          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                Welcome back, {user.name === "User" ? "there" : user.name} 👋
              </h1>
              <p className="text-slate-500 mt-2 text-[15px]">
                Manage your applications, profile, and credit health.
              </p>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors inline-block text-center w-fit"
            >
              Explore Offers
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Credit Score Banner */}
              <div className="bg-slate-900 rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-md shadow-blue-900/10">
                <div className="w-full sm:w-auto">
                  <h3 className="text-lg font-semibold text-white/90 mb-1">Your CIBIL Score</h3>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-5xl font-bold tracking-tight ${scoreColor}`}>
                      {latestScore || "---"}
                    </span>
                    {latestScore && (
                      <span className="text-sm text-white/50">
                        Last checked {new Date(creditChecks[0].createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mt-3 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    {latestScore ? "Check again for free" : "Check your score for free"}
                  </p>
                </div>
                <div className="w-full sm:w-auto shrink-0 bg-white/10 rounded-xl p-5 border border-white/20 backdrop-blur-sm hidden sm:block">
                  <p className="text-sm font-medium text-white mb-2">Know your credit health</p>
                  <Link href="/credit-score">
                    <button className="text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-lg w-full hover:bg-slate-50 transition-colors">
                      Check Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* Active Applications */}
              <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5 sm:p-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> My Applications
                  </h2>
                  <span className="text-sm text-slate-400">{leads.length} total</span>
                </div>

                {leads.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-[17px] font-bold text-slate-900 mb-2">No applications yet</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      You haven&apos;t applied for any products yet.
                    </p>
                    <Link
                      href="/personal-loan"
                      className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-md font-bold text-[13px] hover:bg-blue-700 transition-colors"
                    >
                      Compare Loan Offers
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leads.slice(0, 5).map((lead) => {
                      const status = statusLabels[lead.status] || { label: lead.status, color: "bg-slate-100 text-slate-600" };
                      return (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              {lead.status === "redirected" ? (
                                <Check className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Clock className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 text-sm truncate">
                                {categoryLabels[lead.category || lead.source] || lead.source}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                {lead.offer && ` · ${lead.offer.dsaName}`}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      );
                    })}
                    {leads.length > 5 && (
                      <p className="text-center text-sm text-blue-600 font-medium pt-2">
                        +{leads.length - 5} more applications
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Credit Check History */}
              {creditChecks.length > 0 && (
                <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5 sm:p-8">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-5">
                    <Activity className="w-5 h-5 text-blue-600" /> Credit Score History
                  </h2>
                  <div className="space-y-3">
                    {creditChecks.map((check) => (
                      <div
                        key={check.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{check.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            PAN: {check.pan} ·{" "}
                            {new Date(check.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-2xl font-bold ${
                              check.score >= 750 ? "text-emerald-600" : check.score >= 700 ? "text-amber-600" : "text-red-600"
                            }`}
                          >
                            {check.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Profile Overview */}
              <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-200 shadow-sm p-5 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> Profile Details
                </h2>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-slate-50">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone</p>
                    <p className="text-[15px] font-medium text-slate-700">+91 {user.phone}</p>
                  </div>
                  <div className="pb-4 border-b border-slate-50">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Name</p>
                    <p className="text-[15px] font-medium text-slate-700">
                      {user.name === "User" ? "Not set" : user.name}
                    </p>
                  </div>
                  <div className="pb-4 border-b border-slate-50">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                    <p className="text-[15px] font-medium text-slate-700 block truncate">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Member Since</p>
                    <p className="text-[15px] font-medium text-slate-700">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5 sm:p-6 overflow-hidden relative">
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-[15px]">Account Security</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-3">
                      {user.hasPassword
                        ? "Your account is secured with a password."
                        : "Set a password for easier login without OTP."}
                    </p>

                    {pwMessage && (
                      <div className="mb-3 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium">
                        {pwMessage}
                      </div>
                    )}

                    {!showPasswordForm ? (
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="text-[13px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {user.hasPassword ? "Change Password" : "Set Password"}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <form onSubmit={handleSetPassword} className="space-y-3">
                        {pwError && (
                          <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{pwError}</p>
                        )}
                        {user.hasPassword && (
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600"
                          />
                        )}
                        <div className="relative">
                          <input
                            type={showPw ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password (min 6 chars)"
                            className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={pwLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-70"
                          >
                            {pwLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPwError("");
                              setNewPassword("");
                              setCurrentPassword("");
                            }}
                            className="px-4 py-2 text-slate-500 text-xs font-bold hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-5 sm:p-6">
                <h3 className="font-bold text-slate-900 text-[15px] mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="/apply"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-slate-700">Apply for a Loan</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </Link>
                  <Link
                    href="/credit-score"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-slate-700">Check Credit Score</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </Link>
                  <Link
                    href="/credit-card"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-slate-700">Compare Credit Cards</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
