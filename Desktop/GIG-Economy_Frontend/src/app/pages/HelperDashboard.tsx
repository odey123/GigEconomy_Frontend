import { useState } from 'react';
import { Bell, Wallet, MapPin, Star, CheckCircle, Home, Search, User, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router';

const gigs = [
  {
    id: 1,
    title: 'Sell Parfait at Unilag Campus',
    description: 'Take parfait cups on consignment and sell to students. Perfect for campus reps with existing hostel networks.',
    type: 'sales',
    matchScore: 92,
    commission: '20%',
    commissionNote: 'per unit sold',
    estimatedEarnings: '₦8,000 – ₦15,000',
    location: 'Yaba, Lagos',
    distance: '1.2 km away',
    businessName: 'Cravings by Sade',
    verified: true,
    rating: 4.8,
    totalGigs: 14,
  },
  {
    id: 2,
    title: 'Sew 5 Ankara Midi Dresses',
    description: 'Need a skilled tailor to sew 5 ready-to-wear Ankara midi dresses for an upcoming market event.',
    type: 'task',
    matchScore: 85,
    fixedPrice: '₦12,500',
    commissionNote: 'fixed per task',
    estimatedEarnings: '₦12,500',
    location: 'Surulere, Lagos',
    distance: '3.5 km away',
    businessName: "Ade's Fashion House",
    verified: true,
    rating: 4.6,
    totalGigs: 22,
  },
  {
    id: 3,
    title: 'Sell Handmade Soaps at Church',
    description: 'Sell premium handmade soaps to your church community. Sample pack provided. Very easy sell.',
    type: 'sales',
    matchScore: 78,
    commission: '25%',
    commissionNote: 'per unit sold',
    estimatedEarnings: '₦5,000 – ₦20,000',
    location: 'Ikeja, Lagos',
    distance: '6.1 km away',
    businessName: 'NaturalGlow NG',
    verified: false,
    rating: 4.2,
    totalGigs: 6,
  },
];

type FilterType = 'all' | 'sales' | 'task';

export default function HelperDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const hasGigs = gigs.length > 0;

  const filtered = activeFilter === 'all' ? gigs : gigs.filter(g => g.type === activeFilter);

  const matchColor = (score: number) => {
    if (score >= 90) return 'bg-[#1F5F5B] text-white';
    if (score >= 75) return 'bg-[#F4B942] text-[#1a1a1a]';
    return 'bg-[#e5e7eb] text-[#6b7280]';
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl text-[#1a1a1a]">Hi, Chioma 👋</h1>
            <p className="text-sm text-[#6b7280]">Here's what's matched for you</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-[#f9fafb] rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-[#6b7280]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#F4B942] rounded-full" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1F5F5B]/5 rounded-lg">
              <Wallet className="w-5 h-5 text-[#1F5F5B]" />
              <span className="text-sm text-[#1a1a1a]">₦32,700</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Filter Chips */}
        <div className="flex gap-2">
          {(['all', 'sales', 'task'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeFilter === f
                  ? 'bg-[#1F5F5B] text-white'
                  : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:border-[#1F5F5B]/40'
              }`}
            >
              {f === 'all' ? 'All' : f === 'sales' ? 'Sales' : 'Tasks'}
            </button>
          ))}
          <span className="ml-auto text-sm text-[#6b7280] self-center">
            {filtered.length} gig{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Gig Feed */}
        {hasGigs && filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(gig => (
              <Link
                key={gig.id}
                to={`/gig/${gig.id}`}
                className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#1F5F5B]/30 hover:shadow-sm transition-all"
              >
                {/* Top row: type tag + match score */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded text-xs ${
                    gig.type === 'sales'
                      ? 'bg-[#F4B942]/10 text-[#b5851f]'
                      : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
                  }`}>
                    {gig.type === 'sales' ? 'Sales' : 'Task'}
                  </span>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${matchColor(gig.matchScore)}`}>
                    <Zap className="w-3 h-3" />
                    {gig.matchScore}% match
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-base text-[#1a1a1a] mb-1">{gig.title}</h3>
                <p className="text-sm text-[#6b7280] leading-relaxed mb-4 line-clamp-2">
                  {gig.description}
                </p>

                {/* Pay info */}
                <div className="bg-[#f9fafb] rounded-lg px-4 py-3 mb-4">
                  <p className="text-xs text-[#6b7280] mb-0.5">Estimated earnings</p>
                  <p className="text-base text-[#1a1a1a]">{gig.estimatedEarnings}</p>
                  <p className="text-xs text-[#6b7280]">
                    {gig.commission ? `${gig.commission} commission` : 'Fixed price'} · {gig.commissionNote}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-[#6b7280] mb-4">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{gig.location}</span>
                  <span className="text-[#d1d5db]">·</span>
                  <span>{gig.distance}</span>
                </div>

                {/* Owner row + Apply button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center text-xs text-[#1F5F5B]">
                      {gig.businessName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-[#1a1a1a]">{gig.businessName}</span>
                        {gig.verified && (
                          <CheckCircle className="w-4 h-4 text-[#1F5F5B]" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#F4B942] fill-[#F4B942]" />
                        <span className="text-xs text-[#6b7280]">{gig.rating} · {gig.totalGigs} gigs</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={e => e.preventDefault()}
                    className="px-5 py-2 bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white text-sm rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center mt-6">
            <div className="w-20 h-20 bg-[#f9fafb] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#d1d5db]" />
            </div>
            <h3 className="text-lg text-[#1a1a1a] mb-2">We're finding the right gigs for you</h3>
            <p className="text-sm text-[#6b7280] max-w-xs mx-auto">
              Check back soon — our AI is matching you with the best opportunities in your area.
            </p>
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
            <Search className="w-6 h-6" />
            <span className="text-xs">Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Briefcase className="w-6 h-6" />
            <span className="text-xs">My Gigs</span>
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
