import { useState } from 'react';
import { Upload, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { profileService } from '../../lib/services/profile';

export default function ProfileSetupOwner() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280]">Step 2 of 3</span>
            <span className="text-sm text-[#1F5F5B]">67%</span>
          </div>
          <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
            <div className="h-full bg-[#1F5F5B] rounded-full w-2/3" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2 text-[#1a1a1a]">Tell us about your business</h1>
          <p className="text-[#6b7280]">This helps workers understand what you do</p>
        </div>

        <form className="space-y-8" onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          try {
            await profileService.createOwnerProfile({
              businessName, businessType,
              location: `${address}, ${area}`,
              description,
            });
            localStorage.setItem('owner_profile', JSON.stringify({
              businessName, businessType, description,
              location: `${address}, ${area}`,
            }));
            navigate('/dashboard');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save profile. Please try again.');
            setLoading(false);
          }
        }}>
          {/* Section 1: Business Info */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <h2 className="text-lg mb-5 text-[#1a1a1a]">Business Information</h2>

            <div className="space-y-5">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm mb-2 text-[#1a1a1a]">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  placeholder="e.g., Adaeze's Fashion House"
                  required
                />
              </div>

              {/* Business Type */}
              <div>
                <label htmlFor="businessType" className="block text-sm mb-2 text-[#1a1a1a]">
                  Business Type
                </label>
                <select
                  id="businessType"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="food">Food/Drinks</option>
                  <option value="fashion">Fashion/Tailoring</option>
                  <option value="beauty">Beauty</option>
                  <option value="crafts">Crafts</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm mb-2 text-[#1a1a1a]">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent resize-none"
                  placeholder="Tell us what you do and what makes your business special"
                  required
                />
                <p className="text-xs text-[#6b7280] mt-1">Help workers understand your business</p>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <h2 className="text-lg mb-5 text-[#1a1a1a]">Location</h2>

            <div className="space-y-5">
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm mb-2 text-[#1a1a1a]">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                  <input
                    type="text"
                    id="address"
                    className="w-full pl-11 pr-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                    placeholder="Enter your business address"
                    required
                  />
                </div>
              </div>

              {/* Map Preview Placeholder */}
              <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-[#6b7280]">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Map preview will appear here</p>
                </div>
              </div>

              {/* Area/LGA */}
              <div>
                <label htmlFor="area" className="block text-sm mb-2 text-[#1a1a1a]">
                  Area / LGA
                </label>
                <select
                  id="area"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  required
                >
                  <option value="">Select your area</option>
                  <option value="ikeja">Ikeja</option>
                  <option value="lekki">Lekki</option>
                  <option value="victoria-island">Victoria Island</option>
                  <option value="surulere">Surulere</option>
                  <option value="yaba">Yaba</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Profile Photo */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
            <h2 className="text-lg mb-2 text-[#1a1a1a]">Profile Photo</h2>
            <p className="text-sm text-[#6b7280] mb-5">Optional, but helps build trust</p>

            <div className="flex items-center gap-6">
              {/* Preview */}
              <div className="w-24 h-24 bg-[#f9fafb] border border-[#e5e7eb] rounded-full overflow-hidden flex items-center justify-center">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-[#6b7280]" />
                )}
              </div>

              {/* Upload Button */}
              <div>
                <label
                  htmlFor="photo"
                  className="inline-block px-6 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] text-[#1a1a1a] rounded-lg cursor-pointer hover:bg-[#f3f4f6] transition-colors"
                >
                  Choose Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-[#6b7280] mt-2">JPG or PNG, max 2MB</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] disabled:opacity-60 text-white py-3.5 rounded-lg transition-colors"
          >
            {loading ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
