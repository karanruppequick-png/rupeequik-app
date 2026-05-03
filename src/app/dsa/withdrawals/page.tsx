"use client";
import { useEffect, useState } from "react";
import { Wallet, Loader2, CheckCircle } from "lucide-react";
import { use } from "react";

interface Stats {
  walletBalance: number;
}

export default function DSAWithdrawalsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dsa/stats");
        const data = await res.json();
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/dsa/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setAmount("");
      } else {
        setError(data.error || "Withdrawal failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  const balance = (stats?.walletBalance ?? 0) / 100;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Withdraw Earnings</h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Available Balance</p>
            <p className="text-3xl font-bold text-slate-900">₹{balance.toLocaleString()}</p>
          </div>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1C295E]">Withdrawal Request Submitted</h2>
            <p className="text-slate-500">Your withdrawal is being processed. Funds will be transferred to your registered account within 3-5 business days.</p>
            <button onClick={() => setSuccess(false)} className="text-[#4A69FF] font-semibold hover:underline">Request another withdrawal</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min={500} step={100} required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg font-bold outline-none focus:border-[#4A69FF] focus:ring-2 focus:ring-[#4A69FF]/20"
                placeholder="Enter amount (min ₹500)" />
              <p className="text-xs text-slate-400 mt-1">Minimum withdrawal: ₹500</p>
            </div>
            <button type="submit" disabled={submitting || parseFloat(amount) > balance || parseFloat(amount) < 500}
              className="w-full py-3 bg-[#4A69FF] text-white font-bold rounded-lg hover:bg-[#2B3B8B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Withdraw Funds"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}