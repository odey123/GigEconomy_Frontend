import { useState } from 'react';
import { CheckCircle, Shield, Minus, Plus } from 'lucide-react';

const product = {
  businessName: 'Cravings by Sade',
  productName: 'Parfait Cup',
  description: 'Fresh, layered parfait cup with seasonal fruits, granola, and homemade yoghurt. Made daily — no preservatives.',
  price: 2000,
  commissionRate: 0.2,
  helperName: 'Tobi A.',
};

type FormState = {
  name: string;
  phone: string;
  note: string;
};

export default function CustomerPayment() {
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState<FormState>({ name: '', phone: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = product.price * quantity;
  const helperEarnings = Math.round(total * product.commissionRate);
  const businessEarnings = total - helperEarnings;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-[#e5e7eb] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>

          <h1 className="text-2xl text-[#1a1a1a] mb-2">Payment successful!</h1>
          <p className="text-sm text-[#6b7280] mb-6">
            Thank you, {form.name || 'there'}. Your order is confirmed.
          </p>

          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 text-left mb-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">Product</span>
              <span className="text-[#1a1a1a]">{product.productName} × {quantity}</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-[#e5e7eb] pt-3">
              <span className="text-[#6b7280]">Total paid</span>
              <span className="text-[#1a1a1a]">₦{total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">To {product.businessName}</span>
              <span className="text-[#1a1a1a]">₦{businessEarnings.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">To {product.helperName}</span>
              <span className="text-[#1F5F5B]">₦{helperEarnings.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#1F5F5B]/5 border border-[#1F5F5B]/15 rounded-xl p-4">
            <p className="text-sm text-[#1F5F5B] leading-relaxed">
              You're helping <span className="text-[#1a1a1a]">{product.helperName}</span> earn a{' '}
              <span className="text-[#1a1a1a]">₦{helperEarnings.toLocaleString()}</span> commission. Thanks!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
          {/* Business Header */}
          <div className="bg-gradient-to-br from-[#1F5F5B] to-[#1a4f4c] px-6 pt-6 pb-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-lg">{product.businessName}</span>
              <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
            </div>
            <p className="text-white/60 text-xs">Verified seller · Powered by Squad</p>
          </div>

          {/* Product Card overlapping hero */}
          <div className="mx-4 -mt-6 bg-white border border-[#e5e7eb] rounded-xl p-4 mb-4 shadow-sm">
            {/* Product image placeholder */}
            <div className="w-full h-40 bg-[#F4B942]/10 rounded-lg flex flex-col items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#F4B942]/20 rounded-full flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-[#F4B942]/30 rounded-full" />
              </div>
              <p className="text-xs text-[#6b7280]">Product image</p>
            </div>

            <h2 className="text-lg text-[#1a1a1a] mb-1">{product.productName}</h2>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-3">{product.description}</p>

            <div className="flex items-center justify-between">
              <p className="text-xl text-[#1a1a1a]">₦{product.price.toLocaleString()}</p>
              <span className="text-xs text-[#6b7280]">per cup</span>
            </div>
          </div>

          <div className="px-4 pb-6">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-3 mb-4">
              <div>
                <p className="text-sm text-[#1a1a1a]">Quantity</p>
                <p className="text-xs text-[#6b7280]">
                  Total: <span className="text-[#1a1a1a]">₦{total.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#1a1a1a] hover:bg-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg text-[#1a1a1a] w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#1a1a1a] hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Info Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-[#1a1a1a] mb-1.5">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Amaka Obi"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-[#1a1a1a] mb-1.5">Phone number</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm text-[#6b7280] whitespace-nowrap">
                    +234
                  </div>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="08012345678"
                    className="flex-1 px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#1a1a1a] mb-1.5">
                  Delivery note <span className="text-[#6b7280]">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="e.g., Room 14B, Block C hostel"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent resize-none"
                />
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-70 text-white py-4 rounded-xl text-base transition-colors mt-2"
              >
                {loading ? 'Processing…' : `Pay ₦${total.toLocaleString()} with Squad`}
              </button>

              {/* Trust Signals */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#6b7280]">
                  <Shield className="w-3.5 h-3.5 text-[#1F5F5B]" />
                  <span>Secured by Squad</span>
                </div>
                <p className="text-center text-xs text-[#6b7280] leading-relaxed">
                  Money is split automatically between{' '}
                  <span className="text-[#1a1a1a]">{product.businessName}</span> and your seller,{' '}
                  <span className="text-[#1a1a1a]">{product.helperName}</span>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
