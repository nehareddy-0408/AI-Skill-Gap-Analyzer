import React, { useState } from 'react';
import { RoleBenchmark } from '../types/talent';
import {
  X,
  Check,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface BenchmarkConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBenchmark: (benchmark: RoleBenchmark) => void;
}

export const BenchmarkConfiguratorModal: React.FC<BenchmarkConfiguratorModalProps> = ({
  isOpen,
  onClose,
  onSaveBenchmark,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('Staff Distributed Systems Engineer');
  const [level, setLevel] = useState('L6 / Staff');
  const [department, setDepartment] = useState('Core Infrastructure');
  const [targetScore, setTargetScore] = useState(88);
  const [openPositions, setOpenPositions] = useState(3);
  const [description, setDescription] = useState(
    'Lead engineering for ultra-low latency distributed storage, consensus algorithms (Raft/Paxos), and multi-region replication protocols.'
  );

  const steps = [
    { num: 1, label: 'Role Archetype' },
    { num: 2, label: 'Competency Weights' },
    { num: 3, label: 'Scoring Thresholds' },
    { num: 4, label: 'Model Synthesis' },
  ];

  const handleFinish = () => {
    onSaveBenchmark({
      id: `bench-${Date.now()}`,
      title,
      level,
      department,
      targetScore,
      openPositions,
      description,
      requiredSkillsCount: 16,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0B132B]/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#0B132B]">
                Calibrate Role Benchmark Archetype
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Configure target skill distributions and evaluation baselines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748B] hover:text-[#0B132B] hover:bg-[#F1F3F9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper with 2px Continuous Baseline Track per Design System */}
        <div className="px-8 py-5 border-b border-[#F1F5F9] bg-white">
          <div className="relative flex items-center justify-between">
            {/* 2px Continuous Baseline Track in #E2E8F0 */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E2E8F0] -translate-y-1/2 z-0" />

            {steps.map((s) => {
              const isCompleted = step > s.num;
              const isActive = step === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#10B981] text-white ring-4 ring-white'
                        : isActive
                        ? 'bg-[#4F46E5] text-white ring-4 ring-white shadow-md'
                        : 'bg-[#F1F3F9] text-[#94A3B8] border border-[#CBD5E1] ring-4 ring-white'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 whitespace-nowrap ${
                      isActive ? 'text-[#0B132B] font-semibold' : 'text-[#64748B]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-step Form Content */}
        <div className="p-6 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                  Archetype Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                    Seniority Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value="L5 / Senior">L5 / Senior Engineer</option>
                    <option value="L6 / Staff">L6 / Staff Engineer</option>
                    <option value="L7 / Principal">L7 / Principal Architect</option>
                    <option value="L8 / Distinguished">L8 / Distinguished Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                    Engineering Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                  Core Mission & Focus
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <span className="text-[12px] text-[#64748B] block">
                Assign relative weight distributions for scoring candidate matrices:
              </span>

              {[
                { name: 'Core Architecture & Systems', weight: 'Critical (40%)', desc: 'Consensus protocols, memory concurrency, low-level I/O' },
                { name: 'Applied AI & ML Performance', weight: 'High (25%)', desc: 'vLLM, kernel optimization, tensor parallelism' },
                { name: 'Cloud Infrastructure & Observability', weight: 'High (20%)', desc: 'eBPF, OpenTelemetry, zero-trust isolation' },
                { name: 'Technical Leadership & Velocity', weight: 'Medium (15%)', desc: 'RFC direction, incident command, mentoring' },
              ].map((dim, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-[13px] font-semibold text-[#0B132B]">
                      {dim.name}
                    </h4>
                    <p className="text-[11px] text-[#64748B]">{dim.desc}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2 py-1 rounded-md border border-[#C7D2FE]">
                    {dim.weight}
                  </span>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="font-semibold text-[#0B132B]">
                    Minimum Overall Match Bar
                  </span>
                  <span className="font-bold text-[#4F46E5] font-tabular">
                    {targetScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="98"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full accent-[#4F46E5] cursor-pointer"
                />
                <span className="text-[11px] text-[#64748B] block">
                  Candidates below this threshold will trigger mandatory technical diagnostic reviews.
                </span>
              </div>

              <div>
                <label className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                  Target Hiring Headcount
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={openPositions}
                  onChange={(e) => setOpenPositions(Number(e.target.value))}
                  className="w-32 h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-6 rounded-xl bg-[#EEF2FF]/60 border border-[#C7D2FE] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#0B132B]">
                Benchmark Archetype Calibrated
              </h3>
              <p className="text-[13px] text-[#334155] max-w-md mx-auto leading-relaxed">
                Ready to activate <strong>{title}</strong> with target match threshold of <strong>{targetScore}%</strong>. All candidate skill deltas will immediately recalculate.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#FAFAFC] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-3.5 py-2 text-[12px] font-medium text-[#64748B] hover:text-[#0B132B] disabled:opacity-30 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="px-4 py-2 text-[12px] font-semibold text-white rounded-lg transition shadow-sm flex items-center gap-1"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2 text-[12px] font-semibold text-white rounded-lg transition shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              }}
            >
              Activate Benchmark
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
