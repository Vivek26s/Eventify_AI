import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingDown, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EventData } from '../types';
import { api } from '../services/api';

interface BudgetOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
}

export const BudgetOptimizerModal: React.FC<BudgetOptimizerModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [data, setData] = useState<{
    summary: string;
    healthScore: number;
    savingsIdentified: number;
    recommendations: Array<{ category: string; tip: string; potentialSavings: string; priority: 'High' | 'Medium' | 'Low' }>;
    negotiationTips: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchOptimization();
    }
  }, [isOpen, event.id]);

  const fetchOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.optimizeBudget(event.id);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Unable to optimize budget at this moment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Smart Budget Optimizer</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                  Gemini AI
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Strategic financial rebalancing & cost containment for {event.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin mb-4" />
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Auditing expense categories & negotiating margins...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Comparing against industry market averages for {event.location}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-xs mt-0.5">{error}</p>
                <button
                  onClick={fetchOptimization}
                  className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400 underline"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          )}

          {data && !loading && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                      Budget Health Score
                    </span>
                    <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-purple-900 dark:text-purple-100">
                      {data.healthScore}
                    </span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">/ 100</span>
                  </div>
                  <div className="w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${data.healthScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      Identified Potential Savings
                    </span>
                    <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-100">
                    {event.currency} {data.savingsIdentified.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2">
                    Without cutting down on guest hospitality or aesthetics
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white mr-1">AI Financial Assessment:</span>
                {data.summary}
              </div>

              {/* Actionable Recommendations */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                  Strategic Cost Trimming Moves
                </h4>
                <div className="space-y-3">
                  {data.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                          {rec.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            Save {rec.potentialSavings}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              rec.priority === 'High'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {rec.priority} Priority
                          </span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rec.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negotiation Playbook */}
              {data.negotiationTips && data.negotiationTips.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20 border border-pink-200 dark:border-pink-900/40">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span>Vendor Negotiation Playbook</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {data.negotiationTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-1" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 transition"
          >
            Close Optimizer
          </button>
        </div>
      </div>
    </div>
  );
};
