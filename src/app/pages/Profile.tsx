import { useState } from 'react';
import { User, Home, Briefcase, Wallet, ChevronRight, LogOut, Edit2, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../lib/services/auth';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.role === 'owner';

  const helperProfile = (() => {
    try { return JSON.parse(localStorage.getItem('helper_profile') ?? 'null'); } catch { return null; }
  })();
  const ownerProfile = (() => {
    try { return JSON.parse(localStorage.getItem('owner_profile') ?? 'null'); } catch { return null; }
  })();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await authService.updateMe({ firstName, lastName });
      if (user) setUser({ ...user, firstName, lastName });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl text-[#1a1a1a]">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Avatar + name */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#1F5F5B]/10 rounded-full flex items-center justify-center text-2xl text-[#1F5F5B] flex-shrink-0">
              {user?.firstName?.[0] ?? <User className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <p className="text-lg text-[#1a1a1a]">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-[#6b7280]">{user?.email}</p>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs ${
                isOwner ? 'bg-[#F4B942]/10 text-[#b5851f]' : 'bg-[#1F5F5B]/10 text-[#1F5F5B]'
              }`}>
                {isOwner ? 'Business Owner' : 'Helper / Worker'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
              aria-label="Edit profile"
            >
              <Edit2 className="w-4 h-4 text-[#6b7280]" />
            </button>
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
              <CheckCircle className="w-4 h-4" />
              Profile updated successfully
            </div>
          )}

          {editing && (
            <form onSubmit={handleSave} className="space-y-3 border-t border-[#f3f4f6] pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-xs text-[#6b7280] mb-1.5">First Name</label>
                  <input
                    id="firstName" type="text" required
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B]"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs text-[#6b7280] mb-1.5">Last Name</label>
                  <input
                    id="lastName" type="text" required
                    value={lastName} onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B]"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 border border-[#e5e7eb] text-[#6b7280] rounded-lg text-sm hover:bg-[#f9fafb] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-60 text-white rounded-lg text-sm transition-colors">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Complete / update profile setup */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
          <Link
            to={isOwner ? '/profile-setup/owner' : '/profile-setup/helper'}
            className="flex items-center justify-between px-5 py-4 hover:bg-[#f9fafb] transition-colors"
          >
            <div>
              <p className="text-sm text-[#1a1a1a]">
                {isOwner ? 'Business profile setup' : 'Worker profile setup'}
              </p>
              <p className="text-xs text-[#6b7280]">Update your skills, availability and details</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#d1d5db]" />
          </Link>
        </div>

        {/* Account info */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl divide-y divide-[#f3f4f6]">
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-[#6b7280]">Email</p>
            <p className="text-sm text-[#1a1a1a]">{user?.email}</p>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-[#6b7280]">Phone</p>
            <p className="text-sm text-[#1a1a1a]">{user?.phone ?? '—'}</p>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-[#6b7280]">Account type</p>
            <p className="text-sm text-[#1a1a1a]">{isOwner ? 'Business Owner' : 'Helper'}</p>
          </div>
        </div>

        {/* Helper profile summary */}
        {!isOwner && helperProfile && (
          <div className="bg-white border border-[#e5e7eb] rounded-xl divide-y divide-[#f3f4f6]">
            <div className="px-5 py-4">
              <p className="text-sm text-[#6b7280] mb-1">Open to</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {(helperProfile.openTo ?? []).map((t: string) => (
                  <span key={t} className="px-3 py-1 bg-[#1F5F5B]/10 text-[#1F5F5B] text-xs rounded-full">
                    {t === 'sales' ? 'Sales gigs' : 'Task gigs'}
                  </span>
                ))}
              </div>
            </div>
            {helperProfile.skills?.length > 0 && (
              <div className="px-5 py-4">
                <p className="text-sm text-[#6b7280] mb-2">Skills</p>
                <div className="flex gap-2 flex-wrap">
                  {helperProfile.skills.map((s: string) => (
                    <span key={s} className="px-3 py-1 bg-[#f9fafb] border border-[#e5e7eb] text-sm rounded-full text-[#1a1a1a]">
                      {s}
                      {helperProfile.skillLevels?.[s] && (
                        <span className="text-[#6b7280] ml-1">· {helperProfile.skillLevels[s]}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Owner profile summary */}
        {isOwner && ownerProfile && (
          <div className="bg-white border border-[#e5e7eb] rounded-xl divide-y divide-[#f3f4f6]">
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-sm text-[#6b7280]">Business name</p>
              <p className="text-sm text-[#1a1a1a]">{ownerProfile.businessName}</p>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-sm text-[#6b7280]">Business type</p>
              <p className="text-sm text-[#1a1a1a]">{ownerProfile.businessType}</p>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-sm text-[#6b7280]">Location</p>
              <p className="text-sm text-[#1a1a1a]">{ownerProfile.location}</p>
            </div>
            {ownerProfile.description && (
              <div className="px-5 py-4">
                <p className="text-sm text-[#6b7280] mb-1">Description</p>
                <p className="text-sm text-[#1a1a1a]">{ownerProfile.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e7eb] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button type="button"
            onClick={() => navigate(isOwner ? '/dashboard' : '/helper-dashboard')}
            className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button type="button" onClick={() => navigate('/contracts')}
            className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Briefcase className="w-6 h-6" />
            <span className="text-xs">Contracts</span>
          </button>
          <button type="button" onClick={() => navigate('/wallet')}
            className="flex flex-col items-center gap-1 text-[#6b7280]">
            <Wallet className="w-6 h-6" />
            <span className="text-xs">Wallet</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1 text-[#1F5F5B]">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
