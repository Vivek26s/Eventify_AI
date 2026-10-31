import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Wand2,
  Tag,
  FileText,
  AlertCircle,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AIGenerationOverlay } from '../components/LoadingSkeleton';

export const CreateEventPage: React.FC = () => {
  const { isAuthenticated, loginDemo } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Wedding');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [totalBudget, setTotalBudget] = useState<number>(800000);
  const [currency] = useState('INR');
  const [themePreference, setThemePreference] = useState('Royal Heritage & Pastel Florals');
  const [description, setDescription] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themePresets = [
    'Royal Heritage & Pastel Florals',
    'Modern Minimalist Chic',
    'Bohemian Garden & Fairy Lights',
    'Bollywood Retro Glamour',
    'Cyberpunk Neon & Tech Horizon',
    'Classic Black Tie Gala',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a celebration name.');
      return;
    }
    if (!date) {
      setError('Please select an event date.');
      return;
    }
    if (!location.trim()) {
      setError('Please provide a venue or city location.');
      return;
    }
    if (guestCount <= 0) {
      setError('Guest count must be at least 1.');
      return;
    }
    if (totalBudget <= 0) {
      setError('Budget must be greater than zero.');
      return;
    }

    setLoading(true);

    try {
      // Ensure user is signed in, or automatically initialize demo session
      if (!isAuthenticated) {
        await loginDemo();
      }

      const res = await api.createEvent({
        name,
        category: category as any,
        date,
        location,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        currency,
        themePreference,
        description,
        additionalRequirements,
        generatePlanImmediately: true,
      });

      // Navigate to event details
      navigate(`/events/${res.event.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate event plan. Please check your network and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Flash Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Create & Synthesize Event Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Input your parameters and our AI will engineer a comprehensive celebration blueprint with balanced budgets and vendor run sheets.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-8"
      >
        {/* SECTION 1: ESSENTIAL DETAILS */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
            <span>1. Core Event Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Event Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Celebration Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya's 25th Sunset Birthday Bash, or The Mehra Silver Jubilee"
                className="w-full py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Event Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Wedding">Wedding Celebration</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Anniversary">Anniversary Celebration</option>
                <option value="College Fest">College Cultural Fest</option>
                <option value="Corporate">Corporate Summit / Gala</option>
                <option value="Community">Community / Cultural Fest</option>
                <option value="Other">Other Milestone</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Event Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Location & Venue *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. The Leela Palace, Udaipur / Radisson Blu, Bangalore / Community Lawn, Pune"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: GUESTS & BUDGET */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">
            2. Scale & Fiscal Boundaries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Guests */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Expected Guest Headcount *
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  required
                  min="5"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 0))}
                  placeholder="150"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Used to size food portions and seating layouts.</p>
            </div>

            {/* Total Budget */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Total Budget (INR ₹) *
                </label>
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                  ₹{(totalBudget / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <div className="relative">
                <Wallet className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  required
                  min="10000"
                  step="5000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Math.max(1000, parseInt(e.target.value) || 0))}
                  placeholder="800000"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                AI guarantees total allocations will never exceed this cap.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: THEME & CUSTOM PREFERENCES */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">
            3. Aesthetic & Creative Preferences
          </h2>

          <div className="space-y-4">
            {/* Theme Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Select or Customize Theme
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {themePresets.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThemePreference(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      themePreference === t
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={themePreference}
                onChange={(e) => setThemePreference(e.target.value)}
                placeholder="Or type a custom theme description..."
                className="w-full py-2.5 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Event Description & Story
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share the story, mood, or what makes this celebration special..."
                className="w-full py-2.5 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Additional requirements */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Special Dietary & Technical Requirements
              </label>
              <textarea
                rows={2}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="e.g. Pure Jain / vegetarian food counters, 4K drone cinematography, live Dhol artists, sound curfew at 10 PM"
                className="w-full py-2.5 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 shadow-xl shadow-purple-500/25 transition flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-pink-300 group-hover:rotate-12 transition-transform" />
            <span className="text-base sm:text-lg">Generate My Event Plan with AI</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      {/* AI Generation Fullscreen Overlay */}
      <AIGenerationOverlay isOpen={loading} eventName={name || 'Your Celebration'} />
    </div>
  );
};
