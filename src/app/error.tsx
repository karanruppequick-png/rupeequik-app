'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 font-sans">
      <div className="text-center max-w-md w-full bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
         <div className="w-16 h-16 bg-red-100 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <span className="text-red-500 text-2xl font-black">!</span>
         </div>
         <h2 className="text-2xl font-bold text-[#1C295E] mb-4">Something went wrong!</h2>
         <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            We've encountered an unexpected error. Please try again or return to the homepage.
         </p>
         <div className="flex flex-col gap-3">
            <button 
              onClick={() => reset()}
              className="w-full bg-[#1C295E] hover:bg-[#111A3A] text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Try Again
            </button>
            <Link 
              href="/" 
              className="w-full bg-slate-100 hover:bg-slate-200 text-[#1C295E] font-bold py-3.5 rounded-xl transition-colors"
            >
              Return Home
            </Link>
         </div>
      </div>
    </div>
  );
}
