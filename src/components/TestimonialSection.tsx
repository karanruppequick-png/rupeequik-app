'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Small Business Owner',
    quote:
      'RupeeQuik helped me get a business loan at an unbeatable interest rate. The entire process was seamless and I received the funds within 48 hours.',
  },
  {
    name: 'Rahul Verma',
    role: 'IT Professional',
    quote:
      'I compared multiple credit cards on RupeeQuik and found the perfect one for my travel needs. Their expert guidance saved me a lot of time and money.',
  },
  {
    name: 'Anjali Patel',
    role: 'Doctor',
    quote:
      'The EMI calculator was incredibly helpful in planning my home loan. RupeeQuik made the entire home-buying experience stress-free and transparent.',
  },
  {
    name: 'Vikram Singh',
    role: 'Freelancer',
    quote:
      'Getting a personal loan as a freelancer is tough, but RupeeQuik connected me with the right lenders. Approved in just one day!',
  },
  {
    name: 'Neha Gupta',
    role: 'Teacher',
    quote:
      'I checked my credit score for free and got personalized loan recommendations. The platform is very user-friendly and trustworthy.',
  },
];

export default function TestimonialSection() {
  const [startIdx, setStartIdx] = useState(0);

  const visibleCount = 3;
  const maxStart = testimonials.length - visibleCount;

  const prev = () => setStartIdx((i) => Math.max(0, i - 1));
  const next = () => setStartIdx((i) => Math.min(maxStart, i + 1));

  const visible = testimonials.slice(startIdx, startIdx + visibleCount);

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Heading */}
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-[#1B1F6B] md:text-3xl">
            Let&apos;s See What Users Say{' '}
            <span className="text-[#F59E0B]">About Us</span>
          </h2>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={prev}
              disabled={startIdx === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-[#1B1F6B] hover:text-[#1B1F6B] disabled:opacity-40"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              disabled={startIdx >= maxStart}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-[#1B1F6B] hover:text-[#1B1F6B] disabled:opacity-40"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Quote className="mb-4 h-8 w-8 text-[#1B1F6B]/20" />
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B1F6B] text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          <button
            onClick={prev}
            disabled={startIdx === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-40"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={startIdx >= maxStart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-40"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
