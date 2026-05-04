'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/user-me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/user-logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group" id="nav-logo">
            <Image src="/logo.png" alt="RupeeQuik" width={160} height={40} className="h-8 w-auto group-hover:opacity-90 transition-opacity" priority />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                onBlur={() => setTimeout(() => setProductsOpen(false), 200)}
                className="flex items-center gap-1.5 px-4 py-2 font-medium text-[15px] text-slate-800 hover:text-[#4A69FF] transition-all"
                id="nav-products"
              >
                Loans <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>
              {productsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 animate-slide-down">
                  <Link href="/personal-loan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setProductsOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">💰</div>
                    <div><div className="font-medium text-slate-900 text-sm">Personal Loan</div><div className="text-xs text-slate-500">Starting 8.5% p.a.</div></div>
                  </Link>
                  <Link href="/home-loan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setProductsOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-sm">🏠</div>
                    <div><div className="font-medium text-slate-900 text-sm">Home Loan</div><div className="text-xs text-slate-500">Starting 7.9% p.a.</div></div>
                  </Link>
                  <Link href="/business-loan" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setProductsOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-sm">💼</div>
                    <div><div className="font-medium text-slate-900 text-sm">Business Loan</div><div className="text-xs text-slate-500">Starting 10.5% p.a.</div></div>
                  </Link>
                  <Link href="/apply?type=car" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setProductsOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm">🚗</div>
                    <div><div className="font-medium text-slate-900 text-sm">Car Loan</div><div className="text-xs text-slate-500">Starting 8.0% p.a.</div></div>
                  </Link>
                </div>
              )}
            </div>
            <Link href="/credit-card" className="flex items-center gap-1.5 px-4 py-2 font-medium text-[15px] text-slate-800 hover:text-[#4A69FF] transition-all" id="nav-cards">
              Credit Card <ChevronDown className="w-4 h-4" />
            </Link>
            <Link href="/apply" className="px-4 py-2 font-medium text-[15px] text-slate-800 hover:text-[#4A69FF] transition-all">
              Insurance
            </Link>
            <Link href="/emi-calculator" className="flex items-center gap-1.5 px-4 py-2 font-medium text-[15px] text-slate-800 hover:text-[#4A69FF] transition-all" id="nav-emi">
              EMI Calculator <ChevronDown className="w-4 h-4" />
            </Link>
            <Link href="/credit-score" className="flex items-center gap-2 px-4 py-2 font-medium text-[15px] text-slate-800 hover:text-[#4A69FF] transition-all">
              CIBIL Score
              <span className="text-[10px] font-bold text-white bg-slate-800 px-2.5 py-1 rounded-full leading-none">Free</span>
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-5">
                <Link href="/dashboard" className="font-bold text-[15px] text-[#1C295E] hover:text-[#4A69FF] flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-6 py-2 border-2 border-[#2B3B8B] text-[#2B3B8B] rounded-full font-bold text-[15px] hover:bg-[#2B3B8B] hover:text-white transition-all">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700"
            id="nav-mobile-toggle"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            <Link href="/personal-loan" className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium" onClick={() => setMenuOpen(false)}>Personal Loan</Link>
            <Link href="/home-loan" className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium" onClick={() => setMenuOpen(false)}>Home Loan</Link>
            <Link href="/business-loan" className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium" onClick={() => setMenuOpen(false)}>Business Loan</Link>
            <Link href="/credit-card" className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium" onClick={() => setMenuOpen(false)}>Credit Cards</Link>
            <Link href="/emi-calculator" className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium" onClick={() => setMenuOpen(false)}>EMI Calculator</Link>
            <Link href="/credit-score" className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium" onClick={() => setMenuOpen(false)}>Credit Score <span className="text-[10px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded-full">Free</span></Link>
            <hr className="my-2 border-slate-100" />
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-2" onClick={() => setMenuOpen(false)}><User className="w-4 h-4" /> Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-rose-500 hover:bg-rose-50 font-bold flex items-center gap-2 rounded-b-xl"><LogOut className="w-4 h-4" /> Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-3 border-2 border-[#4A69FF] text-[#4A69FF] rounded-xl font-semibold text-center mt-2" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
