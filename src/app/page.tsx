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
  { name: 'Axis Bank', icon: '🏦' },
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
      <section className="relative pt-24 lg:pt-32 pb-20 bg-white overflow-hidden">
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
            <div className="relative hidden lg:block h-[500px]">
              {/* Background shape with user's requested color, matching Figma border radius */}
              <div className="absolute inset-0 bg-[rgba(63,101,234,0.11)] rounded overflow-hidden">
                {/* mix-blend-darken hides white backgrounds making them transparent to the color underneath */}
                <Image
                  src="/hero_man.png"
                  alt="RupeeQuik User"
                  width={600}
                  height={700}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[115%] w-[auto] max-w-none object-cover object-bottom z-10 mix-blend-darken"
                  priority
                />
              </div>

              {/* Floating overlays matching Figma */}
              <div className="absolute top-[25%] -left-12 bg-white px-5 py-4 z-20 flex flex-col gap-1.5 min-w-[200px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-sm">
                <p className="text-[16px] font-bold text-[#1C295E] leading-tight">Soft credit check done</p>
                <p className="text-[13px] text-slate-600">No score impact</p>
              </div>

              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-white px-5 py-4 z-20 flex gap-4 items-center min-w-[320px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-sm">
                <div className="w-11 h-11 bg-[#10A37F] flex items-center justify-center shrink-0 rounded-sm">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                    {/* Simplified geometric approximation since we don't have the exact logo SVG string here, we use a placeholder or stylized logo icon */}
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[16px] font-bold text-[#1C295E] leading-tight">Offer unlocked in 2 minutes</p>
                  <p className="text-[13px] text-slate-600">1,240 people checked eligibility today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee Bar */}
      <section className="py-5 overflow-hidden bg-[#1C295E]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-sm text-white font-medium mx-8 flex items-center gap-10">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
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
        <div className="lg:w-1/2 bg-[#F4F6FF] py-20 px-8 flex items-center justify-center min-h-[500px]">
          <div className="relative w-full max-w-md mt-10">
            {/* Payment History Badge */}
            <div className="absolute -top-10 -left-6 bg-white rounded-xl px-5 py-3 shadow-[0_10px_30px_rgb(0,0,0,0.05)] border border-slate-50 z-20">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50"></div>
                <div>
                  <p className="text-[13px] text-slate-500 mb-0.5">Payment History</p>
                  <p className="text-sm font-bold text-emerald-500">Low Impact</p>
                </div>
              </div>
            </div>

            {/* Credit Card Util Badge */}
            <div className="absolute top-0 -right-6 bg-white rounded-xl px-5 py-3 shadow-[0_10px_30px_rgb(0,0,0,0.05)] border border-slate-50 z-20">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-orange-50"></div>
                <div>
                  <p className="text-[13px] text-slate-500 mb-0.5">Credit card utilisation</p>
                  <p className="text-sm font-bold text-[#4A69FF]">High Impact</p>
                </div>
              </div>
            </div>

            {/* Gauge */}
            <div className="mt-10 relative bg-white w-full aspect-video rounded-t-full border-t-[16px] border-l-[16px] border-r-[16px] border-white shadow-[0_20px_50px_rgb(0,0,0,0.05)] overflow-hidden">
              {/* Colorful gauge track */}
              <div className="absolute inset-0 rounded-t-full border-[20px] border-transparent" style={{ borderImage: 'linear-gradient(to right, #ef4444, #f59e0b, #10b981) 1' }}></div>
              <div className="absolute bottom-0 left-0 w-full h-[20px] bg-white text-center"></div>
              {/* Inner styling */}
              <div className="absolute bottom-0 left-0 w-full text-center pb-4">
                <div className="w-16 h-16 rounded-t-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mx-auto -mb-8"></div>
                <p className="text-[17px] font-bold text-slate-600 tracking-[0.2em] mt-10">CREDIT SCORE</p>
              </div>
            </div>
            {/* Base */}
            <div className="h-16 w-[120%] -ml-[10%] bg-[#4A69FF] rounded-t-xl -mt-2 shadow-xl z-30 relative border-t-[4px] border-indigo-300"></div>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className="lg:w-1/2 bg-[#1C295E] py-20 px-8 flex items-center justify-center">
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
                <div className="flex bg-white rounded-md overflow-hidden h-14">
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
                <input type="checkbox" id="consent" className="mt-1 shrink-0 w-4 h-4 rounded border-slate-300 text-[#4A69FF] focus:ring-[#4A69FF] cursor-pointer" defaultChecked />
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
          <div className="mb-16 text-center">
            <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">Why Us</span>
            <h2 className="text-4xl lg:text-[44px] font-bold text-[#1C295E] mt-4 mb-4">
              Why Choose Rupeequik?
            </h2>
            <p className="text-slate-500 text-[17px] mx-auto max-w-3xl">
              A transparent, digital-first credit marketplace built on trust, compliance and smart technology. Compare, check eligibility and apply with confidence — all in one place.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left large box */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col pt-12 pl-12 pr-12 lg:pr-6">
              <div className="z-10 w-full pr-10">
                <h3 className="text-[28px] font-bold text-[#1C295E] mb-4">Wide Choice of Lenders</h3>
                <p className="text-slate-500 text-[15px] leading-relaxed mb-6">
                  We partner with leading banks and NBFCs to offer a broad range of personal loans, home loans and credit cards — all in one place.
                </p>
              </div>

              {/* Right side graphic inside left box */}
              <div className="mt-auto relative flex justify-end items-end h-[300px]">
                <div className="absolute bottom-0 right-0 bg-[#F4F6FF] w-[90%] h-[150%] rounded-tl-[2rem] -z-10"></div>
                <div className="absolute top-10 left-0 bg-white rounded-full px-5 py-2.5 shadow-sm font-bold text-[13px] text-slate-700">Instant Approvals</div>
                <Image src="/instant_app.png" alt="Instant Approvals" width={280} height={400} className="object-contain object-bottom h-full w-auto" />
              </div>
            </div>

            {/* Right stacked boxes */}
            <div className="grid grid-rows-2 gap-8">
              {/* Fast Digital */}
              <div className="bg-[#1C295E] rounded-[2rem] p-10 flex flex-col justify-center relative overflow-hidden group border border-[#1C295E]">
                <div className="absolute top-10 right-10 bg-[#F77F00] text-white text-xs font-bold px-3 py-1.5 rounded-full z-20">24 Hours*</div>
                <h3 className="text-[28px] font-bold text-white mb-2 relative z-10">Fast Digital Process</h3>
                <div className="absolute -bottom-10 -right-10 bg-white/5 w-64 h-64 rounded-full rotate-45 transform"></div>
              </div>

              {/* Safe & Secure */}
              <div className="bg-[#4A69FF] rounded-[2rem] p-10 flex flex-col justify-center relative overflow-hidden text-white">
                <h3 className="text-[28px] font-bold mb-4 z-10">Safe &amp; Secure</h3>
                <p className="text-white/80 text-[15px] leading-relaxed max-w-sm z-10">
                  Your data is encrypted and handled according to RBI digital lending guidelines. We follow strict consent-based data practices.
                </p>
                <div className="absolute -right-4 -bottom-4 opacity-20">
                  <Shield className="w-48 h-48" />
                </div>
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

            {/* Tabs */}
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              {['Personal Loan', 'Home Loan', 'Business Loan'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEmiTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${emiTab === tab ? 'bg-[#1C295E] text-white border-[#1C295E]' : 'bg-transparent text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 lg:p-12">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
              {/* Sliders */}
              <div className="lg:col-span-3 space-y-12 py-4">
                {/* Loan Amount */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-slate-600">Enter Loan Amount</label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold text-2xl text-[#1C295E] w-auto inline-block">
                      ₹ {(emiAmount).toLocaleString()}
                    </div>
                    <div className="flex bg-slate-50 rounded-full p-1 border border-slate-100 overflow-x-auto">
                      <span className="px-5 py-2 rounded-full text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 whitespace-nowrap">₹1L</span>
                      <span className="px-5 py-2 rounded-full border border-[#4A69FF] text-[#4A69FF] text-xs font-bold cursor-pointer whitespace-nowrap">₹5L</span>
                      <span className="px-5 py-2 rounded-full text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 whitespace-nowrap">₹10L</span>
                      <span className="px-5 py-2 rounded-full text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 whitespace-nowrap">₹15L</span>
                      <span className="px-5 py-2 rounded-full text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 whitespace-nowrap">₹20L</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={5000000}
                    step={10000}
                    value={emiAmount}
                    onChange={(e) => setEmiAmount(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-3 uppercase">
                    <span>50K</span><span>50L</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-10">
                  {/* Rate of Interest */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-slate-600">Rate of Interest <span className="text-[10px] text-slate-400 font-normal">(Yearly %)</span></label>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold text-2xl text-[#1C295E] mb-6 w-full max-w-[12rem]">
                      {emiRate}
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={30}
                      step={0.5}
                      value={emiRate}
                      onChange={(e) => setEmiRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-3 uppercase">
                      <span>8%</span><span>30%</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-semibold text-slate-600">Loan Tenure</label>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold text-2xl text-[#1C295E] w-full max-w-[8rem]">
                        {emiTenure}
                      </div>
                      <div className="flex bg-slate-50 rounded-full border border-slate-200 overflow-hidden text-sm font-bold shadow-sm">
                        <button
                          onClick={() => setEmiTenureType('Mo')}
                          className={`px-4 py-2 w-14 transition-colors ${emiTenureType === 'Mo' ? 'bg-white text-[#4A69FF] shadow' : 'text-slate-500'}`}
                        >Mo</button>
                        <button
                          onClick={() => setEmiTenureType('Yr')}
                          className={`px-4 py-2 w-14 transition-colors ${emiTenureType === 'Yr' ? 'bg-[#F4F6FF] border border-[#4A69FF] text-[#4A69FF] rounded-full shadow-sm relative -ml-2 z-10' : 'bg-transparent text-slate-500'}`}
                        >Yr</button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={emiTenureType === 'Yr' ? 10 : 120}
                      step={1}
                      value={emiTenure}
                      onChange={(e) => setEmiTenure(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-3 uppercase">
                      <span>1{emiTenureType}</span><span>{emiTenureType === 'Yr' ? '10Y' : '120M'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2 bg-[#F4F6FF] rounded-[2rem] p-8 lg:p-10 flex flex-col justify-center border border-[#e8ecff]">
                <div className="text-center mb-10 text-[#1C295E]">
                  <p className="text-[17px] font-semibold mb-2">Your Monthly EMI Payment</p>
                  <p className="text-5xl font-bold font-mono tracking-tight">₹ {Math.round(emi).toLocaleString()}</p>
                </div>

                <div className="space-y-4 text-[15px] font-medium text-slate-700">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1C295E]"></span>Principal Amount</span>
                    <span className="font-bold text-[#1C295E]">₹ {emiAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300"></span>Interest Amount</span>
                    <span className="font-bold text-[#1C295E]">₹ {Math.round(totalPayment - emiAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 mt-2">
                    <span className="text-[17px] font-bold text-[#1C295E]">Total Amount</span>
                    <span className="text-[17px] font-bold text-[#1C295E]">₹ {Math.round(totalPayment).toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/apply" className="w-full text-center py-4 bg-[#4A69FF] text-white font-bold rounded-lg mt-8 hover:bg-[#3B55D9] transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20">
                  Get Instant Loan <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-6">
            <div>
              <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">TESTIMONIALS</span>
              <h2 className="text-4xl lg:text-[44px] font-bold text-[#1C295E] mt-4 leading-tight">
                Let&apos;s See What User Say<br />About Us
              </h2>
              <p className="text-slate-500 text-[15px] mt-4 max-w-md">
                Your financial well-being is our priority. We offer tailored loan solutions and dedicated support for your needs.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-6 h-6 text-slate-400" />
              </button>
              <button className="w-14 h-14 rounded-full bg-[#4A69FF] flex items-center justify-center hover:bg-[#3B55D9] shadow-lg shadow-blue-500/20 transition-colors">
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-center overflow-hidden min-h-[350px]">
              {/* Left Cutoff Card */}
              <div className="w-[30%] lg:w-[25%] absolute left-0 opacity-40 blur-[2px] transition-all hidden md:block">
                <div className="bg-white rounded-[2rem] border border-slate-100 h-[280px] shadow-sm overflow-hidden translate-x-[-20%]">
                  <img src="/rajesh.png" className="w-full h-full object-cover scaleX(-1)" alt="User" />
                </div>
              </div>

              {/* Center Main Card */}
              <div className="w-full md:w-[60%] lg:w-[50%] z-20 relative px-4">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.08)] flex flex-col sm:flex-row gap-8 items-center text-center sm:text-left">
                  <div className="w-40 h-40 shrink-0 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                    <img src="/rajesh.png" className="w-full h-full object-cover" alt="Rajesh Kumar" />
                  </div>
                  <div className="flex-1">
                    <div className="text-6xl text-[#1C295E] font-serif leading-none h-8 mb-4">“</div>
                    <p className="text-xl font-semibold text-[#1C295E] leading-relaxed mb-6">
                      When I faced a medical emergency, I was unsure where to turn. The quick loan approval process helped me cover my expenses without stress. I am grateful for the support I received!
                    </p>
                    <div>
                      <p className="font-bold text-lg text-[#1C295E]">Rajesh Kumar</p>
                      <p className="text-slate-500 text-sm mt-1">Software Engineer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Cutoff Card */}
              <div className="w-[30%] lg:w-[25%] absolute right-0 opacity-40 blur-[2px] transition-all hidden md:block">
                <div className="bg-white rounded-[2rem] border border-slate-100 h-[280px] shadow-sm overflow-hidden translate-x-[20%]">
                  <img src="/instant_app.png" className="w-full h-full object-cover scale-[1.5] origin-top" alt="User" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners section */}
      <section className="py-24 bg-white border-t border-slate-100 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider">PARTNERS</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1C295E] mt-4 mb-4">
            Trusted by Leading Banks & Financial Institutions
          </h2>
          <p className="text-slate-500 text-[15px] mb-16">All partners are regulated financial institutions committed to fair lending practices.</p>

          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 opacity-70">
            {bankPartners.map((bank, i) => (
              <div key={i} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded shrink-0 bg-rose-50 text-rose-500 flex items-center justify-center font-bold">^</div>
                <span className="font-bold text-slate-800 text-xl">{bank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
