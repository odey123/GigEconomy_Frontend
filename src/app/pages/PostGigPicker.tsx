import { ShoppingBag, Wrench, ChevronLeft, Lock } from 'lucide-react';
import { Link } from 'react-router';

export default function PostGigPicker() {
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] mb-8">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl mb-3 text-[#1a1a1a]">Post a new gig</h1>
          <p className="text-[#6b7280]">What kind of help do you need?</p>
        </div>

        {/* Choice Cards */}
        <div className="space-y-4 mb-8">
          <Link
            to="/post-gig/sales"
            className="block group bg-white border-2 border-[#e5e7eb] hover:border-[#1F5F5B] rounded-xl p-6 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#F4B942]/10 group-hover:bg-[#F4B942]/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <ShoppingBag className="w-7 h-7 text-[#F4B942]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg mb-2 text-[#1a1a1a] group-hover:text-[#1F5F5B] transition-colors">
                  I need someone to sell my product
                </h3>
                <p className="text-sm text-[#6b7280] mb-3 leading-relaxed">
                  Post a sales opportunity where helpers take your stock and sell to their network on commission
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#f9fafb] text-xs text-[#6b7280] rounded">Sell my parfait</span>
                  <span className="px-2 py-1 bg-[#f9fafb] text-xs text-[#6b7280] rounded">Sell my clothes</span>
                  <span className="px-2 py-1 bg-[#f9fafb] text-xs text-[#6b7280] rounded">Sell my jewelry</span>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/post-gig/task"
            className="block group bg-white border-2 border-[#e5e7eb] hover:border-[#1F5F5B] rounded-xl p-6 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-[#1F5F5B]/10 group-hover:bg-[#1F5F5B]/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <Wrench className="w-7 h-7 text-[#1F5F5B]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg mb-2 text-[#1a1a1a] group-hover:text-[#1F5F5B] transition-colors">
                  I need someone to do a piece of work
                </h3>
                <p className="text-sm text-[#6b7280] mb-3 leading-relaxed">
                  Post a one-off task that requires specific skills, with a fixed price held in escrow
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#f9fafb] text-xs text-[#6b7280] rounded">Sew 10 dresses</span>
                  <span className="px-2 py-1 bg-[#f9fafb] text-xs text-[#6b7280] rounded">Repair 5 pairs of shoes</span>
                  <span className="px-2 py-1 bg-[#f9fafb] text-xs text-[#6b7280] rounded">Design a logo</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Coming Soon */}
        <div className="border-t border-[#e5e7eb] pt-6">
          <p className="text-sm text-[#6b7280] mb-4">More work types coming soon:</p>

          <div className="space-y-3">
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 opacity-60">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-[#1a1a1a] mb-1">Shop Staffing</h4>
                  <p className="text-xs text-[#6b7280]">Hire part-time or full-time shop assistants</p>
                </div>
                <Lock className="w-5 h-5 text-[#6b7280]" />
              </div>
            </div>

            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 opacity-60">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-[#1a1a1a] mb-1">Full-time Roles</h4>
                  <p className="text-xs text-[#6b7280]">Post permanent positions with salary</p>
                </div>
                <Lock className="w-5 h-5 text-[#6b7280]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
