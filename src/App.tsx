import React, { useState } from 'react';
import { INITIAL_BENCHMARKS, INITIAL_CANDIDATES } from './data/mockData';
import { Candidate, RoleBenchmark, SkillItem, SkillStatus } from './types/talent';
import { NavigationRail, ActiveView } from './components/NavigationRail';
import { SecondaryPanel } from './components/SecondaryPanel';
import { CandidateHeader } from './components/CandidateHeader';
import { SkillMatrix } from './components/SkillMatrix';
import { SkillInspectionDrawer } from './components/SkillInspectionDrawer';
import { ArtifactScannerModal } from './components/ArtifactScannerModal';
import { MarketIntelligenceView } from './components/MarketIntelligenceView';
import { SyntropicCopilot } from './components/SyntropicCopilot';
import { BenchmarkConfiguratorModal } from './components/BenchmarkConfiguratorModal';
import { NewCandidateModal } from './components/NewCandidateModal';
import { QuickHelpBanner } from './components/QuickHelpBanner';
import {
  Sparkles,
  TrendingUp,
  ScanEye,
  Layers,
  ShieldCheck,
  AlertCircle,
  Plus,
  Compass,
  ArrowUpRight,
  UserCheck,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [benchmarks, setBenchmarks] = useState<RoleBenchmark[]>(INITIAL_BENCHMARKS);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(INITIAL_CANDIDATES[0].id);
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(INITIAL_BENCHMARKS[0].id);

  const [activeView, setActiveView] = useState<ActiveView>('matrix');
  const [navCollapsed, setNavCollapsed] = useState<boolean>(false);
  const [personaMode, setPersonaMode] = useState<'hiring_manager' | 'recruiter' | 'candidate'>('hiring_manager');

  // Modals & Drawers state
  const [inspectingSkill, setInspectingSkill] = useState<SkillItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState<boolean>(false);
  const [isNewCandidateModalOpen, setIsNewCandidateModalOpen] = useState<boolean>(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const currentCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  const currentBenchmark =
    benchmarks.find((b) => b.id === selectedBenchmarkId) || benchmarks[0];

  // Update skill status in candidate profile
  const handleSaveSkillStatus = (skillId: string, status: SkillStatus, newScore: number) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== currentCandidate.id) return c;

        const updatedSkills = c.skills.map((s) =>
          s.id === skillId ? { ...s, status, proficiencyScore: newScore } : s
        );

        const matchedCount = updatedSkills.filter((s) => s.status === 'matched').length;
        const developingCount = updatedSkills.filter((s) => s.status === 'developing').length;
        const missingCount = updatedSkills.filter((s) => s.status === 'missing').length;

        // Recalculate average match score
        const totalScore = updatedSkills.reduce((sum, s) => sum + s.proficiencyScore, 0);
        const overallMatchScore = Math.round(totalScore / updatedSkills.length);

        return {
          ...c,
          skills: updatedSkills,
          matchedCount,
          developingCount,
          missingCount,
          overallMatchScore,
        };
      })
    );
  };

  // Ingest extracted skills from Gemini multimodal scanner
  const handleIngestExtractedSkills = (
    candidateId: string,
    extractedSkills: SkillItem[],
    newScore?: number
  ) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;

        const combinedSkills = [...c.skills, ...extractedSkills];
        const matchedCount = combinedSkills.filter((s) => s.status === 'matched').length;
        const developingCount = combinedSkills.filter((s) => s.status === 'developing').length;
        const missingCount = combinedSkills.filter((s) => s.status === 'missing').length;
        const finalScore = newScore || Math.round(
          combinedSkills.reduce((sum, s) => sum + s.proficiencyScore, 0) / combinedSkills.length
        );

        return {
          ...c,
          skills: combinedSkills,
          matchedCount,
          developingCount,
          missingCount,
          overallMatchScore: finalScore,
        };
      })
    );
  };

  // Trigger whole-profile gap synthesis
  const handleTriggerGapSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      setCopilotInitialPrompt(
        `Provide a comprehensive executive talent gap synthesis for ${currentCandidate.name} targeting the role of ${currentCandidate.targetRole}. Break down the 3 top architectural strengths and the 2 most critical verification deltas before final on-site loop.`
      );
      setActiveView('copilot');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleOpenCopilotForCandidate = () => {
    setCopilotInitialPrompt(
      `Please summarize ${currentCandidate.name}'s key strengths and recommend targeted probing questions for our upcoming panel.`
    );
    setActiveView('copilot');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAFC] text-[#0B132B]">
      {/* 1. Primary Fixed Navigation Rail (240px / 72px) */}
      <NavigationRail
        activeView={activeView}
        onSelectView={setActiveView}
        collapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
      />

      {/* 2. Secondary Static Sub-Navigation Panel (320px) */}
      <SecondaryPanel
        candidates={candidates}
        selectedCandidateId={selectedCandidateId}
        onSelectCandidate={(id) => {
          setSelectedCandidateId(id);
          if (activeView === 'scanner') {
            // keep context
          }
        }}
        benchmarks={benchmarks}
        selectedBenchmarkId={selectedBenchmarkId}
        onSelectBenchmark={setSelectedBenchmarkId}
        onOpenNewCandidateModal={() => setIsNewCandidateModalOpen(true)}
      />

      {/* 3. Fluid Main Analytical Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFC]">
        {/* Top Operational Status Bar */}
        <header className="h-16 px-6 bg-white border-b border-[#E2E8F0] flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#0B132B]">
                Syntropic Precision
              </span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[13px] text-[#64748B] font-medium">
                {currentBenchmark.title}
              </span>
            </div>

            {/* Live KPI Indicators per Design System */}
            <div className="hidden xl:flex items-center gap-4 text-[11px] font-tabular border-l border-[#F1F5F9] pl-6 text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>
                  Evaluated: <strong className="text-[#0B132B]">{candidates.length} Profiles</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                <span>
                  Benchmark Match: <strong className="text-[#0B132B]">89.2% Avg</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span>
                  Critical Gaps: <strong className="text-[#0B132B]">5 In-Flight</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions & Persona Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Persona Switcher */}
            <div className="hidden md:flex items-center bg-[#F1F3F9] p-0.5 rounded-lg border border-[#E2E8F0] text-[11px] font-medium">
              <button
                onClick={() => setPersonaMode('hiring_manager')}
                className={`px-2.5 py-1 rounded-md transition ${
                  personaMode === 'hiring_manager'
                    ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B132B]'
                }`}
                title="Detailed technical systems view"
              >
                🛠️ Engineering Lead
              </button>
              <button
                onClick={() => setPersonaMode('recruiter')}
                className={`px-2.5 py-1 rounded-md transition ${
                  personaMode === 'recruiter'
                    ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B132B]'
                }`}
                title="Hiring summary & salary view"
              >
                👥 Recruiter / HR
              </button>
              <button
                onClick={() => setPersonaMode('candidate')}
                className={`px-2.5 py-1 rounded-md transition ${
                  personaMode === 'candidate'
                    ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B132B]'
                }`}
                title="Learning roadmap & interview prep"
              >
                🎯 Candidate View
              </button>
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] transition"
            >
              <ScanEye className="w-3.5 h-3.5" />
              <span>Scan Resume</span>
            </button>

            <button
              onClick={() => setIsBenchmarkModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#334155] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] transition"
            >
              <Layers className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Calibrate Benchmark</span>
            </button>
          </div>
        </header>

        {/* Viewport Canvas Body */}
        <div className="flex-1 overflow-y-auto p-6 max-w-[1440px] w-full mx-auto">
          {/* Quick Start Guide for Everyone */}
          <QuickHelpBanner
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenCopilot={() => setActiveView('copilot')}
            onOpenMarket={() => setActiveView('market')}
          />

          {activeView === 'matrix' && (
            <div className="space-y-6">
              {/* Candidate Overview Card with circular progress ring & segmented bar */}
              <CandidateHeader
                candidate={currentCandidate}
                onOpenArtifactScanner={() => setIsScannerOpen(true)}
                onOpenCopilotWithCandidate={handleOpenCopilotForCandidate}
                onTriggerGapSynthesis={handleTriggerGapSynthesis}
                isSynthesizing={isSynthesizing}
                personaMode={personaMode}
              />

              {/* High-Density Skill Taxonomy Breakdown */}
              <SkillMatrix
                skills={currentCandidate.skills}
                candidateName={currentCandidate.name}
                targetRole={currentCandidate.targetRole}
                onInspectSkill={(skill) => setInspectingSkill(skill)}
                onUpdateSkillStatus={(id, status) => {
                  const item = currentCandidate.skills.find((s) => s.id === id);
                  if (item) handleSaveSkillStatus(id, status, item.proficiencyScore);
                }}
              />
            </div>
          )}

          {activeView === 'scanner' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[18px] font-semibold text-[#0B132B]">
                      Visual Evidence & Technical Artifact Scanner
                    </h2>
                    <p className="text-[13px] text-[#64748B]">
                      Gemini 3.1 Pro Preview multimodal engine extracting verified competencies from resumes, system diagrams, and performance benchmarks.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    }}
                  >
                    Open Full Scanner Dialog
                  </button>
                </div>

                <div className="p-8 text-center bg-[#FAFAFC] rounded-xl border border-dashed border-[#CBD5E1]">
                  <ScanEye className="w-12 h-12 text-[#4F46E5] mx-auto mb-2" />
                  <h3 className="text-[15px] font-semibold text-[#0B132B]">
                    Ready to scan artifacts for {currentCandidate.name}
                  </h3>
                  <p className="text-[12px] text-[#64748B] max-w-md mx-auto mt-1 mb-4">
                    Upload an image or select sample artifacts (Raft system diagrams, vLLM inference charts, Cloudflare telemetry) to test multimodal parsing.
                  </p>
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="px-4 py-2 text-[12px] font-semibold text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg hover:bg-[#E0E7FF] transition"
                  >
                    Choose Sample Artifact or Upload
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'market' && (
            <MarketIntelligenceView currentRole={currentBenchmark.title} />
          )}

          {activeView === 'copilot' && (
            <SyntropicCopilot
              currentCandidate={currentCandidate}
              initialPrompt={copilotInitialPrompt}
              onClearInitialPrompt={() => setCopilotInitialPrompt(undefined)}
            />
          )}

          {activeView === 'benchmarks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#0B132B]">
                    Active Role Benchmark Archetypes
                  </h2>
                  <p className="text-[13px] text-[#64748B]">
                    Calibrate competence weights, baseline thresholds, and evaluation rigor across engineering tiers.
                  </p>
                </div>
                <button
                  onClick={() => setIsBenchmarkModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white flex items-center gap-1.5 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Calibrate New Archetype</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benchmarks.map((b) => (
                  <div
                    key={b.id}
                    className={`p-5 rounded-xl border transition ${
                      b.id === selectedBenchmarkId
                        ? 'bg-white border-[#4F46E5] shadow-md ring-1 ring-[#4F46E5]/20'
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-md border border-[#C7D2FE]">
                        {b.level}
                      </span>
                      <span className="text-[12px] font-semibold text-[#10B981] font-tabular">
                        Target Bar: {b.targetScore}%
                      </span>
                    </div>

                    <h3 className="text-[16px] font-semibold text-[#0B132B]">
                      {b.title}
                    </h3>
                    <p className="text-[12px] text-[#64748B] mt-0.5">
                      {b.department} • {b.openPositions} Open Positions
                    </p>
                    <p className="text-[13px] text-[#334155] mt-3 leading-relaxed">
                      {b.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B]">
                        {b.requiredSkillsCount} Competencies Tracked
                      </span>
                      <button
                        onClick={() => {
                          setSelectedBenchmarkId(b.id);
                          setActiveView('matrix');
                        }}
                        className="text-[12px] font-semibold text-[#4F46E5] hover:text-[#3525CD]"
                      >
                        Select as Active Benchmark →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Diagnostic Skill Inspection Drawer */}
      <SkillInspectionDrawer
        skill={inspectingSkill}
        candidateName={currentCandidate.name}
        targetRole={currentCandidate.targetRole}
        onClose={() => setInspectingSkill(null)}
        onSaveStatus={handleSaveSkillStatus}
      />

      {/* Multimodal Artifact Scanner Modal */}
      <ArtifactScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        selectedCandidate={currentCandidate}
        onIngestExtractedSkills={handleIngestExtractedSkills}
      />

      {/* Benchmark Configurator Modal */}
      <BenchmarkConfiguratorModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
        onSaveBenchmark={(b) => {
          setBenchmarks((prev) => [b, ...prev]);
          setSelectedBenchmarkId(b.id);
        }}
      />

      {/* Add Candidate Profile Modal */}
      <NewCandidateModal
        isOpen={isNewCandidateModalOpen}
        onClose={() => setIsNewCandidateModalOpen(false)}
        onAddCandidate={(c) => {
          setCandidates((prev) => [c, ...prev]);
          setSelectedCandidateId(c.id);
        }}
        defaultRole={currentBenchmark.title}
      />
    </div>
  );
}
