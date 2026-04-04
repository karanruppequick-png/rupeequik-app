'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface CreditCheck {
  id: string;
  pan: string;
  name: string;
  mobile: string;
  gender: string;
  score: number;
  source: string;
  createdAt: string;
}

export default function AdminCreditChecksPage() {
  const [checks, setChecks] = useState<CreditCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchChecks();
  }, [page, search]);

  async function fetchChecks() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/credit-checks?${params}`);
    const data = await res.json();
    setChecks(data.checks);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setLoading(false);
  }

  function getScoreColor(score: number) {
    if (score >= 800) return 'text-emerald-600 bg-emerald-50';
    if (score >= 750) return 'text-emerald-500 bg-emerald-50';
    if (score >= 700) return 'text-amber-600 bg-amber-50';
    if (score >= 650) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Checks</h1>
          <p className="text-sm text-gray-500">{total} total checks</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, PAN, or mobile..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20 sm:w-72"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : checks.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">No credit checks found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">PAN</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check) => (
                  <tr key={check.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{check.name}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{check.pan}</td>
                    <td className="px-4 py-3 text-gray-700">{check.mobile}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${getScoreColor(check.score)}`}>
                        {check.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        check.source === 'mock' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {check.source === 'mock' ? 'Mock' : 'SurePass'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(check.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
