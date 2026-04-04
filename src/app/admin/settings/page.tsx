'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [creditApiMode, setCreditApiMode] = useState('mock');
  const [surepassApiKey, setSurepassApiKey] = useState('');
  const [surepassApiUrl, setSurepassApiUrl] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setCreditApiMode(data.credit_api_mode || 'mock');
        setSurepassApiKey(data.surepass_api_key || '');
        setSurepassApiUrl(data.surepass_api_url || '');
      } catch { /* use defaults */ }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess('');
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credit_api_mode: creditApiMode,
          surepass_api_key: surepassApiKey,
          surepass_api_url: surepassApiUrl,
        }),
      });
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setSuccess('');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

      {/* Credit Score API Config */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Credit Score API</h2>
            <p className="text-sm text-gray-500">Configure the credit score data provider</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* API Mode Toggle */}
          <div>
            <label className="text-sm font-medium text-gray-700">API Mode</label>
            <div className="mt-2 flex gap-3">
              <button
                onClick={() => setCreditApiMode('mock')}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  creditApiMode === 'mock'
                    ? 'border-[#1B1F6B] bg-[#1B1F6B]/5 text-[#1B1F6B]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Mock Data</div>
                <div className="mt-1 text-xs opacity-70">
                  Generate dummy credit reports for testing
                </div>
              </button>
              <button
                onClick={() => setCreditApiMode('surepass')}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  creditApiMode === 'surepass'
                    ? 'border-[#1B1F6B] bg-[#1B1F6B]/5 text-[#1B1F6B]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">SurePass API</div>
                <div className="mt-1 text-xs opacity-70">
                  Real credit data from TransUnion CIBIL
                </div>
              </button>
            </div>
          </div>

          {/* SurePass config fields */}
          {creditApiMode === 'surepass' && (
            <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50/30 p-4">
              <div>
                <label className="text-sm font-medium text-gray-700">SurePass API URL *</label>
                <input
                  type="url"
                  value={surepassApiUrl}
                  onChange={(e) => setSurepassApiUrl(e.target.value)}
                  placeholder="https://kyc-api.surepass.io/api/v1/cibil/cibil-score"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">SurePass API Key *</label>
                <input
                  type="password"
                  value={surepassApiKey}
                  onChange={(e) => setSurepassApiKey(e.target.value)}
                  placeholder="Enter your SurePass API key"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono outline-none focus:border-[#1B1F6B] focus:ring-2 focus:ring-[#1B1F6B]/20"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Get your API key from the SurePass dashboard
                </p>
              </div>
            </div>
          )}

          {/* Rate limit info */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">Rate Limit</p>
            <p className="mt-1 text-xs text-gray-500">
              Each user can check their credit score once per month (per PAN).
              Repeated requests within 30 days will return the cached report.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1B1F6B] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15185a] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {success && (
            <span className="text-sm font-medium text-emerald-600">{success}</span>
          )}
        </div>
      </div>
    </div>
  );
}
