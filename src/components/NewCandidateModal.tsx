import React, { useState } from 'react';
import { Candidate } from '../types/talent';
import { X, UserPlus, Sparkles } from 'lucide-react';

interface NewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCandidate: (candidate: Candidate) => void;
  defaultRole: string;
}

export const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
  isOpen,
  onClose,
  onAddCandidate,
  defaultRole,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [targetRole, setTargetRole] = useState(defaultRole);
  const [experienceYears, setExperienceYears] = useState(8);
  const [education, setEducation] = useState('B.S. Computer Science');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: name.trim(),
      currentTitle: currentTitle || 'Senior Software Engineer',
      currentCompany: currentCompany || 'Independent / Stealth',
      targetRole: targetRole || defaultRole,
      location: 'San Francisco, CA (Remote)',
      experienceYears: Number(experienceYears),
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (Date.now() % 1000)}?auto=format&fit=crop&q=80&w=256`,
      overallMatchScore: 84,
      matchedCount: 8,
      developingCount: 4,
      missingCount: 2,
      summary:
        summary ||
        'Strong technical contributor with extensive engineering track record across scalable backends and modern architectures.',
      education,
      keyStrengths: [
        'Demonstrated systems architecture and delivery velocity',
        'Proven cross-functional collaboration and technical ownership',
      ],
      skills: [
        {
          id: `s-${Date.now()}-1`,
          name: 'Distributed Consensus & Protocols',
          category: 'Core Architecture',
          status: 'developing',
          proficiencyScore: 78,
          targetBenchmark: 88,
          roleWeight: 'Critical',
          verifiedEvidence: 'Experience with replicated state machines and event-driven architectures.',
        },
        {
          id: `s-${Date.now()}-2`,
          name: 'High-Concurrency Systems & Memory Safety',
          category: 'Core Architecture',
          status: 'matched',
          proficiencyScore: 88,
          targetBenchmark: 85,
          roleWeight: 'Critical',
          verifiedEvidence: 'Extensive production experience writing concurrent services.',
        },
        {
          id: `s-${Date.now()}-3`,
          name: 'Distributed Observability & Tracing',
          category: 'Cloud & Systems',
          status: 'matched',
          proficiencyScore: 85,
          targetBenchmark: 80,
          roleWeight: 'High',
          verifiedEvidence: 'Deployed OpenTelemetry and Prometheus across cluster services.',
        },
      ],
    };

    onAddCandidate(newCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0B132B]/50 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 flex flex-col">
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#0B132B]">
                Add Candidate Profile
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Initialize new profile for AI matrix evaluation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748B] hover:text-[#0B132B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aisha Al-Mansoor"
              className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                Current Title
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="e.g. Staff Software Engineer"
                className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                Current Company
              </label>
              <input
                type="text"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g. Stripe / ex-Google"
                className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full h-10 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Technical Background / Executive Bio
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summary of accomplishments and technical expertise..."
              className="w-full p-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-medium text-[#64748B] hover:text-[#0B132B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
