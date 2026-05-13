import { CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { Link, useParams } from 'react-router';

export default function MatchConfirmed() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-24 h-24 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-[#1F5F5B]" />
          </div>
          <span className="absolute -top-1 -right-1 w-8 h-8 bg-[#F4B942] rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </span>
        </div>

        <h1 className="text-2xl text-[#1a1a1a] mb-2">Contract created!</h1>
        <p className="text-[#6b7280] mb-2 leading-relaxed">
          You've approved the applicant. A contract has been created and both parties have been notified.
        </p>
        <p className="text-sm text-[#6b7280] mb-8">
          Squad will facilitate payments automatically throughout the gig.
        </p>

        {/* What Happens Next */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 text-left mb-6 space-y-4">
          <p className="text-sm text-[#1a1a1a]">What happens next</p>
          {[
            {
              step: '1',
              title: 'Helper gets notified',
              body: "They'll receive details and can get started right away.",
            },
            {
              step: '2',
              title: 'Sales link is generated',
              body: 'For sales gigs, a unique payment link and QR code is ready to share.',
            },
            {
              step: '3',
              title: 'Squad tracks everything',
              body: 'Payments split automatically. You see earnings in real time.',
            },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-[#1F5F5B]">{item.step}</span>
              </div>
              <div>
                <p className="text-sm text-[#1a1a1a] mb-0.5">{item.title}</p>
                <p className="text-xs text-[#6b7280]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/contracts"
            className="flex items-center justify-center gap-2 w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white py-4 rounded-xl text-base transition-colors"
          >
            View My Contracts
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/gig/${id}/applicants`}
            className="flex items-center justify-center w-full py-4 border border-[#e5e7eb] text-[#1a1a1a] rounded-xl text-sm hover:bg-[#f9fafb] transition-colors"
          >
            Back to Applicants
          </Link>
        </div>
      </div>
    </div>
  );
}
