import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, Wallet, CheckCircle, TrendingUp, Package, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { contractsService } from '../../lib/services/contracts';

const MOCK_CONTRACT = {
  id: 'c1',
  gigTitle: 'Sell Parfait at Unilag Campus',
  businessName: 'Cravings by Sade',
  helperName: 'Tobi A.',
  status: 'Active',
  commissionRate: 20,
  pricePerUnit: 2000,
  totalEarnings: 18750,
  totalSales: 15,
  paymentUrl: 'squad.pay/cbs-tobi-a7k2',
  startedAt: 'May 5, 2025',
};

const pickupLog = [
  { date: 'May 12', quantity: 20, value: '₦40,000', status: 'consumed', consumed: 18, remaining: 2 },
  { date: 'May 9',  quantity: 15, value: '₦30,000', status: 'fully consumed', consumed: 15, remaining: 0 },
  { date: 'May 6',  quantity: 10, value: '₦20,000', status: 'fully consumed', consumed: 10, remaining: 0 },
];

const liveSales = [
  { time: '2:14 PM', amount: 2000, businessCut: 1600, helperCut: 400, customer: 'Amaka O.' },
  { time: '1:52 PM', amount: 2000, businessCut: 1600, helperCut: 400, customer: 'Femi B.' },
  { time: '1:30 PM', amount: 4000, businessCut: 3200, helperCut: 800, customer: 'Ngozi T.' },
  { time: '12:11 PM', amount: 2000, businessCut: 1600, helperCut: 400, customer: 'Kunle M.' },
  { time: '11:48 AM', amount: 2000, businessCut: 1600, helperCut: 400, customer: 'Sola D.' },
  { time: '10:22 AM', amount: 4000, businessCut: 3200, helperCut: 800, customer: 'Bisi A.' },
];

function QRCode() {
  const U = 9;
  const cells: [number, number, number, number][] = [
    // Top-left finder pattern
    [0, 0, 7, 1], [6, 0, 7, 1], [0, 0, 1, 7], [0, 6, 1, 7],
    [2, 2, 3, 3],
    // Top-right finder pattern
    [0, 14, 7, 1], [6, 14, 7, 1], [0, 14, 1, 7], [0, 20, 1, 7],
    [2, 16, 3, 3],
    // Bottom-left finder pattern
    [14, 0, 7, 1], [20, 0, 7, 1], [14, 0, 1, 7], [14, 6, 1, 7],
    [16, 2, 3, 3],
    // Timing patterns
    [6, 8, 1, 1], [6, 10, 1, 1], [6, 12, 1, 1],
    [8, 6, 1, 1], [10, 6, 1, 1], [12, 6, 1, 1],
    // Data modules
    [8, 8, 1, 1],  [8, 10, 1, 1], [8, 13, 1, 1], [8, 16, 1, 1], [8, 18, 1, 1], [8, 20, 1, 1],
    [9, 9, 1, 1],  [9, 12, 1, 1], [9, 14, 1, 1], [9, 17, 1, 1], [9, 19, 1, 1],
    [10, 8, 1, 1], [10, 11, 1, 1],[10, 13, 1, 1],[10, 15, 1, 1],[10, 18, 1, 1],[10, 20, 1, 1],
    [11, 9, 1, 1], [11, 12, 1, 1],[11, 16, 1, 1],[11, 19, 1, 1],
    [12, 8, 1, 1], [12, 10, 1, 1],[12, 14, 1, 1],[12, 17, 1, 1],[12, 20, 1, 1],
    [13, 9, 1, 1], [13, 11, 1, 1],[13, 13, 1, 1],[13, 15, 1, 1],[13, 18, 1, 1],
    [15, 8, 1, 1], [15, 11, 1, 1],[15, 13, 1, 1],[15, 16, 1, 1],[15, 19, 1, 1],
    [16, 9, 1, 1], [16, 12, 1, 1],[16, 14, 1, 1],[16, 17, 1, 1],[16, 20, 1, 1],
    [17, 8, 1, 1], [17, 10, 1, 1],[17, 13, 1, 1],[17, 15, 1, 1],[17, 18, 1, 1],
    [18, 9, 1, 1], [18, 11, 1, 1],[18, 14, 1, 1],[18, 16, 1, 1],[18, 19, 1, 1],
    [19, 8, 1, 1], [19, 10, 1, 1],[19, 12, 1, 1],[19, 15, 1, 1],[19, 17, 1, 1],[19, 20, 1, 1],
    [20, 9, 1, 1], [20, 11, 1, 1],[20, 13, 1, 1],[20, 16, 1, 1],[20, 18, 1, 1],
  ];
  return (
    <svg viewBox={`0 0 ${21 * U} ${21 * U}`} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width={21 * U} height={21 * U} fill="white" />
      {cells.map(([row, col, w, h], i) => (
        <rect key={i} x={col * U} y={row * U} width={w * U} height={h * U} fill="#1F5F5B" />
      ))}
    </svg>
  );
}

function SquadBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#1F5F5B] text-white text-[10px] rounded font-medium tracking-wide">
      <Zap className="w-2.5 h-2.5" />
      Squad
    </span>
  );
}

export default function ContractDetailSales() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState(MOCK_CONTRACT);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    contractsService.getSalesEarnings(id)
      .then(data => {
        if (data?.totalSales != null) {
          setContract(prev => ({
            ...prev,
            totalEarnings: data.totalEarnings ?? prev.totalEarnings,
            totalSales: data.totalSales ?? prev.totalSales,
            commissionRate: data.commissionRate ?? prev.commissionRate,
            paymentUrl: data.paymentUrl || prev.paymentUrl,
          }));
        }
      })
      .catch(() => {});
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${contract.paymentUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'My payment link', url: `https://${contract.paymentUrl}` }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-10">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
            </button>
            <span className="text-base text-[#1a1a1a]">My Contract</span>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Active
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        {/* Hero Summary Card */}
        <div className="bg-gradient-to-br from-[#1F5F5B] to-[#1a4f4c] rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-white/70 text-xs mb-1">{contract.businessName}</p>
              <h1 className="text-lg text-white leading-snug">{contract.gigTitle}</h1>
              <p className="text-white/60 text-xs mt-1">Selling as {contract.helperName} · Since {contract.startedAt}</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-white/80 text-xs whitespace-nowrap">
              <span className="relative flex h-1.5 w-1.5 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              Live · powered by Squad
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60 text-xs mb-1">Total earned</p>
              <p className="text-xl text-white">₦{contract.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60 text-xs mb-1">Cups sold</p>
              <p className="text-xl text-white">{contract.totalSales}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white/60 text-xs mb-1">Commission</p>
              <p className="text-xl text-white">{contract.commissionRate}%</p>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-white text-[#1F5F5B] py-3 rounded-xl text-sm transition-colors hover:bg-white/90">
            <Wallet className="w-4 h-4" />
            Withdraw Earnings
          </button>
        </div>

        {/* Payment Link Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <h2 className="text-base text-[#1a1a1a] mb-4">Your Payment Link</h2>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* QR Code */}
            <div className="w-48 h-48 flex-shrink-0 border-2 border-[#e5e7eb] rounded-xl p-3 bg-white">
              <QRCode />
            </div>

            <div className="flex-1 min-w-0 w-full">
              {/* URL */}
              <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-4 py-3 mb-3">
                <p className="text-xs text-[#6b7280] mb-0.5">Your unique link</p>
                <p className="text-sm text-[#1a1a1a] break-all">{contract.paymentUrl}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm transition-colors ${
                    copied
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'border-[#e5e7eb] text-[#1a1a1a] hover:bg-[#f9fafb]'
                  }`}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#e5e7eb] text-[#1a1a1a] text-sm hover:bg-[#f9fafb] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <p className="text-xs text-[#6b7280] leading-relaxed">
                Show this QR or share the link. Customers pay through it and Squad auto-splits the payment instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Stock Pickup Log */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-[#1F5F5B]" />
            <h2 className="text-base text-[#1a1a1a]">Stock Pickup Log</h2>
          </div>

          <div className="space-y-0 divide-y divide-[#f3f4f6]">
            {/* Header */}
            <div className="grid grid-cols-4 pb-2">
              <p className="text-xs text-[#6b7280]">Date</p>
              <p className="text-xs text-[#6b7280]">Qty taken</p>
              <p className="text-xs text-[#6b7280]">Value</p>
              <p className="text-xs text-[#6b7280]">Status</p>
            </div>

            {pickupLog.map((log, i) => (
              <div key={i} className="grid grid-cols-4 py-3 items-center">
                <p className="text-sm text-[#1a1a1a]">{log.date}</p>
                <div>
                  <p className="text-sm text-[#1a1a1a]">{log.quantity} cups</p>
                  <p className="text-xs text-[#6b7280]">{log.remaining} left</p>
                </div>
                <p className="text-sm text-[#1a1a1a]">{log.value}</p>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs ${
                  log.remaining === 0
                    ? 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
                    : 'bg-[#F4B942]/10 text-[#b5851f]'
                }`}>
                  {log.remaining === 0 ? 'Sold out' : `${log.remaining} left`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Sales Feed */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </div>
              <h2 className="text-base text-[#1a1a1a]">Live Sales Feed</h2>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#1F5F5B]" />
              <span className="text-xs text-[#1F5F5B]">Today</span>
            </div>
          </div>

          <div className="space-y-0 divide-y divide-[#f3f4f6]">
            {liveSales.map((sale, i) => (
              <div key={i} className="py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#6b7280]">{sale.time}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#1a1a1a]">₦{sale.amount.toLocaleString()}</span>
                    <SquadBadge />
                  </div>
                </div>
                <p className="text-xs text-[#6b7280]">
                  ₦{sale.amount.toLocaleString()} →{' '}
                  <span className="text-[#1a1a1a]">₦{sale.businessCut.toLocaleString()}</span> to {contract.businessName},{' '}
                  <span className="text-[#1F5F5B]">₦{sale.helperCut.toLocaleString()}</span> to you
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#6b7280] mt-3 pt-3 border-t border-[#f3f4f6]">
            Payments split automatically by Squad at the moment of checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
