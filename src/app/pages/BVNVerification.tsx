import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';

export default function BVNVerification() {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => setIsVerifying(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#1F5F5B]" />
          </div>
          <h1 className="text-3xl md:text-4xl mb-3 text-[#1a1a1a]">Set up your wallet</h1>
          <p className="text-[#6b7280] leading-relaxed">
            We use your BVN to verify your identity and create your secure Squad wallet — one step, two protections.
          </p>
        </div>

        {/* Trust Callout */}
        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 mb-8">
          <h3 className="text-sm mb-2 text-[#1a1a1a] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#1F5F5B]" />
            Why we need this
          </h3>
          <p className="text-sm text-[#6b7280] leading-relaxed">
            Your BVN confirms you're real, protects everyone you do business with, and gives you access to a verified wallet for receiving payments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* BVN */}
          <div>
            <label htmlFor="bvn" className="block text-sm mb-2 text-[#1a1a1a]">
              Bank Verification Number (BVN)
            </label>
            <input
              type="text"
              id="bvn"
              maxLength={11}
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="12345678901"
              required
            />
            <p className="text-xs text-[#6b7280] mt-1">11 digits</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm mb-2 text-[#1a1a1a]">
              Full Name (as on BVN)
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm mb-2 text-[#1a1a1a]">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              required
            />
          </div>

          {/* Squad Badge */}
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="w-8 h-8 bg-[#1F5F5B] rounded flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-[#6b7280]">Powered by Squad</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:bg-[#d1d5db] text-white py-3.5 rounded-lg transition-colors"
          >
            {isVerifying ? 'Verifying with Squad...' : 'Verify and Create Wallet'}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-6 text-center text-xs text-[#6b7280]">
          <p>🔒 Your information is encrypted and never shared without your permission</p>
        </div>
      </div>
    </div>
  );
}
