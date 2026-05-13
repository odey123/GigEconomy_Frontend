import { Link } from 'react-router';
import { Briefcase, DollarSign, Shield, CheckCircle, ArrowRight, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="px-6 py-4 border-b border-[#e5e7eb] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1F5F5B] rounded-lg flex items-center justify-center">
              <span className="text-[#F4B942] font-bold text-sm leading-none">G</span>
            </div>
            <span className="text-[#1a1a1a] font-semibold text-lg tracking-tight">
              Gig<span className="text-[#1F5F5B]">NG</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-[#6b7280]">
            <a href="#how-it-works" className="hover:text-[#1a1a1a] transition-colors">How it works</a>
            <a href="#trust" className="hover:text-[#1a1a1a] transition-colors">Why GigNG</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-[#6b7280] hover:text-[#1a1a1a] transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-[#1F5F5B] text-white px-4 py-2 rounded-lg hover:bg-[#1a4f4c] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f0faf9] text-[#1F5F5B] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-[#1F5F5B] rounded-full"></span>
                Built for Nigeria
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-6 text-[#1a1a1a] leading-[1.1]">
                Hire flexible help.<br />
                <span className="text-[#1F5F5B]">Find flexible work.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#6b7280] mb-10 leading-relaxed max-w-lg">
                Nigeria's trusted platform connecting small businesses with skilled workers. Safe, simple, and built for our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/signup?type=business"
                  className="flex items-center justify-center gap-2 bg-[#1F5F5B] text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-[#1a4f4c] transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  Hire a helper
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/signup?type=helper"
                  className="flex items-center justify-center gap-2 bg-[#F4B942] text-[#1a1a1a] px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-[#e5aa2f] transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Find work
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right — CTA cards (desktop visual) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              <Link
                to="/signup?type=business"
                className="group bg-[#1F5F5B] hover:bg-[#1a4f4c] transition-colors text-white rounded-2xl p-8 text-left shadow-md hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl mb-2 font-medium">I run a business</h3>
                <p className="text-white/75 text-sm leading-relaxed">
                  Post jobs, hire vetted helpers, and manage payments securely
                </p>
              </Link>

              <Link
                to="/signup?type=helper"
                className="group bg-[#F4B942] hover:bg-[#e5aa2f] transition-colors text-[#1a1a1a] rounded-2xl p-8 text-left shadow-md hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-5">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl mb-2 font-medium">I want to earn</h3>
                <p className="text-[#1a1a1a]/70 text-sm leading-relaxed">
                  Find flexible jobs, build your reputation, and get paid on time
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="px-6 py-10 bg-[#1F5F5B]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2,000+', label: 'Helpers registered' },
            { value: '500+', label: 'Businesses onboarded' },
            { value: '₦0', label: 'Platform fee to sign up' },
            { value: '100%', label: 'Secure payments' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-[#F4B942] mb-1">{value}</p>
              <p className="text-sm text-white/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] mb-4">
              How it works
            </h2>
            <p className="text-[#6b7280] max-w-xl mx-auto">
              From sign-up to payday in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '1', title: 'Create your profile', desc: 'Sign up in 2 minutes as a business owner or helper' },
              { step: '2', title: 'Connect & agree', desc: 'Browse opportunities or find the right person for your job' },
              { step: '3', title: 'Work & get paid', desc: 'Complete the job and receive secure payment through the platform' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-[#1F5F5B] text-white rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-bold">
                  {step}
                </div>
                <h3 className="text-lg font-medium mb-2 text-[#1a1a1a]">{title}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section id="trust" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#f0faf9] rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#1F5F5B]" />
                </div>
                <h3 className="text-xl text-[#1a1a1a] font-medium">Payments secured by Squad</h3>
              </div>
              <p className="text-[#6b7280] leading-relaxed text-sm">
                All transactions are processed through Squad's secure payment infrastructure, ensuring your money is safe every step of the way.
              </p>
            </div>

            <div className="bg-[#1F5F5B] rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-medium">BVN-verified helpers</h3>
              </div>
              <p className="text-white/75 leading-relaxed text-sm">
                Every helper on GigNG is identity-verified with BVN, so businesses always know who they're hiring.
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f9fafb] rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4B942] text-[#F4B942]" />
                ))}
              </div>
              <p className="text-[#1a1a1a] mb-5 leading-relaxed text-sm">
                "This platform made it so easy to find reliable help for my shop. Payments are smooth and the helpers are professional."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1F5F5B] flex items-center justify-center text-white text-sm font-semibold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">Adaeze Okonkwo</p>
                  <p className="text-xs text-[#6b7280]">Shop Owner, Lagos</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f9fafb] rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4B942] text-[#F4B942]" />
                ))}
              </div>
              <p className="text-[#1a1a1a] mb-5 leading-relaxed text-sm">
                "I've found consistent work through this app. The payment is always on time and the business owners are respectful."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F4B942] flex items-center justify-center text-[#1a1a1a] text-sm font-semibold">
                  C
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">Chidi Nwankwo</p>
                  <p className="text-xs text-[#6b7280]">Helper, Abuja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] mb-5">
            Ready to get started?
          </h2>
          <p className="text-[#6b7280] mb-8 max-w-lg mx-auto">
            Join thousands of Nigerians already working and hiring on GigNG.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/signup?type=business"
              className="inline-flex items-center justify-center gap-2 bg-[#1F5F5B] text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-[#1a4f4c] transition-colors"
            >
              Post a job free
            </Link>
            <Link
              to="/signup?type=helper"
              className="inline-flex items-center justify-center gap-2 border border-[#1F5F5B] text-[#1F5F5B] px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-[#f0faf9] transition-colors"
            >
              Find work near you
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[#1F5F5B] rounded-md flex items-center justify-center">
                  <span className="text-[#F4B942] font-bold text-xs">G</span>
                </div>
                <span className="font-semibold text-[#1a1a1a]">Gig<span className="text-[#1F5F5B]">NG</span></span>
              </div>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Making flexible work accessible to every Nigerian — safely, simply, and fairly.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-sm font-medium mb-3 text-[#1a1a1a]">For Business</h4>
                <ul className="space-y-2 text-sm text-[#6b7280]">
                  <li><a href="#" className="hover:text-[#1F5F5B]">Post a Job</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">Find Helpers</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 text-[#1a1a1a]">For Helpers</h4>
                <ul className="space-y-2 text-sm text-[#6b7280]">
                  <li><a href="#" className="hover:text-[#1F5F5B]">Find Work</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">How to Apply</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">Success Stories</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 text-[#1a1a1a]">Company</h4>
                <ul className="space-y-2 text-sm text-[#6b7280]">
                  <li><a href="#" className="hover:text-[#1F5F5B]">About Us</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">Contact</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 text-[#1a1a1a]">Legal</h4>
                <ul className="space-y-2 text-sm text-[#6b7280]">
                  <li><a href="#" className="hover:text-[#1F5F5B]">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-[#1F5F5B]">Safety</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e5e7eb] flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-[#6b7280]">
            <p>© 2026 <span className="font-medium text-[#1a1a1a]">GigNG</span>. All rights reserved.</p>
            <p>Making work opportunities accessible to every Nigerian.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
