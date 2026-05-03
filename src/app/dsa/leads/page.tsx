"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  phone: string;
  category: string;
  status: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function StatusPill({ status }: { status: string }) {
  const base = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    contacted: "bg-blue-100 text-blue-700",
    converted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    disbursed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`${base} ${colors[status.toLowerCase()] ?? "bg-slate-100 text-slate-600"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function DSALeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchLeads(page: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/dsa/leads?page=${page}&limit=20`);
      const data = await res.json();
      setLeads(data.data ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads(1);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 border-b border-slate-100 flex gap-4 items-center px-4">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Leads</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-medium">
                    {lead.name ?? "—"}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">
                    {lead.phone}
                  </td>
                  <td className="py-3 px-4 text-slate-600 capitalize">
                    {lead.category.replace("-", " ")}
                  </td>
                  <td className="py-3 px-4">
                    <StatusPill status={lead.status} />
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No leads yet. Share your referral link to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchLeads(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => fetchLeads(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
