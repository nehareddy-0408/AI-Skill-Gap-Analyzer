import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ChevronDown, ChevronUp, ScanEye, TrendingUp, MessageSquare, BookOpen, X } from 'lucide-react';

interface QuickHelpBannerProps {
  onOpenScanner: () => void;
  onOpenCopilot: () => void;
  onOpenMarket: () => void;
}

export const QuickHelpBanner: React.FC<QuickHelpBannerProps> = ({
  onOpenScanner,
  onOpenCopilot,
  onOpenMarket,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="mb-6 rounded-xl border border-[#C7D2FE] bg-gradient-to-r from-[#EEF2FF] via-[#FAFAFC] to-[#F5F3FF] p-4 shadow-xs transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-[#0B132B] flex items-center gap-2">
              How Syntropic Works — Quick Guide for Everyone
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F46E5] bg-white px-2 py-0.5 rounded-full border border-[#C7D2FE]">
                Friendly Guide
              </span>
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Whether you are an HR recruiter, hiring manager, or engineer, here is how to get results in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#4F46E5] hover:text-[#3525CD] px-2.5 py-1 rounded-md hover:bg-white/80 transition"
          >
            <span>{isOpen ? 'Hide Guide' : 'Show Guide'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-[#94A3B8] hover:text-[#0B132B] p-1 rounded-md transition"
            title="Dismiss Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-[#E0E7FF] grid grid-cols-1 md:grid-cols-4 gap-3 animate-in fade-in duration-200">
          <div className="p-3 bg-white/90 rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-2 text-[#0B132B] font-semibold text-[12px]">
              <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Pick Candidate & Role</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-snug">
              Select any candidate on the left to see their match score (e.g. 91% for Elena) against real job requirements.
            </p>
          </div>

          <div className="p-3 bg-white/90 rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-2 text-[#0B132B] font-semibold text-[12px]">
              <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Traffic-Light Skills</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-snug">
              <strong className="text-[#065F46]">Green</strong> = Ready to deliver;{' '}
              <strong className="text-[#92400E]">Yellow</strong> = Needs coaching;{' '}
              <strong className="text-[#991B1B]">Red</strong> = Missing gap to probe in interview.
            </p>
          </div>

          <div className="p-3 bg-white/90 rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-2 text-[#0B132B] font-semibold text-[12px]">
              <span className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Scan Resumes with AI</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-snug">
              Click &quot;Scan Visual Artifact&quot; to upload any resume or chart. Gemini Pro instantly scores verified skills!
            </p>
            <button
              onClick={onOpenScanner}
              className="text-[11px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 pt-1"
            >
              <ScanEye className="w-3 h-3" />
              <span>Try Scanner →</span>
            </button>
          </div>

          <div className="p-3 bg-white/90 rounded-lg border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-2 text-[#0B132B] font-semibold text-[12px]">
              <span className="w-5 h-5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px]">
                4
              </span>
              <span>1-Click AI Copilot</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-snug">
              Get instant interview questions, executive hiring recommendations, or salary comparisons in 1 click.
            </p>
            <button
              onClick={onOpenCopilot}
              className="text-[11px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 pt-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Open Copilot →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
