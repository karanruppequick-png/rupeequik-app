'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TickerBar from '@/components/TickerBar';
import OfferCard from '@/components/OfferCard';
import EMICalculator from '@/components/EMICalculator';
import TestimonialSection from '@/components/TestimonialSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { CheckCircle, Shield, Zap, Award, Clock } from 'lucide-react';

import type { Offer } from '@/components/OfferCard';

interface LoanCategoryPageProps {
  title: string;
  subtitle: string;
  formTitle?: string;
  formHighlight: string;
  ctaText?: string;
  category: string;
}

const sortOptions = [
  { label: 'Lowest Interest Rate', value: 'lowest-rate' },
  { label: 'Max Loan Amount', value: 'max-amount' },
  { label: 'Min Loan Amount', value: 'min-amount' },
];

const steps = [
  { step: 1, text: 'Enter your mobile number and verify OTP' },
  { step: 2, text: 'Fill in basic details like income and employment' },
  { step: 3, text: 'Compare offers from multiple lenders' },
  { step: 4, text: 'Choose the best offer and apply' },
  { step: 5, text: 'Get instant approval and disbursement' },
];

export default function LoanCategoryPage({
  title,
  subtitle,
  formTitle,
  formHighlight,
  ctaText = 'Check Eligibility',
  category,
}: LoanCategoryPageProps) {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState('lowest-rate');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`/api/offers?category=${category}`);
        if (res.ok) {
          const data = await res.json();
          setOffers(data.offers || data || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [category]);

  const sortedOffers = [...offers].sort((a, b) => {
    if (activeSort === 'lowest-rate') {
      return parseFloat(a.interestRate || '99') - parseFloat(b.interestRate || '99');
    }
    return 0;
  });

  const handleApply = (offer: Offer) => {
    router.push(`/apply?offerId=${offer.id}&category=${category}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection
        title={title}
        subtitle={subtitle}
        formTitle={formTitle || `Get the best rates starting at`}
        formHighlight={formHighlight}
        ctaText={ctaText}
      />
      <TickerBar />

      {/* Main content */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Left: Offers */}
            <div className="flex-1">
              {/* Sort pills */}
              <div className="mb-6 flex flex-wrap gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setActiveSort(opt.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeSort === opt.value
                        ? 'bg-[#1B1F6B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Offer list */}
              <div className="flex flex-col gap-4">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B1F6B] border-t-transparent" />
                  </div>
                ) : sortedOffers.length > 0 ? (
                  sortedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} onApply={() => handleApply(offer)} />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
                    <p className="text-gray-500">No offers available at the moment. Please check back later.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="w-full space-y-6 lg:w-80">
              {/* How to apply */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">How Can I Apply?</h3>
                <div className="mt-4 flex flex-col gap-4">
                  {steps.map((s) => (
                    <div key={s.step} className="flex gap-3">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1B1F6B] text-xs font-bold text-white">
                        {s.step}
                      </div>
                      <p className="text-sm text-gray-600">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-[#1B1F6B] to-[#2A2F8A] p-6 text-white shadow-sm">
                <h3 className="text-lg font-bold">Why Choose RupeeQuick?</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {[
                    { icon: Shield, text: 'Safe & Secure' },
                    { icon: Zap, text: 'Fast Digital Process' },
                    { icon: Award, text: 'Exclusive Offers' },
                    { icon: Clock, text: 'Instant Approvals' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#F59E0B]" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EMICalculator />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
