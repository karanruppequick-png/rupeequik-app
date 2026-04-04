'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!redirectUrl) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Animated checkmark */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-14 w-14 text-emerald-500 animate-bounce" />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Application Submitted Successfully!
        </h1>

        {redirectUrl ? (
          <>
            <p className="mt-4 text-gray-600">
              You will be redirected to our partner shortly...
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
            <a
              href={redirectUrl}
              className="mt-6 inline-block rounded-lg bg-[#1B1F6B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15185a]"
            >
              Click here if not redirected
            </a>
          </>
        ) : (
          <>
            <p className="mt-4 text-gray-600">
              Thank you for your application. Our team will contact you shortly.
            </p>
            <a
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#1B1F6B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15185a]"
            >
              Back to Home
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B1F6B]" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
