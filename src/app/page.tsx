'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Shield, Clock, ChevronLeft, ChevronRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const marqueeItems = [
  '20+ Bank Partners',
  '590+ Card Options',
  'Free Credit Checks',
  'Free Account Alerts',
  'Free Expert Advice',
  'Free Rate Monitoring',
  'Free Loan Comparison',
];

const bankPartners = [
  { name: 'HDFC Bank', icon: '🏦' },
  { name: 'ICICI Bank', icon: '🏦' },
  { name: 'Axis Bank', icon: '🏦' },
  { name: 'SBI', icon: '🏦' },
  { name: 'Kotak Bank', icon: '🏦' },
  { name: 'Yes Bank', icon: '🏦' },
];

export default function HomePage() {
  const [emiAmount, setEmiAmount] = useState(500000);
  const [emiRate, setEmiRate] = useState(10.5);
  const [emiTenure, setEmiTenure] = useState(3);
  const [emiTenureType, setEmiTenureType] = useState<'Mo' | 'Yr'>('Yr');
  const [phone, setPhone] = useState('');
  const [emiTab, setEmiTab] = useState('Personal Loan');

  // EMI Calculation
  const tenureMonths = emiTenureType === 'Yr' ? emiTenure * 12 : emiTenure;
  const monthlyRate = emiRate / 12 / 100;
  const emi = monthlyRate > 0
    ? (emiAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    : emiAmount / tenureMonths;
  const totalPayment = emi * tenureMonths;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 lg:pt-40 pb-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="max-w-2xl">
              <div className="mb-6">
                <span className="text-sm text-[#4A69FF] font-bold uppercase tracking-wider">Get Approvals in Mins</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-[#1C295E] leading-[1.05] tracking-tight mb-8">
                India&apos;s best<br />platform for<br />
                <span className="text-[#4A69FF]">Loans, Cards &amp;<br />Investments</span>
              </h1>

              <p className="text-[17px] text-slate-500 leading-relaxed mb-10 max-w-md">
                Compare by total cost, not just discounts.<br />
                See eligible offers with a soft credit check
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#4A69FF] text-white rounded-md font-bold text-[15px] hover:bg-[#2B3B8B] transition-all"
                >
                  Check Your Eligibility
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center px-8 py-4 border border-[#cfd7ff] text-[#4A69FF] rounded-md font-bold text-[15px] hover:bg-[#f5f7ff] transition-all"
                >
                  Check CIBIL Score
                </Link>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative hidden lg:block h-[480px]">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="/hero-person.png"
                  alt="RupeeQuik User"
                  width={407}
                  height={557}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[110%] w-auto max-w-none object-cover object-bottom z-10"
                  priority
                />
              </div>

              {/* Floating badge — Soft credit check */}
              <div className="absolute top-[30%] -left-8 bg-white px-5 py-4 z-20 flex items-center gap-4 min-w-[220px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#F4F6FF] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#4A69FF]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] font-bold text-[#1C295E] leading-tight">Soft credit check done</p>
                  <p className="text-[13px] text-slate-500">No score impact</p>
                </div>
              </div>

              {/* Floating badge — Offer unlocked */}
              <div className="absolute bottom-[5%] right-0 bg-white px-5 py-4 z-20 flex gap-4 items-center min-w-[285px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#10A37F] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[15px] font-bold text-[#1C295E] leading-tight">Offer unlocked in 2 minutes</p>
                  <p className="text-[13px] text-slate-500">1,240 people checked eligibility today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee Bar */}
      <section className="py-4 overflow-hidden bg-white border-y border-slate-100">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-sm text-[#1C295E] font-medium mx-8 flex items-center gap-10">
              {item}
              <span className="w-1 h-1 rounded-full bg-[#4A69FF]/40"></span>
            </span>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 gap-4">
            <div>
              <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">Products</span>
              <h2 className="text-4xl lg:text-[44px] font-bold text-[#1C295E] mt-4 leading-tight">
                Find the Right Credit Product<br />for You
              </h2>
            </div>
            <p className="text-slate-500 text-lg lg:mt-10 lg:text-right">
              Compare offers from top banks and lenders.<br />
              Check eligibility with a soft inquiry — no impact on your credit score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Personal Loans */}
            <div className="group relative bg-[#F4F6FF] rounded-[2rem] overflow-hidden aspect-[4/5] flex flex-col">
              <div className="pt-10 px-10 text-center z-10">
                <h3 className="text-2xl font-bold text-[#1C295E]">Personal Loans</h3>
              </div>
              <div className="absolute inset-0 mt-20">
                <Image src="/personal_loan.png" alt="Personal Loans" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <Link href="/personal-loan" className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#4A69FF] hover:text-white transition-colors z-20 group">
                <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-white" />
              </Link>
            </div>

            {/* Credit Cards */}
            <div className="group relative bg-[#F4F6FF] rounded-[2rem] overflow-hidden aspect-[4/5] flex flex-col">
              <div className="pt-10 px-10 text-center z-10">
                <h3 className="text-2xl font-bold text-[#1C295E]">Credit Cards</h3>
              </div>
              <div className="absolute inset-0 mt-20">
                <Image src="/credit_card.png" alt="Credit Cards" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <Link href="/credit-card" className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#4A69FF] hover:text-white transition-colors z-20 group">
                <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-white" />
              </Link>
            </div>

            {/* Insurance */}
            <div className="group relative bg-[#F4F6FF] rounded-[2rem] overflow-hidden aspect-[4/5] flex flex-col">
              <div className="pt-10 px-10 text-center z-10">
                <h3 className="text-2xl font-bold text-[#1C295E]">Insurance</h3>
              </div>
              <div className="absolute inset-0 mt-20">
                <Image src="/insurance.png" alt="Insurance" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <Link href="/apply" className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#4A69FF] hover:text-white transition-colors z-20 group">
                <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CIBIL Score Banner */}
      <section className="flex flex-col lg:flex-row">
        {/* Left Side — Score Illustration */}
        <div className="lg:w-[43%] bg-[#F4F6FF] py-20 px-8 flex items-center justify-center min-h-[568px] relative">
          <div className="relative w-full max-w-md">
            {/* Payment History Badge */}
            <div className="absolute -top-4 left-0 bg-white rounded-xl px-5 py-4 shadow-[0_10px_30px_rgb(0,0,0,0.06)] z-20">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-emerald-400"></div>
                </div>
                <div>
                  <p className="text-[13px] text-slate-500 mb-0.5">Payment History</p>
                  <p className="text-sm font-bold text-emerald-500">Low Impact</p>
                </div>
              </div>
            </div>

            {/* Credit Card Util Badge */}
            <div className="absolute -top-4 right-0 bg-white rounded-xl px-5 py-4 shadow-[0_10px_30px_rgb(0,0,0,0.06)] z-20">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-orange-400"></div>
                </div>
                <div>
                  <p className="text-[13px] text-slate-500 mb-0.5">Credit card utilisation</p>
                  <p className="text-sm font-bold text-[#4A69FF]">High Impact</p>
                </div>
              </div>
            </div>

            {/* Credit Score Gauge */}
            <div className="mt-24 flex flex-col items-center">
              <div className="relative w-[280px] h-[160px]">
                {/* Gauge arc background */}
                <svg viewBox="0 0 280 160" className="w-full h-full">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="30%" stopColor="#f59e0b" />
                      <stop offset="60%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  {/* Background arc */}
                  <path d="M 30 150 A 110 110 0 0 1 250 150" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
                  {/* Colored arc */}
                  <path d="M 30 150 A 110 110 0 0 1 250 150" fill="none" stroke="url(#gaugeGradient)" strokeWidth="18" strokeLinecap="round" />
                  {/* Needle */}
                  <line x1="140" y1="150" x2="190" y2="60" stroke="#1C295E" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="140" cy="150" r="8" fill="#1C295E" />
                  <circle cx="140" cy="150" r="4" fill="white" />
                </svg>
                {/* Score text */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-xs font-bold text-slate-400 tracking-[0.2em]">CREDIT SCORE</p>
                </div>
              </div>
              {/* Base bar */}
              <div className="w-[320px] h-10 bg-[#4A69FF] rounded-lg -mt-2 relative z-10 flex items-center justify-center">
                <div className="flex gap-8 text-white/70 text-xs font-medium">
                  <span>Poor</span><span>Fair</span><span>Good</span><span>Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className="lg:w-[57%] bg-[#1C295E] py-20 px-8 flex items-center justify-center relative">
          <div className="max-w-md w-full">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
              Get your latest FREE<br />Credit Report
            </h2>

            <div className="flex items-center gap-3 mb-10">
              <div className="flex -space-x-3">
                <img src="/rajesh.png" className="w-10 h-10 rounded-full border-2 border-[#1C295E] object-cover" alt="User 1" />
                <div className="w-10 h-10 rounded-full border-2 border-[#1C295E] bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">U2</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1C295E] bg-[#4A69FF] flex items-center justify-center text-xs text-white font-bold">1M+</div>
              </div>
              <p className="text-white/80 text-[15px]">10 lakhs+ people have got their Credit Scores for free</p>
            </div>

            <div className="w-full space-y-5 relative z-10">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Phone number</label>
                <div className="flex bg-white rounded-lg overflow-hidden h-[75px]">
                  <div className="flex items-center px-4 bg-white border-r border-slate-200 cursor-pointer">
                    <span className="text-[15px] font-medium text-slate-600">IND</span>
                    <ChevronDown className="w-4 h-4 ml-2 text-slate-500" />
                  </div>
                  <div className="flex items-center px-4">
                    <span className="text-[15px] text-slate-500">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-2 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" id="consent" className="mt-1 shrink-0 w-5 h-5 rounded border-slate-300 text-[#4A69FF] focus:ring-[#4A69FF] cursor-pointer" defaultChecked />
                <label htmlFor="consent" className="text-white/70 text-xs leading-relaxed cursor-pointer">
                  I hereby appoint RupeeQuik as my authorised representative to receive my credit information from Cibil / Equifax / Experian / CRIF Highmark (bureau)....
                </label>
              </div>

              <button className="w-full text-center py-4 bg-[#F77F00] text-white font-bold text-[15px] rounded-md hover:bg-[#e67600] transition-colors mt-2">
                Check FREE credit score
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RupeeQuick */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 gap-6">
            <div className="lg:max-w-[640px]">
              <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">Why Us</span>
              <h2 className="text-4xl lg:text-[44px] font-bold text-[#1C295E] mt-4 mb-4">
                Why Choose Rupeequik?
              </h2>
              <p className="text-slate-500 text-[17px]">
                A transparent, digital-first credit marketplace built on trust, compliance and smart technology. Compare, check eligibility and apply with confidence — all in one place.
              </p>
            </div>
            <p className="text-slate-500 text-[15px] leading-relaxed lg:max-w-[416px] lg:mt-14">
              Rupeequik simplifies credit decisions by combining transparent comparison, soft eligibility checks and partnerships with trusted banks and NBFCs. We focus on clarity, compliance and customer control at every step.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
            {/* Left large box */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col pt-8 pl-8 pr-8 lg:pr-6 min-h-[402px]">
              <div className="z-10 w-full max-w-[322px] pt-4 pl-4">
                <h3 className="text-[24px] font-bold text-[#1C295E] mb-3">Wide Choice of Lenders</h3>
                <p className="text-slate-500 text-[15px] leading-relaxed mb-6">
                  We partner with leading banks and NBFCs to offer a broad range of personal loans, home loans and credit cards — all in one place.
                </p>
              </div>

              {/* Concentric circles with bank icons */}
              <div className="absolute bottom-[-50px] left-[-20px] z-0">
                <div className="w-[300px] h-[300px] rounded-full border border-[#4A69FF]/10 flex items-center justify-center">
                  <div className="w-[240px] h-[240px] rounded-full border border-[#4A69FF]/15 flex items-center justify-center">
                    <div className="w-[180px] h-[180px] rounded-full border border-[#4A69FF]/20 flex items-center justify-center">
                      <div className="w-[120px] h-[120px] rounded-full border border-[#4A69FF]/25"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side graphic inside left box */}
              <div className="mt-auto relative flex justify-end items-end h-[260px]">
                <div className="absolute bottom-0 right-0 bg-[#F4F6FF] w-[241px] h-[310px] rounded-tl-[1rem] z-[1] overflow-hidden">
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <span className="bg-white rounded-full px-5 py-2 shadow-sm font-bold text-[13px] text-slate-700">Instant Approvals</span>
                  </div>
                  <Image src="/instant_app.png" alt="Instant Approvals" width={218} height={327} className="absolute bottom-0 left-0 object-contain object-bottom w-full" />
                </div>
              </div>

              {/* RupeeQuik logo at bottom left */}
              <div className="absolute bottom-6 left-8 z-10">
                <Image src="/logo.png" alt="RupeeQuik" width={128} height={27} className="h-7 w-auto opacity-80" />
              </div>
            </div>

            {/* Right stacked boxes */}
            <div className="grid grid-rows-[auto_1fr] gap-8">
              {/* Fast Digital — compact like Figma (72px height) */}
              <div className="bg-[#1C295E] rounded-xl px-5 py-5 flex items-center justify-between relative overflow-hidden h-[72px]">
                <h3 className="text-[20px] font-bold text-white relative z-10">Fast Digital Process</h3>
                <div className="bg-[#F77F00] text-white text-xs font-bold px-3 py-1.5 rounded-full z-20">24 Hours*</div>
              </div>

              <div className="bg-[#4A69FF] rounded-[2rem] p-10 flex flex-col justify-center relative overflow-hidden text-white">
                <h3 className="text-[28px] font-bold mb-4 z-10">Safe &amp; Secure</h3>
                <p className="text-white/80 text-[15px] leading-relaxed max-w-sm z-10">Your data is encrypted and handled according to RBI digital lending guidelines. We follow strict consent-based data practices.</p>
                <div className="absolute right-0 bottom-0 w-[60%] h-[60%] opacity-10"><svg viewBox="0 0 300 260" fill="none" className="w-full h-full"><path d="M50 119C22 150 0 180 0 260H300V0C250 30 220 70 180 90C140 110 78 88 50 119Z" fill="white" /></svg></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">Know Your EMI</span>
            <h2 className="text-4xl lg:text-[44px] font-bold text-[#1C295E] mt-4 mb-4">EMI Calculator</h2>
            <p className="text-slate-500 text-[15px]">EMI (Equated Monthly Instalment) is calculated using the reducing balance method.</p>
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              {['Personal Loan', 'Home Loan', 'Business Loan'].map((tab) => (
                <button key={tab} onClick={() => setEmiTab(tab)} className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${emiTab === tab ? 'bg-[#1C295E] text-white border-[#1C295E]' : 'bg-transparent text-slate-700 border-slate-200 hover:border-slate-400'}`}>{tab}</button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-[60%_1px_1fr]">
              <div className="p-6 lg:p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-[#1C295E] mb-4">Calculate Your {emiTab} EMI</h3>
                  <p className="text-xs font-medium text-slate-500 mb-2">Select Your Bank</p>
                  <div className="flex gap-2 flex-wrap">
                    {['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map((b) => (<div key={b} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer hover:border-[#4A69FF]"><div className="w-[18px] h-[18px] rounded bg-slate-200"></div>{b}</div>))}
                    <div className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 cursor-pointer">More</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-4 block">Enter Loan Amount</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold text-2xl text-[#1C295E]">₹ {emiAmount.toLocaleString()}</div>
                    <div className="flex bg-slate-50 rounded-full p-1 border border-slate-100 overflow-x-auto">
                      {['₹1L','₹5L','₹10L','₹15L','₹20L'].map((v,i) => (<span key={i} className="px-5 py-2 rounded-full text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 whitespace-nowrap">{v}</span>))}
                    </div>
                  </div>
                  <input type="range" min={50000} max={5000000} step={10000} value={emiAmount} onChange={(e) => setEmiAmount(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]" />
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-3"><span>50K</span><span>50L</span></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-10">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 mb-4 block">Rate of Interest <span className="text-[10px] text-slate-400 font-normal">(Yearly %)</span></label>
                    <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold text-2xl text-[#1C295E] mb-6 max-w-[12rem]">{emiRate}</div>
                    <input type="range" min={8} max={30} step={0.5} value={emiRate} onChange={(e) => setEmiRate(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]" />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-3"><span>8%</span><span>30%</span></div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 mb-4 block">Loan Tenure</label>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold text-2xl text-[#1C295E] max-w-[8rem]">{emiTenure}</div>
                      <div className="flex bg-slate-50 rounded-full border border-slate-200 overflow-hidden text-sm font-bold shadow-sm">
                        <button onClick={() => setEmiTenureType('Mo')} className={`px-4 py-2 w-14 transition-colors ${emiTenureType === 'Mo' ? 'bg-white text-[#4A69FF] shadow' : 'text-slate-500'}`}>Mo</button>
                        <button onClick={() => setEmiTenureType('Yr')} className={`px-4 py-2 w-14 transition-colors ${emiTenureType === 'Yr' ? 'bg-[#F4F6FF] text-[#4A69FF]' : 'text-slate-500'}`}>Yr</button>
                      </div>
                    </div>
                    <input type="range" min={1} max={emiTenureType === 'Yr' ? 10 : 120} step={1} value={emiTenure} onChange={(e) => setEmiTenure(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]" />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-3"><span>1{emiTenureType}</span><span>{emiTenureType === 'Yr' ? '10Y' : '120M'}</span></div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block bg-slate-200"></div>
              <div className="flex flex-col">
                <div className="text-center p-8 text-[#1C295E]">
                  <p className="text-[17px] font-semibold mb-2">Your Monthly EMI Payment</p>
                  <p className="text-5xl font-bold font-mono tracking-tight">₹ {Math.round(emi).toLocaleString()}</p>
                </div>
                <div className="bg-[#F4F6FF] flex-1 p-8 flex flex-col justify-between">
                  <div className="space-y-4 text-[15px] font-medium text-slate-700">
                    <div className="flex justify-between items-center py-2"><span>Principal Amount</span><span className="font-bold text-[#1C295E]">₹ {emiAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center py-2"><span>Interest Amount</span><span className="font-bold text-[#1C295E]">₹ {Math.round(totalPayment - emiAmount).toLocaleString()}</span></div>
                    <div className="flex justify-between items-center py-3 border-t border-slate-200/60 mt-2"><span className="font-bold text-[#1C295E]">Total Amount</span><span className="font-bold text-[#1C295E]">₹ {Math.round(totalPayment).toLocaleString()}</span></div>
                  </div>
                  <Link href="/apply" className="w-full text-center py-4 bg-[#4A69FF] text-white font-bold rounded-lg mt-6 hover:bg-[#3B55D9] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">Get Instant Loan <ArrowRight className="w-5 h-5" /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-16 gap-6">
            <div>
              <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">TESTIMONIALS</span>
              <h2 className="text-4xl lg:text-[44px] font-bold text-[#1C295E] mt-4 leading-tight">Let&apos;s See What User Say<br />About Us</h2>
              <p className="text-slate-500 text-[15px] mt-4 max-w-md">Your financial well-being is our priority. We offer tailored loan solutions and dedicated support for your needs.</p>
            </div>
            <div className="flex gap-3 lg:mt-40">
              <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
              <button className="w-12 h-12 rounded-full bg-[#4A69FF] flex items-center justify-center hover:bg-[#3B55D9] shadow-lg shadow-blue-500/20 transition-colors"><ChevronRight className="w-5 h-5 text-white" /></button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.06)] p-3 max-w-[964px]">
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="w-full sm:w-[280px] h-[304px] shrink-0 rounded-xl overflow-hidden bg-slate-100"><img src="/rajesh.png" className="w-full h-full object-cover" alt="Rajesh Kumar" /></div>
              <div className="flex-1 flex flex-col justify-between py-4 pr-4">
                <div>
                  <div className="mb-4"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M8 20H4L8 12H4V4H12V12L8 20ZM22 20H18L22 12H18V4H26V12L22 20Z" fill="#1C295E" /></svg></div>
                  <p className="text-[17px] font-medium text-[#1C295E] leading-relaxed">&ldquo;When I faced a medical emergency, I was unsure where to turn. The quick loan approval process helped me cover my expenses without stress. I am grateful for the support I received!&rdquo;</p>
                </div>
                <div className="mt-6">
                  <p className="font-bold text-lg text-[#1C295E]">Rajesh Kumar</p>
                  <p className="text-slate-500 text-sm mt-1">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">PARTNERS</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1C295E] mt-4 mb-4">Trusted by Leading Banks &amp; Financial Institutions</h2>
          <p className="text-slate-500 text-[15px] mb-16">All partners are regulated financial institutions committed to fair lending practices.</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {bankPartners.map((bank, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-6 py-4 w-[198px] hover:border-[#4A69FF]/30 hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center"><div className="w-[18px] h-[18px] rounded bg-[#4A69FF]/20"></div></div>
                <span className="font-semibold text-slate-800 text-[15px]">{bank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
