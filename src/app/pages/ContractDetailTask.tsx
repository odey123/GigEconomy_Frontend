import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Clock, CheckCircle, AlertTriangle, Upload, FileText, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { contractsService } from '../../lib/services/contracts';

// TODO: replace with actual auth context value
const role: 'helper' | 'owner' = 'helper';

const MOCK_CONTRACT = {
  id: 'c2',
  title: 'Sew 10 Ankara Midi Dresses',
  businessName: "Funmy's Fashion House",
  helperName: 'Tobi A.',
  fixedPrice: 25000,
  deadline: 'May 20, 2025',
  daysLeft: 7,
  status: 'Escrow Funded' as 'Escrow Funded' | 'Work Submitted' | 'Approved',
  description:
    'Sew 10 ready-to-wear Ankara midi dresses for an upcoming market event. Each dress must be neatly finished with zip closure at the back. Measurements will be provided on pickup. All fabric is supplied by the client.',
  requirements: [
    'Midi length (below knee, above ankle)',
    'Hidden zip closure at back',
    'Lining required for all dresses',
    'Delivery must include individual polythene wrap per dress',
    'Final fitting check on at least 2 sample dresses before bulk sewing',
  ],
  submittedNotes:
    'All 10 dresses are complete. I sewed the first 2 and sent photos for approval before doing the rest. Delivery is ready — please confirm pickup time.',
  submittedFiles: [
    { name: 'dress_samples.jpg', size: '2.1 MB' },
    { name: 'all_10_dresses.jpg', size: '3.4 MB' },
    { name: 'zip_closeup.jpg', size: '1.8 MB' },
  ],
};

const statusConfig = {
  'Escrow Funded': {
    label: 'Escrow Funded',
    pill: 'bg-blue-50 border-blue-200 text-blue-700',
    dot: 'bg-blue-500',
  },
  'Work Submitted': {
    label: 'Work Submitted',
    pill: 'bg-[#F4B942]/10 border-[#F4B942]/40 text-[#b5851f]',
    dot: 'bg-[#F4B942]',
  },
  Approved: {
    label: 'Approved',
    pill: 'bg-green-50 border-green-200 text-green-700',
    dot: 'bg-green-500',
  },
};

export default function ContractDetailTask() {
  // api.get(`/bookings/${id}`) — bookingType: 'task', status: 'accepted'
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState(MOCK_CONTRACT);
  const [workNotes, setWorkNotes] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    contractsService.getById(id)
      .then(data => { if (data?.id) setContract(data as typeof MOCK_CONTRACT); })
      .catch(() => {});
  }, [id]);

  const cfg = statusConfig[contract.status];

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (id) await contractsService.submitTask(id, { deliverableNotes: workNotes });
    } catch { /* optimistic */ }
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleApprove = async () => {
    try { if (id) await contractsService.approveTask(id); } catch { /* optimistic */ }
    setContract(prev => ({ ...prev, status: 'Approved' as typeof prev.status }));
  };

  const handleDispute = async () => {
    try { if (id) await contractsService.disputeTask(id, { reason: disputeReason }); } catch { /* optimistic */ }
    setDisputeOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-10">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
            </button>
            <span className="text-base text-[#1a1a1a]">My Contract</span>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs rounded-full ${cfg.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        {/* Hero Summary Card */}
        <div className="bg-gradient-to-br from-[#1F5F5B] to-[#1a4f4c] rounded-xl p-6 text-white">
          <p className="text-white/70 text-xs mb-1">{contract.businessName}</p>
          <h1 className="text-lg text-white leading-snug mb-4">{contract.title}</h1>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60 text-xs mb-1">Fixed price</p>
              <p className="text-lg text-white">₦{contract.fixedPrice.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60 text-xs mb-1">Deadline</p>
              <p className="text-base text-white leading-tight">{contract.deadline}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60 text-xs mb-1">Days left</p>
              <p className="text-lg text-white">{contract.daysLeft}</p>
            </div>
          </div>

          <p className="text-white/60 text-xs mt-4">
            {role === 'helper'
              ? `Assigned to you · Posted by ${contract.businessName}`
              : `Worker: ${contract.helperName}`}
          </p>
        </div>

        {/* Escrow Status Card */}
        <div className="bg-white border-2 border-[#1F5F5B]/20 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1F5F5B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[#1F5F5B]" />
            </div>
            <div className="flex-1">
              <h2 className="text-base text-[#1a1a1a] mb-1">Escrow Status</h2>
              <p className="text-2xl text-[#1F5F5B] mb-2">₦{contract.fixedPrice.toLocaleString()} locked</p>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                ₦{contract.fixedPrice.toLocaleString()} is locked in Squad escrow until{' '}
                {role === 'helper' ? 'the owner approves your work' : 'you approve the work'}.
                No one can touch it until then.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
              <div
                className={`h-full bg-[#1F5F5B] rounded-full transition-all ${
                  contract.status === 'Approved'
                    ? 'w-full'
                    : contract.status === 'Work Submitted'
                    ? 'w-2/3'
                    : 'w-1/3'
                }`}
              />
            </div>
            <span className="text-xs text-[#6b7280] whitespace-nowrap">{cfg.label}</span>
          </div>

          <div className="flex items-center gap-6 mt-3 text-xs text-[#6b7280]">
            <span className={contract.status !== undefined ? 'text-[#1F5F5B]' : ''}>① Funded</span>
            <span className={contract.status === 'Work Submitted' || contract.status === 'Approved' ? 'text-[#1F5F5B]' : ''}>② Work submitted</span>
            <span className={contract.status === 'Approved' ? 'text-[#1F5F5B]' : ''}>③ Released</span>
          </div>
        </div>

        {/* Task Details Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-[#1F5F5B]" />
            <h2 className="text-base text-[#1a1a1a]">Task Details</h2>
          </div>

          <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{contract.description}</p>

          <h3 className="text-sm text-[#1a1a1a] mb-3">Requirements</h3>
          <div className="space-y-2 mb-4">
            {contract.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#1F5F5B] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#6b7280]">{req}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-4 py-3">
            <Calendar className="w-4 h-4 text-[#6b7280] flex-shrink-0" />
            <div>
              <p className="text-xs text-[#6b7280]">Deadline</p>
              <p className="text-sm text-[#1a1a1a]">{contract.deadline} · {contract.daysLeft} days left</p>
            </div>
            <Clock className="w-4 h-4 text-[#F4B942] ml-auto" />
          </div>
        </div>

        {/* Role-specific card */}
        {role === 'helper' ? (
          submitted ? (
            <div className="bg-white border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-base text-[#1a1a1a]">Work submitted</h2>
                  <p className="text-xs text-[#6b7280]">Waiting for the owner to review and approve.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
              <h2 className="text-base text-[#1a1a1a] mb-4">Submit Your Work</h2>
              <form onSubmit={handleSubmitWork} className="space-y-4">
                <div>
                  <label htmlFor="work-notes" className="block text-sm text-[#1a1a1a] mb-1.5">Notes for the owner</label>
                  <textarea
                    id="work-notes"
                    rows={4}
                    value={workNotes}
                    onChange={e => setWorkNotes(e.target.value)}
                    placeholder="Describe what you've completed, any notes, or questions for the owner…"
                    className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#1a1a1a] mb-1.5">Attach files</label>
                  <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-6 text-center hover:border-[#1F5F5B]/40 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-[#d1d5db] mx-auto mb-2" />
                    <p className="text-sm text-[#6b7280] mb-1">Drag and drop files here</p>
                    <p className="text-xs text-[#9ca3af]">Photos, videos, or documents · Max 10 MB each</p>
                    <button
                      type="button"
                      className="mt-3 px-4 py-2 border border-[#e5e7eb] text-sm text-[#1a1a1a] rounded-lg hover:bg-[#f9fafb] transition-colors"
                    >
                      Browse files
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-70 text-white py-4 rounded-xl text-base transition-colors"
                >
                  {submitting ? 'Submitting…' : 'Submit for Review'}
                </button>
              </form>
            </div>
          )
        ) : (
          /* Owner review panel */
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
            <h2 className="text-base text-[#1a1a1a] mb-4">Review Submission</h2>

            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 mb-4">
              <p className="text-xs text-[#6b7280] mb-2">Notes from {contract.helperName}</p>
              <p className="text-sm text-[#1a1a1a] leading-relaxed">{contract.submittedNotes}</p>
            </div>

            <div className="mb-5">
              <p className="text-xs text-[#6b7280] mb-2">Attached files</p>
              <div className="space-y-2">
                {contract.submittedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-4 py-3"
                  >
                    <div className="w-8 h-8 bg-[#1F5F5B]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#1F5F5B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1a1a1a] truncate">{file.name}</p>
                      <p className="text-xs text-[#6b7280]">{file.size}</p>
                    </div>
                    <button type="button" className="text-xs text-[#1F5F5B] hover:underline">View</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDisputeOpen(true)}
                className="flex-1 py-3.5 border border-red-300 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Open Dispute
              </button>
              <button type="button" onClick={handleApprove} className="flex-1 py-3.5 bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approve &amp; Release
              </button>
            </div>

            {disputeOpen && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 mb-3">
                  Describe the issue and our team will help mediate within 24 hours.
                </p>
                <textarea
                  aria-label="Describe the dispute"
                  rows={3}
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  placeholder="e.g., The dresses don't match the measurements provided…"
                  className="w-full px-3 py-2.5 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none bg-white"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setDisputeOpen(false)}
                    className="flex-1 py-2.5 border border-[#e5e7eb] text-[#6b7280] rounded-lg text-sm hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="button" onClick={handleDispute} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                    Submit Dispute
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Info Banner */}
        <div className="bg-[#1F5F5B]/5 border border-[#1F5F5B]/15 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#1F5F5B] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#1F5F5B] leading-relaxed">
              Once approved, Squad releases the ₦{contract.fixedPrice.toLocaleString()} to the helper instantly.
              No chasing, no excuses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
