import { useState } from 'react';
import { ChevronLeft, Info, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { gigsService } from '../../lib/services/gigs';

export default function PostGigSales() {
  const navigate = useNavigate();
  const [commission, setCommission] = useState(15);
  const [productPrice, setProductPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  const commissionAmount = productPrice ? (parseFloat(productPrice) * commission / 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-white">
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Form Section */}
        <div className="px-4 py-8 lg:overflow-y-auto">
          <div className="max-w-xl mx-auto">
            {/* Back Button */}
            <Link to="/post-gig" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] mb-8">
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl mb-2 text-[#1a1a1a]">Sales Gig</h1>
              <p className="text-[#6b7280]">Set up your commission-based sales opportunity</p>
            </div>

            <form className="space-y-6" onSubmit={async e => {
                e.preventDefault();
                setLoading(true);
                try {
                  await gigsService.create({
                    workType: 'sales',
                    title: `Sell ${productName}`,
                    productName,
                    productPrice: parseFloat(productPrice) || 0,
                    commissionPercent: commission,
                    stockAvailable: parseInt(stock) || 0,
                  });
                } catch { /* optimistic — navigate regardless */ }
                setLoading(false);
                navigate('/dashboard');
              }}>
              {/* Product Name */}
              <div>
                <label htmlFor="productName" className="block text-sm mb-2 text-[#1a1a1a]">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  placeholder="e.g., Parfait Cup, Ankara Dress"
                  required
                />
              </div>

              {/* Product Price */}
              <div>
                <label htmlFor="productPrice" className="block text-sm mb-2 text-[#1a1a1a]">
                  Product Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">₦</span>
                  <input
                    type="number"
                    id="productPrice"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Commission Percentage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="commission" className="block text-sm text-[#1a1a1a]">
                    Commission Percentage
                  </label>
                  <span className="text-sm text-[#1F5F5B]">{commission}%</span>
                </div>
                <input
                  type="range"
                  id="commission"
                  min="5"
                  max="50"
                  step="5"
                  value={commission}
                  onChange={(e) => setCommission(parseInt(e.target.value))}
                  className="w-full accent-[#1F5F5B]"
                />
                <div className="flex justify-between text-xs text-[#6b7280] mt-1">
                  <span>5%</span>
                  <span className="text-[#1F5F5B]">Recommended: 15%</span>
                  <span>50%</span>
                </div>
                {productPrice && (
                  <p className="text-sm text-[#6b7280] mt-2">
                    Helper earns ₦{commissionAmount} per sale
                  </p>
                )}
              </div>

              {/* Stock Available */}
              <div>
                <label htmlFor="stock" className="block text-sm mb-2 text-[#1a1a1a]">
                  Stock Available
                </label>
                <input
                  type="number"
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  placeholder="e.g., 100"
                  required
                />
              </div>

              {/* Starter Stock Value */}
              <div>
                <label htmlFor="starterStock" className="block text-sm mb-2 text-[#1a1a1a]">
                  Starter Stock Value
                </label>
                <input
                  type="number"
                  id="starterStock"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  placeholder="e.g., 10"
                  required
                />
                <div className="flex items-start gap-2 mt-2">
                  <Info className="w-4 h-4 text-[#6b7280] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#6b7280]">
                    How much stock can a new helper take on their first pickup?
                  </p>
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label htmlFor="pickupLocation" className="block text-sm mb-2 text-[#1a1a1a]">
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="pickupLocation"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  placeholder="Your shop or business address"
                  required
                />
              </div>

              {/* Pickup Times */}
              <div>
                <label className="block text-sm mb-3 text-[#1a1a1a]">
                  Pickup Times
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <label key={day} className="flex items-center gap-2 p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-white">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#e5e7eb] text-[#1F5F5B] focus:ring-2 focus:ring-[#1F5F5B]" />
                        <span className="text-sm text-[#1a1a1a]">{day}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="pickup-from" className="text-xs text-[#6b7280] mb-1 block">From</label>
                      <input
                        id="pickup-from"
                        type="time"
                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="pickup-to" className="text-xs text-[#6b7280] mb-1 block">To</label>
                      <input
                        id="pickup-to"
                        type="time"
                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label htmlFor="instructions" className="block text-sm mb-2 text-[#1a1a1a]">
                  Special Instructions <span className="text-[#6b7280]">(Optional)</span>
                </label>
                <textarea
                  id="instructions"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent resize-none"
                  placeholder="Any additional information helpers should know..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-60 text-white py-3.5 rounded-lg transition-colors"
              >
                {loading ? 'Posting…' : 'Post Gig'}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="hidden lg:block bg-[#f9fafb] border-l border-[#e5e7eb] p-8">
          <div className="sticky top-8">
            <h3 className="text-sm text-[#6b7280] mb-4">Preview</h3>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F4B942]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 text-[#F4B942]" />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-[#F4B942]/10 text-[#F4B942] rounded text-xs mb-2">
                    Sales
                  </span>
                  <h3 className="text-lg text-[#1a1a1a] mb-1">
                    {productName || 'Product Name'}
                  </h3>
                  <p className="text-sm text-[#6b7280]">Posted just now</p>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-[#e5e7eb]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">Price per unit</span>
                  <span className="text-[#1a1a1a]">₦{productPrice || '0.00'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">Your commission</span>
                  <span className="text-[#1F5F5B]">{commission}% (₦{commissionAmount})</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">Stock available</span>
                  <span className="text-[#1a1a1a]">{stock || '0'} units</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-[#6b7280] mb-2">Pickup location</p>
                <p className="text-sm text-[#1a1a1a]">Location will appear here</p>
              </div>

              <button type="button" className="w-full mt-6 bg-[#1F5F5B] text-white py-3 rounded-lg">
                Apply for This Gig
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
