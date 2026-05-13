import { Link } from 'react-router';
import { Briefcase, DollarSign, Shield, CheckCircle, Users, Clock } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 text-[#1a1a1a]">
            Hire flexible help.<br />Find flexible work.
          </h1>
          <p className="text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto mb-12 leading-relaxed">
            Nigeria's trusted platform connecting small businesses with skilled workers. Safe, simple, and built for our community.
          </p>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <Link
              to="/signup?type=business"
              className="group bg-[#1F5F5B] hover:bg-[#1a4f4c] transition-colors text-white rounded-xl p-8 text-left shadow-md hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">I run a business</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Post jobs, hire vetted helpers, and manage payments securely
              </p>
            </Link>

            <Link
              to="/signup?type=helper"
              className="group bg-[#F4B942] hover:bg-[#e5aa2f] transition-colors text-[#1a1a1a] rounded-xl p-8 text-left shadow-md hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">I want to earn</h3>
              <p className="text-[#1a1a1a]/70 text-sm leading-relaxed">
                Find flexible jobs, build your reputation, and get paid on time
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12 text-[#1a1a1a]">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1F5F5B] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                1
              </div>
              <h3 className="text-lg mb-2 text-[#1a1a1a]">Create your profile</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Sign up in 2 minutes as a business owner or helper
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1F5F5B] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                2
              </div>
              <h3 className="text-lg mb-2 text-[#1a1a1a]">Connect & agree</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Browse opportunities or find the right person for your job
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1F5F5B] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                3
              </div>
              <h3 className="text-lg mb-2 text-[#1a1a1a]">Work & get paid</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Complete the job and receive secure payment through the platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#1F5F5B]" />
              <h3 className="text-xl text-[#1a1a1a]">Payments secured by Squad</h3>
            </div>
            <p className="text-[#6b7280] leading-relaxed">
              All transactions are processed through Squad's secure payment infrastructure, ensuring your money is safe every step of the way.
            </p>
          </div>

          {/* Testimonials Placeholder */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f9fafb] rounded-xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <CheckCircle key={i} className="w-5 h-5 text-[#F4B942]" />
                ))}
              </div>
              <p className="text-[#1a1a1a] mb-4 leading-relaxed">
                "This platform made it so easy to find reliable help for my shop. Payments are smooth and the helpers are professional."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1F5F5B] rounded-full flex items-center justify-center text-white">
                  A
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]">Adaeze Okonkwo</p>
                  <p className="text-xs text-[#6b7280]">Shop Owner, Lagos</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f9fafb] rounded-xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <CheckCircle key={i} className="w-5 h-5 text-[#F4B942]" />
                ))}
              </div>
              <p className="text-[#1a1a1a] mb-4 leading-relaxed">
                "I've found consistent work through this app. The payment is always on time and the business owners are respectful."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F4B942] rounded-full flex items-center justify-center text-[#1a1a1a]">
                  C
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]">Chidi Nwankwo</p>
                  <p className="text-xs text-[#6b7280]">Helper, Abuja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-sm mb-3 text-[#1a1a1a]">For Business</h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li><a href="#" className="hover:text-[#1F5F5B]">Post a Job</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">Find Helpers</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm mb-3 text-[#1a1a1a]">For Helpers</h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li><a href="#" className="hover:text-[#1F5F5B]">Find Work</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">How to Apply</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm mb-3 text-[#1a1a1a]">Company</h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li><a href="#" className="hover:text-[#1F5F5B]">About Us</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">Contact</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm mb-3 text-[#1a1a1a]">Legal</h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li><a href="#" className="hover:text-[#1F5F5B]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#1F5F5B]">Safety</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e5e7eb] text-center text-sm text-[#6b7280]">
            <p>© 2026 FlexWork Nigeria. Making work opportunities accessible.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
