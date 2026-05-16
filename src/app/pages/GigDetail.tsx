import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, MapPin, Star, Zap, ShoppingBag, Wrench, Clock, Shield, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams, useLocation } from 'react-router';
import { gigsService } from '../../lib/services/gigs';
import { bookingsService } from '../../lib/services/bookings';
import { useAuth } from '../../context/AuthContext';

const MOCK_GIG = {
  id: 1,
  title: 'Sell Parfait at Unilag Campus',
  type: 'sales',
  matchScore: 92,
  description:
    'We make fresh, beautiful parfait cups and need campus reps to sell them to students at Unilag and nearby institutions. You take stock on consignment — no upfront payment needed — and earn 20% on every cup sold. Perfect if you live in a hostel or have a strong campus network.',
  commission: '20%',
  fixedPrice: null,
  pricePerUnit: '₦2,000',
  estimatedEarnings: '₦8,000 – ₦15,000',
  earningsNote: 'Based on selling 20–40 cups per week',
  location: 'Yaba / Mainland axis',
  locationNote: 'Exact pickup address shared after approval',
  businessName: 'Cravings by Sade',
  verified: true,
  rating: 4.8,
  totalGigs: 14,
  totalReviews: 38,
  memberSince: 'Jan 2024',
  skillLevel: 'No experience required',
  requirements: [
    'Must be based in Yaba or nearby (within 5 km)',
    'Must have an active student or campus network',
    'Phone with good internet for order tracking',
    'Ability to pick up stock 3× per week',
  ],
  evidenceRequired: 'Short voice note introducing yourself and your network',
  duration: 'Ongoing (weekly)',
  startDate: 'Within 3 days of approval',
};

const similarGigs = [
  {
    id: 3,
    title: 'Sell Handmade Soaps at Church',
    type: 'sales',
    matchScore: 78,
    estimatedEarnings: '₦5,000 – ₦20,000',
    businessName: 'NaturalGlow NG',
    verified: false,
  },
  {
    id: 4,
    title: 'Campus Rep — Skin Serum Brand',
    type: 'sales',
    matchScore: 74,
    estimatedEarnings: '₦10,000 – ₦18,000',
    businessName: 'GlowUp NG',
    verified: true,
  },
];

export default function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';
  // Use gig passed from the list if available — avoids showing mock while API loads
  const [gig, setGig] = useState((location.state as { gig?: typeof MOCK_GIG })?.gig ?? MOCK_GIG);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deliverables, setDeliverables] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    gigsService.getById(id)
      .then(data => { if (data?.id) setGig(data as typeof MOCK_GIG); })
      .catch(() => {});
    // Check if worker already applied to this gig
    bookingsService.getMy({ role: 'worker' })
      .then(data => {
        const alreadyApplied = data?.bookings?.some(b => {
          const raw = b as unknown as Record<string, unknown>;
          const gigId = (raw.gigId as Record<string, unknown>)?._id ?? raw.gigId ?? raw.jobId;
          return String(gigId) === String(id);
        });
        if (alreadyApplied) setApplied(true);
      })
      .catch(() => {});
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobId = (gig as unknown as { _id?: string })._id ?? gig.id;
    // MongoDB ObjectIds are 24-char hex strings — block mock IDs like 1, 2, 3
    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(String(jobId))) {
      setApplyError('This is a demo gig — go back to the dashboard and apply to a real posted gig.');
      return;
    }
    setApplying(true);
    setApplyError(null);
    try {
      await bookingsService.create({
        jobId,
        proposedBudget: parseFloat(proposedBudget),
        deliverables,
      });
      setApplied(true);
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('already applied') || msg.toLowerCase().includes('already applied')) {
        setApplied(true);
        setShowForm(false);
      } else {
        setApplyError(msg || 'Could not submit application. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const matchColor = (score: number) => {
    if (score >= 90) return 'bg-[#1F5F5B] text-white';
    if (score >= 75) return 'bg-[#F4B942] text-[#1a1a1a]';
    return 'bg-[#e5e7eb] text-[#6b7280]';
  };

  return (
    <div className={`min-h-screen bg-[#f9fafb] ${showForm ? 'pb-96' : 'pb-28'}`}>
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
          </button>
          <span className="text-base text-[#1a1a1a]">Gig Detail</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
              gig.type === 'sales' ? 'bg-[#F4B942]/10 text-[#b5851f]' : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
            }`}>
              {gig.type === 'sales' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
              {gig.type === 'sales' ? 'Sales Gig' : 'Task'}
            </span>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${matchColor(gig.matchScore)}`}>
              <Zap className="w-3 h-3" />
              {gig.matchScore}% match
            </span>
          </div>
          <h1 className="text-2xl text-[#1a1a1a] mb-1">{gig.title}</h1>
          <div className="flex items-center gap-1.5 text-sm text-[#6b7280]">
            <Clock className="w-4 h-4" />
            <span>{gig.duration}</span>
            <span className="text-[#d1d5db]">·</span>
            <span>Starts {gig.startDate}</span>
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center text-lg text-[#1F5F5B]">
              {gig.businessName?.[0] ?? '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-base text-[#1a1a1a]">{gig.businessName}</span>
                {gig.verified && <CheckCircle className="w-4 h-4 text-[#1F5F5B]" />}
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6b7280]">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#F4B942] fill-[#F4B942]" />
                  {gig.rating} ({gig.totalReviews} reviews)
                </span>
                <span className="text-[#d1d5db]">·</span>
                <span>{gig.totalGigs} gigs completed</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1F5F5B]/5 rounded-lg">
              <Shield className="w-4 h-4 text-[#1F5F5B]" />
              <span className="text-xs text-[#1F5F5B]">Verified</span>
            </div>
          </div>
          <p className="text-xs text-[#6b7280] mt-3">Member since {gig.memberSince}</p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-4">Pay breakdown</h2>
          {(() => {
            const g = gig as unknown as Record<string, unknown>;
            const isSales = (g.workType ?? g.type) === 'sales';
            const commission = (g.commissionPercent ?? g.commission) as number | string | undefined;
            const productPrice = (g.productPrice ?? g.pricePerUnit) as number | string | undefined;
            const fixedPrice = g.fixedPrice as number | undefined;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-[#f3f4f6]">
                  <span className="text-sm text-[#6b7280]">Pay type</span>
                  <span className="text-sm text-[#1a1a1a]">
                    {isSales && commission ? `${commission}% commission` : fixedPrice ? `Fixed — ₦${Number(fixedPrice).toLocaleString()}` : '—'}
                  </span>
                </div>
                {isSales && productPrice && (
                  <div className="flex items-center justify-between py-3 border-b border-[#f3f4f6]">
                    <span className="text-sm text-[#6b7280]">Price per unit</span>
                    <span className="text-sm text-[#1a1a1a]">₦{Number(productPrice).toLocaleString()}</span>
                  </div>
                )}
                {isSales && commission && productPrice && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-[#6b7280]">You earn per sale</span>
                    <p className="text-base text-[#1F5F5B]">
                      ₦{Math.round(Number(productPrice) * Number(commission) / 100).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-3">About this gig</h2>
          <p className="text-sm text-[#6b7280] leading-relaxed">{gig.description}</p>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-3">Location</h2>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#1F5F5B]/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-[#1F5F5B]" />
            </div>
            <div>
              <p className="text-sm text-[#1a1a1a] mb-0.5">{gig.location ?? gig.approximateLocation ?? '—'}</p>
              {(gig as unknown as Record<string,unknown>).locationNote && (
                <p className="text-xs text-[#6b7280]">{(gig as unknown as Record<string,unknown>).locationNote as string}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-4">Requirements</h2>
          <div className="space-y-2 mb-4">
            {(gig.requirements ?? []).map((req, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#1F5F5B] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#6b7280]">{req}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4">
            <p className="text-xs text-[#6b7280] mb-1">Skill level</p>
            <p className="text-sm text-[#1a1a1a]">
              {(gig as unknown as Record<string,unknown>).skillLevelRequired as string ?? gig.skillLevel ?? '—'}
            </p>
          </div>
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 mt-3">
            <p className="text-xs text-[#6b7280] mb-1">What to submit with application</p>
            <p className="text-sm text-[#1a1a1a]">
              {(gig as unknown as Record<string,unknown>).evidenceRequired as string ?? '—'}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-base text-[#1a1a1a] mb-3">Similar gigs for you</h2>
          <div className="space-y-3">
            {similarGigs.map(g => (
              <Link
                key={g.id}
                to={`/gig/${g.id}`}
                className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-xl p-4 hover:border-[#1F5F5B]/30 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      g.type === 'sales' ? 'bg-[#F4B942]/10 text-[#b5851f]' : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
                    }`}>
                      {g.type === 'sales' ? 'Sales' : 'Task'}
                    </span>
                    <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs ${matchColor(g.matchScore)}`}>
                      <Zap className="w-2.5 h-2.5" />
                      {g.matchScore}%
                    </span>
                  </div>
                  <p className="text-sm text-[#1a1a1a] truncate">{g.title}</p>
                  <p className="text-xs text-[#6b7280]">{g.estimatedEarnings}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#d1d5db] flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {isOwner ? (
            <button
              type="button"
              onClick={() => navigate(`/gig/${id}/applicants`)}
              className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white py-4 rounded-xl text-base transition-colors"
            >
              View Applicants
            </button>
          ) : applied ? (
            <div className="flex items-center justify-center gap-2 py-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              Application submitted!
            </div>
          ) : showForm ? (
            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label htmlFor="deliverables" className="block text-xs text-[#6b7280] mb-1.5">
                  What will you do? <span className="text-[#9ca3af]">(optional)</span>
                </label>
                <textarea
                  id="deliverables"
                  rows={3}
                  value={deliverables}
                  onChange={e => setDeliverables(e.target.value)}
                  placeholder="e.g., I will sell 50 units across Lagos using my campus network…"
                  className="w-full px-3 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] resize-none"
                />
              </div>
              <div>
                <label htmlFor="proposedBudget" className="block text-xs text-[#6b7280] mb-1.5">
                  Proposed budget (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  id="proposedBudget"
                  type="number"
                  required
                  min={1}
                  value={proposedBudget}
                  onChange={e => setProposedBudget(e.target.value)}
                  placeholder="e.g., 750"
                  className="w-full px-3 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B]"
                />
              </div>
              {applyError && (
                <p className="text-xs text-red-600">{applyError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-[#e5e7eb] text-[#6b7280] rounded-xl text-sm hover:bg-[#f9fafb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 py-3 bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-60 text-white rounded-xl text-sm transition-colors"
                >
                  {applying ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white py-4 rounded-xl text-base transition-colors"
            >
              Apply for this Gig
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
