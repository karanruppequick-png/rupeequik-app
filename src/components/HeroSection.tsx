'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Shield, Clock, BadgePercent } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  formTitle: string;
  formHighlight: string;
  ctaText: string;
  heroImage?: string;
}

export default function HeroSection({
  title,
  subtitle,
  formTitle,
  formHighlight,
  ctaText,
  heroImage,
}: HeroSectionProps) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      const params = new URLSearchParams({ phone });
      if (email) params.set('email', email);
      router.push(`/apply?${params.toString()}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F0F1FF] to-white py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:px-8">
        {/* Left side */}
        <div className="max-w-xl flex-1 pt-4">
          <span className="inline-block rounded-full bg-[#1B1F6B]/10 px-4 py-1.5 text-xs font-semibold text-[#1B1F6B]">
            {subtitle}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#1B1F6B] md:text-4xl lg:text-5xl">
            {title}
          </h1>

          {/* Feature callout cards */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Shield, label: '100% Secure' },
              { icon: Clock, label: 'Quick Approval' },
              { icon: BadgePercent, label: 'Best Rates' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm"
              >
                <Icon className="h-4 w-4 text-[#1B1F6B]" />
                <span className="text-xs font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>

          {/* Hero image if provided */}
          {heroImage && (
            <div className="mt-8 hidden lg:block">
              <Image
                src={heroImage}
                alt={title}
                width={480}
                height={320}
                className="rounded-xl object-contain"
                priority
              />
            </div>
          )}
        </div>

        {/* Right side - Lead form */}
        <div className="w-full max-w-[460px] flex-shrink-0">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg" style={{ minHeight: 422 }}>
            <h2 className="text-lg font-bold text-gray-900">
              {formTitle}{' '}
              <span className="text-[#1B1F6B]">{formHighlight}</span>
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="hero-phone" className="mb-1 block text-xs font-medium text-gray-600">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-[#1B1F6B] focus-within:ring-1 focus-within:ring-[#1B1F6B]">
                  <span className="text-sm text-gray-500">+91</span>
                  <input
                    id="hero-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full text-sm outline-none placeholder:text-gray-400"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="hero-email" className="mb-1 block text-xs font-medium text-gray-600">
                  Email Address
                </label>
                <input
                  id="hero-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#1B1F6B] focus:ring-1 focus:ring-[#1B1F6B]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#1B1F6B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2A2F8A]"
              >
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-4 text-[10px] leading-relaxed text-gray-400">
              By clicking &ldquo;{ctaText}&rdquo;, you agree to our Terms of
              Service and Privacy Policy. We may send you updates via SMS or
              email.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
