"use client";
import { useEffect, useState } from "react";
import { Users, TrendingUp, Wallet, Loader2, Copy, Share2 } from "lucide-react";

interface Stats {
  totalLeads: number;
  totalEarnings: number;
  walletBalance: number;
  tier: string;
  partnerCode: string;
}

interface Lead {
  id: string;
  phone: string;
  name: string | null;
  category: string;
  status: string;
  createdAt: string;
}

export default function DSADashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch("/api/dsa/stats"),
          fetch("/api/dsa/leads?limit=5"),
        ]);
        const statsData = await statsRes.json();
        const leadsData = await leadsRes.json();
        setStats(statsData.data);
        setLeads(leadsData.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const referralLink = stats ? `https://rupeequik.com/?ref=${stats.partnerCode}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=Apply for loans and credit cards with RupeeQuik! Use my referral link: ${referralLink}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalLeads ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Earnings</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">₹{((stats?.totalEarnings ?? 0) / 100).toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Wallet Balance</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">₹{((stats?.walletBalance ?? 0) / 100).toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><Wallet className="w-5 h-5 text-amber-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tier</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 capitalize">{stats?.tier ?? "silver"}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-purple-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Referral Link</h2>
        <p className="text-sm text-slate-500 mb-4">Share this link with anyone who applies through RupeeQuik. You earn commission on successful leads.</p>
        <div className="flex gap-2">
          <input readOnly value={referralLink} className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-700" />
          <button onClick={copyLink} className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200 flex items-center gap-2">
            <Copy className="w-4 h-4" /> {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={shareWhatsApp} className="px-4 py-2.5 bg-[#25D366] text-white rounded-lg text-sm font-semibold hover:bg-[#1ebe5c] flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Leads</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-2 font-medium text-slate-500">Name</th>
                <th className="text-left py-2 px-2 font-medium text-slate-500">Phone</th>
                <th className="text-left py-2 px-2 font-medium text-slate-500">Category</th>
                <th className="text-left py-2 px-2 font-medium text-slate-500">Status</th>
                <th className="text-left py-2 px-2 font-medium text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 px-2 text-slate-900">{lead.name ?? "—"}</td>
                  <td className="py-2.5 px-2 font-mono text-slate-600">{lead.phone}</td>
                  <td className="py-2.5 px-2 text-slate-600 capitalize">{lead.category}</td>
                  <td className="py-2.5 px-2"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{lead.status}</span></td>
                  <td className="py-2.5 px-2 text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">No leads yet. Share your referral link to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}