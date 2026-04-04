'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpValue, source: 'login' }),
      });
      
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        setTimer(30);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to resend');
      }
    } catch {
      setError('Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[440px]">
        
        <div className="text-center mb-8">
           <Link href="/" className="inline-block hover:scale-105 transition-transform">
              <h1 className="text-[28px] font-black text-[#1C295E] tracking-tight flex items-center justify-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md shadow-blue-500/25">₹</div>
                 RupeeQuik
              </h1>
           </Link>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-slate-100">
           <h2 className="text-[22px] font-bold text-[#1C295E] text-center mb-4">Verify Mobile Number</h2>
           <p className="text-slate-500 text-sm text-center mb-8 italic">Dev Mode: use 123456</p>

           {error && (
             <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm font-medium mb-6 flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" />
               {error}
             </div>
           )}

           <div className="bg-[#E8EDFF] rounded-xl py-3.5 px-4 text-center mb-10 border border-blue-100/50">
             <p className="text-[14px] font-medium text-[#1C295E]">
                OTP sent to <span className="font-bold">+91-{phone.slice(-4).padStart(10, 'x')}</span>
             </p>
           </div>

           <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 sm:gap-3 mb-10">
                 {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-14 sm:w-12 sm:h-14 text-center text-xl font-black text-[#1C295E] border-b-[3px] border-slate-200 bg-transparent rounded-none focus:outline-none focus:border-[#4A69FF] transition-colors"
                      placeholder="•"
                    />
                 ))}
              </div>

              <div className="text-center mb-8">
                 {timer > 0 ? (
                    <p className="text-[14px] font-medium text-slate-500">
                       Resend OTP in <span className="font-bold text-slate-600">{timer}</span> seconds
                    </p>
                 ) : (
                    <button type="button" onClick={handleResend} className="text-[14px] font-bold text-[#4A69FF] hover:underline">
                       Resend OTP
                    </button>
                 )}
              </div>

              <button 
                 type="submit" 
                 disabled={loading || otp.join('').length < 6}
                 className="w-full h-[54px] bg-[#4260FF] hover:bg-[#324DE6] text-white font-bold text-[15px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:shadow-none active:scale-[0.98]"
              >
                 {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                    <>Verify & Login <ArrowRight className="w-4 h-4" /></>
                 )}
              </button>
           </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[13px] font-medium text-slate-400">
           <Shield className="w-4 h-4 text-emerald-500" />
           <span>Secured by 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
