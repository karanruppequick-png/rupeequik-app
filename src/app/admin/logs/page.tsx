'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  changesBefore: string | null;
  changesAfter: string | null;
  actorType: string | null;
  actorId: string | null;
  ipAddress: string | null;
  createdAt: string;
}

interface LogsResponse {
  success: boolean;
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

const LIMIT = 50;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', action: '' });

  const totalPages = Math.ceil(total / LIMIT) || 1;

  async function loadLogs(pageNum: number, f: typeof filters) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(pageNum));
      params.set('limit', String(LIMIT));
      if (f.dateFrom) params.set('dateFrom', f.dateFrom);
      if (f.dateTo) params.set('dateTo', f.dateTo);
      if (f.action) params.set('action', f.action);

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      const data: LogsResponse = await res.json();
      if (data.success) {
        setLogs(data.data);
        setTotal(data.pagination.total);
      } else {
        setError(data.error || 'Failed to load logs');
      }
    } catch {
      setError('Failed to load logs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs(1, filters);
  }, []);

  useEffect(() => {
    loadLogs(page, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleFilterChange(field: string, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function handleApplyFilters() {
    setPage(1);
    loadLogs(1, filters);
  }

  function handleClearFilters() {
    const empty = { dateFrom: '', dateTo: '', action: '' };
    setFilters(empty);
    setPage(1);
    loadLogs(1, empty);
  }

  function truncate(str: string | null, len: number): string {
    if (!str) return '—';
    return str.length > len ? str.slice(0, len) + '...' : str;
  }

  function actionBadge(action: string) {
    return (
      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
        {action}
      </span>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-0.5">All admin actions are recorded here</p>
      </div>

      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-xs text-slate-500 block mb-1">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Action</label>
          <input
            type="text"
            placeholder="e.g. lead.update"
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-40"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleClearFilters}
            className="text-sm px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
          <button
            onClick={handleApplyFilters}
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      {!loading && (
        <p className="text-sm text-slate-500">{total} log entries</p>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Staff ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Action</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Entity</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Changes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">Loading logs...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-red-500">{error}</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 align-top">
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {format(new Date(log.createdAt), 'dd MMM yyyy HH:mm')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-slate-600">
                        {log.actorId ? log.actorId.slice(0, 8) + '...' : <span className="text-slate-300">system</span>}
                      </span>
                    </td>
                    <td className="py-3 px-4">{actionBadge(log.action)}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div className="font-medium">{log.entityType ?? '—'}</div>
                      <div className="text-slate-400 font-mono">{log.entityId?.slice(0, 8)}...</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-xs">
                      {log.changesBefore && log.changesAfter ? (
                        <div>
                          <div className="text-red-400 line-through">{truncate(log.changesBefore, 60)}</div>
                          <div className="text-green-600 mt-0.5">{truncate(log.changesAfter, 60)}</div>
                        </div>
                      ) : log.changesAfter ? (
                        <div className="text-green-600">{truncate(log.changesAfter, 60)}</div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1 || loading}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages || loading}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
