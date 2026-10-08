import React, { useState, useEffect } from 'react';
import { SkillItem, SkillStatus } from '../types/talent';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SkillInspectionDrawerProps {
  skill: SkillItem | null;
  candidateName: string;
  targetRole: string;
  onClose: () => void;
  onSaveStatus: (skillId: string, status: SkillStatus, newScore: number) => void;
}

export const SkillInspectionDrawer: React.FC<SkillInspectionDrawerProps> = ({
  skill,
  candidateName,
  targetRole,
  onClose,
  onSaveStatus,
}) => {
  if (!skill) return null;

  const [currentStatus, setCurrentStatus] = useState<SkillStatus>(skill.status);
  const [currentScore, setCurrentScore] = useState<number>(skill.proficiencyScore);
  const [loadingAi, setLoadingAi] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<string | null>(null);

  useEffect(() => {
    setCurrentStatus(skill.status);
    setCurrentScore(skill.proficiencyScore);
    setDiagnosticReport(null);
  }, [skill]);

  const handleFetchAiDiagnostic = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/gemini/skill-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          roleTitle: targetRole,
          skillName: skill.name,
          currentStatus,
          currentProficiency: currentScore,
        }),
      });
      const data = await res.json();
      if (data.diagnostic) {
        setDiagnosticReport(data.diagnostic);
      }
    } catch (err) {
      console.error('Failed to evaluate skill:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = () => {
    onSaveStatus(skill.id, currentStatus, currentScore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0B132B]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl h-full flex flex-col z-10 border-l border-[#E2E8F0]">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFAFC]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
              Diagnostic Skill Inspection
            </span>
            <h2 className="text-[18px] font-semibold text-[#0B132B] leading-snug mt-0.5">
              {skill.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B132B] hover:bg-[#F1F3F9] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Role & Dimension Card */}
          <div className="p-4 rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#64748B]">Category Dimension</span>
              <span className="font-semibold text-[#0B132B]">{skill.category}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#64748B]">Role Benchmark Weight</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]">
                {skill.roleWeight}
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#64748B]">Target Minimum</span>
              <span className="font-bold text-[#0B132B] font-tabular">
                {skill.targetBenchmark}% Required
              </span>
            </div>
          </div>

          {/* Calibrate Status & Score */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
              Calibration & Status
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCurrentStatus('matched')}
                className={`py-2 px-3 rounded-lg text-[12px] font-semibold border flex items-center justify-center gap-1.5 transition ${
                  currentStatus === 'matched'
                    ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] ring-2 ring-[#10B981]/20'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                Matched
              </button>
              <button
                type="button"
                onClick={() => setCurrentStatus('developing')}
                className={`py-2 px-3 rounded-lg text-[12px] font-semibold border flex items-center justify-center gap-1.5 transition ${
                  currentStatus === 'developing'
                    ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] ring-2 ring-[#F59E0B]/20'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                Developing
              </button>
              <button
                type="button"
                onClick={() => setCurrentStatus('missing')}
                className={`py-2 px-3 rounded-lg text-[12px] font-semibold border flex items-center justify-center gap-1.5 transition ${
                  currentStatus === 'missing'
                    ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA] ring-2 ring-[#EF4444]/20'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                Missing
              </button>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[12px] font-medium text-[#334155] mb-1">
                <span>Demonstrated Proficiency Score</span>
                <span className="font-bold text-[#0B132B] font-tabular">{currentScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentScore}
                onChange={(e) => setCurrentScore(Number(e.target.value))}
                className="w-full accent-[#4F46E5] cursor-pointer"
              />
            </div>
          </div>

          {/* Verified Signal Citation */}
          <div className="space-y-2">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B]">
              Verified Proof in Record
            </h3>
            <div className="p-3.5 rounded-lg bg-[#FAFAFC] border border-[#E2E8F0] text-[13px] text-[#334155] leading-relaxed">
              {skill.verifiedEvidence}
            </div>
          </div>

          {/* Gap Notes */}
          {skill.identifiedGap && (
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#B45309]">
                Identified Delta / Verification Need
              </h3>
              <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[13px] text-[#92400E] leading-relaxed">
                {skill.identifiedGap}
              </div>
            </div>
          )}

          {/* Live AI Diagnostic Generator */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#0B132B] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                AI Diagnostic & Interview Probing
              </h3>
              <button
                type="button"
                onClick={handleFetchAiDiagnostic}
                disabled={loadingAi}
                className="px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                }}
              >
                {loadingAi ? 'Analyzing...' : 'Generate Probing Loop'}
              </button>
            </div>

            {loadingAi && (
              <div className="p-6 text-center rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] space-y-2">
                <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[12px] text-[#64748B]">
                  Gemini synthesizing interview scenarios and technical test criteria...
                </p>
              </div>
            )}

            {diagnosticReport && !loadingAi && (
              <div className="p-4 rounded-xl bg-[#EEF2FF]/60 border border-[#C7D2FE] text-[13px] text-[#1E1B4B] space-y-3 leading-relaxed whitespace-pre-line font-normal">
                {diagnosticReport}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#FAFAFC] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#334155] hover:text-[#0B132B] bg-white border border-[#E2E8F0] rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            }}
          >
            Save Calibration
          </button>
        </div>
      </div>
    </div>
  );
};
