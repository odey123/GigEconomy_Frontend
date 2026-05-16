import { useState, useEffect } from 'react';
import { Plus, Bell, Wallet, Users, TrendingUp, Clock, Home, Briefcase, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { gigsService } from '../../lib/services/gigs';
import { walletService } from '../../lib/services/wallet';

const MOCK_GIGS = [
  { id: 1, title: 'Sell Parfait', type: 'sales', status: 'active', applicants: 12, activeWorkers: 3 },
  { id: 2, title: 'Sew 10 Ankara Dresses', type: 'task', status: 'active', applicants: 5, activeWorkers: 1 },
];
const MOCK_BALANCE = '₦125,450';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeGigs, setActiveGigs] = useState(MOCK_GIGS);
  const [balance, setBalance] = useState(MOCK_BALANCE);
  const [noWallet, setNoWallet] = useState(false);

  useEffect(() => {
    gigsService.getMine()
      .then(data => { if (Array.isArray(data) && data.length) setActiveGigs(data as typeof MOCK_GIGS); })
      .catch(() => {});
    walletService.getBalance()
      .then(w => { if (w?.balance != null) setBalance(`₦${Number(w.balance).toLocaleString()}`); })
      .catch(err => {
        if (err?.message?.toLowerCase().includes('wallet')) setNoWallet(true);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20">
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl text-[#1a1a1a]">Hi, {user?.firstName ?? 'Adunni'} 👋</h1>
            <p className="text-sm text-[#6b7280]">Good to see you today</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Notifications" className="relative p-2 hover:bg-[#f9fafb] rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-[#6b7280]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#F4B942] rounded-full" />
            </button>
            {noWallet ? (
              <button
                type="button"
                onClick={() => navigate('/verify-bvn')}
                className="flex items-center gap-2 px-4 py-2 bg-[#F4B942]/10 border border-[#F4B942]/40 rounded-lg text-sm text-[#b5851f]"
              >
                Set up wallet
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1F5F5B]/5 rounded-lg">
                <Wallet className="w-5 h-5 text-[#1F5F5B]" />
                <span className="text-sm text-[#1a1a1a]">{balance}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-[#1F5F5B] to-[#1a4f4c] rounded-xl p-6 text-white">
          <h2 className="text-xl mb-2">Need help?</h2>
          <p className="text-white/80 mb-4 text-sm">Post a new gig and start getting applications in minutes</p>
          <Link
            to="/post-gig"
            className="inline-flex items-center gap-2 bg-white text-[#1F5F5B] px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Post a New Gig
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4">
            <div className="w-8 h-8 bg-[#F4B942]/10 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#F4B942]" />
            </div>
            <p className="text-2xl text-[#1a1a1a] mb-1">₦87,200</p>
            <p className="text-xs text-[#6b7280]">Revenue this month</p>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4">
            <div className="w-8 h-8 bg-[#1F5F5B]/10 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-[#1F5F5B]" />
            </div>
            <p className="text-2xl text-[#1a1a1a] mb-1">4</p>
            <p className="text-xs text-[#6b7280]">Active workers</p>
          </div>
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4">
            <div className="w-8 h-8 bg-[#E76F51]/10 rounded-lg flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#E76F51]" />
            </div>
            <p className="text-2xl text-[#1a1a1a] mb-1">17</p>
            <p className="text-xs text-[#6b7280]">Pending applicants</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-[#1a1a1a]">Your Active Gigs</h2>
            <Link to="/gigs" className="text-sm text-[#1F5F5B] hover:underline">View all</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {activeGigs.map(gig => (
              <div key={gig.id} className="bg-white border border-[#e5e7eb] rounded-xl p-5 min-w-[280px] flex-shrink-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded text-xs mb-2 ${
                      gig.type === 'sales' ? 'bg-[#F4B942]/10 text-[#F4B942]' : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
                    }`}>
                      {gig.type === 'sales' ? 'Sales' : 'Task'}
                    </span>
                    <h3 className="text-sm text-[#1a1a1a]">{gig.title}</h3>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7280]">Applicants</span>
                    <span className="text-[#1a1a1a]">{gig.applicants}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7280]">Active workers</span>
                    <span className="text-[#1a1a1a]">{gig.activeWorkers}</span>
                  </div>
                </div>
                <Link
                  to={`/gig/${gig.id}/applicants`}
                  className="block w-full py-2 border border-[#e5e7eb] text-[#1a1a1a] rounded-lg hover:bg-[#f9fafb] transition-colors text-sm text-center"
                >
                  Manage Gig
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button type="button" className="flex flex-col items-center gap-1 text-[#1F5F5B]">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button type="button" onClick={() => navigate('/contracts')} className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Briefcase className="w-6 h-6" />
            <span className="text-xs">Contracts</span>
          </button>
          <button type="button" onClick={() => navigate('/wallet')} className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Wallet className="w-6 h-6" />
            <span className="text-xs">Wallet</span>
          </button>
          <button type="button" onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-[#6b7280]">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
