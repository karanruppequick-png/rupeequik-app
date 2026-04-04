import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1B1F6B] to-[#3B3FBB] py-16">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/5" />

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 px-4 lg:flex-row lg:justify-between lg:px-8">
        {/* Text content */}
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            A New World of Financial{' '}
            <span className="text-[#F59E0B]">Wellbeing</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Compare loans and credit cards by total cost, not just interest rates.
            Make smarter financial decisions with transparent insights and
            personalised recommendations.
          </p>
          <Link
            href="/get-started"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-8 py-3.5 text-sm font-semibold text-[#1B1F6B] transition-colors hover:bg-[#D97706]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Phone mockup placeholder */}
        <div className="flex flex-shrink-0 items-center justify-center">
          <div className="flex h-[400px] w-[200px] items-center justify-center rounded-[2rem] border-4 border-white/20 bg-white/10 backdrop-blur-sm">
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-white/20" />
              <p className="text-xs font-medium text-white/60">App Preview</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
