'use client';

import { useEffect, useState } from 'react';
import { Users, Tag, UserPlus, TrendingUp, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  totalLeads: number;
  totalOffers: number;
  categoryStats: { category: string; count: number }[];
  recentLeads: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    category: string;
    status: string;
    createdAt: string;
    offer: { title: string } | null;
  }[];
}

const categoryLabels: Record<string, string> = {
  'personal-loan': 'Personal Loan',
  'business-loan': 'Business Loan',
  'credit-card': 'Credit Card',
  'home-loan': 'Home Loan',
};

function formatCategory(cat: string) {
  return categoryLabels[cat] || cat;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error('Failed to load analytics');
        setData(await res.json());
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        {error || 'No data available.'}
      </div>
    );
  }

  const todayLeads = data.recentLeads.filter((l) => {
    const today = new Date();
    const d = new Date(l.createdAt);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }).length;

  const convertedLeads = data.recentLeads.filter(
    (l) => l.status === 'converted'
  ).length;
  const conversionRate =
    data.totalLeads > 0
      ? ((convertedLeads / data.totalLeads) * 100).toFixed(1)
      : '0';

  const stats = [
    {
      label: 'Total Leads',
      value: data.totalLeads,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Offers',
      value: data.totalOffers,
      icon: Tag,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Leads Today',
      value: todayLeads,
      icon: UserPlus,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const chartData = data.categoryStats.map((s) => ({
    name: formatCategory(s.category),
    leads: s.count,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {s.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Leads by Category
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                <Tooltip />
                <Bar dataKey="leads" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm text-center py-12">
              No data yet
            </p>
          )}
        </div>

        {/* Recent leads */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Leads
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 font-medium text-slate-500">
                    Name
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-slate-500">
                    Category
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2.5 px-2 text-slate-900">{lead.name}</td>
                    <td className="py-2.5 px-2">
                      <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {formatCategory(lead.category)}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data.recentLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-8 text-slate-400"
                    >
                      No leads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
