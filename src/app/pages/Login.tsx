import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../../lib/services/auth';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coldStart, setColdStart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coldStartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setColdStart(false);
    // Show cold-start notice after 6 seconds — Render free tier can take ~50s to wake up
    coldStartTimer.current = setTimeout(() => setColdStart(true), 6000);
    try {
      const { accessToken, refreshToken, user } = await authService.login(email, password);
      login(accessToken, refreshToken, user);
      navigate(user.role === 'owner' ? '/dashboard' : '/helper-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      if (coldStartTimer.current) clearTimeout(coldStartTimer.current);
      setColdStart(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl mb-3 text-[#1a1a1a]">Welcome back</h1>
          <p className="text-[#6b7280]">Sign in to continue to your account</p>
        </div>

        {coldStart && (
          <div className="mb-5 px-4 py-3 bg-[#F4B942]/10 border border-[#F4B942]/40 rounded-lg text-sm text-[#b5851f] flex items-start gap-2">
            <span className="mt-0.5 flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#F4B942] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#F4B942]" />
            </span>
            <span>
              The server is waking up — this can take up to 50 seconds on first load.
              Hang tight, your request is still going through.
            </span>
          </div>
        )}

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm mb-2 text-[#1a1a1a]">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-[#1a1a1a]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent pr-12"
                placeholder="Enter your password"
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
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-[#1F5F5B] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-60 text-white py-3.5 rounded-lg transition-colors mt-6"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-[#e5e7eb] text-center">
          <p className="text-sm text-[#6b7280] mb-3">New here?</p>
          <Link
            to="/signup"
            className="inline-block w-full py-3.5 border-2 border-[#1F5F5B] text-[#1F5F5B] hover:bg-[#1F5F5B] hover:text-white rounded-lg transition-colors text-center"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
