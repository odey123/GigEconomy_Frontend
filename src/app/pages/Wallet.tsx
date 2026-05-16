import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, CheckCircle, Shield, ArrowDownLeft, ArrowUpRight, Home, Briefcase, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { walletService } from '../../lib/services/wallet';

type TabKey = 'all' | 'credits' | 'debits';
type TxType = 'credit' | 'debit';
type TxStatus = 'successful' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TxType;
  description: string;
  amount: number;
  status: TxStatus;
  timestamp: string;
}

const transactions: Transaction[] = [
  {
    id: 't1',
    type: 'credit',
    description: 'Sale commission from Cravings by Sade',
    amount: 400,
    status: 'successful',
    timestamp: 'Today, 2:14 PM',
  },
  {
    id: 't2',
    type: 'credit',
    description: 'Sale commission from Cravings by Sade',
    amount: 800,
    status: 'successful',
    timestamp: 'Today, 1:30 PM',
  },
  {
    id: 't3',
    type: 'debit',
    description: 'Withdrawal to GTBank ****1234',
    amount: 15000,
    status: 'successful',
    timestamp: 'Today, 11:00 AM',
  },
  {
    id: 't4',
    type: 'credit',
    description: 'Task payout — Design 5 Instagram Posts',
    amount: 8500,
    status: 'successful',
    timestamp: 'May 12, 4:22 PM',
  },
  {
    id: 't5',
    type: 'credit',
    description: 'Sale commission from Cravings by Sade',
    amount: 400,
    status: 'successful',
    timestamp: 'May 12, 12:11 PM',
  },
  {
    id: 't6',
    type: 'credit',
    description: 'Sale commission from NaturalGlow NG',
    amount: 1250,
    status: 'successful',
    timestamp: 'May 11, 3:40 PM',
  },
  {
    id: 't7',
    type: 'debit',
    description: 'Withdrawal to GTBank ****1234',
    amount: 20000,
    status: 'successful',
    timestamp: 'May 10, 9:15 AM',
  },
  {
    id: 't8',
    type: 'credit',
    description: 'Task payout — Sell Handmade Soaps (final batch)',
    amount: 12600,
    status: 'successful',
    timestamp: 'May 9, 5:00 PM',
  },
  {
    id: 't9',
    type: 'debit',
    description: 'Withdrawal to GTBank ****1234',
    amount: 10000,
    status: 'pending',
    timestamp: 'May 8, 8:30 AM',
  },
  {
    id: 't10',
    type: 'credit',
    description: 'Sale commission from Cravings by Sade',
    amount: 400,
    status: 'successful',
    timestamp: 'May 7, 2:55 PM',
  },
];

const statusPill: Record<TxStatus, string> = {
  successful: 'bg-green-50 text-green-700',
  pending: 'bg-[#F4B942]/10 text-[#b5851f]',
  failed: 'bg-red-50 text-red-600',
};

const tabLabels: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'credits', label: 'Credits' },
  { key: 'debits', label: 'Debits' },
];

export default function Wallet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [accountCopied, setAccountCopied] = useState(false);
  const [balance, setBalance] = useState('₦87,500');
  const [txList, setTxList] = useState(transactions);

  useEffect(() => {
    walletService.getBalance()
      .then(w => { if (w?.balance != null) setBalance(`₦${w.balance.toLocaleString()}`); })
      .catch(() => {});
    walletService.getTransactions({ limit: 20 })
      .then(data => { if (data?.transactions?.length) setTxList(data.transactions as typeof transactions); })
      .catch(() => {});
  }, []);

  const visible = txList.filter(t => {
    if (activeTab === 'credits') return t.type === 'credit';
    if (activeTab === 'debits') return t.type === 'debit';
    return true;
  });

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('7012345678').catch(() => {});
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
          </button>
          <span className="text-base text-[#1a1a1a]">Wallet</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Hero Balance Card */}
        <div className="bg-gradient-to-br from-[#1F5F5B] to-[#1a4f4c] rounded-xl p-6 text-white">
          <p className="text-white/60 text-xs mb-1">Available balance</p>
          <p className="text-4xl text-white mb-5">{balance}</p>

          {/* Virtual Account */}
          <div className="bg-white/10 rounded-xl px-4 py-3 mb-5">
            <p className="text-white/60 text-xs mb-1">Your Squad virtual account</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-base tracking-wider">7012 345 678</p>
                <p className="text-white/60 text-xs mt-0.5">Squad / Habari MFB</p>
              </div>
              <button
                onClick={handleCopyAccount}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  accountCopied
                    ? 'bg-green-400/20 text-green-300'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {accountCopied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-white text-[#1F5F5B] py-3 rounded-xl text-sm hover:bg-white/90 transition-colors">
              Withdraw
            </button>
            <button className="flex-1 bg-white/10 text-white py-3 rounded-xl text-sm hover:bg-white/20 transition-colors border border-white/20">
              Fund Wallet
            </button>
          </div>
        </div>

        {/* Squad-Verified Badge */}
        <div className="flex items-center gap-3 bg-white border border-[#e5e7eb] rounded-xl px-4 py-3">
          <div className="w-9 h-9 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#1F5F5B]" />
          </div>
          <div>
            <p className="text-sm text-[#1a1a1a]">Squad-verified account</p>
            <p className="text-xs text-[#6b7280]">Your identity verified via Squad BVN check</p>
          </div>
          <span className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-[#1F5F5B]/5 rounded-full text-xs text-[#1F5F5B] whitespace-nowrap">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        </div>

        {/* Transaction Tabs */}
        <div>
          <div className="flex gap-1 bg-[#f3f4f6] rounded-xl p-1 mb-4">
            {tabLabels.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === t.key
                    ? 'bg-white text-[#1a1a1a] shadow-sm'
                    : 'text-[#6b7280] hover:text-[#1a1a1a]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden divide-y divide-[#f3f4f6]">
            {visible.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'credit' ? 'bg-green-50' : 'bg-[#f9fafb]'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-[#6b7280]" />
                  )}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1a1a1a] truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-[#6b7280]">{tx.timestamp}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${statusPill[tx.status]}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <p
                  className={`text-sm flex-shrink-0 ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-[#1a1a1a]'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '−'}₦{tx.amount.toLocaleString()}
                </p>
              </div>
            ))}

            {visible.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-[#6b7280]">No transactions in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 text-[#6b7280]"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => navigate('/contracts')}
            className="flex flex-col items-center gap-1 text-[#6b7280]"
          >
            <Briefcase className="w-6 h-6" />
            <span className="text-xs">Contracts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#1F5F5B]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M16 12a4 4 0 0 1-8 0" />
            </svg>
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
