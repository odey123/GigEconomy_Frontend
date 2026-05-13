import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl mb-3 text-[#1a1a1a]">Welcome back</h1>
          <p className="text-[#6b7280]">Sign in to continue to your account</p>
        </div>

        {/* Form */}
        <form className="space-y-5">
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-[#1a1a1a]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1a1a1a]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-sm text-[#1F5F5B] hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white py-3.5 rounded-lg transition-colors mt-6"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 pt-8 border-t border-[#e5e7eb]">
          <div className="text-center">
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
    </div>
  );
}
