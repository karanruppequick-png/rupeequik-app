'use client';

import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface Offer {
  id: string;
  title: string;
  category: string;
  dsaName: string;
  description: string;
  interestRate: string;
  benefits: string;
  redirectUrl: string;
  status: string;
  priority?: number;
}

interface OfferCardProps {
  offer: Offer;
  onApply?: (offer: Offer) => void;
}

export default function OfferCard({ offer, onApply }: OfferCardProps) {
  const isLoan = offer.category !== 'credit-card';
  const features = offer.benefits ? offer.benefits.split(',').map((b) => b.trim()) : [];

  const handleApply = () => {
    if (onApply) {
      onApply(offer);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-[#1B1F6B]">
            {offer.dsaName.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{offer.dsaName}</p>
            <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
          </div>
        </div>
      </div>

      {isLoan ? (
        <>
          {/* Loan stats grid */}
          <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {offer.interestRate && (
              <div>
                <p className="text-[11px] font-medium text-gray-400">Interest Rate</p>
                <p className="mt-0.5 text-sm font-bold text-[#1B1F6B]">{offer.interestRate}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] font-medium text-gray-400">Processing</p>
              <p className="mt-0.5 text-sm font-bold text-[#1B1F6B]">Up to 2%</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-400">Tenure</p>
              <p className="mt-0.5 text-sm font-bold text-[#1B1F6B]">Up to 5 Years</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-400">Type</p>
              <p className="mt-0.5 text-sm font-bold text-[#1B1F6B] capitalize">{offer.category.replace('-', ' ')}</p>
            </div>
          </div>

          {/* Features */}
          <ul className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>

          {/* Description + CTA */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="max-w-sm text-xs text-gray-500">{offer.description}</p>
            {onApply ? (
              <button
                onClick={handleApply}
                className="ml-4 inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-[#1B1F6B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2A2F8A]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href={`/apply?offerId=${offer.id}&category=${offer.category}`}
                className="ml-4 inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-[#1B1F6B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2A2F8A]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Credit card benefits */}
          <p className="mb-3 text-sm text-gray-600">{offer.description}</p>
          <ul className="mb-5 flex flex-col gap-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="border-t border-gray-100 pt-4">
            {onApply ? (
              <button
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B1F6B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2A2F8A]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href={`/apply?offerId=${offer.id}&category=${offer.category}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B1F6B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2A2F8A]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
