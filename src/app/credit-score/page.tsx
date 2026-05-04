'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, ShieldCheck, AlertTriangle, TrendingUp, CreditCard, Landmark, User, Check, X, Phone, KeyRound, CheckCircle } from 'lucide-react';

interface Account {
  type: string;
  bank: string;
  accountNumber: string;
  sanctionedAmount: number;
  currentBalance: number;
  status: string;
  openDate: string;
  closeDate?: string;
  paymentHistory: string[];
}

interface Report {
  score: number;
  scoreCategory: string;
  personalInfo: {
    name: string;
    pan: string;
    mobile: string;
    gender: string;
    dateOfBirth: string;
  };
  summary: {
    totalAccounts: number;
    activeAccounts: number;
    closedAccounts: number;
    totalBalance: number;
    totalSanctioned: number;
    overdueAccounts: number;
    recentEnquiries: number;
  };
  accounts: Account[];
  enquiries: { date: string; institution: string; purpose: string }[];
  reportDate: string;
}

function ScoreGauge({ score, category }: { score: number; category: string }) {
  const angle = ((score - 300) / 600) * 180;
  const color =
    score >= 800 ? '#10B981' :
    score >= 750 ? '#34D399' :
    score >= 700 ? '#F59E0B' :
    score >= 650 ? '#F97316' : '#EF4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-36 overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center">
          <div
            className="w-64 h-64 rounded-full border-[16px] border-gray-200"
            style={{ clipPath: 'inset(50% 0 0 0)' }}
          />
        </div>
        <div className="absolute inset-0 flex items-end justify-center">
          <div
            className="w-64 h-64 rounded-full border-[16px] border-transparent"
            style={{
              clipPath: 'inset(50% 0 0 0)',
              borderColor: color,
              transform: `rotate(${angle - 180}deg)`,
              transformOrigin: 'center center',
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-5xl font-extrabold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {category}
        </span>
      </div>
      <div className="mt-2 flex justify-between w-64 text-xs text-gray-400">
        <span>300</span>
        <span>500</span>
        <span>700</span>
        <span>900</span>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const steps = [
  { label: 'Mobile', icon: Phone },
  { label: 'Verify OTP', icon: KeyRound },
  { label: 'Details', icon: User },
];

export default function CreditScorePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [pan, setPan] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [cached, setCached] = useState(false);
  const [cachedMessage, setCachedMessage] = useState('');
  const [leadId, setLeadId] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile, purpose: 'loan-apply' }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.devOtp) setDevOtp(data.devOtp);
        setCurrentStep(2);
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile, otp, source: 'loan-apply' }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeadId(data.leadId);
        // User is now auto-logged in. Fetch their profile to pre-populate name.
        try {
          const meRes = await fetch('/api/auth/user-me');
          const meData = await meRes.json();
          if (meData.authenticated && meData.user) {
            if (meData.user.name && meData.user.name !== 'User') setName(meData.user.name);
          }
        } catch { /* ignore */ }
        setCurrentStep(3);
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pan.trim() || !gender) {
      setError('Please fill in all required fields');
      return;
    }
    if (!consent) {
      setError('Please provide consent to check your credit score');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Update lead with details
      if (leadId) {
        await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            pan: pan.toUpperCase(),
            gender,
            category: 'credit-score',
            status: 'details-filled',
          }),
        });
      }

      // Fetch credit score
      const res = await fetch('/api/credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          pan: pan.toUpperCase(),
          name,
          gender,
          consent: 'Y',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch credit score');
        return;
      }

      // Update lead status to credit-checked
      if (leadId) {
        await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'credit-checked' }),
        });
      }

      setReport(data.report);
      setCached(data.cached || false);
      if (data.message) setCachedMessage(data.message);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        {report ? (
          /* Report */
          <div className="mx-auto max-w-4xl px-4 py-8">
            {cached && cachedMessage && (
              <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                {cachedMessage}
              </div>
            )}

            {/* Score card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-12">
                <ScoreGauge score={report.score} category={report.scoreCategory} />

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">Your Credit Report</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Report generated on {new Date(report.reportDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{report.personalInfo.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 font-mono">PAN: {report.personalInfo.pan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-400">Total Accounts</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{report.summary.totalAccounts}</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-400">Active Accounts</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{report.summary.activeAccounts}</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-400">Total Balance</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(report.summary.totalBalance)}</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-400">Recent Enquiries</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">{report.summary.recentEnquiries}</p>
              </div>
            </div>

            {/* Account details */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Landmark className="h-5 w-5 text-[#1B1F6B]" />
                Credit Accounts
              </h3>

              <div className="mt-4 space-y-4">
                {report.accounts.map((account) => (
                  <div key={account.accountNumber} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{account.type}</p>
                        <p className="text-sm text-gray-500">{account.bank} &middot; {account.accountNumber}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          account.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {account.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Sanctioned</p>
                        <p className="font-semibold text-gray-800">{formatCurrency(account.sanctionedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Current Balance</p>
                        <p className="font-semibold text-gray-800">{formatCurrency(account.currentBalance)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Opened</p>
                        <p className="font-semibold text-gray-800">{new Date(account.openDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                      </div>
                      {account.closeDate && (
                        <div>
                          <p className="text-xs text-gray-400">Closed</p>
                          <p className="font-semibold text-gray-800">{new Date(account.closeDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                        </div>
                      )}
                    </div>

                    {/* Payment history */}
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-400 mb-1.5">Payment History (last 12 months)</p>
                      <div className="flex gap-1">
                        {account.paymentHistory.map((status, i) => (
                          <div key={i} className="flex flex-col items-center gap-0.5">
                            <div
                              className={`h-6 w-6 rounded flex items-center justify-center ${
                                status === 'On Time' ? 'bg-emerald-100' : 'bg-red-100'
                              }`}
                            >
                              {status === 'On Time' ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <X className="h-3 w-3 text-red-600" />
                              )}
                            </div>
                            <span className="text-[9px] text-gray-400">{months[i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enquiries */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <TrendingUp className="h-5 w-5 text-[#1B1F6B]" />
                Recent Enquiries
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Institution</th>
                      <th className="pb-2 font-medium">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.enquiries.map((enq, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 text-gray-700">
                          {new Date(enq.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-2.5 text-gray-700">{enq.institution}</td>
                        <td className="py-2.5 text-gray-700">{enq.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => { setReport(null); setCached(false); setCachedMessage(''); setCurrentStep(1); setMobile(''); setOtp(''); setDevOtp(''); setPan(''); setName(''); setGender(''); setConsent(false); setLeadId(null); }}
                className="rounded-lg border-2 border-[#1B1F6B] px-6 py-2.5 text-sm font-semibold text-[#1B1F6B] transition-colors hover:bg-[#1B1F6B] hover:text-white"
              >
                Check Another Score
              </button>
              <a
                href="/apply"
                className="rounded-lg bg-[#1B1F6B] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15185a]"
              >
                Apply for a Loan
              </a>
            </div>
          </div>
        ) : (
          /* Form with steps */
          <div className="mx-auto max-w-lg px-4 py-12">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Check Your Credit Score
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Free credit score check powered by TransUnion CIBIL. No impact on your score.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mb-8 flex items-center justify-center gap-2">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                const stepNum = i + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                return (
                  <div key={step.label} className="flex items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-[#1B1F6B] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`h-0.5 w-8 sm:w-12 ${
                          currentStep > stepNum ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1B1F6B]">
                  Step {currentStep} of 3
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {currentStep === 1 && 'Enter Your Mobile Number'}
                  {currentStep === 2 && 'Verify OTP'}
                  {currentStep === 3 && 'Your Details'}
                </h2>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Step 1: Mobile */}
              {currentStep === 1 && (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit number"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {currentStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  {/* Dev Mode Helper (Only shows in development) */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                      <span className="font-bold">Dev Mode:</span> OTP is {devOtp || 'sent to phone'}
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enter the 6-digit OTP sent to +91 {mobile}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter OTP"
                      maxLength={6}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-bold tracking-[0.25em] outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-gray-500 hover:text-[#1B1F6B]"
                  >
                    Change mobile number
                  </button>
                </form>
              )}

              {/* Step 3: PAN & Details */}
              {currentStep === 3 && (
                <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="As per PAN card"
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">PAN Number *</label>
                    <input
                      type="text"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                      placeholder="e.g. ABCDE1234F"
                      required
                      maxLength={10}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono uppercase outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <label className="mt-2 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1B1F6B] focus:ring-[#1B1F6B]"
                    />
                    <span className="text-xs text-gray-500">
                      I hereby consent to RupeeQuik accessing my credit information from TransUnion CIBIL
                      for the purpose of displaying my credit score and report. I understand this is a soft
                      inquiry and will not affect my credit score.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Fetching Your Score...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Get Free Credit Score
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                256-bit encrypted
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                No impact on score
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                100% free
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
