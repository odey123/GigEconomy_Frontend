import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { walletService } from '../../lib/services/wallet';
import { useAuth } from '../../context/AuthContext';

// HTML date input returns YYYY-MM-DD — Squad requires mm/dd/yyyy
function toSquadDob(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}

export default function BVNVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bvn, setBvn] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await walletService.create({
        bvn,
        firstName,
        lastName,
        ...(middleName ? { middleName } : {}),
        dateOfBirth: toSquadDob(dob),
        gender,
        address,
        beneficiaryAccount,
      });
      navigate(user?.role === 'owner' ? '/profile-setup/owner' : '/profile-setup/helper');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please check your details match your BVN exactly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#1F5F5B]" />
          </div>
          <h1 className="text-3xl md:text-4xl mb-3 text-[#1a1a1a]">Set up your wallet</h1>
          <p className="text-[#6b7280] leading-relaxed">
            We use your BVN to verify your identity and create your secure Squad wallet — one step, two protections.
          </p>
        </div>

        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-4 mb-6">
          <h3 className="text-sm mb-2 text-[#1a1a1a] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#1F5F5B]" />
            Details must match your BVN exactly
          </h3>
          <p className="text-sm text-[#6b7280] leading-relaxed">
            Squad validates your name, date of birth, and gender against the BVN database. Use the exact same spelling and date registered with your bank.
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* BVN */}
          <div>
            <label htmlFor="bvn" className="block text-sm mb-2 text-[#1a1a1a]">
              Bank Verification Number (BVN)
            </label>
            <input
              type="text" id="bvn" maxLength={11} minLength={11} required
              value={bvn} onChange={e => setBvn(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="12345678901"
            />
            <p className="text-xs text-[#6b7280] mt-1">11 digits</p>
          </div>

          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm mb-2 text-[#1a1a1a]">
                First Name
              </label>
              <input
                type="text" id="firstName" required
                value={firstName} onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                placeholder="As on BVN"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm mb-2 text-[#1a1a1a]">
                Last Name
              </label>
              <input
                type="text" id="lastName" required
                value={lastName} onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                placeholder="As on BVN"
              />
            </div>
          </div>

          {/* Middle Name (optional) */}
          <div>
            <label htmlFor="middleName" className="block text-sm mb-2 text-[#1a1a1a]">
              Middle Name <span className="text-[#6b7280]">(optional)</span>
            </label>
            <input
              type="text" id="middleName"
              value={middleName} onChange={e => setMiddleName(e.target.value)}
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="Leave blank if none"
            />
          </div>

          {/* Date of Birth + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dob" className="block text-sm mb-2 text-[#1a1a1a]">
                Date of Birth
              </label>
              <input
                type="date" id="dob" required
                value={dob} onChange={e => setDob(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              />
              <p className="text-xs text-[#6b7280] mt-1">As registered with your bank</p>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm mb-2 text-[#1a1a1a]">
                Gender
              </label>
              <select
                id="gender" required
                value={gender} onChange={e => setGender(e.target.value)}
                className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm mb-2 text-[#1a1a1a]">
              Home Address
            </label>
            <input
              type="text" id="address" required
              value={address} onChange={e => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="123 Lagos Street, Lagos"
            />
          </div>

          {/* GTBank Settlement Account */}
          <div>
            <label htmlFor="beneficiaryAccount" className="block text-sm mb-2 text-[#1a1a1a]">
              GTBank Account Number
            </label>
            <input
              type="text" id="beneficiaryAccount" required
              value={beneficiaryAccount}
              onChange={e => setBeneficiaryAccount(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
              pattern="\d{10}"
              title="Must be exactly 10 digits"
              className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
              placeholder="0123456789"
            />
            <p className="text-xs text-[#6b7280] mt-1">
              Squad will settle payments into this account
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 py-3">
            <div className="w-8 h-8 bg-[#1F5F5B] rounded flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-[#6b7280]">Powered by Squad</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-60 text-white py-3.5 rounded-lg transition-colors"
          >
            {loading ? 'Verifying with Squad…' : 'Verify and Create Wallet'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#6b7280]">
          <p>Your information is encrypted and never shared without your permission</p>
        </div>
      </div>
    </div>
  );
}
