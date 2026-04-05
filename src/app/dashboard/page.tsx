"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FileText, CreditCard, Shield, Activity, User } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, email: string, phone: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protect route client-side or fetch user
    fetch("/api/auth/user-me")
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          router.push("/login");
        } else {
          setUser(data.user);
          setLoading(false);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-24 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name} 👋</h1>
              <p className="text-slate-500 mt-2 text-[15px]">Manage your applications, profile, and credit health.</p>
            </div>
            <Link href="/" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors inline-block text-center w-fit">
              Explore Offers
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Credit Score Banner */}
              <div className="bg-slate-900 rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-md shadow-blue-900/10">
                <div className="w-full sm:w-auto">
                   <h3 className="text-lg font-semibold text-white/90 mb-1">Your CIBIL Score</h3>
                   <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold tracking-tight">---</span>
                   </div>
                   <p className="text-sm text-white/60 mt-3 flex items-center gap-1.5"><Activity className="w-4 h-4" /> Check your score for free</p>
                </div>
                <div className="w-full sm:w-auto shrink-0 bg-white/10 rounded-xl p-5 border border-white/20 backdrop-blur-sm hidden sm:block">
                   <p className="text-sm font-medium text-white mb-2">Know your credit health</p>
                   <Link href="/credit-score">
                     <button className="text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-lg w-full hover:bg-slate-50 transition-colors">Check Now</button>
                   </Link>
                </div>
              </div>

              {/* Active Applications */}
              <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600" /> My Applications</h2>
                  <Link href="#" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                </div>

                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-900 mb-2">No active applications</h3>
                  <p className="text-sm text-slate-500 mb-6">You haven&apos;t applied for any products yet.</p>
                  <Link href="/personal-loan" className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white rounded-md font-bold text-[13px] hover:bg-blue-700 transition-colors">
                    Compare Loan Offers
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              
              {/* Profile Overview */}
              <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-200 shadow-sm p-5 sm:p-8">
                 <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><User className="w-5 h-5 text-blue-600" /> Profile Details</h2>
                 <div className="space-y-4">
                    <div className="pb-4 border-b border-slate-50">
                       <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</p>
                       <p className="text-[15px] font-medium text-slate-700 block truncate">{user.email || "Not Provided"}</p>
                    </div>
                 </div>
                 
                 <button className="w-full mt-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                   Edit Profile
                 </button>
              </div>
              
               <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-6 overflow-hidden relative group">
                <div className="flex items-start gap-4 relative z-10">
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900 text-[15px]">Account Security</h3>
                      <p className="text-xs text-slate-500 mt-1 mb-3">Your account is protected with enterprise grade encryption.</p>
                      <button className="text-[13px] font-bold text-blue-600 hover:underline">Change Password</button>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
