import React, { useState } from 'react';
import { SAMPLE_ARTIFACT_PRESETS } from '../data/mockData';
import { Candidate, SkillItem } from '../types/talent';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  ScanEye,
  Check,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface ArtifactScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidate: Candidate;
  onIngestExtractedSkills: (candidateId: string, extractedSkills: SkillItem[], newScore?: number) => void;
}

export const ArtifactScannerModal: React.FC<ArtifactScannerModalProps> = ({
  isOpen,
  onClose,
  selectedCandidate,
  onIngestExtractedSkills,
}) => {
  if (!isOpen) return null;

  const [selectedPreset, setSelectedPreset] = useState<any>(SAMPLE_ARTIFACT_PRESETS[0]);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ingestedSuccess, setIngestedSuccess] = useState(false);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomImageBase64(result);
      setSelectedPreset(null);
      setAnalysisResult(null);
      setIngestedSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  // Convert preset image to base64 canvas or fetch
  const getActiveImagePayload = async (): Promise<{ base64: string; mimeType: string }> => {
    if (customImageBase64) {
      const mime = customImageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/png';
      return { base64: customImageBase64, mimeType: mime };
    }

    // For preset images, generate a high-contrast mock document image on canvas to send to Gemini
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header Banner
      ctx.fillStyle = '#3525CD';
      ctx.fillRect(40, 40, canvas.width - 80, 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.fillText(selectedPreset.title, 70, 92);

      // Body Document Text
      ctx.fillStyle = '#0B132B';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText(`CANDIDATE: ${selectedCandidate.name} | TARGET: ${selectedCandidate.targetRole}`, 70, 170);

      ctx.fillStyle = '#334155';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText(`ARTIFACT TYPE: ${selectedPreset.type}`, 70, 210);
      ctx.fillText(`DESCRIPTION: ${selectedPreset.description}`, 70, 250);

      ctx.font = '16px monospace';
      ctx.fillStyle = '#4F46E5';
      ctx.fillText('// VERIFIED TECHNICAL ACCOMPLISHMENTS & TELEMETRY LOGS', 70, 310);
      ctx.fillStyle = '#1E293B';
      ctx.fillText('• Consensus Protocol: Custom Raft with linearizable read leases in async Rust (P99 < 8ms, 1.4M QPS)', 70, 345);
      ctx.fillText('• Compaction Tuning: Custom RocksDB compaction filter eliminating 38% write amplification', 70, 380);
      ctx.fillText('• Network I/O: Linux epoll sockets; io_uring 6.x prototypes benchmarked for zero-copy transfers', 70, 415);
      ctx.fillText('• Fault Injection: Continuous Jepsen test loops verifying partition healing and clock skew safety', 70, 450);
      ctx.fillText('• OpenTelemetry: Tenant-isolated span propagation deployed across 400+ microservices', 70, 485);
      ctx.fillText('• Leadership: Authored 7 cross-organization technical RFCs; led Tier-1 incident management', 70, 520);
      ctx.fillText('• Gaps: DPDK bare-metal bypass not deployed in live edge prod; custom Triton kernels not authored', 70, 555);

      // Convert canvas to base64
      const dataUrl = canvas.toDataURL('image/png');
      resolve({ base64: dataUrl, mimeType: 'image/png' });
    });
  };

  const handleRunVisualAnalysis = async () => {
    setAnalyzing(true);
    setErrorMsg(null);
    setIngestedSuccess(false);

    try {
      const { base64, mimeType } = await getActiveImagePayload();

      const res = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          targetRole: selectedCandidate.targetRole,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setErrorMsg('Unable to parse visual analysis.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Image analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyToCandidate = () => {
    if (!analysisResult?.extractedSkills) return;

    const newSkills: SkillItem[] = analysisResult.extractedSkills.map(
      (s: any, idx: number) => ({
        id: `extracted-${Date.now()}-${idx}`,
        name: s.name,
        category: s.category || 'Core Architecture',
        status: s.status || 'matched',
        proficiencyScore: s.proficiencyScore || 85,
        targetBenchmark: 85,
        roleWeight: 'High',
        verifiedEvidence: s.evidence || 'Extracted from visual artifact scan',
        identifiedGap: s.gapNotes,
      })
    );

    const newScore = analysisResult.overallMatchScore || selectedCandidate.overallMatchScore;
    onIngestExtractedSkills(selectedCandidate.id, newSkills, newScore);
    setIngestedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0B132B]/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white">
              <ScanEye className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-semibold text-[#0B132B]">
                  Visual Evidence & Artifact Scanner
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full border border-[#C7D2FE]">
                  Gemini 3.1 Pro Preview
                </span>
              </div>
              <p className="text-[12px] text-[#64748B]">
                Ingest technical resumes, system diagrams, and performance benchmarks to extract verified signal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B132B] hover:bg-[#F1F3F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Profile Bar */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedCandidate.avatarUrl}
                alt={selectedCandidate.name}
                className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
              />
              <div>
                <span className="text-[13px] font-semibold text-[#0B132B]">
                  Target Profile: {selectedCandidate.name}
                </span>
                <span className="text-[12px] text-[#64748B] ml-2">
                  ({selectedCandidate.targetRole})
                </span>
              </div>
            </div>
            <span className="text-[12px] font-semibold text-[#4F46E5]">
              Current Match: {selectedCandidate.overallMatchScore}%
            </span>
          </div>

          {/* Preset Artifacts or Upload */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B]">
                Choose Artifact or Upload Photo
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPreset(SAMPLE_ARTIFACT_PRESETS[0]);
                    setCustomImageBase64(null);
                    setTimeout(() => handleRunVisualAnalysis(), 50);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg shadow-xs transition hover:brightness-105"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  }}
                  title="Run instant demo without uploading any files"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ 1-Click Instant Demo Scan</span>
                </button>

                {/* Upload Input */}
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] rounded-lg transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Custom Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {customImageBase64 ? (
              <div className="p-4 rounded-xl bg-[#EEF2FF]/40 border border-[#C7D2FE] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white border border-[#CBD5E1] overflow-hidden flex items-center justify-center">
                    <img
                      src={customImageBase64}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-[#0B132B] block">
                      Custom File: {customImageName}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      Ready for Gemini 3.1 Pro visual extraction
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCustomImageBase64(null);
                    setSelectedPreset(SAMPLE_ARTIFACT_PRESETS[0]);
                  }}
                  className="text-[12px] text-[#EF4444] hover:underline font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SAMPLE_ARTIFACT_PRESETS.map((preset) => {
                  const isSelected = selectedPreset?.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-white border-[#4F46E5] shadow-[0_4px_12px_rgba(79,70,229,0.08)] ring-1 ring-[#4F46E5]/20'
                          : 'bg-[#FAFAFC] hover:bg-white border-[#E2E8F0]'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#E2E8F0] overflow-hidden shrink-0">
                        <img
                          src={preset.mockImagePlaceholder}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-[12px] font-semibold text-[#0B132B] truncate">
                            {preset.title}
                          </h4>
                          <span className="text-[10px] font-medium text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[12px] text-[#64748B]">
              Engine: <strong className="text-[#0B132B]">gemini-3.1-pro-preview</strong> (multimodal visual parsing)
            </span>

            <button
              onClick={handleRunVisualAnalysis}
              disabled={analyzing}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white shadow-sm flex items-center gap-2 hover:brightness-105 transition disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{analyzing ? 'Scanning Visual Signal...' : 'Run Multimodal Extraction'}</span>
            </button>
          </div>

          {/* Analyzing Spinner */}
          {analyzing && (
            <div className="p-8 text-center rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] space-y-3">
              <div className="w-8 h-8 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[13px] font-medium text-[#0B132B]">
                Gemini 3.1 Pro Preview is inspecting the artifact structure...
              </p>
              <p className="text-[11px] text-[#64748B]">
                Extracting concrete systems milestones, verifying concurrency claims, and testing against role requirements.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[13px]">
              {errorMsg}
            </div>
          )}

          {/* Analysis Results Display */}
          {analysisResult && !analyzing && (
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Signal Extracted
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#0B132B] mt-0.5">
                    {analysisResult.artifactType || 'Technical Artifact Summary'}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B] uppercase block">
                      Calculated Fit
                    </span>
                    <span className="text-[18px] font-bold text-[#4F46E5] font-tabular">
                      {analysisResult.overallMatchScore || 93}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              {analysisResult.executiveSummary && (
                <div className="p-3.5 rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] text-[13px] text-[#334155] leading-relaxed">
                  <span className="font-semibold text-[#0B132B] block mb-1">
                    AI Talent Synthesis:
                  </span>
                  {analysisResult.executiveSummary}
                </div>
              )}

              {/* Extracted Skills List */}
              {analysisResult.extractedSkills && (
                <div className="space-y-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Extracted Competencies ({analysisResult.extractedSkills.length})
                  </span>
                  <div className="space-y-2">
                    {analysisResult.extractedSkills.map((sk: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-[12px]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              sk.status === 'matched'
                                ? 'bg-[#10B981]'
                                : sk.status === 'developing'
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#EF4444]'
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-[#0B132B]">
                              {sk.name}
                            </span>
                            <span className="text-[#64748B] ml-2">
                              {sk.evidence}
                            </span>
                          </div>
                        </div>

                        <span className="font-bold text-[#4F46E5] font-tabular">
                          {sk.proficiencyScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Probing Questions */}
              {analysisResult.recommendedInterviewQuestions && (
                <div className="space-y-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Recommended Live Technical Probing Questions
                  </span>
                  <ul className="space-y-1.5 text-[12px] text-[#334155]">
                    {analysisResult.recommendedInterviewQuestions.map(
                      (q: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#4F46E5] font-bold">Q{i + 1}:</span>
                          <span>{q}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Ingest Action Button */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Updating profile will recalculate candidate overall match ring gauge.
                </span>

                <button
                  onClick={handleApplyToCandidate}
                  disabled={ingestedSuccess}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition ${
                    ingestedSuccess
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#4F46E5] text-white hover:bg-[#3525CD]'
                  }`}
                >
                  {ingestedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ingested into Profile!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Ingest Extracted Skills</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
