import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, ShieldOff, ShieldCheck, Search, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

type AdminTab = 'overview' | 'users' | 'flags';

interface Summary {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  activeLoans: number;
  totalVolume: number;
}

interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Flag {
  userId: string;
  user: { firstName: string; email: string };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  recommendedAction: string;
}

const riskColors: Record<string, string> = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-[#F4B942]/10 text-[#b5851f] border-[#F4B942]/40',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ status: string; data: Summary }>('/api/admin/summary')
      .then(r => setSummary(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (tab !== 'users') return;
    setLoading(true);
    const q = new URLSearchParams({ limit: '50', ...(search && { search }), ...(roleFilter && { role: roleFilter }) }).toString();
    api.get<{ status: string; data: { users: AdminUser[] } }>(`/api/admin/users?${q}`)
      .then(r => setUsers(r.data?.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab, search, roleFilter]);

  useEffect(() => {
    if (tab !== 'flags') return;
    setLoading(true);
    api.get<{ status: string; data: { flags: Flag[] } }>('/api/admin/flags')
      .then(r => setFlags(r.data?.flags ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  const suspend = async (id: string) => {
    await api.post(`/api/admin/users/${id}/suspend`).catch(() => {});
    setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'suspended' } : u));
    setActionMsg('User suspended');
    setTimeout(() => setActionMsg(null), 3000);
  };

  const reinstate = async (id: string) => {
    await api.post(`/api/admin/users/${id}/reinstate`).catch(() => {});
    setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'active' } : u));
    setActionMsg('User reinstated');
    setTimeout(() => setActionMsg(null), 3000);
  };

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'flags', label: 'Flags' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl text-[#1a1a1a]">Admin Dashboard</h1>
            <p className="text-xs text-[#6b7280]">GigNG — internal tools</p>
          </div>
          {actionMsg && (
            <span className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
              {actionMsg}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#f3f4f6] rounded-xl p-1 w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm transition-colors ${
                tab === t.key ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#6b7280] hover:text-[#1a1a1a]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total users', value: summary?.totalUsers ?? '—', icon: Users, color: 'text-[#1F5F5B] bg-[#1F5F5B]/10' },
                { label: 'Active users', value: summary?.activeUsers ?? '—', icon: ShieldCheck, color: 'text-green-600 bg-green-50' },
                { label: 'Transactions', value: summary?.totalTransactions ?? '—', icon: TrendingUp, color: 'text-[#F4B942] bg-[#F4B942]/10' },
                { label: 'Total volume', value: summary?.totalVolume != null ? `₦${Number(summary.totalVolume).toLocaleString()}` : '—', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-[#e5e7eb] rounded-xl p-5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl text-[#1a1a1a]">{value}</p>
                  <p className="text-xs text-[#6b7280] mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
                <p className="text-sm text-[#1a1a1a] mb-1">Active loans</p>
                <p className="text-3xl text-[#1a1a1a]">{summary?.activeLoans ?? '—'}</p>
              </div>
              <div className="bg-[#1F5F5B] rounded-xl p-5 text-white">
                <p className="text-white/70 text-sm mb-1">Platform health</p>
                <p className="text-lg">
                  {summary
                    ? `${Math.round((summary.activeUsers / Math.max(summary.totalUsers, 1)) * 100)}% of users active`
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="text"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5F5B]"
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                aria-label="Filter by role"
                className="px-4 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5F5B]"
              >
                <option value="">All roles</option>
                <option value="worker">Worker</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12 text-sm text-[#6b7280]">Loading users…</div>
            ) : (
              <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                    <tr>
                      {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-[#6b7280] font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f4f6]">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-[#f9fafb] transition-colors">
                        <td className="px-4 py-3 text-[#1a1a1a]">{u.firstName} {u.lastName}</td>
                        <td className="px-4 py-3 text-[#6b7280]">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            u.role === 'client' ? 'bg-[#F4B942]/10 text-[#b5851f]' : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6b7280]">
                          {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          {u.status === 'active' ? (
                            <button
                              type="button"
                              onClick={() => suspend(u._id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <ShieldOff className="w-3.5 h-3.5" />
                              Suspend
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => reinstate(u._id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Reinstate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#6b7280]">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Flags */}
        {tab === 'flags' && (
          <div className="space-y-3">
            {loading && <div className="text-center py-12 text-sm text-[#6b7280]">Loading flags…</div>}
            {!loading && flags.length === 0 && (
              <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-[#1a1a1a]">No flags at this time</p>
                <p className="text-sm text-[#6b7280] mt-1">All accounts look healthy</p>
              </div>
            )}
            {flags.map((flag, i) => (
              <div key={i} className="bg-white border border-[#e5e7eb] rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-[#1a1a1a]">
                        {flag.user?.firstName ?? 'Unknown'} — {flag.user?.email}
                      </span>
                      <span className={`px-2 py-0.5 border rounded text-xs ${riskColors[flag.riskLevel] ?? riskColors.medium}`}>
                        {flag.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-[#6b7280] mb-1">{flag.reason}</p>
                    <p className="text-xs text-[#1F5F5B]">Recommended: {flag.recommendedAction}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => suspend(flag.userId)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    <ShieldOff className="w-3.5 h-3.5" />
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
