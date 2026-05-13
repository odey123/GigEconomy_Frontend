import { useState } from 'react';
import { ArrowLeft, MapPin, Star, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';

type SortKey = 'match' | 'rating' | 'recent';

const mockApplicants = [
  {
    id: 'a1',
    firstName: 'Tobi',
    lastInitial: 'A',
    verified: true,
    approximateLocation: 'Yaba, Lagos',
    matchScore: 94,
    coverNote:
      "I live in Unilag hostel block C and already sell drinks to my floor. I can easily move 30+ parfait cups a week through my existing customer network. I'm reliable and will send daily sales updates.",
    rating: 4.9,
    completedGigs: 18,
    appliedAt: '2 hours ago',
  },
  {
    id: 'a2',
    firstName: 'Chioma',
    lastInitial: 'O',
    verified: true,
    approximateLocation: 'Surulere, Lagos',
    matchScore: 81,
    coverNote:
      "I'm a 300-level student with strong connections across three hostels. I've done commission sales before for a skincare brand and hit target every month. Very organized.",
    rating: 4.7,
    completedGigs: 11,
    appliedAt: '5 hours ago',
  },
  {
    id: 'a3',
    firstName: 'Bayo',
    lastInitial: 'K',
    verified: false,
    approximateLocation: 'Mushin, Lagos',
    matchScore: 67,
    coverNote:
      "I sell snacks on campus already and my customers always ask about new products. Parfait would be an easy add-on. I'm available every day after 2pm.",
    rating: 4.3,
    completedGigs: 5,
    appliedAt: '1 day ago',
  },
  {
    id: 'a4',
    firstName: 'Aisha',
    lastInitial: 'M',
    verified: true,
    approximateLocation: 'Akoka, Lagos',
    matchScore: 76,
    coverNote:
      "I'm president of my department's student union, so I have a strong network. I'm looking for flexible income that fits around my lectures and I'm great with money tracking.",
    rating: 4.6,
    completedGigs: 8,
    appliedAt: '1 day ago',
  },
];

const gigTitle = 'Sell Parfait at Unilag Campus';

export default function ApplicantsList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortKey>('match');

  const sorted = [...mockApplicants].sort((a, b) => {
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
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
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
        {/* Summary Row */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6b7280]">
            <span className="text-[#1a1a1a] font-medium">{mockApplicants.length}</span> applicants
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

        {/* AI Banner */}
        <div className="flex items-start gap-3 bg-[#1F5F5B]/5 border border-[#1F5F5B]/15 rounded-xl px-4 py-3">
          <Sparkles className="w-4 h-4 text-[#1F5F5B] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#1F5F5B] leading-relaxed">
            Results are AI-sorted by how well each applicant matches your gig requirements, location, and network quality.
          </p>
        </div>

        {/* Applicant Cards */}
        <div className="space-y-3">
          {sorted.map(applicant => (
            <Link
              key={applicant.id}
              to={`/gig/${id}/applicants/${applicant.id}`}
              className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#1F5F5B]/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-11 h-11 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center text-base text-[#1F5F5B] flex-shrink-0">
                  {applicant.firstName[0]}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name row */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-[#1a1a1a]">
                        {applicant.firstName} {applicant.lastInitial}.
                      </span>
                      {applicant.verified && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#1F5F5B]/8 rounded text-xs text-[#1F5F5B]">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${matchBadgeColor(applicant.matchScore)}`}>
                      <Zap className="w-3 h-3" />
                      {applicant.matchScore}%
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-[#6b7280] mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{applicant.approximateLocation}</span>
                  </div>

                  {/* Cover note preview */}
                  <p className="text-sm text-[#6b7280] leading-relaxed line-clamp-2 mb-3">
                    "{applicant.coverNote}"
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#F4B942] fill-[#F4B942]" />
                        {applicant.rating} · {applicant.completedGigs} gigs
                      </span>
                      <span className="text-[#d1d5db]">·</span>
                      <span>{applicant.appliedAt}</span>
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
      </div>
    </div>
  );
}
