'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight, Check, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Offer {
  id: string;
  title: string;
  category: string;
  dsaName: string;
  description: string;
  interestRate: string | null;
  benefits: string | null;
  bgLogo: string | null;
  redirectUrl: string;
  status: string;
  priority: number;
}

export default function CreditCardPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hero Form state
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pan, setPan] = useState('');
  const [error, setError] = useState('');

  // Filter states
  const [selectedBanks, setSelectedBanks] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/offers?category=credit-card');
        const data = await res.json();
        setOffers(data);
      } catch (err) {
        console.error('Failed to fetch offers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  const handleApply = () => {
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (pan && !panRegex.test(pan.toUpperCase())) {
      setError('Please enter a valid 10-digit PAN (e.g. ABCDE1234F)');
      return;
    }

    setError('');
    router.push(`/apply?category=credit-card&phone=${mobileNumber}&pan=${pan.toUpperCase()}`);
  };

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
            
            {/* Right Form Overlay - Positioned for desktop, separate section for mobile below if needed, but keeping original layout */}
            <div className="relative z-20 flex items-center justify-center lg:justify-start px-4">
              <div className="bg-white rounded-[2rem] p-8 w-full max-w-[440px] shadow-[0_20px_60px_rgb(0,0,0,0.15)] border border-slate-100">
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
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">PAN Number</label>
                    <input
                      type="text"
                      value={pan}
                      onChange={e => setPan(e.target.value.toUpperCase().slice(0, 10))}
                      placeholder="Enter 10-digit PAN"
                      maxLength={10}
                      className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-xl px-4 text-[15px] font-mono uppercase focus:outline-none focus:border-[#4A69FF] focus:ring-1 focus:ring-[#4A69FF] transition-all"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
                  <button 
                    onClick={handleApply}
                    className="w-full h-[52px] bg-[#4A69FF] hover:bg-[#3B55D9] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-[15px] mt-2 shadow-lg shadow-blue-500/25"
                  >
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
        </div>
      </section>

      {/* Recommended For You Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-[#1C295E] mb-4">Recommended For You</h2>
            <p className="text-slate-500 font-medium">Handpicked premium cards based on your lifestyle</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm">
              <div className="w-12 h-12 border-4 border-[#4A69FF] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold">Finding the best cards for you...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
               <p className="text-slate-500 font-bold">No cards found in the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
              {offers.map((card) => (
                <div key={card.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all group flex flex-col">
                  {/* Card Visual Side */}
                  <div className={`p-8 lg:p-10 ${card.bgLogo || 'bg-slate-900'} relative overflow-hidden flex-shrink-0 min-h-[260px] flex flex-col justify-between`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="w-14 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                        <div className="w-10 h-7 border border-white/30 rounded flex items-center justify-center">
                          <div className="w-6 h-4 bg-white/20 rounded-sm"></div>
                        </div>
                      </div>
                      <div className="text-white/40 font-black text-2xl italic tracking-tighter uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                        RupeeQuik
                      </div>
                    </div>

                    <div className="relative z-10">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{card.dsaName}</p>
                      <h3 className="text-white text-2xl lg:text-3xl font-black tracking-tight leading-tight max-w-[80%] pr-4 uppercase">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* Info Side */}
                  <div className="p-8 lg:p-10 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-8">
                       <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">Premium</span>
                       <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">Rewards</span>
                    </div>

                    <div className="space-y-4 mb-10 flex-1">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Key Privileges</h4>
                      {(card.benefits || '').split(',').map((reward, i) => (
                        reward.trim() && (
                          <div key={i} className="flex items-start gap-4 group/item">
                            <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-slate-50 text-[#4A69FF] group-hover/item:bg-[#4A69FF] group-hover/item:text-white transition-colors duration-300">
                              <Check className="w-3 h-3" />
                            </div>
                            <p className="text-[14px] font-medium text-slate-600 leading-snug">{reward.trim()}</p>
                          </div>
                        )
                      ))}
                    </div>

                    <Link 
                      href={card.redirectUrl} 
                      className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all group/btn shadow-xl shadow-slate-200 active:scale-[0.98]"
                    >
                      Check Eligibility <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <Footer />
    </div>
  );
}
