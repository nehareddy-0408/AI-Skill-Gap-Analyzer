import React, { useState } from 'react';
import { Candidate } from '../types/talent';
import {
  Briefcase,
  MapPin,
  GraduationCap,
  Sparkles,
  FileCheck,
  Share2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ScanEye,
  MessageSquare,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface CandidateHeaderProps {
  candidate: Candidate;
  onOpenArtifactScanner: () => void;
  onOpenCopilotWithCandidate: () => void;
  onTriggerGapSynthesis: () => void;
  isSynthesizing?: boolean;
  personaMode?: 'recruiter' | 'hiring_manager' | 'candidate';
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({
  candidate,
  onOpenArtifactScanner,
  onOpenCopilotWithCandidate,
  onTriggerGapSynthesis,
  isSynthesizing = false,
  personaMode = 'hiring_manager',
}) => {
  const [copied, setCopied] = useState(false);

  const totalSkills =
    candidate.matchedCount + candidate.developingCount + candidate.missingCount || 1;
  const matchedPercent = Math.round((candidate.matchedCount / totalSkills) * 100);
  const developingPercent = Math.round((candidate.developingCount / totalSkills) * 100);
  const missingPercent = 100 - (matchedPercent + developingPercent);

  // SVG Circular progress ring calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (candidate.overallMatchScore / 100) * circumference;

  // Plain-English verdict
  const verdict =
    candidate.overallMatchScore >= 90
      ? {
          title: 'Strong Match — Recommend Advancing to Final Panel',
          badge: 'Strong Yes',
          color: 'text-[#065F46] bg-[#ECFDF5] border-[#A7F3D0]',
          dot: 'bg-[#10B981]',
          tip: 'Exceeds benchmark in 11+ critical competencies with verified production proof.',
        }
      : candidate.overallMatchScore >= 80
      ? {
          title: 'Promising Match — Focus Interview on Identified Deltas',
          badge: 'Proceed with Probing',
          color: 'text-[#1E40AF] bg-[#EFF6FF] border-[#BFDBFE]',
          dot: 'bg-[#3B82F6]',
          tip: 'Solid foundation; verify specific gaps in live system design interview.',
        }
      : {
          title: 'Developing Fit — Requires 60-Day Upskilling Plan',
          badge: 'Evaluate Growth Bar',
          color: 'text-[#92400E] bg-[#FFFBEB] border-[#FDE68A]',
          dot: 'bg-[#F59E0B]',
          tip: 'Candidate has potential but lacks required senior-level operational depth.',
        };

  // 1-Click Copy Summary for Slack or Email
  const handleCopySummary = () => {
    const summaryText = `📋 *Syntropic Precision Candidate Briefing*
Candidate: ${candidate.name}
Target Role: ${candidate.targetRole}
Current: ${candidate.currentTitle} (${candidate.currentCompany})
Overall Match Score: ${candidate.overallMatchScore}% (${verdict.badge})
Breakdown: ${candidate.matchedCount} Matched, ${candidate.developingCount} Developing, ${candidate.missingCount} Missing Skills
Top Strengths:
${candidate.keyStrengths.map((s) => `• ${s}`).join('\n')}
Executive Summary: ${candidate.summary}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(11,19,43,0.04)] p-6 mb-6">
      {/* Friendly Plain-English Verdict Strip */}
      <div className={`mb-5 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${verdict.color}`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${verdict.dot}`} />
          <div>
            <span className="text-[13px] font-bold tracking-tight">
              {verdict.title}
            </span>
            <span className="text-[12px] opacity-80 block md:inline md:ml-2">
              • {verdict.tip}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#0B132B] hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[12px] font-semibold transition shadow-xs"
          title="Copy formatted briefing to paste into Slack or Email"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[#10B981]">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Copy Briefing (Slack/Email)</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Avatar & Bio */}
        <div className="flex items-start gap-5">
          <div className="relative">
            <img
              src={candidate.avatarUrl}
              alt={candidate.name}
              className="w-20 h-20 rounded-xl object-cover border-2 border-[#E2E8F0] shadow-sm"
            />
            <div
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1"
              style={{
                background:
                  candidate.overallMatchScore >= 90
                    ? '#10B981'
                    : candidate.overallMatchScore >= 80
                    ? '#4F46E5'
                    : '#F59E0B',
              }}
            >
              <span>{candidate.overallMatchScore}%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#0B132B] leading-tight">
                {candidate.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.04em] bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]">
                Target: {candidate.targetRole}
              </span>
              <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F3F9] px-2 py-0.5 rounded-md">
                {candidate.experienceYears} Years Exp
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[13px] text-[#64748B]">
              <span className="flex items-center gap-1.5 text-[#334155] font-medium">
                <Briefcase className="w-3.5 h-3.5 text-[#4F46E5]" />
                {candidate.currentTitle} • {candidate.currentCompany}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#94A3B8]" />
                {candidate.education}
              </span>
            </div>

            <p className="text-[13px] text-[#334155] max-w-2xl leading-relaxed pt-1">
              {candidate.summary}
            </p>
          </div>
        </div>

        {/* Right Side: Circular Gauge & Actions */}
        <div className="flex items-center gap-6 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-[#F1F5F9]">
          {/* Dual-Track Circular Progress Gauge */}
          <div className="flex items-center gap-4 bg-[#FAFAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="syntropicGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
                {/* Underlay Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#F1F5F9"
                  strokeWidth="7"
                  fill="transparent"
                />
                {/* Dynamic Progress Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="url(#syntropicGaugeGrad)"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              {/* Centered Tabular Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[20px] font-bold tracking-tight text-[#0B132B] font-tabular">
                  {candidate.overallMatchScore}%
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Overall Fit
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-[11px] pr-2">
              <span className="font-semibold text-[#0B132B] uppercase tracking-wider text-[10px] flex items-center gap-1">
                Skill Status
              </span>
              <div className="flex items-center gap-1.5 text-[#065F46]">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="font-medium">{candidate.matchedCount} Ready (Matched)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#92400E]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="font-medium">{candidate.developingCount} Can Learn (Developing)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#991B1B]">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="font-medium">{candidate.missingCount} Missing (Gap)</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={onTriggerGapSynthesis}
              disabled={isSynthesizing}
              className="flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition shadow-sm hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
              title="Generate a full AI synthesis of strengths & interview test areas"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isSynthesizing ? 'Synthesizing...' : '1-Click AI Synthesis'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenArtifactScanner}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#0B132B] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] rounded-lg transition"
                title="Scan resume or architecture image to extract skills"
              >
                <ScanEye className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Scan Resume</span>
              </button>

              <button
                onClick={onOpenCopilotWithCandidate}
                className="flex items-center justify-center p-2 text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] rounded-lg transition"
                title="Open Copilot to ask questions about this candidate"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Segmented Status Bar */}
      <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
        <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748B] uppercase tracking-wider font-semibold">
              Skill Readiness Breakdown
            </span>
            <span className="text-[10px] text-[#94A3B8]">
              (Hover segments to inspect)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#065F46] font-tabular flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {matchedPercent}% Ready (Day 1)
            </span>
            <span className="text-[#92400E] font-tabular flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              {developingPercent}% In-Progress
            </span>
            <span className="text-[#991B1B] font-tabular flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              {missingPercent}% Needs Interview Test
            </span>
          </div>
        </div>

        {/* 8px height segmented bar with 9999px rounding */}
        <div className="h-2.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden flex border border-[#E2E8F0]">
          <div
            style={{ width: `${matchedPercent}%` }}
            className="bg-[#10B981] h-full transition-all duration-500 hover:brightness-110"
            title={`${matchedPercent}% Matched / Ready for Day 1`}
          />
          <div
            style={{ width: `${developingPercent}%` }}
            className="bg-[#F59E0B] h-full transition-all duration-500 hover:brightness-110"
            title={`${developingPercent}% Developing / Growth Area`}
          />
          <div
            style={{ width: `${missingPercent}%` }}
            className="bg-[#EF4444] h-full transition-all duration-500 hover:brightness-110"
            title={`${missingPercent}% Missing / Critical Gap to Probe`}
          />
        </div>
      </div>
    </div>
  );
};
