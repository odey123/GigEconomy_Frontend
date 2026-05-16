import { useState } from 'react';
import { ShoppingBag, Wrench, MapPin, MessageCircle, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { profileService } from '../../lib/services/profile';

export default function ProfileSetupHelper() {
  const navigate = useNavigate();
  // Pre-populate from localStorage if user already filled this in
  const saved = (() => { try { return JSON.parse(localStorage.getItem('helper_profile') ?? 'null'); } catch { return null; } })();

  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(
    saved?.openTo?.map((t: string) => t === 'sales' ? 'selling' : 'tasks') ?? []
  );
  const [selectedSkills, setSelectedSkills] = useState<{ [key: string]: string }>(saved?.skillLevels ?? {});
  const [location, setLocation] = useState<string>(saved?.location ?? '');
  const [languages, setLanguages] = useState<string>(saved?.languages ?? '');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(saved?.networks ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleNetwork = (network: string) =>
    setSelectedNetworks(prev =>
      prev.includes(network) ? prev.filter(n => n !== network) : [...prev, network]
    );

  const toggleWorkType = (type: string) => {
    setSelectedWorkTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSkillLevel = (skill: string, level: string) => {
    setSelectedSkills(prev => ({ ...prev, [skill]: level }));
  };

  const skills = [
    'Tailoring/Sewing',
    'Beauty/Hairdressing',
    'Photography',
    'Graphic Design',
    'Event Planning',
    'Cooking/Catering',
    'Repairs/Maintenance',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2 text-[#1a1a1a]">
            What kind of work are you open to?
          </h1>
          <p className="text-[#6b7280]">Select all that apply — you can do both!</p>
        </div>

        <form className="space-y-8" onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          try {
            // UI uses 'selling'/'tasks' — backend expects 'sales'/'task' in openTo
            const openTo = selectedWorkTypes.map(t =>
              t === 'selling' ? 'sales' : 'task'
            ) as ('sales' | 'task')[];
            await profileService.createHelperProfile({
              openTo,
              skills: Object.keys(selectedSkills),
              preferredRadius: 50,
            });
            localStorage.setItem('helper_profile', JSON.stringify({
              openTo,
              skills: Object.keys(selectedSkills),
              skillLevels: selectedSkills,
              location,
              languages,
              networks: selectedNetworks,
            }));
            navigate('/helper-dashboard');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save profile. Please try again.');
            setLoading(false);
          }
        }}>
          {/* Work Type Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Selling Card */}
            <button
              type="button"
              onClick={() => toggleWorkType('selling')}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                selectedWorkTypes.includes('selling')
                  ? 'border-[#1F5F5B] bg-[#1F5F5B]/5'
                  : 'border-[#e5e7eb] hover:border-[#1F5F5B]/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedWorkTypes.includes('selling') ? 'bg-[#1F5F5B]' : 'bg-[#f9fafb]'
                }`}>
                  <ShoppingBag className={`w-6 h-6 ${
                    selectedWorkTypes.includes('selling') ? 'text-white' : 'text-[#6b7280]'
                  }`} />
                </div>
                {selectedWorkTypes.includes('selling') && (
                  <CheckCircle className="w-6 h-6 text-[#1F5F5B]" />
                )}
              </div>
              <h3 className="text-lg mb-2 text-[#1a1a1a]">Selling products on commission</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                Take stock from business owners, sell to your network, and earn commission on every sale
              </p>
            </button>

            {/* Tasks Card */}
            <button
              type="button"
              onClick={() => toggleWorkType('tasks')}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                selectedWorkTypes.includes('tasks')
                  ? 'border-[#1F5F5B] bg-[#1F5F5B]/5'
                  : 'border-[#e5e7eb] hover:border-[#1F5F5B]/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedWorkTypes.includes('tasks') ? 'bg-[#1F5F5B]' : 'bg-[#f9fafb]'
                }`}>
                  <Wrench className={`w-6 h-6 ${
                    selectedWorkTypes.includes('tasks') ? 'text-white' : 'text-[#6b7280]'
                  }`} />
                </div>
                {selectedWorkTypes.includes('tasks') && (
                  <CheckCircle className="w-6 h-6 text-[#1F5F5B]" />
                )}
              </div>
              <h3 className="text-lg mb-2 text-[#1a1a1a]">One-off skilled tasks</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                Use your skills to complete specific jobs like sewing, photography, design, or repairs
              </p>
            </button>
          </div>

          {/* Conditional: Selling Section */}
          {selectedWorkTypes.includes('selling') && (
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-6 space-y-5">
              <h2 className="text-lg text-[#1a1a1a]">About your selling network</h2>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm mb-2 text-[#1a1a1a]">
                  Where are you based?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                    placeholder="e.g., Yaba, Lagos"
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <label htmlFor="languages" className="block text-sm mb-2 text-[#1a1a1a]">
                  Languages you speak
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                  <input
                    type="text"
                    id="languages"
                    value={languages}
                    onChange={e => setLanguages(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                    placeholder="e.g., English, Yoruba, Igbo"
                  />
                </div>
              </div>

              {/* Networks */}
              <div>
                <label className="block text-sm mb-3 text-[#1a1a1a]">
                  Where do you have access to customers?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Hostel', 'Office area', 'Church', 'Market', 'Campus', 'Gym', 'Salon', 'Other'].map(network => (
                    <label key={network} className={`flex items-center gap-2 p-3 bg-white border rounded-lg cursor-pointer transition-colors ${
                      selectedNetworks.includes(network) ? 'border-[#1F5F5B] bg-[#1F5F5B]/5' : 'border-[#e5e7eb] hover:bg-white/80'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedNetworks.includes(network)}
                        onChange={() => toggleNetwork(network)}
                        className="w-4 h-4 rounded border-[#e5e7eb] text-[#1F5F5B] focus:ring-2 focus:ring-[#1F5F5B]"
                      />
                      <span className="text-sm text-[#1a1a1a]">{network}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conditional: Tasks Section */}
          {selectedWorkTypes.includes('tasks') && (
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-6 space-y-5">
              <h2 className="text-lg text-[#1a1a1a]">Your skills</h2>
              <p className="text-sm text-[#6b7280]">Select your skills and rate your experience level</p>

              <div className="space-y-3">
                {skills.map(skill => (
                  <div key={skill} className="bg-white border border-[#e5e7eb] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-[#e5e7eb] text-[#1F5F5B] focus:ring-2 focus:ring-[#1F5F5B]"
                        />
                        <span className="text-sm text-[#1a1a1a]">{skill}</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      {['Beginner', 'Intermediate', 'Expert'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleSkillLevel(skill, level)}
                          className={`flex-1 py-2 px-3 text-xs rounded-md transition-colors ${
                            selectedSkills[skill] === level
                              ? 'bg-[#1F5F5B] text-white'
                              : 'bg-[#f9fafb] text-[#6b7280] hover:bg-[#f3f4f6]'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Section */}
          {selectedWorkTypes.length > 0 && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
              <h2 className="text-lg mb-5 text-[#1a1a1a]">When are you available?</h2>

              <div className="space-y-4">
                {/* Days */}
                <div>
                  <label className="block text-sm mb-3 text-[#1a1a1a]">Days</label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <label key={day} className="flex items-center justify-center p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-[#f3f4f6]">
                        <input type="checkbox" className="hidden peer" />
                        <span className="text-sm text-[#1a1a1a] peer-checked:text-[#1F5F5B]">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Hours */}
                <div>
                  <label className="block text-sm mb-3 text-[#1a1a1a]">Typical hours</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="avail-from" className="text-xs text-[#6b7280] mb-1 block">From</label>
                      <input
                        id="avail-from"
                        type="time"
                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="avail-to" className="text-xs text-[#6b7280] mb-1 block">To</label>
                      <input
                        id="avail-to"
                        type="time"
                        className="w-full px-4 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={selectedWorkTypes.length === 0 || loading}
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:bg-[#d1d5db] disabled:cursor-not-allowed text-white py-3.5 rounded-lg transition-colors"
          >
            {loading ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
