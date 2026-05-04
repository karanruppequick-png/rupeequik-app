'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'telecaller' });
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function loadStaff() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      if (data.success) {
        setStaff(data.data);
      } else {
        setError(data.error || 'Failed to load staff');
      }
    } catch {
      setError('Failed to load staff');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  async function handleAddStaff() {
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 409) {
        setFormError('Email already registered');
      } else if (!data.success) {
        setFormError(data.error || 'Failed to add staff member');
      } else {
        setShowModal(false);
        setForm({ name: '', email: '', phone: '', role: 'telecaller' });
        await loadStaff();
        setSuccessMsg('Staff member added successfully');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      setFormError('Failed to add staff member');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, currentIsActive: boolean) {
    setToggling(id);
    try {
      await fetch(`/api/admin/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentIsActive }),
      });
      await loadStaff();
    } finally {
      setToggling(null);
    }
  }

  function roleBadge(role: string) {
    const map: Record<string, string> = {
      owner: 'bg-purple-100 text-purple-800',
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-orange-100 text-orange-800',
      manager: 'bg-blue-100 text-blue-800',
      telecaller: 'bg-gray-100 text-gray-800',
    };
    const label: Record<string, string> = {
      owner: 'Owner',
      super_admin: 'Super Admin',
      admin: 'Admin',
      manager: 'Manager',
      telecaller: 'Telecaller',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[role] ?? 'bg-gray-100 text-gray-600'}`}>
        {label[role] ?? role}
      </span>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-800">Staff Members</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Staff Member
        </button>
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

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Role</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Created</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Loading staff...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-red-500">{error}</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No staff members yet. Add one to get started.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{member.name}</td>
                    <td className="py-3 px-4 text-slate-600">{member.email}</td>
                    <td className="py-3 px-4 text-slate-600">{member.phone || '-'}</td>
                    <td className="py-3 px-4">{roleBadge(member.role)}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-red-400'}`} />
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {format(new Date(member.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggle(member.id, member.isActive)}
                        disabled={toggling === member.id}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          member.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        } disabled:opacity-50`}
                      >
                        {toggling === member.id ? '...' : member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Add Staff Member</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError(null);
                  setForm({ name: '', email: '', phone: '', role: 'telecaller' });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border rounded-lg p-2.5 w-full text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border rounded-lg p-2.5 w-full text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Phone</label>
                <input
                  type="tel"
                  maxLength={10}
                  pattern="\d{10}"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border rounded-lg p-2.5 w-full text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="border rounded-lg p-2.5 w-full text-sm"
                >
                  <option value="telecaller">Telecaller</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError(null);
                  setForm({ name: '', email: '', phone: '', role: 'telecaller' });
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Staff Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
