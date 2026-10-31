import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, MessageCircle, FileText, Smartphone, Mail, RefreshCw } from 'lucide-react';
import { EventData } from '../types';
import { api } from '../services/api';

interface InvitationWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
}

export const InvitationWriterModal: React.FC<InvitationWriterModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [tone, setTone] = useState<'elegant' | 'casual' | 'rhyme' | 'royal' | 'corporate'>('royal');
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'formal' | 'sms'>('whatsapp');
  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState<{
    whatsappText: string;
    formalText: string;
    smsText: string;
    subjectLine: string;
  } | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleGenerate(tone);
    }
  }, [isOpen]);

  const handleGenerate = async (selectedTone: 'elegant' | 'casual' | 'rhyme' | 'royal' | 'corporate') => {
    setLoading(true);
    setTone(selectedTone);
    try {
      const res = await api.generateInvitation(event.id, selectedTone);
      setInvitation(res);
    } catch (err) {
      console.error('Failed to generate invitation:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Invitation Copywriter</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Gemini Flash
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Craft compelling invitation copy for WhatsApp, formal cards & messages
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

        {/* Tone Selector */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Tone:
          </span>
          {[
            { id: 'royal', label: '👑 Royal & Grand' },
            { id: 'elegant', label: '✨ Modern & Elegant' },
            { id: 'rhyme', label: '🎶 Poetic / Rhyme' },
            { id: 'casual', label: '🎉 Casual & Warm' },
            { id: 'corporate', label: '💼 Executive' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleGenerate(t.id as any)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                tone === t.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Format Selector Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 gap-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'whatsapp'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>WhatsApp Ready</span>
          </button>

          <button
            onClick={() => setActiveTab('formal')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'formal'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-500" />
            <span>Printed Card / Email</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'sms'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4 text-pink-500" />
            <span>Concise SMS</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Writing heartfelt {tone} invitations...
              </p>
            </div>
          ) : invitation ? (
            <div className="space-y-4">
              {/* Subject line */}
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-purple-900 dark:text-purple-200">
                  <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold">Subject:</span>
                  <span className="truncate">{invitation.subjectLine}</span>
                </div>
                <button
                  onClick={() => copyText(invitation.subjectLine, 'subject')}
                  className="p-1 rounded-md text-purple-700 hover:bg-purple-200/50 dark:hover:bg-purple-900 transition"
                  title="Copy subject"
                >
                  {copiedFormat === 'subject' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Main text area */}
              <div className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80">
                <button
                  onClick={() => {
                    const text =
                      activeTab === 'whatsapp'
                        ? invitation.whatsappText
                        : activeTab === 'formal'
                        ? invitation.formalText
                        : invitation.smsText;
                    copyText(text, activeTab);
                  }}
                  className="absolute top-4 right-4 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 flex items-center gap-1.5 transition"
                >
                  {copiedFormat === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <pre className="font-sans text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 max-h-[300px] overflow-y-auto pr-16">
                  {activeTab === 'whatsapp' && invitation.whatsappText}
                  {activeTab === 'formal' && invitation.formalText}
                  {activeTab === 'sms' && invitation.smsText}
                </pre>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => handleGenerate(tone)}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Generate New Variation</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
