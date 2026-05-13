import { useState } from 'react';
import { ArrowLeft, MapPin, Star, Zap, Sparkles, CheckCircle, Briefcase, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

const applicant = {
  id: 'a1',
  firstName: 'Tobi',
  lastInitial: 'A',
  verified: true,
  approximateLocation: 'Yaba, Lagos',
  memberSince: 'March 2025',
  appliedAt: '2 hours ago',
  rating: 4.9,
  completedGigs: 18,
  totalEarnings: '₦142,000',
  matchScore: 94,
  matchReasoning:
    "Tobi lives in Unilag's main hostel zone — the exact target area for your parfait sales. They have a proven sales track record with 18 completed gigs, including 3 previous commission-based roles. Their self-described hostel customer network and daily availability closely match your requirements.",
  coverNote:
    "I live in Unilag hostel block C and already sell drinks to my floor. I can easily move 30+ parfait cups a week through my existing customer network. I'm reliable and will send daily sales updates.",
  skills: [
    { name: 'Commission Sales', level: 'Expert' },
    { name: 'Customer Relations', level: 'Intermediate' },
    { name: 'Stock Management', level: 'Beginner' },
  ],
  reviews: [
    {
      reviewer: 'Cakes by Tolu',
      rating: 5,
      tags: ['Reliable', 'Great communicator'],
      comment:
        "Tobi sold out our full consignment batch in 4 days. Sent updates every evening without being asked. Will definitely hire again.",
      date: 'Apr 2025',
    },
    {
      reviewer: 'Naija Beads Co.',
      rating: 5,
      tags: ['Honest', 'Exceeded target'],
      comment:
        "Exceeded our weekly sales target by 40%. Very transparent with stock tracking and payments. Zero issues.",
      date: 'Feb 2025',
    },
  ],
};

export default function ApplicantDetail() {
  const { id, applicantId } = useParams<{ id: string; applicantId: string }>();
  const navigate = useNavigate();

  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    navigate(`/gig/${id}/applicants/${applicantId}/approved`);
  };

  const handleConfirmReject = () => {
    // In production: call api.post(`/applications/${applicantId}/reject`, { reason: rejectionReason })
    navigate(`/gig/${id}/applicants`);
  };

  const matchBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-[#1F5F5B] text-white';
    if (score >= 75) return 'bg-[#F4B942] text-[#1a1a1a]';
    return 'bg-[#e5e7eb] text-[#6b7280]';
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-32">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            aria-label="Go back"
            onClick={() => navigate(`/gig/${id}/applicants`)}
            className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
          </button>
          <span className="text-base text-[#1a1a1a]">Applicant Profile</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Header Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center text-xl text-[#1F5F5B] flex-shrink-0">
              {applicant.firstName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-lg text-[#1a1a1a]">
                  {applicant.firstName} {applicant.lastInitial}.
                </h1>
                {applicant.verified && (
                  <CheckCircle className="w-4 h-4 text-[#1F5F5B] flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6b7280] mb-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{applicant.approximateLocation}</span>
              </div>
              <p className="text-xs text-[#6b7280]">
                Member since {applicant.memberSince} · Applied {applicant.appliedAt}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#f9fafb] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
              </div>
              <p className="text-base text-[#1a1a1a]">{applicant.rating}</p>
              <p className="text-xs text-[#6b7280]">Rating</p>
            </div>
            <div className="bg-[#f9fafb] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Briefcase className="w-4 h-4 text-[#1F5F5B]" />
              </div>
              <p className="text-base text-[#1a1a1a]">{applicant.completedGigs}</p>
              <p className="text-xs text-[#6b7280]">Gigs done</p>
            </div>
            <div className="bg-[#f9fafb] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="w-4 h-4 text-[#1F5F5B]" />
              </div>
              <p className="text-base text-[#1a1a1a] text-sm leading-tight">{applicant.totalEarnings}</p>
              <p className="text-xs text-[#6b7280]">Earned</p>
            </div>
          </div>
        </div>

        {/* AI Match Analysis */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1F5F5B]" />
              <h2 className="text-base text-[#1a1a1a]">AI Match Analysis</h2>
            </div>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${matchBadgeColor(applicant.matchScore)}`}>
              <Zap className="w-3 h-3" />
              {applicant.matchScore}% match
            </span>
          </div>
          <p className="text-sm text-[#6b7280] leading-relaxed">{applicant.matchReasoning}</p>
        </div>

        {/* Cover Note */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-3">Their note to you</h2>
          <blockquote className="text-sm text-[#6b7280] leading-relaxed border-l-2 border-[#1F5F5B]/30 pl-4 italic">
            "{applicant.coverNote}"
          </blockquote>
        </div>

        {/* Skills */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {applicant.skills.map((skill, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-full text-sm"
              >
                <span className="text-[#1a1a1a]">{skill.name}</span>
                <span className="text-[#6b7280] text-xs">· {skill.level}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-4">What other owners say</h2>
          <div className="space-y-4">
            {applicant.reviews.map((review, i) => (
              <div key={i} className={i > 0 ? 'pt-4 border-t border-[#f3f4f6]' : ''}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1a1a1a]">{review.reviewer}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s < review.rating ? 'text-[#F4B942] fill-[#F4B942]' : 'text-[#e5e7eb]'}`}
                      />
                    ))}
                    <span className="text-xs text-[#6b7280] ml-1">{review.date}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {review.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-[#1F5F5B]/5 text-[#1F5F5B] text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#6b7280] leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-4 py-4 z-10">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Rejection reason textarea — slides in */}
          {rejecting && (
            <div>
              <label htmlFor="rejection-reason" className="block text-xs text-[#6b7280] mb-1.5">
                Reason (optional — helps the applicant improve)
              </label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g., We needed someone closer to campus..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] resize-none"
              />
            </div>
          )}

          <div className="flex gap-3">
            {rejecting ? (
              <>
                <button
                  onClick={() => setRejecting(false)}
                  className="flex-1 py-3.5 border border-[#e5e7eb] text-[#1a1a1a] rounded-xl text-sm hover:bg-[#f9fafb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 py-3.5 border border-red-300 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors"
                >
                  Confirm Reject
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setRejecting(true)}
                  className="flex-1 py-3.5 border border-[#e5e7eb] text-[#1a1a1a] rounded-xl text-sm hover:bg-[#f9fafb] transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="flex-1 py-3.5 bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white rounded-xl text-sm transition-colors"
                >
                  Approve & Create Contract
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
