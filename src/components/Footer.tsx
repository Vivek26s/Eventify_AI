import React from 'react';
import { Sparkles, Heart, Shield, Cpu, Zap, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Eventify AI
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The intelligent event planning platform that uses Gemini AI to turn dreams into seamless, perfectly budgeted celebrations.
            </p>
           {/* <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PromptWars Virtual Challenge 05 Winner Architecture</span>
            </div> */}
          </div>

          {/* Celebration Types */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Celebration Types
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/create-event" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Royal Weddings</Link></li>
              <li><Link to="/create-event" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Milestone Birthdays</Link></li>
              <li><Link to="/create-event" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Anniversary Galas</Link></li>
              <li><Link to="/create-event" className="hover:text-purple-600 dark:hover:text-purple-400 transition">College Festivals</Link></li>
              <li><Link to="/create-event" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Corporate Summits</Link></li>
              <li><Link to="/create-event" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Community Carnivals</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              AI Engines
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-500" /> <span>Gemini Event Blueprint</span></li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-pink-500" /> <span>Smart Budget Optimizer</span></li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> <span>AI Invitation Writer</span></li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500" /> <span>Zero Over-Budget Guarantee</span></li>
              <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500" /> <span>Interactive AI Concierge</span></li>
            </ul>
          </div>

          {/* Contact / Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Pan-India & Global Currency Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>support@eventify.ai</span>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                Built with React, Express, MongoDB Mongoose, and Google Gemini API.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Eventify AI. All rights reserved. Crafted for memorable milestones.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Google Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
