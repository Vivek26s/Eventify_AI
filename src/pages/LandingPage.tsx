import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Wallet,
  Users,
  Clock,
  CheckCircle2,
  Heart,
  PartyPopper,
  GraduationCap,
  Briefcase,
  Cake,
  Star,
  Shield,
  Zap,
  Sliders,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  // Interactive Live Estimator State
  const [calcCategory, setCalcCategory] = useState('Wedding');
  const [calcGuests, setCalcGuests] = useState(200);
  const [calcBudget, setCalcBudget] = useState(1200000);

  const categories = [
    {
      name: 'Weddings',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      tag: 'Grand & Royal',
      desc: 'Sangeet, Mehendi, Varmala, and reception schedules with curated decor & dining blueprints.',
    },
    {
      name: 'Birthday Parties',
      icon: Cake,
      color: 'from-purple-500 to-indigo-500',
      tag: 'Kids to Milestones',
      desc: 'Themed cakes, entertainer bookings, return gifts, interactive games, and photo booths.',
    },
    {
      name: 'Anniversaries',
      icon: Sparkles,
      color: 'from-amber-500 to-pink-500',
      tag: 'Romantic & Intimate',
      desc: 'Silver & Golden jubilee celebrations, vow renewals, and customized nostalgic slideshows.',
    },
    {
      name: 'College Festivals',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      tag: 'Youth & High Energy',
      desc: 'Hackathons, battle of bands, cultural nights, sponsorship allocation, and celebrity artists.',
    },
    {
      name: 'Corporate Events',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-500',
      tag: 'Polished & Professional',
      desc: 'Annual summits, leadership conferences, tech expos, team retreats, and award galas.',
    },
    {
      name: 'Community Celebrations',
      icon: PartyPopper,
      color: 'from-violet-500 to-purple-500',
      tag: 'Cultural & Festive',
      desc: 'Diwali melas, society carnivals, New Year bashes, and vibrant festive block parties.',
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Gemini AI Master Plan',
      desc: 'Personalized theme inspirations, color palettes, minute-by-minute timelines, and curated catering suggestions.',
    },
    {
      icon: Wallet,
      title: 'Smart Budget Optimizer',
      desc: 'Guaranteed non-exceeding allocations. Real-time cost containment, expense tracking, and vendor negotiation tips.',
    },
    {
      icon: Clock,
      title: 'Visual Preparation Timeline',
      desc: 'Milestones scheduled dynamically based on your event date: from venue lock-in to day-of run sheets.',
    },
    {
      icon: Users,
      title: 'Vendor & Guest Suite',
      desc: 'Track quotes, contact details, payment status, and RSVP attendance headcounts with dietary notes.',
    },
    {
      icon: Zap,
      title: 'AI Invitation Copywriter',
      desc: 'Generate viral WhatsApp invites, elegant print card copy, and concise SMS messages in multiple tones.',
    },
    {
      icon: Shield,
      title: 'Export & Share Anywhere',
      desc: 'Download publication-grade PDF master plans or generate shareable live links for family and co-hosts.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya & Rahul S.',
      role: 'Jaipur Palace Wedding',
      quote:
        'Eventify AI saved us at least ₹1.8 Lakhs on catering and decor! The Gemini-generated timeline kept our 250 guests synchronized across 2 full days.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      stars: 5,
    },
    {
      name: 'Tanmay Kulkarni',
      role: 'Tech Summit Lead Organizer',
      quote:
        'We planned our 400-delegate tech conference in under an hour. The vendor checklist and automated budget distribution were spot on.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      stars: 5,
    },
    {
      name: 'Sunita Mehra',
      role: 'Golden 50th Anniversary Host',
      quote:
        'The AI invitation writer created the most touching poetry for our parents’ invitation card. Everyone commended the unique themes!',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      stars: 5,
    },
  ];

  const handleQuickDemo = async () => {
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin [animation-duration:4s]" />
            <span>PromptWars Challenge 05: Smart Celebration & Event Planner</span>
          </div> */}

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Plan Your Perfect Celebration with{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 dark:from-purple-400 dark:via-pink-400 dark:to-purple-300 bg-clip-text text-transparent">
              Gemini AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn your celebration vision into an actionable master plan. Instant realistic budget allocations, visual timelines, vendor checklists, decor ideas, and food suggestions tailored to your budget.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2 group"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthOpen(true);
                  }}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2 group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleQuickDemo}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-4 h-4 fill-purple-600 dark:fill-purple-400 text-purple-600 dark:text-purple-400" />
                  <span>Launch Live Demo Wedding</span>
                </button>
              </>
            )}
          </div>

          {/* Guarantee Pill */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Over-Budget Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> INR & Multi-Currency Support
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF Master Export
            </span>
          </div>

          {/* INTERACTIVE BUDGET ESTIMATOR PREVIEW CARD */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Interactive AI Calculator
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Preview Your Event Blueprint
                </h3>
              </div>
              <Link
                to="/create-event"
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Full AI Plan Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Event Type
                </label>
                <select
                  value={calcCategory}
                  onChange={(e) => setCalcCategory(e.target.value)}
                  className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Wedding">Royal Wedding</option>
                  <option value="Birthday">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary Gala</option>
                  <option value="College Fest">College Cultural Fest</option>
                  <option value="Corporate">Corporate Summit</option>
                </select>
              </div>

              {/* Guest Count */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Guests:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{calcGuests} People</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={calcGuests}
                  onChange={(e) => setCalcGuests(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Budget */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Target Budget:</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400">
                    ₹{(calcBudget / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={calcBudget}
                  onChange={(e) => setCalcBudget(Number(e.target.value))}
                  className="w-full accent-pink-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Live Distribution Mini-Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                <span>AI Recommended Allocation for ₹{calcBudget.toLocaleString('en-IN')}:</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">100% Balanced</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div className="bg-purple-600 h-full" style={{ width: '35%' }} title="Venue & Stay (35%)" />
                <div className="bg-pink-500 h-full" style={{ width: '28%' }} title="Catering & Food (28%)" />
                <div className="bg-amber-400 h-full" style={{ width: '15%' }} title="Decoration (15%)" />
                <div className="bg-blue-500 h-full" style={{ width: '10%' }} title="Photography (10%)" />
                <div className="bg-emerald-500 h-full" style={{ width: '7%' }} title="Entertainment & Music (7%)" />
                <div className="bg-slate-400 h-full" style={{ width: '5%' }} title="Reserve (5%)" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-3 text-[11px] text-slate-600 dark:text-slate-400">
                <div><span className="inline-block w-2 h-2 rounded-full bg-purple-600 mr-1" />Venue ₹{Math.round(calcBudget * 0.35).toLocaleString('en-IN')}</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-pink-500 mr-1" />Catering ₹{Math.round(calcBudget * 0.28).toLocaleString('en-IN')}</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" />Decor ₹{Math.round(calcBudget * 0.15).toLocaleString('en-IN')}</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />Photo ₹{Math.round(calcBudget * 0.10).toLocaleString('en-IN')}</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />Music ₹{Math.round(calcBudget * 0.07).toLocaleString('en-IN')}</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-slate-400 mr-1" />Buffer ₹{Math.round(calcBudget * 0.05).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT CATEGORIES SECTION */}
      <section id="categories" className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Versatile Celebrations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Curated for Every Milestone
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Whether intimate family gatherings or grand cultural festivals, Eventify AI personalizes every detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {cat.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <Link
                    to="/create-event"
                    className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    <span>Plan a {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPLORE FEATURES SECTION */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
              Next-Gen Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Engineered for Effortless Execution
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Built on Google Gemini 3.8 Flash to transform hours of stressful coordination into minutes of clear delight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-lg transition duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-b from-purple-500/5 via-pink-500/5 to-transparent border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Three Simple Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              How Eventify AI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Share Your Celebration Vision',
                desc: 'Enter your date, venue location, expected guest count, and maximum budget in INR.',
              },
              {
                step: '02',
                title: 'Gemini AI Synthesizes Blueprint',
                desc: 'Our engine generates a personalized timeline, theme boards, zero-overbudget breakdown, and vendor questions.',
              },
              {
                step: '03',
                title: 'Execute, Track & Celebrate',
                desc: 'Manage vendors, RSVPs, export printable PDF agendas, optimize expenses, and ask the AI copilot anytime.',
              },
            ].map((st, i) => (
              <div
                key={i}
                className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="text-4xl font-black text-purple-200 dark:text-purple-950 mb-3">
                  {st.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Real Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Loved by Event Hosts & Organizers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-purple-200 dark:border-purple-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Design an Unforgettable Celebration?
          </h2>
          <p className="text-purple-100 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Generate your complete AI-backed event blueprint in less than 30 seconds.
          </p>
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/create-event');
              } else {
                setAuthMode('register');
                setIsAuthOpen(true);
              }
            }}
            className="py-3.5 px-8 rounded-2xl bg-white text-purple-700 hover:bg-purple-50 text-sm font-bold shadow-xl transition inline-flex items-center gap-2"
          >
            <span>Start Planning Your Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
};
