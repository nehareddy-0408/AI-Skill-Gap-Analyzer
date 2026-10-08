import React, { useState } from 'react';
import { Candidate, RoleBenchmark } from '../types/talent';
import { Search, Filter, Plus, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react';

interface SecondaryPanelProps {
  candidates: Candidate[];
  selectedCandidateId: string;
  onSelectCandidate: (candidateId: string) => void;
  benchmarks: RoleBenchmark[];
  selectedBenchmarkId: string;
  onSelectBenchmark: (benchmarkId: string) => void;
  onOpenNewCandidateModal: () => void;
}

export const SecondaryPanel: React.FC<SecondaryPanelProps> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  benchmarks,
  selectedBenchmarkId,
  onSelectBenchmark,
  onOpenNewCandidateModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'high' | 'moderate'>('all');

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetRole.toLowerCase().includes(searchQuery.toLowerCase());

    if (tierFilter === 'high') return matchesSearch && c.overallMatchScore >= 90;
    if (tierFilter === 'moderate') return matchesSearch && c.overallMatchScore < 90;
    return matchesSearch;
  });

  return (
    <div className="w-[320px] bg-[#F1F3F9] border-r border-[#E2E8F0] flex flex-col h-full shrink-0 select-none">
      {/* Role Benchmark Filter Strip */}
      <div className="p-3.5 border-b border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Active Role Benchmark
          </span>
          <span className="text-[11px] font-medium text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
            {benchmarks.find((b) => b.id === selectedBenchmarkId)?.level || 'L6'}
          </span>
        </div>

        <select
          value={selectedBenchmarkId}
          onChange={(e) => onSelectBenchmark(e.target.value)}
          className="w-full text-[13px] font-medium text-[#0B132B] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition"
        >
          {benchmarks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      {/* Candidate Search & Filter Tools */}
      <div className="p-3.5 space-y-2.5 border-b border-[#E2E8F0] bg-[#FAFAFC]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate or tech..."
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-[#E2E8F0] rounded-lg placeholder-[#94A3B8] text-[#0B132B] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition"
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-2 py-1 rounded font-medium transition ${
                tierFilter === 'all'
                  ? 'bg-[#0B132B] text-white'
                  : 'bg-white text-[#64748B] hover:text-[#0B132B] border border-[#E2E8F0]'
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              onClick={() => setTierFilter('high')}
              className={`px-2 py-1 rounded font-medium transition ${
                tierFilter === 'high'
                  ? 'bg-[#10B981] text-white'
                  : 'bg-white text-[#64748B] hover:text-[#0B132B] border border-[#E2E8F0]'
              }`}
            >
              ≥90%
            </button>
            <button
              onClick={() => setTierFilter('moderate')}
              className={`px-2 py-1 rounded font-medium transition ${
                tierFilter === 'moderate'
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-white text-[#64748B] hover:text-[#0B132B] border border-[#E2E8F0]'
              }`}
            >
              &lt;90%
            </button>
          </div>

          <button
            onClick={onOpenNewCandidateModal}
            className="flex items-center gap-1 text-[#4F46E5] hover:text-[#3525CD] font-semibold text-[11px] py-1 px-1.5 rounded hover:bg-[#EEF2FF] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Candidate Inspection Cards List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredCandidates.map((c) => {
          const isSelected = c.id === selectedCandidateId;

          // Color tier logic
          const scoreColor =
            c.overallMatchScore >= 90
              ? 'text-[#10B981] bg-[#ECFDF5] border-[#A7F3D0]'
              : c.overallMatchScore >= 80
              ? 'text-[#4F46E5] bg-[#EEF2FF] border-[#C7D2FE]'
              : 'text-[#F59E0B] bg-[#FFFBEB] border-[#FDE68A]';

          return (
            <div
              key={c.id}
              onClick={() => onSelectCandidate(c.id)}
              className={`p-3 rounded-lg border transition cursor-pointer relative ${
                isSelected
                  ? 'bg-white border-[#4F46E5] shadow-[0_4px_12px_rgba(79,70,229,0.08)] ring-1 ring-[#4F46E5]/20'
                  : 'bg-white/80 hover:bg-white border-[#E2E8F0] hover:border-[#CBD5E1] shadow-[0_1px_2px_rgba(11,19,43,0.02)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                  />
                  <div className="truncate">
                    <h3 className="text-[13px] font-semibold text-[#0B132B] truncate leading-tight">
                      {c.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {c.currentCompany}
                    </p>
                  </div>
                </div>

                {/* Score Tabular Badge */}
                <div
                  className={`px-2 py-1 rounded-md border text-[12px] font-bold font-tabular shrink-0 ${scoreColor}`}
                >
                  {c.overallMatchScore}%
                </div>
              </div>

              {/* Status Metric Breakdown Bar */}
              <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <span className="flex items-center gap-1 font-medium text-[#065F46]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {c.matchedCount}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#92400E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    {c.developingCount}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-[#991B1B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    {c.missingCount}
                  </span>
                </div>

                <span className="text-[10px] text-[#94A3B8] font-medium">
                  {c.experienceYears}y exp
                </span>
              </div>
            </div>
          );
        })}

        {filteredCandidates.length === 0 && (
          <div className="p-6 text-center text-[#64748B] text-[12px]">
            No candidates matched search criteria.
          </div>
        )}
      </div>

      {/* Sub-Panel Footer Statistics */}
      <div className="p-3 border-t border-[#E2E8F0] bg-white text-[11px] text-[#64748B] flex items-center justify-between font-tabular">
        <span>Evaluated: {candidates.length} Profiles</span>
        <span className="text-[#0B132B] font-semibold">Avg Match: 89.5%</span>
      </div>
    </div>
  );
};
