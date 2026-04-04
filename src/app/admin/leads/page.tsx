'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface Lead {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  pan: string | null;
  category: string;
  source: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  offer: { title: string; dsaName: string } | null;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

const categories = [
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'business-loan', label: 'Business Loan' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'home-loan', label: 'Home Loan' },
  { value: 'credit-score', label: 'Credit Score' },
  { value: 'general', label: 'General' },
];

const categoryLabels: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.value, c.label])
);

const statusColors: Record<string, string> = {
  'otp-verified': 'bg-blue-100 text-blue-700',
  'details-filled': 'bg-amber-100 text-amber-700',
  'offer-selected': 'bg-purple-100 text-purple-700',
  'redirected': 'bg-emerald-100 text-emerald-700',
  'credit-checked': 'bg-teal-100 text-teal-700',
  'new': 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  'otp-verified': 'OTP Verified',
  'details-filled': 'Details Filled',
  'offer-selected': 'Offer Selected',
  'redirected': 'Redirected',
  'credit-checked': 'Credit Checked',
  'new': 'New',
};

const sourceLabels: Record<string, string> = {
  'loan-apply': 'Loan Apply',
  'credit-score': 'Credit Score',
};

export default function LeadsPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (search) params.set('search', search);
      if (filterCategory) params.set('category', filterCategory);
      if (filterSource) params.set('source', filterSource);

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCategory, filterSource]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function exportCSV() {
    if (!data || data.leads.length === 0) return;

    const headers = ['Name', 'Phone', 'Email', 'PAN', 'Category', 'Source', 'Status', 'Offer', 'Date'];
    const rows = data.leads.map((l) => [
      l.name || '',
      l.phone,
      l.email || '',
      l.pan || '',
      categoryLabels[l.category] || l.category,
      sourceLabels[l.source] || l.source,
      statusLabels[l.status] || l.status,
      l.offer?.title || '',
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(searchInput);
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const leads = data?.leads || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          {data && <p className="text-sm text-slate-500">{data.total} total leads</p>}
        </div>
        <button
          onClick={exportCSV}
          disabled={!data || leads.length === 0}
          className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or PAN..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
        </div>
        <select
          value={filterSource}
          onChange={(e) => { setFilterSource(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Sources</option>
          <option value="loan-apply">Loan Apply</option>
          <option value="credit-score">Credit Score</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Offer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{lead.name || '-'}</div>
                      {lead.email && <div className="text-xs text-slate-400">{lead.email}</div>}
                      {lead.pan && <div className="text-xs text-slate-400 font-mono">{lead.pan}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{lead.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        lead.source === 'credit-score' ? 'bg-teal-50 text-teal-700' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {sourceLabels[lead.source] || lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {categoryLabels[lead.category] || lead.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[lead.status] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{lead.offer?.title || '-'}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, data.total)} of{' '}
            {data.total} leads
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
