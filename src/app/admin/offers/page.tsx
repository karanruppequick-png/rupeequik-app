'use client';

import { useEffect, useState, FormEvent } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
} from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  category: string;
  dsaName: string;
  description: string;
  interestRate: string | null;
  benefits: string | null;
  cashback: string | null;
  maxAmount: string | null;
  tenure: string | null;
  processingFee: string | null;
  emi: string | null;
  bgLogo: string | null;
  redirectUrl: string;
  status: string;
  priority: number;
  createdAt: string;
  // Eligibility fields
  minCreditScore?: number | null;
  maxCreditScore?: number | null;
  allowNTCUsers?: boolean;
  maxRecentInquiries?: number | null;
  minOnTimePaymentRate?: number | null;
  maxCreditUtilization?: number | null;
  minBureauVintageMonths?: number | null;
  maxOpenLoans?: number | null;
  minMonthlyIncome?: number | null;
  maxFOIR?: number | null;
  employmentTypes?: string;
  minEmploymentTenureMonths?: number | null;
  minBusinessVintageYears?: number | null;
  employerCategories?: string;
  minLoanAmount?: number | null;
  maxLoanAmount?: number | null;
  minTenureMonths?: number | null;
  maxTenureMonths?: number | null;
  minInterestRate?: number | null;
  maxInterestRate?: number | null;
  processingFeePercent?: number | null;
  isSecured?: boolean;
  collateralType?: string | null;
  allowedStates?: string;
  allowedCityTiers?: string;
  excludedPincodes?: string;
  badgeText?: string | null;
  isFeatured?: boolean;
  isNewToCreditFriendly?: boolean;
  maxExistingCreditCards?: number | null;
}

const categories = [
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'business-loan', label: 'Business Loan' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'home-loan', label: 'Home Loan' },
];

const categoryLabels: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.value, c.label])
);

const emptyForm = {
  title: '',
  category: 'personal-loan',
  dsaName: '',
  description: '',
  interestRate: '',
  benefits: '',
  cashback: '',
  maxAmount: '',
  tenure: '',
  processingFee: '',
  emi: '',
  bgLogo: '',
  redirectUrl: '',
  status: 'active',
  priority: 0,
  minCreditScore: '',
  minBureauVintageMonths: '',
  maxOpenLoans: '',
  maxCreditScore: '',
  allowNTCUsers: false,
  maxRecentInquiries: '',
  minOnTimePaymentRate: '',
  maxCreditUtilization: '',
  // Income
  minMonthlyIncome: '',
  maxFOIR: '',
  employmentTypes: [] as string[],
  minEmploymentTenureMonths: '',
  minBusinessVintageYears: '',
  employerCategories: [] as string[],
  // Loan
  minLoanAmount: '',
  maxLoanAmount: '',
  minTenureMonths: '',
  maxTenureMonths: '',
  minInterestRate: '',
  maxInterestRate: '',
  processingFeePercent: '',
  isSecured: false,
  collateralType: '',
  // Geography
  allowedStates: '',
  allowedCityTiers: [] as string[],
  excludedPincodes: '',
  // Display
  badgeText: '',
  isFeatured: false,
  isNewToCreditFriendly: false,
  maxExistingCreditCards: null as number | null,
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showEligibility, setShowEligibility] = useState(false);

  async function loadOffers() {
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.set('category', filterCategory);
      // Fetch all offers including inactive for admin
      const res = await fetch(`/api/offers?${params.toString()}`);
      if (!res.ok) throw new Error();
      setOffers(await res.json());
    } catch {
      setError('Failed to load offers.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory]);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(offer: Offer) {
    const parsedForm = {
      ...emptyForm,
      title: offer.title,
      category: offer.category,
      dsaName: offer.dsaName,
      description: offer.description,
      interestRate: offer.interestRate || '',
      benefits: offer.benefits || '',
      cashback: offer.cashback || '',
      maxAmount: offer.maxAmount || '',
      tenure: offer.tenure || '',
      processingFee: offer.processingFee || '',
      emi: offer.emi || '',
      bgLogo: offer.bgLogo || '',
      redirectUrl: offer.redirectUrl,
      status: offer.status,
      priority: offer.priority,
      minCreditScore: String(offer.minCreditScore ?? ''),
      maxCreditScore: String(offer.maxCreditScore ?? ''),
      allowNTCUsers: offer.allowNTCUsers ?? false,
      maxRecentInquiries: String(offer.maxRecentInquiries ?? ''),
      minOnTimePaymentRate: String(offer.minOnTimePaymentRate ?? ''),
      maxCreditUtilization: String(offer.maxCreditUtilization ?? ''),
      minBureauVintageMonths: String(offer.minBureauVintageMonths ?? ''),
      maxOpenLoans: String(offer.maxOpenLoans ?? ''),
      minMonthlyIncome: String(offer.minMonthlyIncome ?? ''),
      maxFOIR: String(offer.maxFOIR ?? ''),
      employmentTypes: JSON.parse(offer.employmentTypes || '[]'),
      minEmploymentTenureMonths: String(offer.minEmploymentTenureMonths ?? ''),
      minBusinessVintageYears: String(offer.minBusinessVintageYears ?? ''),
      employerCategories: JSON.parse(offer.employerCategories || '[]'),
      minLoanAmount: String(offer.minLoanAmount ?? ''),
      maxLoanAmount: String(offer.maxLoanAmount ?? ''),
      minTenureMonths: String(offer.minTenureMonths ?? ''),
      maxTenureMonths: String(offer.maxTenureMonths ?? ''),
      minInterestRate: String(offer.minInterestRate ?? ''),
      maxInterestRate: String(offer.maxInterestRate ?? ''),
      processingFeePercent: String(offer.processingFeePercent ?? ''),
      isSecured: offer.isSecured ?? false,
      collateralType: offer.collateralType ?? '',
      allowedStates: (() => { try { return JSON.parse(offer.allowedStates || '[]').join(', '); } catch { return ''; } })(),
      allowedCityTiers: JSON.parse(offer.allowedCityTiers || '[]'),
      excludedPincodes: (() => { try { return JSON.parse(offer.excludedPincodes || '[]').join(', '); } catch { return ''; } })(),
      badgeText: offer.badgeText ?? '',
      isFeatured: offer.isFeatured ?? false,
      isNewToCreditFriendly: offer.isNewToCreditFriendly ?? false,
      maxExistingCreditCards: offer.maxExistingCreditCards ?? null,
    };
    setForm(parsedForm);
    setEditingId(offer.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body = {
        ...form,
        // Re-serialize JSON string arrays
        employmentTypes: JSON.stringify(form.employmentTypes),
        employerCategories: JSON.stringify(form.employerCategories),
        allowedCityTiers: JSON.stringify(form.allowedCityTiers),
        // Convert comma-separated to JSON array
        allowedStates: JSON.stringify(form.allowedStates.split(',').map((s: string) => s.trim()).filter(Boolean)),
        excludedPincodes: JSON.stringify(form.excludedPincodes.split(',').map((s: string) => s.trim()).filter(Boolean)),
        // Convert empty strings to null/undefined
        interestRate: form.interestRate || null,
        benefits: form.benefits || null,
        cashback: form.cashback || null,
        maxAmount: form.maxAmount || null,
        tenure: form.tenure || null,
        processingFee: form.processingFee || null,
        emi: form.emi || null,
        bgLogo: form.bgLogo || null,
        // Numeric fields
        priority: form.priority,
        minCreditScore: form.minCreditScore ? parseInt(form.minCreditScore) : null,
        maxCreditScore: form.maxCreditScore ? parseInt(form.maxCreditScore) : null,
        maxRecentInquiries: form.maxRecentInquiries ? parseInt(form.maxRecentInquiries) : null,
        minOnTimePaymentRate: form.minOnTimePaymentRate ? parseFloat(form.minOnTimePaymentRate) : null,
        maxCreditUtilization: form.maxCreditUtilization ? parseFloat(form.maxCreditUtilization) : null,
        minMonthlyIncome: form.minMonthlyIncome ? parseInt(form.minMonthlyIncome) : null,
        maxFOIR: form.maxFOIR ? parseFloat(form.maxFOIR) : null,
        minEmploymentTenureMonths: form.minEmploymentTenureMonths ? parseInt(form.minEmploymentTenureMonths) : null,
        minBusinessVintageYears: form.minBusinessVintageYears ? parseInt(form.minBusinessVintageYears) : null,
        minLoanAmount: form.minLoanAmount ? parseInt(form.minLoanAmount) : null,
        maxLoanAmount: form.maxLoanAmount ? parseInt(form.maxLoanAmount) : null,
        minTenureMonths: form.minTenureMonths ? parseInt(form.minTenureMonths) : null,
        maxTenureMonths: form.maxTenureMonths ? parseInt(form.maxTenureMonths) : null,
        minInterestRate: form.minInterestRate ? parseFloat(form.minInterestRate) : null,
        maxInterestRate: form.maxInterestRate ? parseFloat(form.maxInterestRate) : null,
        processingFeePercent: form.processingFeePercent ? parseFloat(form.processingFeePercent) : null,
        collateralType: form.collateralType || null,
        badgeText: form.badgeText || null,
        isSecured: form.isSecured,
        maxExistingCreditCards: form.maxExistingCreditCards ? parseInt(String(form.maxExistingCreditCards)) : null,
      };

      const url = editingId ? `/api/offers/${editingId}` : '/api/offers';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();

      setModalOpen(false);
      setLoading(true);
      await loadOffers();
    } catch {
      setError('Failed to save offer.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/offers/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setDeleteId(null);
      setLoading(true);
      await loadOffers();
    } catch {
      setError('Failed to delete offer.');
    } finally {
      setDeleting(false);
    }
  }

  function updateForm(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleEmploymentType(val: string) {
    const curr = form.employmentTypes as string[];
    const next = curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val];
    updateForm('employmentTypes', next);
  }

  function toggleEmployerCategory(val: string) {
    const curr = form.employerCategories as string[];
    const next = curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val];
    updateForm('employerCategories', next);
  }

  function toggleCityTier(val: string) {
    const curr = form.allowedCityTiers as string[];
    const next = curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val];
    updateForm('allowedCityTiers', next);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Offers</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Offer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
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
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">DSA Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Interest Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{offer.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {categoryLabels[offer.category] || offer.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{offer.dsaName}</td>
                    <td className="py-3 px-4 text-slate-600">{offer.interestRate || '-'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          offer.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(offer)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(offer.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {offers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No offers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Edit Offer' : 'Create Offer'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm('category', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DSA Name</label>
                <input
                  required
                  value={form.dsaName}
                  onChange={(e) => updateForm('dsaName', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate</label>
                  <input
                    value={form.interestRate}
                    onChange={(e) => updateForm('interestRate', e.target.value)}
                    placeholder="e.g. 10.5%"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">EMI</label>
                  <input
                    value={form.emi}
                    onChange={(e) => updateForm('emi', e.target.value)}
                    placeholder="e.g. 16,134"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Amount</label>
                  <input
                    value={form.maxAmount}
                    onChange={(e) => updateForm('maxAmount', e.target.value)}
                    placeholder="e.g. ₹50 Lakhs"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tenure</label>
                  <input
                    value={form.tenure}
                    onChange={(e) => updateForm('tenure', e.target.value)}
                    placeholder="e.g. 5 Years"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cashback</label>
                  <input
                    value={form.cashback}
                    onChange={(e) => updateForm('cashback', e.target.value)}
                    placeholder="e.g. ₹2,000"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Processing Fee</label>
                  <input
                    value={form.processingFee}
                    onChange={(e) => updateForm('processingFee', e.target.value)}
                    placeholder="e.g. Up to 2%"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) => updateForm('priority', parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">UI Style (Logo BG)</label>
                  <input
                    value={form.bgLogo}
                    onChange={(e) => updateForm('bgLogo', e.target.value)}
                    placeholder="bg-blue-100 text-blue-700"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Benefits</label>
                <textarea
                  rows={2}
                  value={form.benefits}
                  onChange={(e) => updateForm('benefits', e.target.value)}
                  placeholder="Comma-separated benefits"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Redirect URL</label>
                <input
                  required
                  type="url"
                  value={form.redirectUrl}
                  onChange={(e) => updateForm('redirectUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <button
                  type="button"
                  onClick={() =>
                    updateForm('status', form.status === 'active' ? 'inactive' : 'active')
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.status === 'active' ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-500">
                  {form.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Eligibility Rules - Collapsible */}
              <div className="border-t pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowEligibility(!showEligibility)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2 w-full text-left"
                >
                  <span>{showEligibility ? '▼' : '▶'}</span>
                  Eligibility Rules
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    (optional — leave blank for no restriction)
                  </span>
                </button>

                {showEligibility && (
                  <div className="mt-3 space-y-4">
                    {/* Credit Requirements */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Credit Requirements
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">Min CIBIL Score</label>
                          <input type="number" placeholder="e.g. 650"
                            value={form.minCreditScore ?? ''}
                            onChange={e => updateForm('minCreditScore', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max CIBIL Score</label>
                          <input type="number" placeholder="e.g. 749"
                            value={form.maxCreditScore ?? ''}
                            onChange={e => updateForm('maxCreditScore', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max Recent Inquiries</label>
                          <input type="number" placeholder="e.g. 5"
                            value={form.maxRecentInquiries ?? ''}
                            onChange={e => updateForm('maxRecentInquiries', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Min On-Time Payment %</label>
                          <input type="number" min="0" max="100" placeholder="e.g. 85"
                            value={form.minOnTimePaymentRate ?? ''}
                            onChange={e => updateForm('minOnTimePaymentRate', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max Credit Utilization %</label>
                          <input type="number" min="0" max="100" placeholder="e.g. 60"
                            value={form.maxCreditUtilization ?? ''}
                            onChange={e => updateForm('maxCreditUtilization', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Min Bureau Vintage (months)</label>
                          <input type="number" placeholder="e.g. 6"
                            value={form.minBureauVintageMonths ?? ''}
                            onChange={e => updateForm('minBureauVintageMonths', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <input type="checkbox" id="allowNTC"
                          checked={form.allowNTCUsers ?? false}
                          onChange={e => updateForm('allowNTCUsers', e.target.checked)} />
                        <label htmlFor="allowNTC" className="text-sm">
                          Allow New-to-Credit users (no bureau history)
                        </label>
                      </div>
                    </div>

                    {/* Income & Employment */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Income &amp; Employment
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs text-gray-600">Min Monthly Income ₹</label>
                          <input type="number" placeholder="e.g. 25000"
                            value={form.minMonthlyIncome ?? ''}
                            onChange={e => updateForm('minMonthlyIncome', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max FOIR %</label>
                          <input type="number" min="0" max="100" placeholder="e.g. 60"
                            value={form.maxFOIR ?? ''}
                            onChange={e => updateForm('maxFOIR', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Min Employment Tenure (months)</label>
                          <input type="number" placeholder="e.g. 12"
                            value={form.minEmploymentTenureMonths ?? ''}
                            onChange={e => updateForm('minEmploymentTenureMonths', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Min Business Vintage (years)</label>
                          <input type="number" placeholder="e.g. 2"
                            value={form.minBusinessVintageYears ?? ''}
                            onChange={e => updateForm('minBusinessVintageYears', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="text-xs text-gray-600 block mb-1">
                          Employment Types Accepted
                          <span className="text-gray-400 ml-1">(uncheck all = all types accepted)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            ['salaried_govt','Govt Salaried'],
                            ['salaried_private','Private Salaried'],
                            ['salaried_mnc','MNC Salaried'],
                            ['self_employed_professional','Self-Employed Professional'],
                            ['self_employed_business','Business Owner'],
                            ['freelancer','Freelancer'],
                            ['pensioner','Pensioner'],
                          ].map(([val, label]) => (
                            <label key={val} className="flex items-center gap-1 text-sm">
                              <input type="checkbox"
                                checked={(form.employmentTypes ?? []).includes(val)}
                                onChange={() => toggleEmploymentType(val)} />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">
                          Employer Categories
                          <span className="text-gray-400 ml-1">(uncheck all = any employer)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            ['govt','Govt / PSU'],
                            ['mnc','MNC'],
                            ['listed_private','Listed Private'],
                            ['unlisted_private','Unlisted Private'],
                            ['any','Any'],
                          ].map(([val, label]) => (
                            <label key={val} className="flex items-center gap-1 text-sm">
                              <input type="checkbox"
                                checked={(form.employerCategories ?? []).includes(val)}
                                onChange={() => toggleEmployerCategory(val)} />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Loan Parameters */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Loan Parameters
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-600">Min Loan Amount ₹</label>
                          <input type="number" placeholder="e.g. 50000"
                            value={form.minLoanAmount ?? ''}
                            onChange={e => updateForm('minLoanAmount', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max Loan Amount ₹</label>
                          <input type="number" placeholder="e.g. 2500000"
                            value={form.maxLoanAmount ?? ''}
                            onChange={e => updateForm('maxLoanAmount', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Min Tenure (months)</label>
                          <input type="number" placeholder="e.g. 12"
                            value={form.minTenureMonths ?? ''}
                            onChange={e => updateForm('minTenureMonths', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max Tenure (months)</label>
                          <input type="number" placeholder="e.g. 60"
                            value={form.maxTenureMonths ?? ''}
                            onChange={e => updateForm('maxTenureMonths', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Min Interest Rate %</label>
                          <input type="number" step="0.1" placeholder="e.g. 10.5"
                            value={form.minInterestRate ?? ''}
                            onChange={e => updateForm('minInterestRate', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max Interest Rate %</label>
                          <input type="number" step="0.1" placeholder="e.g. 24.0"
                            value={form.maxInterestRate ?? ''}
                            onChange={e => updateForm('maxInterestRate', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Processing Fee %</label>
                          <input type="number" step="0.1" placeholder="e.g. 2.0"
                            value={form.processingFeePercent ?? ''}
                            onChange={e => updateForm('processingFeePercent', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input type="checkbox" id="isSecured"
                            checked={form.isSecured ?? false}
                            onChange={e => updateForm('isSecured', e.target.checked)} />
                          <label htmlFor="isSecured" className="text-sm">Secured Product (requires collateral)</label>
                        </div>
                      </div>
                      {form.isSecured && (
                        <div className="mt-3">
                          <label className="text-xs text-gray-600">Collateral Type</label>
                          <input type="text" placeholder="e.g. property, gold, fd, vehicle"
                            value={form.collateralType ?? ''}
                            onChange={e => updateForm('collateralType', e.target.value)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                      )}
                    </div>

                    {/* Geography */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Geography
                        <span className="text-gray-400 font-normal normal-case ml-1">(blank = all India)</span>
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600">Allowed States (comma-separated)</label>
                          <input type="text" placeholder="e.g. Maharashtra, Karnataka"
                            value={form.allowedStates ?? ''}
                            onChange={e => updateForm('allowedStates', e.target.value)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            City Tiers
                            <span className="text-gray-400 ml-1">(uncheck all = all cities)</span>
                          </label>
                          <div className="flex gap-4">
                            {[
                              ['metro','Metro'],
                              ['tier1','Tier 1'],
                              ['tier2','Tier 2'],
                              ['tier3','Tier 3'],
                            ].map(([val, label]) => (
                              <label key={val} className="flex items-center gap-1 text-sm">
                                <input type="checkbox"
                                  checked={(form.allowedCityTiers ?? []).includes(val)}
                                  onChange={() => toggleCityTier(val)} />
                                {label}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Excluded Pincodes (comma-separated)</label>
                          <input type="text" placeholder="e.g. 400001, 110001"
                            value={form.excludedPincodes ?? ''}
                            onChange={e => updateForm('excludedPincodes', e.target.value)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Display Options */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Display Options
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-600">Badge Text</label>
                          <input type="text" placeholder="e.g. Pre-approved, Low Rate, Quick Disbursal"
                            value={form.badgeText ?? ''}
                            onChange={e => updateForm('badgeText', e.target.value)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="isFeatured"
                            checked={form.isFeatured ?? false}
                            onChange={e => updateForm('isFeatured', e.target.checked)} />
                          <label htmlFor="isFeatured" className="text-sm">Featured Offer (shown at top)</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="isNewToCreditFriendly"
                            checked={form.isNewToCreditFriendly ?? false}
                            onChange={e => updateForm('isNewToCreditFriendly', e.target.checked)} />
                          <label htmlFor="isNewToCreditFriendly" className="text-sm">NTC-Friendly (mark as suitable for new-to-credit users)</label>
                        </div>
                        <div className="mt-2">
                          <label className="text-xs text-gray-600">Max Existing Credit Cards</label>
                          <input type="number" placeholder="e.g. 3 (leave blank = no limit)"
                            value={form.maxExistingCreditCards ?? ''}
                            onChange={e => updateForm('maxExistingCreditCards', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border rounded p-2 text-sm mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Offer</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
