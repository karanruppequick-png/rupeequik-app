"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, Wallet, LogOut, Loader2, Menu, X } from "lucide-react";

const navItems = [
  { href: "/dsa/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dsa/leads", label: "My Leads", icon: Users },
  { href: "/dsa/withdrawals", label: "Withdraw", icon: Wallet },
];

export default function DSALayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dsa, setDsa] = useState<{ name: string; partnerCode: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/dsa/profile");
        if (!res.ok) {
          router.push("/dsa/login");
          return;
        }
        const data = await res.json();
        setDsa(data.data);
      } catch {
        router.push("/dsa/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dsa/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`} style={{ backgroundColor: "#1e293b" }}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <Image src="/logo.png" alt="RupeeQuik" width={120} height={28} className="brightness-0 invert" />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700/50 hover:text-white"}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-6 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-1">{dsa?.name}</p>
          <p className="text-xs text-slate-500 font-mono mb-4">{dsa?.partnerCode}</p>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600"><Menu className="w-6 h-6" /></button>
          <div className="hidden lg:block" />
          <span className="text-sm text-slate-600">DSA Partner</span>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}