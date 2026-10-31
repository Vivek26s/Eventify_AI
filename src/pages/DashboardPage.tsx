import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { EventData } from '../types';
import { CardSkeleton } from '../components/LoadingSkeleton';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, loginDemo } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Auto offer demo login or prompt
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getEvents();
      setEvents(res.events || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Passed';
    if (days === 0) return 'Today!';
    return `${days} days left`;
  };

  // Aggregated Stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => new Date(e.date).getTime() >= new Date().getTime()).length;
  const totalBudget = events.reduce((sum, e) => sum + (e.totalBudget || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Sign In to Access Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Log in to view your celebrations, budget allocations, and AI-generated event itineraries.
          </p>
          <div className="space-y-3">
            <button
              onClick={async () => {
                await loginDemo();
                fetchDashboardData();
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Instant 1-Click Demo Login</span>
            </button>
            <Link
              to="/"
              className="block w-full py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
            <span>Welcome back</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {user?.name}'s Event Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your celebrations, monitor budgets, and consult your Gemini AI planner.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/create-event"
            className="py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-500/20 transition flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Celebrations
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalEvents}
            </h3>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
              Across all categories
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Upcoming Events
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {upcomingEvents}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              Actively in planning
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Portfolio Budget
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              ₹{(totalBudget / 100000).toFixed(1)}L
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              ₹{totalBudget.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              AI Optimizations
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Active
            </h3>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Your Celebrations</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {events.length}
            </span>
          </h2>
          {events.length > 0 && (
            <Link
              to="/create-event"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>+ Add another event</span>
            </Link>
          )}
        </div>

        {loading ? (
          <CardSkeleton count={3} />
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Celebrations Created Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Launch your first AI-powered celebration plan with automated budgeting, timelines, vendor checklists, and catering recommendations.
            </p>
            <Link
              to="/create-event"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Event</span>
            </Link>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => {
              const daysLeft = calculateDaysLeft(evt.date);
              const isPassed = daysLeft === 'Passed';

              return (
                <div
                  key={evt.id}
                  onClick={() => navigate(`/events/${evt.id}`)}
                  className="cursor-pointer group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Top Row: Category and Countdown Pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                        {evt.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isPassed
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            : 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{daysLeft}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 mb-2">
                      {evt.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {evt.aiPlan?.eventOverview?.summary || evt.description || 'Custom curated celebration.'}
                    </p>

                    {/* Metadata items */}
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>{new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{evt.guestCount} Guests</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          ₹{evt.totalBudget.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:bg-purple-50/50 dark:group-hover:bg-purple-950/20 transition-colors">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{evt.aiPlan ? 'AI Plan Ready' : 'Generate Blueprint'}</span>
                    </span>
                    <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Master Plan</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
