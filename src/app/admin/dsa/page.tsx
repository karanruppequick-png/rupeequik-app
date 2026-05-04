'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface DsaPartner {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  partnerCode: string;
  tier: string;
  totalLeads: number;
  walletBalance: number;
  totalEarnings: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function DsaPage() {
  const [partners, setPartners] = useState<DsaPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function loadPartners() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dsa');
      const data = await res.json();
      if (data.success) {
        setPartners(data.data);
      } else {
        setError(data.error || 'Failed to load partners');
      }
    } catch {
      setError('Failed to load partners');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPartners();
  }, []);

  async function handleVerify(id: string) {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/dsa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true }),
      });
      if (res.ok) {
        await loadPartners();
        setSuccessMsg('DSA partner verified and activated');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } finally {
      setActionId(null);
    }
  }

  async function handleToggleActive(id: string, currentIsActive: boolean) {
    setActionId(id);
    try {
      await fetch(`/api/admin/dsa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentIsActive }),
      });
      await loadPartners();
    } finally {
      setActionId(null);
    }
  }

  async function handleTierChange(id: string, newTier: string) {
    setActionId(id);
    try {
      await fetch(`/api/admin/dsa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier }),
      });
      await loadPartners();
    } finally {
      setActionId(null);
    }
  }

  function tierBadge(tier: string) {
    const map: Record<string, string> = {
      silver: 'bg-gray-100 text-gray-700',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-blue-100 text-blue-800',
      diamond: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[tier] ?? 'bg-gray-100 text-gray-600'}`}>
        {tier}
      </span>
    );
  }

  function formatINR(paise: number): string {
    const rupees = paise / 100;
    return '₹' + rupees.toLocaleString('en-IN');
  }

  const verifiedCount = partners.filter((p) => p.isVerified).length;
  const pendingCount = partners.filter((p) => !p.isVerified).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-800">DSA Partners</h1>
        <span className="text-sm text-slate-500">Partners self-register via /dsa/apply</span>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-2">
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-slate-800">{partners.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total Partners</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-slate-800">{verifiedCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Verified</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center">
          <div className="text-2xl font-bold text-slate-800">{pendingCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Pending</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Code</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Tier</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Leads</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Earnings</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Verified</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">Loading partners...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-red-500">{error}</td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No DSA partners yet. Partners register via /dsa/apply
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{partner.name}</div>
                      <div className="text-xs text-slate-400">{partner.email ?? '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{partner.phone}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {partner.partnerCode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={partner.tier}
                        onChange={(e) => handleTierChange(partner.id, e.target.value)}
                        disabled={actionId === partner.id}
                        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white"
                      >
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                        <option value="platinum">Platinum</option>
                        <option value="diamond">Diamond</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{partner.totalLeads}</td>
                    <td className="py-3 px-4 text-slate-600">{formatINR(partner.totalEarnings)}</td>
                    <td className="py-3 px-4">
                      {partner.isVerified ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <span>✓</span> Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {!partner.isVerified && (
                          <button
                            onClick={() => handleVerify(partner.id)}
                            disabled={actionId === partner.id}
                            className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-medium disabled:opacity-50"
                          >
                            {actionId === partner.id ? '...' : 'Verify'}
                          </button>
                        )}
                        {partner.isVerified && (
                          <button
                            onClick={() => handleToggleActive(partner.id, partner.isActive)}
                            disabled={actionId === partner.id}
                            className={`px-3 py-1 rounded text-xs font-medium disabled:opacity-50 ${
                              partner.isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {actionId === partner.id ? '...' : partner.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}