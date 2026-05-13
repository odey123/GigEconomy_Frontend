import { useState } from 'react';
import { ChevronLeft, Info, Wrench, Shield } from 'lucide-react';
import { Link } from 'react-router';

export default function PostGigTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [skillLevel, setSkillLevel] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Form Section */}
        <div className="px-4 py-8 lg:overflow-y-auto">
          <div className="max-w-xl mx-auto">
            {/* Back Button */}
            <Link to="/post-gig" className="inline-flex items-center gap-2 text-[#6b7280] hover:text-[#1a1a1a] mb-8">
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl mb-2 text-[#1a1a1a]">Task Gig</h1>
              <p className="text-[#6b7280]">Post a one-off skilled task with escrow protection</p>
            </div>

            <form className="space-y-6">
              {/* Task Title */}
              <div>
                <label htmlFor="title" className="block text-sm mb-2 text-[#1a1a1a]">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  placeholder="e.g., Sew 10 Ankara Dresses"
                  required
                />
              </div>

              {/* Task Description */}
              <div>
                <label htmlFor="description" className="block text-sm mb-2 text-[#1a1a1a]">
                  Task Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent resize-none"
                  placeholder="Describe the task in detail: what needs to be done, quality requirements, specifications..."
                  required
                />
              </div>

              {/* Fixed Price */}
              <div>
                <label htmlFor="price" className="block text-sm mb-2 text-[#1a1a1a]">
                  Fixed Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">₦</span>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex items-start gap-2 mt-2 p-3 bg-[#1F5F5B]/5 border border-[#1F5F5B]/20 rounded-lg">
                  <Shield className="w-4 h-4 text-[#1F5F5B] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#1F5F5B]">
                    This amount will be held in Squad escrow until you approve the completed work
                  </p>
                </div>
              </div>

              {/* Skill Category */}
              <div>
                <label htmlFor="skillCategory" className="block text-sm mb-2 text-[#1a1a1a]">
                  Skill Category
                </label>
                <select
                  id="skillCategory"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="tailoring">Tailoring/Sewing</option>
                  <option value="beauty">Beauty/Hairdressing</option>
                  <option value="photography">Photography</option>
                  <option value="design">Graphic Design</option>
                  <option value="event">Event Planning</option>
                  <option value="cooking">Cooking/Catering</option>
                  <option value="repairs">Repairs/Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Skill Level Required */}
              <div>
                <label className="block text-sm mb-3 text-[#1a1a1a]">
                  Skill Level Required
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Beginner', 'Intermediate', 'Expert', 'Any'].map(level => (
                    <label
                      key={level}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        skillLevel === level
                          ? 'border-[#1F5F5B] bg-[#1F5F5B]/5'
                          : 'border-[#e5e7eb] hover:border-[#1F5F5B]/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="skillLevel"
                        value={level}
                        checked={skillLevel === level}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className="hidden"
                      />
                      <span className={`text-sm ${skillLevel === level ? 'text-[#1F5F5B]' : 'text-[#1a1a1a]'}`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Evidence Required */}
              <div>
                <label className="block text-sm mb-3 text-[#1a1a1a]">
                  Evidence Required
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['None', 'Photos'].map(option => (
                    <label
                      key={option}
                      className="flex items-center gap-2 p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-white"
                    >
                      <input
                        type="radio"
                        name="evidence"
                        className="w-4 h-4 text-[#1F5F5B] focus:ring-2 focus:ring-[#1F5F5B]"
                      />
                      <span className="text-sm text-[#1a1a1a]">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm mb-2 text-[#1a1a1a]">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  required
                />
              </div>

              {/* Pickup/Dropoff Location */}
              <div>
                <label htmlFor="location" className="block text-sm mb-2 text-[#1a1a1a]">
                  Where to pick up materials / drop off finished work
                </label>
                <input
                  type="text"
                  id="location"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5F5B] focus:border-transparent"
                  placeholder="Your address or meeting location"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#1F5F5B] hover:bg-[#1a4f4c] text-white py-3.5 rounded-lg transition-colors"
              >
                Post Gig & Fund Escrow
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="hidden lg:block bg-[#f9fafb] border-l border-[#e5e7eb] p-8">
          <div className="sticky top-8">
            <h3 className="text-sm text-[#6b7280] mb-4">Preview</h3>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#1F5F5B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-6 h-6 text-[#1F5F5B]" />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-[#1F5F5B]/10 text-[#1F5F5B] rounded text-xs mb-2">
                    Task
                  </span>
                  <h3 className="text-lg text-[#1a1a1a] mb-1">
                    {title || 'Task Title'}
                  </h3>
                  <p className="text-sm text-[#6b7280]">Posted just now</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-[#1a1a1a] leading-relaxed">
                  {description || 'Your task description will appear here...'}
                </p>
              </div>

              <div className="space-y-3 py-4 border-y border-[#e5e7eb]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">Fixed price</span>
                  <span className="text-[#1F5F5B]">₦{price || '0.00'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">Skill level</span>
                  <span className="text-[#1a1a1a]">{skillLevel || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">Deadline</span>
                  <span className="text-[#1a1a1a]">Date will appear here</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#f9fafb] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-[#1F5F5B]" />
                  <p className="text-xs text-[#1a1a1a]">Escrow Protected</p>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Payment held safely until work is approved
                </p>
              </div>

              <button className="w-full mt-6 bg-[#1F5F5B] text-white py-3 rounded-lg">
                Apply for This Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
