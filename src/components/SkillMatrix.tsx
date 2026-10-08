import React, { useState } from 'react';
import { SkillItem, SkillStatus } from '../types/talent';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Filter,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  ListFilter,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface SkillMatrixProps {
  skills: SkillItem[];
  candidateName: string;
  targetRole: string;
  onInspectSkill: (skill: SkillItem) => void;
  onUpdateSkillStatus: (skillId: string, newStatus: SkillStatus) => void;
}

export const SkillMatrix: React.FC<SkillMatrixProps> = ({
  skills,
  candidateName,
  targetRole,
  onInspectSkill,
  onUpdateSkillStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  const categories = [
    'All',
    'Core Architecture',
    'Applied AI & ML',
    'Cloud & Systems',
    'Leadership & Velocity',
  ];

  const filteredSkills = skills.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verifiedEvidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.identifiedGap && item.identifiedGap.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(11,19,43,0.04)] overflow-hidden">
      {/* Matrix Controls & Category Tabs */}
      <div className="p-4 border-b border-[#F1F5F9] bg-[#FAFAFC] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#0B132B] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B132B] hover:bg-[#F1F3F9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filters, View Mode & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F1F3F9] p-0.5 rounded-lg border border-[#E2E8F0] text-[11px] font-medium">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md transition ${
                viewMode === 'table'
                  ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B132B]'
              }`}
              title="Full Table View"
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-md transition ${
                viewMode === 'cards'
                  ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B132B]'
              }`}
              title="Easy Cards View"
            >
              Visual Cards
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills or proof..."
              className="h-8 pl-8 pr-2.5 text-[12px] bg-white border border-[#E2E8F0] rounded-md text-[#0B132B] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] w-44"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 text-[12px] font-medium bg-white border border-[#E2E8F0] rounded-md text-[#334155] focus:outline-none focus:border-[#4F46E5]"
          >
            <option value="all">All Statuses ({skills.length})</option>
            <option value="matched">Ready for Day 1 (Green)</option>
            <option value="developing">Can Learn on Job (Yellow)</option>
            <option value="missing">Needs Interview Test (Red)</option>
          </select>
        </div>
      </div>

      {/* Helpful Hint Bar */}
      <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#F1F5F9] text-[11px] text-[#64748B] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>
            Click <strong className="text-[#0B132B]">&quot;Inspect Delta&quot;</strong> on any skill to get tailored interview questions and a 30-day learning plan.
          </span>
        </div>
        <span className="font-tabular text-[#0B132B] font-medium">
          Showing {filteredSkills.length} competencies
        </span>
      </div>

      {/* 1. Visual Cards View (Friendly for everyone) */}
      {viewMode === 'cards' ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSkills.map((skill) => {
            const isMatched = skill.status === 'matched';
            const isDeveloping = skill.status === 'developing';

            return (
              <div
                key={skill.id}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] shadow-xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        isMatched
                          ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                          : isDeveloping
                          ? 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                          : 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isMatched
                            ? 'bg-[#10B981]'
                            : isDeveloping
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#EF4444]'
                        }`}
                      />
                      {isMatched
                        ? 'Ready (Matched)'
                        : isDeveloping
                        ? 'Can Learn (Developing)'
                        : 'Gap to Test'}
                    </span>

                    <span className="text-[11px] font-bold text-[#0B132B] font-tabular">
                      {skill.proficiencyScore}%
                    </span>
                  </div>

                  <h4 className="text-[14px] font-semibold text-[#0B132B] leading-snug">
                    {skill.name}
                  </h4>
                  <span className="text-[11px] text-[#64748B] block mt-0.5 mb-2.5">
                    {skill.category} • Weight: {skill.roleWeight}
                  </span>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 mb-3 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${skill.proficiencyScore}%`,
                        background: isMatched
                          ? '#10B981'
                          : isDeveloping
                          ? '#F59E0B'
                          : '#EF4444',
                      }}
                    />
                  </div>

                  <div className="space-y-1.5 text-[12px] text-[#334155] bg-[#FAFAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                    <div>
                      <strong className="text-[#0B132B] text-[11px] block">
                        Verified Proof:
                      </strong>
                      <p className="line-clamp-2 text-[#475569]">{skill.verifiedEvidence}</p>
                    </div>

                    {skill.identifiedGap && (
                      <div className="pt-1 border-t border-[#F1F5F9]">
                        <strong className="text-[#B45309] text-[11px] block">
                          What to probe:
                        </strong>
                        <p className="line-clamp-2 text-[#92400E]">{skill.identifiedGap}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-[10px] text-[#94A3B8]">
                    Target: {skill.targetBenchmark}%
                  </span>
                  <button
                    onClick={() => onInspectSkill(skill)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4F46E5] hover:text-[#3525CD]"
                  >
                    <span>Interview Questions & Plan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. High-Density Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                <th className="py-3 px-4">Skill & Dimension</th>
                <th className="py-3 px-3">Readiness Status</th>
                <th className="py-3 px-3">Proficiency vs Target</th>
                <th className="py-3 px-3">Importance</th>
                <th className="py-3 px-4">Verified Proof / What to Check</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[13px]">
              {filteredSkills.map((skill) => {
                const isMatched = skill.status === 'matched';
                const isDeveloping = skill.status === 'developing';

                return (
                  <tr
                    key={skill.id}
                    className="hover:bg-[#FAFAFC] transition-colors group"
                  >
                    {/* Skill Name & Category */}
                    <td className="py-3.5 px-4 font-medium text-[#0B132B]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0B132B] group-hover:text-[#4F46E5] transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-[11px] text-[#64748B] font-normal mt-0.5">
                          {skill.category}
                        </span>
                      </div>
                    </td>

                    {/* Status Chip with Plain-English labels */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {isMatched && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                          title="Ready to execute on Day 1 without training"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          Ready (Day 1)
                        </span>
                      )}
                      {isDeveloping && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                          title="Can learn and ramp up on the job"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                          Can Learn
                        </span>
                      )}
                      {!isMatched && !isDeveloping && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
                          title="Critical gap to test during the interview"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                          Test in Interview
                        </span>
                      )}
                    </td>

                    {/* Proficiency Score vs Target */}
                    <td className="py-3.5 px-3 font-tabular">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${skill.proficiencyScore}%`,
                              background: isMatched
                                ? '#10B981'
                                : isDeveloping
                                ? '#F59E0B'
                                : '#EF4444',
                            }}
                          />
                        </div>
                        <span className="text-[12px] font-semibold text-[#0B132B]">
                          {skill.proficiencyScore}%
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          / {skill.targetBenchmark}%
                        </span>
                      </div>
                    </td>

                    {/* Role Weight */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                          skill.roleWeight === 'Critical'
                            ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                            : skill.roleWeight === 'High'
                            ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {skill.roleWeight}
                      </span>
                    </td>

                    {/* Verified Accomplishment or Gap Evidence */}
                    <td className="py-3.5 px-4 text-[#334155] max-w-md">
                      <p className="text-[12px] leading-relaxed line-clamp-2">
                        {skill.verifiedEvidence}
                      </p>
                      {skill.identifiedGap && (
                        <p className="text-[11px] text-[#B45309] font-medium mt-1 flex items-start gap-1">
                          <span className="text-[#F59E0B] font-bold">What to ask:</span>{' '}
                          {skill.identifiedGap}
                        </p>
                      )}
                    </td>

                    {/* Action / Inspect Delta */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onInspectSkill(skill)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold text-[#4F46E5] hover:text-[#3525CD] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] rounded-lg transition"
                        title="Open interview questions and learning plan"
                      >
                        <span>Inspect Delta</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredSkills.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748B]">
                    No competencies found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Summary Strip */}
      <div className="p-3.5 border-t border-[#E2E8F0] bg-[#FAFAFC] flex flex-wrap items-center justify-between text-[11px] text-[#64748B]">
        <span>
          Showing {filteredSkills.length} of {skills.length} competencies for{' '}
          <strong className="text-[#0B132B]">{candidateName}</strong>
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            100% Backed by Verified Evidence
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
            Target: {targetRole}
          </span>
        </div>
      </div>
    </div>
  );
};
