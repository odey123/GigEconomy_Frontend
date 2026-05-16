import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { bookingsService } from '../../lib/services/bookings';
import type { Booking } from '../../types';

type SortKey = 'match' | 'rating' | 'recent';

const MOCK_APPLICANTS = [
  {
    id: 'a1', firstName: 'Tobi', lastInitial: 'A', verified: true,
    approximateLocation: 'Yaba, Lagos', matchScore: 94,
    coverNote: "I live in Unilag hostel block C and already sell drinks to my floor.",
    rating: 4.9, completedGigs: 18, appliedAt: '2 hours ago',
  },
  {
    id: 'a2', firstName: 'Chioma', lastInitial: 'O', verified: true,
    approximateLocation: 'Surulere, Lagos', matchScore: 81,
    coverNote: "I'm a 300-level student with strong connections across three hostels.",
    rating: 4.7, completedGigs: 11, appliedAt: '5 hours ago',
  },
];

function normaliseBooking(b: Booking) {
  const raw = b as unknown as Record<string, unknown>;
  // helperId may be a populated object or just an ID string
  const helper = typeof raw.helperId === 'object' && raw.helperId !== null
    ? (raw.helperId as Record<string, unknown>)
    : (raw.helper as Record<string, unknown> | undefined);
  const lastName = (helper?.lastName ?? '') as string;
  const firstName = (helper?.firstName ?? helper?.name ?? '') as string;
  return {
    id: (raw._id ?? b.id) as string,
    firstName: firstName || 'Worker',
    lastInitial: lastName[0] ?? '',
    verified: (helper?.verified ?? false) as boolean,
    approximateLocation: (helper?.approximateLocation ?? helper?.location ?? '') as string,
    matchScore: (b.matchScore ?? 0) as number,
    coverNote: (b.coverNote ?? (raw.deliverables as string) ?? '') as string,
    rating: (helper?.rating ?? 0) as number,
    completedGigs: (helper?.completedGigs ?? 0) as number,
    appliedAt: b.appliedAt ?? '',
  };
}

export default function ApplicantsList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortKey>('match');
  const [applicants, setApplicants] = useState<typeof MOCK_APPLICANTS>([]);
  const [loading, setLoading] = useState(true);
  const [gigTitle, setGigTitle] = useState('Your Gig');

  useEffect(() => {
    bookingsService.getMy({ role: 'client', status: 'pending' })
      .then(data => {
        if (data?.bookings?.length) {
          const filtered = data.bookings.filter(b => {
            const raw = b as unknown as Record<string, unknown>;
            const gigId = (raw.gigId as Record<string, unknown>)?._id ?? raw.gigId ?? raw.jobId;
            return String(gigId) === String(id);
          });
          setApplicants(filtered.length ? filtered.map(normaliseBooking) : MOCK_APPLICANTS);
          const first = filtered[0] as unknown as Record<string, unknown> | undefined;
          const gigData = first?.gigId as Record<string, unknown> | undefined;
          if (gigData?.title) setGigTitle(gigData.title as string);
        } else {
          setApplicants(MOCK_APPLICANTS);
        }
      })
      .catch(() => setApplicants(MOCK_APPLICANTS))
      .finally(() => setLoading(false));
  }, [id]);

  const sorted = [...applicants].sort((a, b) => {
    if (sort === 'match') return b.matchScore - a.matchScore;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  const matchBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-[#1F5F5B] text-white';
    if (score >= 75) return 'bg-[#F4B942] text-[#1a1a1a]';
    return 'bg-[#e5e7eb] text-[#6b7280]';
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-8">
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#6b7280]">Applicants for</p>
            <p className="text-base text-[#1a1a1a] truncate">{gigTitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#6b7280]">Loading applicants…</div>
        ) : (
        <><div className="flex items-center justify-between">
          <p className="text-sm text-[#6b7280]">
            <span className="text-[#1a1a1a] font-medium">{sorted.length}</span> applicant{sorted.length !== 1 ? 's' : ''}
          </p>
          <select
            aria-label="Sort applicants"
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-sm border border-[#e5e7eb] bg-white text-[#1a1a1a] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1F5F5B]"
          >
            <option value="match">Sort: AI Match Score</option>
            <option value="rating">Sort: Rating</option>
            <option value="recent">Sort: Most Recent</option>
          </select>
        </div>

        <div className="flex items-start gap-3 bg-[#1F5F5B]/5 border border-[#1F5F5B]/15 rounded-xl px-4 py-3">
          <Sparkles className="w-4 h-4 text-[#1F5F5B] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#1F5F5B] leading-relaxed">
            Results are AI-sorted by how well each applicant matches your gig requirements, location, and network quality.
          </p>
        </div>

        <div className="space-y-3">
          {sorted.map(applicant => (
            <Link
              key={applicant.id}
              to={`/gig/${id}/applicants/${applicant.id}`}
              className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#1F5F5B]/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center text-base text-[#1F5F5B] flex-shrink-0">
                  {applicant.firstName?.[0] ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-[#1a1a1a]">
                        {applicant.firstName} {applicant.lastInitial ? `${applicant.lastInitial}.` : ''}
                      </span>
                      {applicant.verified && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#1F5F5B]/10 rounded text-xs text-[#1F5F5B]">
                          Verified
                        </span>
                      )}
                    </div>
                    {applicant.matchScore > 0 && (
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${matchBadgeColor(applicant.matchScore)}`}>
                        <Zap className="w-3 h-3" />
                        {applicant.matchScore}%
                      </span>
                    )}
                  </div>

                  {applicant.approximateLocation && (
                    <div className="flex items-center gap-1 text-xs text-[#6b7280] mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{applicant.approximateLocation}</span>
                    </div>
                  )}

                  {applicant.coverNote && (
                    <p className="text-sm text-[#6b7280] leading-relaxed line-clamp-2 mb-3">
                      "{applicant.coverNote}"
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                      {applicant.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#F4B942] fill-[#F4B942]" />
                          {applicant.rating} · {applicant.completedGigs} gigs
                        </span>
                      )}
                      {applicant.appliedAt && (
                        <>
                          <span className="text-[#d1d5db]">·</span>
                          <span>{applicant.appliedAt}</span>
                        </>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#1F5F5B]">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
