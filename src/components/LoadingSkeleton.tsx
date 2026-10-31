import React from 'react';
import { Sparkles, Brain, Wand2, Calculator, CheckCircle2 } from 'lucide-react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
          <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const AIGenerationOverlay: React.FC<{
  isOpen: boolean;
  eventName: string;
  currentStep?: string;
}> = ({ isOpen, eventName, currentStep }) => {
  if (!isOpen) return null;

  const steps = [
    { icon: Brain, label: 'Analyzing guest demographics & location vibes...' },
    { icon: Calculator, label: 'Optimizing category budget without exceeding limits...' },
    { icon: Wand2, label: 'Curating themes, decor elements & catering menu...' },
    { icon: Sparkles, label: 'Synthesizing timeline milestones & vendor questionnaires...' },
    { icon: CheckCircle2, label: 'Finalizing your bespoke Eventify AI blueprint...' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-purple-500/30 shadow-2xl text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 animate-spin blur-md opacity-70" />
          <div className="relative w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Gemini AI is Designing Your Celebration
        </h3>
        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-6">
          "{eventName}"
        </p>

        <div className="space-y-3 text-left bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{st.label}</span>
              </div>
            );
          })}
        </div>

        {currentStep && (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
            Current stage: {currentStep}
          </p>
        )}
      </div>
    </div>
  );
};
