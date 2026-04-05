'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Phone, KeyRound, User, Tag, Check, ArrowRight, Loader2 } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  category: string;
  dsaName: string;
  description: string;
  interestRate: string;
  benefits: string;
  redirectUrl: string;
  status: string;
}

const steps = [
  { label: 'Mobile', icon: Phone },
  { label: 'Verify OTP', icon: KeyRound },
  { label: 'Details', icon: User },
  { label: 'Choose Offer', icon: Tag },
];

const categoryOptions = [
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'business-loan', label: 'Business Loan' },
  { value: 'home-loan', label: 'Home Loan' },
  { value: 'credit-card', label: 'Credit Card' },
];

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [mobile, setMobile] = useState(searchParams.get('phone') || '');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [income, setIncome] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [submittingOfferId, setSubmittingOfferId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
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
        body: JSON.stringify({ phone: mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.devOtp) setDevOtp(data.devOtp);
        setCurrentStep(2);
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
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
        // User is now auto-logged in. Fetch their profile to pre-populate fields.
        try {
          const meRes = await fetch('/api/auth/user-me');
          const meData = await meRes.json();
          if (meData.authenticated && meData.user) {
            if (meData.user.name && meData.user.name !== 'User') setName(meData.user.name);
            if (meData.user.email) setEmail(meData.user.email);
          }
        } catch { /* ignore - just won't pre-populate */ }
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
    if (!name.trim() || !email.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setOffersLoading(true);

    try {
      // Update lead with details
      if (leadId) {
        await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, email, income: income || undefined, category,
            status: 'details-filled',
          }),
        });
      }

      const url = category ? `/api/offers?category=${category}` : '/api/offers';
      const res = await fetch(url);
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : data.offers || []);
      setCurrentStep(4);
    } catch {
      setError('Failed to load offers. Please try again.');
    } finally {
      setOffersLoading(false);
    }
  };

  const handleSelectOffer = async (offer: Offer) => {
    setSubmittingOfferId(offer.id);
    setError('');
    try {
      if (leadId) {
        // Update existing lead with offer selection
        const res = await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offerId: offer.id,
            category: offer.category,
            status: 'redirected',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const redirectUrl = data.redirectUrl || offer.redirectUrl;
          window.open(redirectUrl, '_blank');
          setSubmitted(true);
        } else {
          setError('Submission failed. Please try again.');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmittingOfferId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-start justify-center bg-gray-50 py-12">
        {submitted ? (
          <div className="w-full max-w-md px-4 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-14 w-14 text-emerald-500" />
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Application Submitted Successfully!
            </h1>
            <p className="mt-4 text-gray-600">
              Thank you for your application. You have been redirected to our partner in a new tab.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Our team will also contact you shortly.
            </p>
            <a
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#1B1F6B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15185a]"
            >
              Back to Home
            </a>
          </div>
        ) : (
        <div className={`w-full px-4 ${currentStep === 4 ? 'max-w-4xl' : 'max-w-lg'}`}>
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

          {/* Steps 1-3: Card wrapper */}
          {currentStep < 4 && (
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1B1F6B]">
                  Step {currentStep} of 4
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {currentStep === 1 && 'Enter Your Mobile Number'}
                  {currentStep === 2 && 'Verify OTP'}
                  {currentStep === 3 && 'Your Details'}
                </h2>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
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
                    className="rounded-lg bg-[#1B1F6B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15185a] disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {currentStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  {devOtp && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                      <span className="font-bold">Dev Mode OTP:</span> {devOtp}
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enter the 4-digit OTP sent to +91 {mobile}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Enter OTP"
                      maxLength={4}
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-[#1B1F6B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15185a] disabled:opacity-50"
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

              {/* Step 3: Details */}
              {currentStep === 3 && (
                <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Monthly Income (optional)</label>
                    <input
                      type="text"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="e.g. 50000"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">I&apos;m looking for *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                    >
                      <option value="">Select a product</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={offersLoading}
                    className="rounded-lg bg-[#1B1F6B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15185a] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {offersLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {offersLoading ? 'Finding Best Offers...' : 'View Best Offers'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Step 4: Browse & Select Offers */}
          {currentStep === 4 && (
            <div>
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1B1F6B]">
                  Step 4 of 4
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Choose Your Best Offer
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  We found {offers.length} offer{offers.length !== 1 ? 's' : ''} matching your profile. Select one to proceed.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Category filter pills */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={async () => {
                      setCategory(opt.value);
                      setOffersLoading(true);
                      try {
                        const res = await fetch(`/api/offers?category=${opt.value}`);
                        const data = await res.json();
                        setOffers(Array.isArray(data) ? data : data.offers || []);
                      } catch { /* ignore */ }
                      setOffersLoading(false);
                    }}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      category === opt.value
                        ? 'bg-[#1B1F6B] text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B1F6B] hover:text-[#1B1F6B]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {offersLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1B1F6B]" />
                </div>
              ) : offers.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                  <p className="text-gray-500">No offers available for this category right now.</p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="mt-4 text-sm font-medium text-[#1B1F6B] hover:underline"
                  >
                    Go back and try a different category
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {offers.map((offer) => {
                    const features = offer.benefits ? offer.benefits.split(',').map((b) => b.trim()) : [];
                    const isSubmitting = submittingOfferId === offer.id;

                    return (
                      <div
                        key={offer.id}
                        className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:border-[#1B1F6B]/30"
                      >
                        {/* Header */}
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-[#1B1F6B]">
                            {offer.dsaName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{offer.dsaName}</p>
                            <h3 className="text-sm font-bold text-gray-900">{offer.title}</h3>
                          </div>
                        </div>

                        {/* Key info */}
                        {offer.interestRate && (
                          <div className="mb-3 flex items-center gap-4">
                            <div>
                              <p className="text-[10px] text-gray-400">Interest Rate</p>
                              <p className="text-sm font-bold text-[#1B1F6B]">{offer.interestRate}</p>
                            </div>
                          </div>
                        )}

                        {/* Benefits */}
                        <ul className="mb-4 flex flex-col gap-1.5">
                          {features.slice(0, 3).map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                              <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500" />
                              {f}
                            </li>
                          ))}
                        </ul>

                        {/* Apply button */}
                        <button
                          onClick={() => handleSelectOffer(offer)}
                          disabled={isSubmitting}
                          className="w-full rounded-lg bg-[#1B1F6B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2A2F8A] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Redirecting...
                            </>
                          ) : (
                            <>
                              Apply Now
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-sm text-gray-500 hover:text-[#1B1F6B]"
                >
                  &larr; Go back and edit details
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B1F6B]" />
      </div>
    }>
      <ApplyPageContent />
    </Suspense>
  );
}
