'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';

const bankOffers = [
  {
    name: 'HDFC Bank',
    logo: 'H',
    cashback: '₹2,000',
    rate: '11.25%',
    amount: '₹50 Lakhs',
    tenure: '5 Years',
    processingFee: 'Up to 2%',
    features: ['100% Digital Process', 'Minimal Documentation', 'Quick Approval in 24 Hours', 'Flexible Repayment Options'],
    emi: '16,134',
    bgLogo: 'bg-blue-100 text-blue-700',
    href: '/apply?bank=hdfc'
  },
  {
    name: 'ICICI Bank',
    logo: 'I',
    cashback: '₹1,500',
    rate: '11.50%',
    amount: '₹40 Lakhs',
    tenure: '4 Years',
    processingFee: 'Up to 1.5%',
    features: ['100% Digital Process', 'Minimal Documentation', 'Quick Approval in 48 Hours', 'Flexible Repayment Options'],
    emi: '15,000',
    bgLogo: 'bg-orange-100 text-orange-600',
    href: '/apply?bank=icici'
  },
  {
    name: 'Axis Bank',
    logo: 'A',
    cashback: '₹2,500',
    rate: '11.75%',
    amount: '₹60 Lakhs',
    tenure: '6 Years',
    processingFee: 'Up to 1.75%',
    features: ['100% Digital Process', 'Minimal Documentation', 'Quick Approval in 36 Hours', 'Flexible Repayment Options'],
    emi: '16,500',
    bgLogo: 'bg-red-100 text-red-700',
    href: '/apply?bank=axis'
  },
  {
    name: 'SBI Bank',
    logo: 'S',
    cashback: '₹1,000',
    rate: '11.45%',
    amount: '₹75 Lakhs',
    tenure: '7 Years',
    processingFee: 'Up to 1%',
    features: ['100% Digital Process', 'Minimal Documentation', 'Quick Approval in 72 Hours', 'Flexible Repayment Options'],
    emi: '17,000',
    bgLogo: 'bg-indigo-100 text-indigo-700',
    href: '/apply?bank=sbi'
  }
];

export default function BusinessLoanPage() {
  const [emiAmount, setEmiAmount] = useState(500000);
  const [emiRate, setEmiRate] = useState(11.25);
  const [emiTenure, setEmiTenure] = useState(3);
  const [emiTenureType, setEmiTenureType] = useState<'Mo' | 'Yr'>('Yr');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [emiCalculators, setEmiCalculators] = useState<Record<string, boolean>>({
    'HDFC Bank': true,
    'ICICI Bank': true,
    'Axis Bank': true,
    'SBI Bank': true
  });

  // Hero Form state
  const [companyName, setCompanyName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // EMI Calculation
  const tenureMonths = emiTenureType === 'Yr' ? emiTenure * 12 : emiTenure;
  const monthlyRate = emiRate / 12 / 100;
  const emi = monthlyRate > 0
    ? (emiAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    : emiAmount / tenureMonths;
  const totalPayment = emi * tenureMonths;

  const toggleCalculator = (bankName: string) => {
    setEmiCalculators(prev => ({
      ...prev,
      [bankName]: !prev[bankName]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section specifically for Business Loan */}
      <section className="relative pt-24 lg:pt-32 pb-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="max-w-2xl py-10 lg:pr-10">
              <div className="mb-6">
                <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                  QUICK ONLINE APPROVALS
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#1C295E] leading-[1.1] tracking-tight mb-8">
                Find the Best <br />
                <span className="text-[#4A69FF]">Business Loan</span> Offers <br />
                with Low Interest Rates
              </h1>

              <div className="flex flex-col gap-6 mb-12 relative">
                {/* Temporary reuse of hero_man graphic until business man graphic uploaded */}
                <Image src="/hero_man.png" alt="Happy Business Owner" width={300} height={300} className="rounded-2xl shrink-0 drop-shadow-xl" />
                <div className="absolute bottom-10 right-20 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                  <p className="text-xs font-bold text-[#1C295E] pr-2">Easy Online Process <span className="block text-[10px] text-slate-500 font-normal">Fast Disbursal</span></p>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Abstract Background Shapes & Right Form */}
        <div className="absolute top-0 right-0 w-full lg:w-[50%] h-full">
           <div className="absolute inset-0 bg-[#E8EDFF] lg:bg-transparent">
             <div className="hidden lg:block absolute top-0 right-0 w-[110%] h-[120%] bg-[#1c295b] origin-top-left -rotate-6 transform -skew-x-6 scale-110 z-0 shadow-2xl"></div>
             <div className="hidden lg:block absolute top-[-10%] right-[-10%] w-[120%] h-[120%] bg-[#2e4088] origin-top-left -rotate-[12deg] transform -skew-x-6 z-0 opacity-40"></div>
           </div>

           {/* Form Box Overlay */}
           <div className="relative z-20 h-full flex items-center justify-center lg:justify-start lg:pl-10 px-4 py-10 lg:py-0">
             <div className="bg-white rounded-[2rem] p-8 w-full max-w-[440px] shadow-[0_20px_60px_rgb(0,0,0,0.15)] border border-white/20">
               <div className="text-center mb-8">
                 <h2 className="text-[22px] font-bold text-[#1C295E]">
                   Get up to <span className="text-[#4A69FF]">₹50 Lakhs</span> starting at <span className="bg-blue-50 text-[#4A69FF] px-2 py-0.5 rounded ml-1">11.25%</span>
                 </h2>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Business Name</label>
                   <input
                     type="text"
                     value={companyName}
                     onChange={e => setCompanyName(e.target.value)}
                     placeholder="Enter your business name"
                     className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#4A69FF] focus:ring-1 focus:ring-[#4A69FF] transition-all"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                   <input
                     type="tel"
                     value={mobileNumber}
                     onChange={e => setMobileNumber(e.target.value)}
                     placeholder="Enter your 10 digit number"
                     className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#4A69FF] focus:ring-1 focus:ring-[#4A69FF] transition-all"
                   />
                 </div>
                 <button className="w-full h-[52px] bg-[#4A69FF] hover:bg-[#3B55D9] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-[15px] mt-2 shadow-lg shadow-blue-500/25">
                   View Offers <ArrowRight className="w-4 h-4" />
                 </button>
               </div>

               <div className="mt-6 text-center">
                 <p className="text-[11px] text-slate-400 leading-relaxed max-w-[90%] mx-auto">
                   By submitting this form, you have read and agree to the <br />
                   <Link href="/" className="text-[#4A69FF] hover:underline">Credit Report Terms of Use</Link>, <Link href="/" className="text-[#4A69FF] hover:underline">Terms of Use</Link> & <Link href="/" className="text-[#4A69FF] hover:underline">Privacy Policy</Link>
                 </p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Marquee Bar */}
      <section className="py-4 overflow-hidden border-y border-[#E8ECFF] bg-[#F8FAFC]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
             'Multiple Options Available', 'Free Credit Score Check', 'Reward on payments', 
             'Quick Assistance', 'Rate Trend Updates', 'Easy Loan Access', 'Business Tools'
          ].map((item, i) => (
            <span key={i} className="text-xs uppercase tracking-wider text-slate-500 font-bold mx-8 flex items-center gap-10">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            </span>
          ))}
          {[
             'Multiple Options Available', 'Free Credit Score Check', 'Reward on payments', 
             'Quick Assistance', 'Rate Trend Updates', 'Easy Loan Access', 'Business Tools'
          ].map((item, i) => (
            <span key={`dup-${i}`} className="text-xs uppercase tracking-wider text-slate-500 font-bold mx-8 flex items-center gap-10">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            </span>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1C295E]">Explore Top Business Loan Options</h2>
          </div>

          {/* Sort Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-sm font-semibold text-slate-500">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              <button className="px-5 py-2 text-sm font-bold bg-white text-[#1C295E] rounded-full border border-slate-200 hover:border-slate-300 shadow-sm transition-all">Lowest Interest Rate</button>
              <button className="px-5 py-2 text-sm font-bold bg-transparent text-slate-500 rounded-full border border-slate-200 hover:bg-white hover:text-[#1C295E] transition-all">Max Loan Amount</button>
              <button className="px-5 py-2 text-sm font-bold bg-transparent text-slate-500 rounded-full border border-slate-200 hover:bg-white hover:text-[#1C295E] transition-all">Min Loan Amount</button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Bank Offers Listing */}
            <div className="lg:col-span-2 space-y-6">
              {bankOffers.map((bank, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Bank Details */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl ${bank.bgLogo}`}>
                          {bank.logo}
                        </div>
                        <div>
                          <h3 className="text-[22px] font-bold text-[#1C295E] leading-none mb-1.5">{bank.name}</h3>
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
                            Cashback {bank.cashback}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Interest Rate</p>
                          <p className="text-[17px] font-bold text-[#4A69FF]">{bank.rate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Max Amount</p>
                          <p className="text-[17px] font-bold text-[#1C295E]">{bank.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Max Tenure</p>
                          <p className="text-[17px] font-bold text-[#1C295E]">{bank.tenure}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Processing</p>
                          <p className="text-[17px] font-bold text-[#1C295E]">{bank.processingFee}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 pt-4 border-t border-slate-100">
                        {bank.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <Check className="w-[14px] h-[14px] text-emerald-500 shrink-0" />
                            <p className="text-[13px] font-medium text-slate-600">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right action area */}
                    <div className="w-full md:w-[220px] shrink-0 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-center relative">
                      <div className="mb-4">
                         <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Estimated EMI</p>
                         <p className="text-3xl font-black text-[#1C295E] tracking-tight mb-1 font-mono">₹{bank.emi}</p>
                         <p className="text-[11px] font-medium text-slate-500">for ₹5L @ {bank.rate} for 36 months</p>
                      </div>

                      <label className="flex items-center gap-2.5 mb-6 cursor-pointer group w-fit">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input
                            type="checkbox"
                            checked={emiCalculators[bank.name] || false}
                            onChange={() => toggleCalculator(bank.name)}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded focus:ring-0 checked:bg-[#4A69FF] checked:border-[#4A69FF] transition-all cursor-pointer"
                          />
                          <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-700 group-hover:text-[#4A69FF] transition-colors">Calculate EMI</span>
                      </label>

                      <Link href={bank.href} className="w-full h-12 bg-[#4A69FF] hover:bg-[#3B55D9] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-[15px] transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]">
                        Apply Now <ArrowRight className="w-[18px] h-[18px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                 <button className="px-6 py-3 border-2 border-[#4A69FF] text-[#4A69FF] font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm uppercase tracking-wide">
                   Load More Offers
                 </button>
              </div>
            </div>

            {/* Right Column: Sidebars */}
            <div className="space-y-8 sticky top-28">
              {/* Info Box */}
              <div className="bg-[#1C295E] rounded-3xl p-8 text-white relative overflow-hidden">
                 <h3 className="text-[22px] font-bold leading-tight mb-2 relative z-10">What&apos;s the Online Business Loan<br />Application Process?</h3>
                 <p className="text-sm text-indigo-200 mb-8 relative z-10">Follow the below given 4 simple steps.</p>
                 
                 <div className="space-y-4 relative z-10">
                   {['Enter your mobile number to login', 'Check if you are pre-approved', 'Verify with the OTP sent to your number', 'Specify your loan needs / loan amount', 'Compare offers and submit your application'].map((step, i) => (
                     <div key={i} className="flex gap-4 p-3.5 bg-[#2B3B8B] rounded-xl border border-indigo-400/20">
                       <span className="text-xs font-bold text-indigo-300 shrink-0 mt-0.5">Step {i+1}:</span>
                       <p className="text-sm font-medium leading-snug">{step}</p>
                     </div>
                   ))}
                 </div>
                 
                 <Link href="/apply" className="w-full h-12 bg-white text-[#1C295E] mt-6 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors relative z-10">
                   Apply Now <ArrowRight className="w-4 h-4" />
                 </Link>
                 
                 <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
              </div>

              {/* Promo Banner */}
              <div className="bg-[#EAF0FC] rounded-3xl p-8 relative overflow-hidden min-h-[350px] flex flex-col border border-blue-50 shadow-sm">
                <div className="relative z-10 mb-8 max-w-[80%]">
                  <h3 className="text-3xl font-black text-[#1C295E] leading-[1.1] mb-2 tracking-tight">Sapno ka business,</h3>
                  <h3 className="text-3xl font-black text-[#4A69FF] leading-[1.1] tracking-tight">ab bade scale par.</h3>
                </div>
                <Image src="/hero_man.png" alt="Promo" width={300} height={300} className="absolute bottom-0 right-[-30px] w-[90%] h-auto drop-shadow-xl z-0" />
              </div>

              {/* USP Box */}
              <div className="bg-[#4A69FF] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <h3 className="text-[22px] font-bold mb-6 relative z-10">Why Choose RupeeQuik</h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 opacity-80" />
                    <p className="text-[15px] font-medium leading-snug">Compare & Choose the <span className="font-bold text-orange-200">Best Offer</span></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 opacity-80" />
                    <p className="text-[15px] font-medium leading-snug">Pre-approved Offers with Instant Disbursals</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 opacity-80" />
                    <p className="text-[15px] font-medium leading-snug">Know Your Chances of Approval</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 opacity-80" />
                    <p className="text-[15px] font-medium leading-snug">End-to-End Digital Process</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb section inline */}
      <div className="bg-white border-y border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center gap-2 text-xs font-medium">
             <Link href="/" className="text-[#4A69FF] hover:underline">Home</Link>
             <ChevronRight className="w-3 h-3 text-slate-400" />
             <span className="text-slate-500">Business Loan Application</span>
           </div>
        </div>
      </div>

      {/* EMI Calculator Big Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.03)] overflow-hidden">
            <div className="flex flex-col lg:flex-row">
               {/* Calc Left */}
               <div className="lg:w-[60%] p-8 lg:p-12">
                 <h2 className="text-[28px] font-bold text-[#1C295E] mb-8">Calculate Your Business Loan EMI</h2>
                 
                 <div className="mb-10">
                   <p className="text-sm font-semibold text-slate-500 mb-4">Select Your Bank</p>
                   <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
                     {['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'More'].map((b, i) => (
                       <button
                         key={b}
                         onClick={() => b !== 'More' && setSelectedBank(b)}
                         className={`px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all shrink-0 ${
                           selectedBank === b 
                             ? 'border-[#1C295E] bg-slate-50 text-[#1C295E] shadow-sm' 
                             : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                         }`}
                       >
                         {b !== 'More' && <div className="w-5 h-5 rounded overflow-hidden bg-slate-200 shrink-0"></div>}
                         {b}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* The Sliders */}
                 <div className="bg-slate-50 rounded-2xl p-6 lg:p-8 border border-slate-200/60 space-y-10">
                    {/* Amount */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-slate-700">Enter Loan Amount</label>
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg font-bold text-lg text-[#1C295E] flex items-center gap-1 shadow-sm">
                          <span className="text-slate-400 text-sm">₹</span> {(emiAmount).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-6 w-full max-w-sm">
                        {['1L', '5L', '10L', '15L', '20L'].map((v) => (
                          <button key={v} onClick={() => setEmiAmount(parseInt(v) * 100000)} className="flex-1 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all">₹{v}</button>
                        ))}
                      </div>
                      <input type="range" min={50000} max={5000000} step={10000} value={emiAmount} onChange={e => setEmiAmount(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]" />
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2"><span>50K</span><span>50L</span></div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      {/* Rate */}
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <label className="text-sm font-bold text-slate-700 flex items-baseline gap-1">Rate of Interest <span className="text-[10px] text-slate-400 font-normal">(Yearly %)</span></label>
                          <div className="bg-white border border-slate-200 px-4 py-1.5 rounded-lg font-bold text-lg text-[#1C295E] shadow-sm">{emiRate}</div>
                        </div>
                        <input type="range" min={8} max={30} step={0.5} value={emiRate} onChange={e => setEmiRate(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]" />
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2"><span>8%</span><span>30%</span></div>
                      </div>

                      {/* Tenure */}
                      <div>
                        <div className="flex flex-wrap items-center justify-between mb-5 gap-y-2">
                          <label className="text-sm font-bold text-slate-700">Loan Tenure</label>
                          <div className="flex items-center gap-3">
                             <div className="bg-white border border-slate-200 px-4 py-1.5 rounded-lg font-bold text-lg text-[#1C295E] shadow-sm w-16 text-center">{emiTenure}</div>
                             <div className="flex bg-slate-200/50 rounded-lg p-0.5 border border-slate-200">
                               <button onClick={() => setEmiTenureType('Mo')} className={`px-3 py-1 text-xs font-bold rounded-md ${emiTenureType === 'Mo' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Mo</button>
                               <button onClick={() => setEmiTenureType('Yr')} className={`px-3 py-1 text-xs font-bold rounded-md ${emiTenureType === 'Yr' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Yr</button>
                             </div>
                          </div>
                        </div>
                        <input type="range" min={1} max={emiTenureType === 'Yr' ? 10 : 120} step={1} value={emiTenure} onChange={e => setEmiTenure(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A69FF]" />
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2"><span>1{emiTenureType}</span><span>{emiTenureType === 'Yr' ? '10Y' : '120M'}</span></div>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Calc Right */}
               <div className="lg:w-[40%] bg-[#1C295E] p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A69FF] rounded-full blur-[100px] opacity-40 mix-blend-screen pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                 
                 <div className="bg-[#2B3B8B] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl relative z-10 text-center">
                   <p className="text-[17px] font-medium text-indigo-100 mb-2">Your Monthly EMI Payment</p>
                   <p className="text-5xl font-black tracking-tight font-mono">₹{Math.round(emi).toLocaleString()}</p>
                 </div>
                 
                 <div className="space-y-4 mb-10 relative z-10 px-2 lg:px-4">
                   <div className="flex justify-between items-center py-2 border-b border-indigo-400/20">
                     <span className="text-sm font-medium text-indigo-100">Principal Amount</span>
                     <span className="font-bold text-[17px]">₹ {emiAmount.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-indigo-400/20">
                     <span className="text-sm font-medium text-indigo-100">Interest Amount</span>
                     <span className="font-bold text-[17px]">₹ {Math.round(totalPayment - emiAmount).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center py-4">
                     <span className="text-[17px] font-bold">Total Amount</span>
                     <span className="font-black text-xl">₹ {Math.round(totalPayment).toLocaleString()}</span>
                   </div>
                 </div>
                 
                 <button className="w-full h-14 bg-[#4A69FF] hover:bg-[#3B55D9] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-[15px] transition-colors relative z-10">
                   Get Instant Loan <ArrowRight className="w-[18px] h-[18px]" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Reused */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:items-center text-center mb-16 max-w-2xl mx-auto">
             <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider mb-4 block">PRODUCTS</span>
             <h2 className="text-4xl lg:text-[44px] font-bold text-[#1C295E] leading-tight mb-4">
               Let&apos;s See What User Say<br />About Us
             </h2>
             <p className="text-slate-500 text-[15px]">
               Your financial well-being is our priority. We offer tailored loan solutions and dedicated support for your needs.
             </p>
          </div>

          <div className="relative">
             <div className="flex items-center justify-center overflow-hidden min-h-[350px]">
                <div className="w-[30%] absolute left-[-15%] xl:left-0 opacity-40 blur-[2px] transition-all hidden lg:block">
                   <div className="bg-slate-50 rounded-[2rem] border border-slate-100 aspect-square shadow-sm overflow-hidden scale-75">
                      <Image src="/rajesh.png" className="w-full h-full object-cover scaleX(-1)" width={400} height={400} alt="User" />
                   </div>
                </div>

                <div className="w-full lg:w-[60%] z-20 relative px-4">
                   <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.08)] flex flex-col sm:flex-row gap-8 items-center text-center sm:text-left h-full">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-[1.5rem] overflow-hidden shadow-inner bg-slate-100">
                         <Image src="/rajesh.png" width={400} height={400} className="w-full h-full object-cover" alt="Rajesh Kumar" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                         <div className="text-6xl text-[#1C295E] font-serif leading-none h-8 mb-4">“</div>
                         <p className="text-lg sm:text-xl font-semibold text-[#1C295E] leading-relaxed mb-6">
                           When I faced a medical emergency, I was unsure where to turn. The quick loan approval process helped me cover my expenses without stress. I am grateful for the support I received!
                         </p>
                         <div>
                            <p className="font-bold text-lg text-[#1C295E]">Rajesh Kumar</p>
                            <p className="text-slate-500 text-sm mt-1">Software Engineer</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="w-[30%] absolute right-[-15%] xl:right-0 opacity-40 blur-[2px] transition-all hidden lg:block">
                   <div className="bg-indigo-50 rounded-[2rem] border border-slate-100 aspect-square shadow-sm overflow-hidden scale-75 pt-10 px-4 object-bottom">
                      <Image src="/hero_man.png" className="w-full h-full object-contain object-bottom scale-[1.2] origin-bottom" width={400} height={400} alt="User" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
