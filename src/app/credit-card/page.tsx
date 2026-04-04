'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight, Check, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const creditCards = [
  {
    name: 'HDFC Regalia Gold Credit Card',
    bank: 'HDFC Bank',
    color: 'bg-[#1e1b4b]', // Dark navy
    rewards: [
      'Earn 20 Reward points on every ₹150 spent',
      'Exclusive lounge access with free priority pass',
      'Earn 5X value back on select premium brands',
      'Joining Fees: ₹2,500 + Taxes',
      'Annual/Renewal Fee: ₹2,500 + Taxes'
    ],
    tags: ['Travel', 'Premium', 'Rewards'],
    href: '/apply?card=hdfc-regalia-gold'
  },
  {
    name: 'SBI AURUM Credit Card',
    bank: 'SBI Bank',
    color: 'bg-[#0f172a]', // Slate
    rewards: [
      'Earn 40 Reward points on every ₹100 spent',
      'Unlimited lounge access and free spa sessions',
      'Upto 40% value back on curated luxury brands',
      'Joining Fees: ₹9,999 + Taxes',
      'Annual/Renewal Fee: ₹9,999 + Taxes'
    ],
    tags: ['Premium', 'Rewards'],
    href: '/apply?card=sbi-aurum'
  },
  {
    name: 'Axis Bank Atlas Credit Card',
    bank: 'Axis Bank',
    color: 'bg-[#991b1b]', // Red
    rewards: [
      'Earn 5 EDGE Miles on every ₹100 spent on travel',
      'Free Priority Pass with 4 free guest visits',
      'Earn 2X EDGE Miles on international spends',
      'Joining Fees: ₹5,000 + Taxes',
      'Annual/Renewal Fee: ₹5,000 + Taxes'
    ],
    tags: ['Travel', 'Rewards'],
    href: '/apply?card=axis-atlas'
  },
  {
    name: 'ICICI Sapphiro Credit Card',
    bank: 'ICICI Bank',
    color: 'bg-[#1d4ed8]', // Blue
    rewards: [
      'Earn 20 Reward points on every ₹100 spent',
      'Complimentary lounge access & free movie tickets',
      'Upto 15% value back on dining and lifestyle',
      'Joining Fees: ₹6,500 + Taxes',
      'Annual/Renewal Fee: ₹6,500 + Taxes'
    ],
    tags: ['Travel', 'Premium', 'Rewards'],
    href: '/apply?card=icici-sapphiro'
  }
];

export default function CreditCardPage() {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Filter states
  const [selectedBanks, setSelectedBanks] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});

  const toggleBank = (bank: string) => setSelectedBanks(p => ({ ...p, [bank]: !p[bank] }));
  const toggleCategory = (cat: string) => setSelectedCategories(p => ({ ...p, [cat]: !p[cat] }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Custom Hero Section for Credit Cards */}
      <section className="relative pt-24 lg:pt-32 pb-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="max-w-2xl py-10 lg:pr-10">
              <div className="mb-6">
                <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                  INSTANT CARD APPROVAL
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#1C295E] leading-[1.1] tracking-tight mb-8">
                Find the Best <br />
                <span className="text-[#4A69FF]">Credit Card</span> Offers with <br />
                Exclusive Rewards
              </h1>

              <div className="flex flex-col gap-6 mb-12 relative w-full max-w-md h-64 mt-10">
                {/* Simulated Floating Cards Graphic */}
                <div className="absolute top-10 left-0 w-48 h-32 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-2xl shadow-2xl transform -rotate-12 hover:-rotate-6 transition-transform"></div>
                <div className="absolute top-5 left-16 w-48 h-32 bg-gradient-to-tr from-teal-900 to-teal-700 rounded-2xl shadow-2xl transform -rotate-6 z-10 hover:-rotate-3 transition-transform"></div>
                <div className="absolute top-0 left-32 w-48 h-32 bg-gradient-to-tr from-violet-700 to-[#4A69FF] rounded-2xl shadow-2xl z-20 hover:scale-105 transition-transform flex flex-col justify-between p-4">
                  <div className="w-8 h-6 bg-white/20 rounded"></div>
                  <div className="flex justify-end">
                    <div className="w-12 h-6 bg-white/30 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute bottom-5 -right-5 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 flex items-center gap-3 z-30">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-[#4A69FF] flex items-center justify-center font-bold">💳</div>
                  <p className="text-xs font-bold text-[#1C295E] pr-2">Easy Online Process <span className="block text-[10px] text-slate-500 font-normal">Choose your Card</span></p>
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
                   Get up to <span className="text-[#4A69FF]">33% Rewards</span> & Save <span className="text-emerald-600">₹25,000</span>
                 </h2>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Full Name</label>
                   <input
                     type="text"
                     value={fullName}
                     onChange={e => setFullName(e.target.value)}
                     placeholder="Enter your full name"
                     className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#4A69FF] focus:ring-1 focus:ring-[#4A69FF] transition-all"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Mobile Number</label>
                   <input
                     type="tel"
                     value={mobileNumber}
                     onChange={e => setMobileNumber(e.target.value)}
                     placeholder="Enter your 10 digit number"
                     className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-4 text-[15px] focus:outline-none focus:border-[#4A69FF] focus:ring-1 focus:ring-[#4A69FF] transition-all"
                   />
                 </div>
                 <button className="w-full h-[52px] bg-[#4A69FF] hover:bg-[#3B55D9] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-[15px] mt-2 shadow-lg shadow-blue-500/25">
                   View Card Offers <ArrowRight className="w-4 h-4" />
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
             '78+ Bank Partners', 'Wide Range of Cards', 'Free Credit Score Check', 
             'Personalized Recommendations', 'Dedicated Support', 'Exclusive Deals', 'No Hidden Fees'
          ].map((item, i) => (
             <span key={i} className="text-xs uppercase tracking-wider text-slate-500 font-bold mx-8 flex items-center gap-10">
               {item}
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
             </span>
          ))}
          {[
             '78+ Bank Partners', 'Wide Range of Cards', 'Free Credit Score Check', 
             'Personalized Recommendations', 'Dedicated Support', 'Exclusive Deals', 'No Hidden Fees'
          ].map((item, i) => (
             <span key={`dup-${i}`} className="text-xs uppercase tracking-wider text-slate-500 font-bold mx-8 flex items-center gap-10">
               {item}
               <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
             </span>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1C295E]">Explore Top Credit Card Options</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Sidebar: Filters */}
            <div className="w-full lg:w-72 shrink-0 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 lg:p-8">
               <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-[#1C295E] flex items-center gap-2">
                     <SlidersHorizontal className="w-5 h-5 text-[#4A69FF]" />
                     Filters
                  </h3>
                  <button className="text-xs font-bold text-[#4A69FF] hover:underline">Clear All</button>
               </div>

               {/* BANKS */}
               <div className="mb-8">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">BANKS</h4>
                  <div className="space-y-3.5">
                     {['AU Small Finance Bank', 'American Express', 'Axis Bank', 'BOBCARD', 'Equitas Small Finance', 'HDFC Bank', 'ICICI Bank', 'SBI Card'].map((bank) => (
                        <label key={bank} className="flex items-center gap-3 cursor-pointer group">
                           <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
                              <input
                                 type="checkbox"
                                 checked={selectedBanks[bank] || false}
                                 onChange={() => toggleBank(bank)}
                                 className="peer appearance-none w-full h-full border-2 border-slate-300 rounded focus:ring-0 checked:bg-[#4A69FF] checked:border-[#4A69FF] transition-all cursor-pointer"
                              />
                              <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100" />
                           </div>
                           <span className="text-[13px] font-medium text-slate-700 group-hover:text-[#1C295E] transition-colors">{bank}</span>
                        </label>
                     ))}
                     <button className="text-xs font-bold text-[#4A69FF] hover:underline mt-2 flex items-center gap-1">+ Show more</button>
                  </div>
               </div>

               {/* CATEGORIES */}
               <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">CATEGORIES</h4>
                  <div className="space-y-3.5">
                     {['Travel', 'Premium', 'Rewards', 'Lounge Access', 'Shopping', 'Dining', 'Cashback', 'Online Shopping', 'Fuel', 'Movies'].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                           <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
                              <input
                                 type="checkbox"
                                 checked={selectedCategories[cat] || false}
                                 onChange={() => toggleCategory(cat)}
                                 className="peer appearance-none w-full h-full border-2 border-slate-300 rounded focus:ring-0 checked:bg-[#4A69FF] checked:border-[#4A69FF] transition-all cursor-pointer"
                              />
                              <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100" />
                           </div>
                           <span className="text-[13px] font-medium text-slate-700 group-hover:text-[#1C295E] transition-colors">{cat}</span>
                        </label>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Column: Card Offers Listing */}
            <div className="flex-1 space-y-6">
              {creditCards.map((card, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                  <div className="flex flex-col md:flex-row gap-8 items-center lg:items-start">
                    
                    {/* Visual Card Representation */}
                    <div className="w-full md:w-56 shrink-0 flex flex-col items-center">
                       <div className={`w-full aspect-[1.58] rounded-xl shadow-lg relative overflow-hidden ${card.color} p-4 flex flex-col justify-between border border-white/10`}>
                          <div className="flex justify-between items-start">
                             <div className="w-8 h-6 bg-white/20 rounded"></div>
                             <span className="text-[10px] font-bold text-white/50">{card.bank}</span>
                          </div>
                          <div className="flex justify-end mt-auto">
                              <div className="w-10 h-6 bg-white/30 rounded-full flex gap-[-5px]"></div>
                          </div>
                       </div>
                       <Link href={card.href} className="text-[13px] font-bold text-[#4A69FF] mt-4 hover:underline">View Features & Benefits</Link>
                    </div>

                    {/* Card Details */}
                    <div className="flex-1 space-y-5">
                       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                             <h3 className="text-xl font-bold text-[#1C295E] mb-1">{card.name}</h3>
                             <p className="text-sm font-semibold text-slate-500">{card.bank}</p>
                          </div>
                          
                          {/* Tags block */}
                          <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                             {card.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600">
                                   ⭐ {tag}
                                </span>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-3 pt-2">
                         {card.rewards.map((reward, i) => {
                            const isFee = reward.includes('Fee');
                            return (
                              <div key={i} className="flex items-start gap-2.5">
                                <div className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${isFee ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                   <Check className="w-2.5 h-2.5" />
                                </div>
                                <p className={`text-[13px] font-medium leading-relaxed ${isFee ? 'text-slate-500' : 'text-slate-700'}`}>{reward}</p>
                              </div>
                            );
                         })}
                       </div>
                    </div>

                    {/* Apply Button */}
                    <div className="w-full md:w-32 shrink-0 md:pt-14 mt-4 md:mt-0">
                      <Link href={card.href} className="w-full h-11 bg-[#4A69FF] hover:bg-[#3B55D9] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                 <button className="px-6 py-3 border-2 border-[#4A69FF] text-[#4A69FF] font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm uppercase tracking-wide">
                   Load More Cards
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Application Wrapper */}
      <section className="py-20 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
               <span className="text-sm font-bold text-[#4A69FF] uppercase tracking-wider mb-3 block">HOW TO APPLY</span>
               <h2 className="text-3xl lg:text-[40px] font-bold text-[#1C295E] leading-tight mb-4">Steps to apply for a credit<br />card online</h2>
               <p className="text-slate-500 text-[15px]">You can apply for a credit card with RupeeQuik by following the below mentioned steps</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { step: '1', title: 'Enter Name & Mobile Number', text: 'Enter your mobile number & name as per your PAN to verify via an OTP sent to your phone.' },
                  { step: '2', title: 'Provide Personal Details', text: 'Fill in your personal details, like city, occupation, DOB and monthly income to check loan.' },
                  { step: '3', title: 'Choose Lifestyle Category', text: 'Select your lifestyle category shopping, travel, fuel, etc so as best to guide tailored on your.' },
                  { step: '4', title: 'Compare & Apply', text: 'View pre-qualified card offers, compare features & benefits, and click on "Apply Now".' }
               ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] relative mt-8 lg:mt-0">
                     <div className="absolute -top-6 left-8 text-6xl font-black text-[#E8ECFF] z-0">{item.step}</div>
                     <div className="relative z-10 pt-4">
                        <h3 className="text-[17px] font-bold text-[#1C295E] mb-3">{item.title}</h3>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{item.text}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonials Reused */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
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
