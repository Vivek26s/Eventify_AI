import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Moon, Sun, Plus, LayoutDashboard, LogOut, Calendar, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Eventify AI
              </span>
              {/* <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                PromptWars 05
              </span> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                isCurrent('/')
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    isCurrent('/dashboard')
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/create-event"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    isCurrent('/create-event')
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Create Event</span>
                </Link>
              </>
            ) : (
              <>
                <a
                  href="/#features"
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
                >
                  Features
                </a>
                <a
                  href="/#how-it-works"
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
                >
                  How It Works
                </a>
                <a
                  href="/#categories"
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
                >
                  Categories
                </a>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Dark mode switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/create-event"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-sm shadow-purple-500/20 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Plan Event</span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer flex items-center gap-2 group"
                    title={user?.name}
                  >
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border border-purple-200 dark:border-purple-800 object-cover"
                    />
                    <span className="hidden xl:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                      {user?.name.split(' ')[0]}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    aria-label="Log Out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-500/20 transition"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-event"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Plan New Event
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="w-full py-2 text-center text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="w-full py-2 text-center text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={() => navigate('/dashboard')}
      />
    </>
  );
};
