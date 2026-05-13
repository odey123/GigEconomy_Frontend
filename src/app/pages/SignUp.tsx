import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') === 'helper' ? 'helper' : 'business';

  const [accountType, setAccountType] = useState<'business' | 'helper'>(defaultType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-3 text-[#1a1a1a]">Create Account</h1>
          <p className="text-[#6b7280]">It takes 2 minutes. Your details are encrypted.</p>
        </div>

        {/* Account Type Toggle */}
        <div className="bg-[#f9fafb] rounded-lg p-1 flex gap-1 mb-8">
          <button
            onClick={() => setAccountType('business')}
            className={`flex-1 py-3 px-4 rounded-md transition-all ${
              accountType === 'business'
                ? 'bg-white shadow-sm text-[#1F5F5B]'
                : 'text-[#6b7280] hover:text-[#1a1a1a]'
            }`}
          >
            Business Owner
          </button>
          <button
            onClick={() => setAccountType('helper')}
            className={`flex-1 py-3 px-4 rounded-md transition-all ${
              accountType === 'helper'
                ? 'bg-white shadow-sm text-[#1F5F5B]'
                : 'text-[#6b7280] hover:text-[#1a1a1a]'
            }`}
          >
            Helper
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm mb-2 text-[#1a1a1a]">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2 text-[#1a1a1a]">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm mb-2 text-[#1a1a1a]">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-20 px-3 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-[#6b7280] flex items-center justify-center">
                +234
              </div>
              <input
                type="tel"
                id="phone"
                className="flex-1 px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                placeholder="8012345678"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-[#1a1a1a]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent pr-12"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1a1a1a]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength.hasLength ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#d1d5db]" />
                  )}
                  <span className={passwordStrength.hasLength ? 'text-green-600' : 'text-[#6b7280]'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#d1d5db]" />
                  )}
                  <span className={passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? 'text-green-600' : 'text-[#6b7280]'}>
                    Upper & lowercase letters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordStrength.hasNumber ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#d1d5db]" />
                  )}
                  <span className={passwordStrength.hasNumber ? 'text-green-600' : 'text-[#6b7280]'}>
                    At least one number
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-2 text-[#1a1a1a]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent pr-12"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1a1a1a]"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Passwords match</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-[#e5e7eb] text-[#1F5F5B] focus:ring-2 focus:ring-[#1F5F5B]"
            />
            <label htmlFor="terms" className="text-sm text-[#6b7280] leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-[#1F5F5B] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#1F5F5B] hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isPasswordStrong || !passwordsMatch || !agreedToTerms}
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:bg-[#d1d5db] disabled:cursor-not-allowed text-white py-3.5 rounded-lg transition-colors"
          >
            Create Account
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm text-[#6b7280]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1F5F5B] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
