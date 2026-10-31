import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import { EventData } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, event }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;
  const shareText = `Check out the celebration plan for "${event.name}" on ${event.date} at ${event.location}! Curated with Eventify AI.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\nPlan link: ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Share Celebration Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Collaborate with family, co-hosts, or vendors
            </p>
          </div>
        </div>

        {/* Event Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-200 dark:border-purple-800/60 mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
            <span>{event.category}</span>
            <span>{event.date}</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1">
            {event.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {event.aiPlan?.eventOverview?.summary || event.description || `Celebration with ${event.guestCount} guests in ${event.location}.`}
          </p>
        </div>

        {/* Share Link Input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Event URL Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 py-2.5 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 select-all"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareWhatsApp}
            className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <a
            href={`mailto:?subject=${encodeURIComponent(`Celebration Plan: ${event.name}`)}&body=${encodeURIComponent(`${shareText}\n\nView complete itinerary and details: ${shareUrl}`)}`}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Send className="w-4 h-4 text-slate-500" />
            <span>Email Plan</span>
          </a>
        </div>
      </div>
    </div>
  );
};
