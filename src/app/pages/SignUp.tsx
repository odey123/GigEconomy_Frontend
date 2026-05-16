import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '../../lib/services/auth';
import { useAuth } from '../../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') === 'helper' ? 'helper' : 'business';

  const [accountType, setAccountType] = useState<'business' | 'helper'>(defaultType);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong || !passwordsMatch || !agreedToTerms) return;
    setLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken, user } = await authService.signup({
        firstName,
        lastName,
        email,
        phone: `234${phone.replace(/^0/, '')}`,
        password,
        role: accountType === 'business' ? 'client' : 'worker',
      });
      login(accessToken, refreshToken, user);
      navigate('/verify-bvn');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-3 text-[#1a1a1a]">Create Account</h1>
          <p className="text-[#6b7280]">It takes 2 minutes. Your details are encrypted.</p>
        </div>

        <div className="bg-[#f9fafb] rounded-lg p-1 flex gap-1 mb-8">
          <button
            type="button"
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
            type="button"
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

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm mb-2 text-[#1a1a1a]">First Name</label>
              <input
                type="text" id="firstName" required value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm mb-2 text-[#1a1a1a]">Last Name</label>
              <input
                type="text" id="lastName" required value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-2 text-[#1a1a1a]">Email</label>
            <input
              type="email" id="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm mb-2 text-[#1a1a1a]">Phone Number</label>
            <div className="flex gap-2">
              <div className="w-20 px-3 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-[#6b7280] flex items-center justify-center">
                +234
              </div>
              <input
                type="tel" id="phone" required value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                placeholder="8012345678"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-[#1a1a1a]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} id="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent pr-12"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1a1a1a]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {password && (
              <div className="mt-3 space-y-2">
                {[
                  { ok: passwordStrength.hasLength, label: 'At least 8 characters' },
                  { ok: passwordStrength.hasUpperCase && passwordStrength.hasLowerCase, label: 'Upper & lowercase letters' },
                  { ok: passwordStrength.hasNumber, label: 'At least one number' },
                ].map(({ ok, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    {ok ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-[#d1d5db]" />}
                    <span className={ok ? 'text-green-600' : 'text-[#6b7280]'}>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-2 text-[#1a1a1a]">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" required
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent pr-12"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1a1a1a]"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                {passwordsMatch
                  ? <><CheckCircle className="w-4 h-4 text-green-600" /><span className="text-green-600">Passwords match</span></>
                  : <><XCircle className="w-4 h-4 text-red-600" /><span className="text-red-600">Passwords do not match</span></>
                }
              </div>
            )}
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox" id="terms" checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-[#e5e7eb] text-[#1F5F5B] focus:ring-2 focus:ring-[#1F5F5B]"
            />
            <label htmlFor="terms" className="text-sm text-[#6b7280] leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-[#1F5F5B] hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-[#1F5F5B] hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={!isPasswordStrong || !passwordsMatch || !agreedToTerms || loading}
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:bg-[#d1d5db] disabled:cursor-not-allowed text-white py-3.5 rounded-lg transition-colors"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#6b7280]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1F5F5B] hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
