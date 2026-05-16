import { useState, useEffect } from 'react';
import { Home, Briefcase, Wallet, User, ShoppingBag, Wrench, ChevronRight, FileX } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { contractsService } from '../../lib/services/contracts';

type TabKey = 'active' | 'completed' | 'disputed';

type ContractStatus =
  | 'active'
  | 'escrow-funded'
  | 'work-submitted'
  | 'completed'
  | 'disputed';

type ContractType = 'sales' | 'task';

interface Contract {
  id: string;
  type: ContractType;
  title: string;
  counterparty: string;
  status: ContractStatus;
  metric: string;
  metricLabel: string;
  startedAt: string;
  tab: TabKey;
}

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    type: 'sales',
    title: 'Sell Parfait at Unilag Campus',
    counterparty: 'Cravings by Sade',
    status: 'active',
    metric: '₦18,750',
    metricLabel: 'earned so far',
    startedAt: 'May 5, 2025',
    tab: 'active',
  },
  {
    id: 'c2',
    type: 'task',
    title: 'Sew 10 Ankara Midi Dresses',
    counterparty: "Funmy's Fashion House",
    status: 'escrow-funded',
    metric: '₦25,000',
    metricLabel: 'in escrow',
    startedAt: 'May 10, 2025',
    tab: 'active',
  },
  {
    id: 'c3',
    type: 'sales',
    title: 'Sell Handmade Soaps at Church',
    counterparty: 'NaturalGlow NG',
    status: 'completed',
    metric: '₦31,200',
    metricLabel: 'total earned',
    startedAt: 'Mar 12, 2025',
    tab: 'completed',
  },
  {
    id: 'c4',
    type: 'task',
    title: 'Design 5 Instagram Promo Posts',
    counterparty: 'GlowUp NG',
    status: 'completed',
    metric: '₦8,500',
    metricLabel: 'paid out',
    startedAt: 'Apr 3, 2025',
    tab: 'completed',
  },
  {
    id: 'c5',
    type: 'task',
    title: 'Repair 2 Industrial Sewing Machines',
    counterparty: "Adunni's Atelier",
    status: 'disputed',
    metric: '₦12,000',
    metricLabel: 'in dispute',
    startedAt: 'Apr 28, 2025',
    tab: 'disputed',
  },
];

const statusConfig: Record<ContractStatus, { label: string; pill: string; dot: string }> = {
  active: {
    label: 'Active',
    pill: 'bg-green-50 border-green-200 text-green-700',
    dot: 'bg-green-500',
  },
  'escrow-funded': {
    label: 'Escrow Funded',
    pill: 'bg-blue-50 border-blue-200 text-blue-700',
    dot: 'bg-blue-500',
  },
  'work-submitted': {
    label: 'Work Submitted',
    pill: 'bg-[#F4B942]/10 border-[#F4B942]/40 text-[#b5851f]',
    dot: 'bg-[#F4B942]',
  },
  completed: {
    label: 'Completed',
    pill: 'bg-[#1F5F5B]/5 border-[#1F5F5B]/20 text-[#1F5F5B]',
    dot: 'bg-[#1F5F5B]',
  },
  disputed: {
    label: 'Disputed',
    pill: 'bg-red-50 border-red-200 text-red-600',
    dot: 'bg-red-500',
  },
};

const tabLabels: { key: TabKey; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'disputed', label: 'Disputed' },
];

const emptyMessages: Record<TabKey, { heading: string; body: string }> = {
  active: {
    heading: 'No active contracts',
    body: 'Once you start a gig or hire a helper, your active contracts will appear here.',
  },
  completed: {
    heading: 'Nothing completed yet',
    body: 'Finished contracts will show up here once work is approved and payment is released.',
  },
  disputed: {
    heading: 'No open disputes',
    body: "That's a good sign! Any contracts under review or mediation will appear here.",
  },
};

export default function MyContracts() {
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const navigate = useNavigate();
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);

  useEffect(() => {
    contractsService.getAll()
      .then(data => { if (Array.isArray(data) && data.length) setContracts(data as typeof MOCK_CONTRACTS); })
      .catch(() => {});
  }, []);

  const visible = contracts.filter(c => c.tab === activeTab);

  const contractLink = (c: Contract) =>
    c.type === 'task' ? `/contracts/${c.id}/task` : `/contracts/${c.id}`;

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl text-[#1a1a1a]">My Contracts</h1>
          <p className="text-sm text-[#6b7280]">All your active and past agreements</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#f3f4f6] rounded-xl p-1">
          {tabLabels.map(t => (
            <button
              type="button"
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                activeTab === t.key
                  ? 'bg-white text-[#1a1a1a] shadow-sm'
                  : 'text-[#6b7280] hover:text-[#1a1a1a]'
              }`}
            >
              {t.label}
              {t.key === 'disputed' && MOCK_CONTRACTS.some(c => c.tab === 'disputed') && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] rounded-full">
                  {MOCK_CONTRACTS.filter(c => c.tab === 'disputed').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contract List */}
        {visible.length > 0 ? (
          <div className="space-y-3">
            {visible.map(c => {
              const cfg = statusConfig[c.status];
              return (
                <Link
                  key={c.id}
                  to={contractLink(c)}
                  className="block bg-white border border-[#e5e7eb] rounded-xl p-5 hover:border-[#1F5F5B]/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Type tag */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs ${
                          c.type === 'sales'
                            ? 'bg-[#F4B942]/10 text-[#b5851f]'
                            : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
                        }`}
                      >
                        {c.type === 'sales' ? (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        ) : (
                          <Wrench className="w-3.5 h-3.5" />
                        )}
                        {c.type === 'sales' ? 'Sales' : 'Task'}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${cfg.pill}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#d1d5db] flex-shrink-0 mt-0.5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base text-[#1a1a1a] mb-1 leading-snug">{c.title}</h3>

                  {/* Counterparty */}
                  <p className="text-sm text-[#6b7280] mb-3">
                    with{' '}
                    <span className="text-[#1a1a1a]">{c.counterparty}</span>
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base text-[#1F5F5B]">{c.metric}</p>
                      <p className="text-xs text-[#6b7280]">{c.metricLabel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6b7280]">Started</p>
                      <p className="text-xs text-[#1a1a1a]">{c.startedAt}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-12 text-center mt-4">
            <div className="w-20 h-20 bg-[#f9fafb] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileX className="w-10 h-10 text-[#d1d5db]" />
            </div>
            <h3 className="text-lg text-[#1a1a1a] mb-2">{emptyMessages[activeTab].heading}</h3>
            <p className="text-sm text-[#6b7280] max-w-xs mx-auto leading-relaxed">
              {emptyMessages[activeTab].body}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 text-[#6b7280]"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1 text-[#1F5F5B]">
            <Briefcase className="w-6 h-6" />
            <span className="text-xs">Contracts</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/wallet')}
            className="flex flex-col items-center gap-1 text-[#6b7280]"
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs">Wallet</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1 text-[#6b7280]">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
