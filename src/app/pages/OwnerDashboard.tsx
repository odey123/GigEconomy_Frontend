import { Plus, Bell, Wallet, Users, TrendingUp, Clock, Home, Briefcase, User } from 'lucide-react';
import { Link } from 'react-router';

export default function OwnerDashboard() {
  const hasGigs = true; // Toggle for empty state

  const activeGigs = [
    {
      id: 1,
      title: 'Sell Parfait',
      type: 'sales',
      status: 'active',
      applicants: 12,
      activeWorkers: 3,
      revenue: '₦45,000'
    },
    {
      id: 2,
      title: 'Sew 10 Ankara Dresses',
      type: 'task',
      status: 'active',
      applicants: 5,
      activeWorkers: 1,
      revenue: '₦15,000'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl text-[#1a1a1a]">Hi, Adunni 👋</h1>
            <p className="text-sm text-[#6b7280]">Good to see you today</p>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative p-2 hover:bg-[#f9fafb] rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-[#6b7280]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#F4B942] rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1F5F5B]/5 rounded-lg">
              <Wallet className="w-5 h-5 text-[#1F5F5B]" />
              <span className="text-sm text-[#1a1a1a]">₦125,450</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Card */}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#F4B942]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#F4B942]" />
              </div>
            </div>
            <p className="text-2xl text-[#1a1a1a] mb-1">₦87,200</p>
            <p className="text-xs text-[#6b7280]">Revenue this month</p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#1F5F5B]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#1F5F5B]" />
              </div>
            </div>
            <p className="text-2xl text-[#1a1a1a] mb-1">4</p>
            <p className="text-xs text-[#6b7280]">Active workers</p>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#E76F51]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#E76F51]" />
              </div>
            </div>
            <p className="text-2xl text-[#1a1a1a] mb-1">17</p>
            <p className="text-xs text-[#6b7280]">Pending applicants</p>
          </div>
        </div>

        {/* Active Gigs */}
        {hasGigs ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-[#1a1a1a]">Your Active Gigs</h2>
              <Link to="/gigs" className="text-sm text-[#1F5F5B] hover:underline">
                View all
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {activeGigs.map(gig => (
                <div key={gig.id} className="bg-white border border-[#e5e7eb] rounded-xl p-5 min-w-[280px] flex-shrink-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-xs mb-2 ${
                        gig.type === 'sales'
                          ? 'bg-[#F4B942]/10 text-[#F4B942]'
                          : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
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
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6b7280]">Revenue</span>
                      <span className="text-[#1a1a1a]">{gig.revenue}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 border border-[#e5e7eb] text-[#1a1a1a] rounded-lg hover:bg-[#f9fafb] transition-colors text-sm">
                    Manage Gig
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-[#f9fafb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-[#6b7280]" />
            </div>
            <h3 className="text-lg mb-2 text-[#1a1a1a]">No gigs yet</h3>
            <p className="text-[#6b7280] mb-6 max-w-md mx-auto">
              Post your first gig to start connecting with talented workers in your area
            </p>
            <Link
              to="/post-gig"
              className="inline-flex items-center gap-2 bg-[#1F5F5B] text-white px-6 py-3 rounded-lg hover:bg-[#1a4f4c] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post Your First Gig
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-[#1F5F5B]">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Briefcase className="w-6 h-6" />
            <span className="text-xs">Gigs</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Wallet className="w-6 h-6" />
            <span className="text-xs">Wallet</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#6b7280]">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
