import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <>
      {/* Upper Footer CTA Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1C295E' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-[#4A69FF] clip-diagonal"></div>
          <div className="absolute top-0 right-0 w-[50%] h-full bg-[#3B55D9] clip-diagonal-2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16 lg:py-0">
          <div className="grid lg:grid-cols-2 lg:h-[400px] items-center">
            <div className="text-white lg:py-20 lg:pr-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-4">
                A new world of<br />financial wellbeing
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-sm">
                Compare by total cost, not just discounts. See eligible offers with a soft credit check
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#1C295E] rounded-full font-bold text-[15px] hover:shadow-lg transition-all w-fit"
              >
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:flex items-end justify-center h-full relative">
              <Image src="/footer_man.png" alt="RupeeQuik User" width={350} height={400} className="object-contain object-bottom absolute bottom-0 h-[110%] w-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-[#1C295E] text-slate-300 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
            {/* Links Columns */}
            <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <h3 className="text-white font-semibold mb-6">Learn More</h3>
                <ul className="space-y-4">
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Community Forum</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">User Guides</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Webinars</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-6">Products</h3>
                <ul className="space-y-4">
                  <li><Link href="/personal-loan" className="text-[15px] text-white/70 hover:text-white transition-colors">Personal Loans</Link></li>
                  <li><Link href="/business-loan" className="text-[15px] text-white/70 hover:text-white transition-colors">Business Solutions</Link></li>
                  <li><Link href="/apply" className="text-[15px] text-white/70 hover:text-white transition-colors">Insurance Options</Link></li>
                  <li><Link href="/apply" className="text-[15px] text-white/70 hover:text-white transition-colors">Investment Services</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-6">About Rupeequik</h3>
                <ul className="space-y-4">
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Our Story</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Meet the Team</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Social Responsibility</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Press Releases</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-6">Calculators & Tools</h3>
                <ul className="space-y-4">
                  <li><Link href="/emi-calculator" className="text-[15px] text-white/70 hover:text-white transition-colors">Loan Calculator</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Budget Planner</Link></li>
                  <li><Link href="/emi-calculator" className="text-[15px] text-white/70 hover:text-white transition-colors">Mortgage Calculator</Link></li>
                  <li><Link href="/" className="text-[15px] text-white/70 hover:text-white transition-colors">Savings Estimator</Link></li>
                </ul>
              </div>
            </div>

            {/* Newsletter section */}
            <div className="lg:col-span-2 lg:pl-10">
              <Link href="/" className="inline-block mb-10">
                <Image src="/logo.png" alt="RupeeQuik" width={160} height={40} className="h-8 w-auto brightness-0 invert" />
              </Link>
              <h3 className="text-white font-semibold mb-4">Subscribe for New Latest<br />Opportunities</h3>
              <div className="flex flex-col sm:flex-row bg-white rounded-lg p-1 overflow-hidden gap-1 sm:gap-0">
                <input
                  type="email"
                  placeholder="Type your email address"
                  className="flex-1 bg-transparent px-4 py-2.5 sm:py-0 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button className="bg-[#2a2a2a] text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-black transition-colors shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/50">Copyright © RupeeQuik 2026</p>
            <div className="flex items-center gap-10">
              <span className="text-sm text-white/50 hover:text-white/80 cursor-pointer transition-colors">Term Condition</span>
              <span className="text-sm text-white/50 hover:text-white/80 cursor-pointer transition-colors">Terms of Use</span>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .clip-diagonal {
            clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
          }
          .clip-diagonal-2 {
            clip-path: polygon(40% 0, 100% 0, 100% 100%, 10% 100%);
          }
        `}} />
      </footer>
    </>
  );
}
