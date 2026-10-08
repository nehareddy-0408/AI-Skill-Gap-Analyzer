import React, { useState } from 'react';
import { MarketReport } from '../types/talent';
import {
  TrendingUp,
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Copy,
  Check,
  HelpCircle,
  BarChart3,
} from 'lucide-react';

interface MarketIntelligenceViewProps {
  currentRole: string;
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({
  currentRole,
}) => {
  const [roleInput, setRoleInput] = useState(currentRole);
  const [locationInput, setLocationInput] = useState('San Francisco, CA / Remote');
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<MarketReport | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleSearchPrompts = [
    'Staff Distributed Systems Engineer total comp (base, equity, bonus) in 2026',
    'Principal AI Infrastructure Architect salary benchmarks & vLLM/GPU demand',
    'Rust, Raft consensus, and eBPF market skill scarcity premium 2026',
    'Staff Cloud Security Engineer counter-offer retention rates in tier-1 tech',
  ];

  const handleRunSearchGrounding = async (queryToRun?: string) => {
    setLoading(true);
    try {
      const q =
        queryToRun ||
        customQuery ||
        `Current 2026 compensation bands, equity, and trending skill scarcity for ${roleInput} in ${locationInput}`;
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          role: roleInput,
          location: locationInput,
        }),
      });

      const data = await res.json();
      if (data.report) {
        setReportData({
          role: roleInput,
          location: locationInput,
          report: data.report,
          grounding: data.grounding,
          modelUsed: data.modelUsed || 'gemini-3.5-flash',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.error('Failed to run search grounding:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!reportData) return;
    navigator.clipboard.writeText(`📊 Syntropic Precision Market Report for ${reportData.role} (${reportData.location})\n\n${reportData.report}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white shadow-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-semibold text-[#0B132B]">
                  Real-Time Market Search Grounding
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full border border-[#C7D2FE]">
                  gemini-3.5-flash + Google Search
                </span>
              </div>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Up-to-date salary bands, equity packages, and skill scarcity backed by Google Search.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Live Web Grounded
            </span>
          </div>
        </div>

        {/* Friendly Explanation Strip */}
        <div className="mt-4 p-3 rounded-xl bg-[#FAFAFC] border border-[#E2E8F0] grid grid-cols-1 md:grid-cols-4 gap-2 text-[12px]">
          <div className="flex items-center gap-2 text-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            <span><strong>p25:</strong> Entry of Band</span>
          </div>
          <div className="flex items-center gap-2 text-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span><strong>p50:</strong> Market Median</span>
          </div>
          <div className="flex items-center gap-2 text-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span><strong>p75:</strong> Competitive Standard</span>
          </div>
          <div className="flex items-center gap-2 text-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span><strong>p90:</strong> Top Tier / Counter-Offer</span>
          </div>
        </div>

        {/* Search Parameter Inputs */}
        <div className="mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Role Benchmark
            </label>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full h-9 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-1">
              Target Metro / Region
            </label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="w-full h-9 px-3 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleRunSearchGrounding()}
              disabled={loading}
              className="w-full h-9 rounded-lg text-[13px] font-semibold text-white flex items-center justify-center gap-2 transition hover:brightness-105 disabled:opacity-50 shadow-xs"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            >
              <Search className="w-4 h-4 text-white" />
              <span>{loading ? 'Searching Live Web...' : 'Run Grounded Intelligence'}</span>
            </button>
          </div>
        </div>

        {/* Quick Query Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#64748B] font-medium mr-1">
            1-Click Queries:
          </span>
          {sampleSearchPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomQuery(prompt);
                handleRunSearchGrounding(prompt);
              }}
              className="text-[11px] font-medium text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] px-2.5 py-1 rounded-full transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-12 text-center rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
          <div className="w-8 h-8 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-[14px] font-semibold text-[#0B132B]">
            Querying Google Search Grounding for Live Market Metrics...
          </h3>
          <p className="text-[12px] text-[#64748B]">
            Synthesizing recent 2026 tech compensation data, Levels.fyi trends, and verified skill scarcity with Gemini 3.5 Flash.
          </p>
        </div>
      )}

      {/* Market Report Display */}
      {reportData && !loading && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#F1F5F9] gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4F46E5]">
                Grounded Market Intelligence Report
              </span>
              <h2 className="text-[18px] font-semibold text-[#0B132B] mt-0.5">
                {reportData.role} • {reportData.location}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#64748B] font-tabular">
                Generated: {reportData.timestamp}
              </span>
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[#0B132B] bg-[#FAFAFC] hover:bg-[#F1F3F9] border border-[#CBD5E1] rounded-lg transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[#10B981]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Copy Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Formatted Text Content */}
          <div className="text-[13px] text-[#334155] leading-relaxed whitespace-pre-line font-normal space-y-4">
            {reportData.report}
          </div>

          {/* Grounding Sources & Web Citations */}
          {reportData.grounding?.groundingChunks && reportData.grounding.groundingChunks.length > 0 && (
            <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#4F46E5]" />
                Google Search Citations & Verification Sources
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {reportData.grounding.groundingChunks.map((chunk, idx) => {
                  const web = chunk.web;
                  if (!web?.uri) return null;
                  return (
                    <a
                      key={idx}
                      href={web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-[#FAFAFC] hover:bg-[#F1F3F9] border border-[#E2E8F0] text-[12px] flex items-center justify-between gap-2 group transition"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-[#0B132B] block truncate group-hover:text-[#4F46E5]">
                          {web.title || web.uri}
                        </span>
                        <span className="text-[10px] text-[#64748B] truncate block">
                          {web.uri}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#4F46E5] shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial Empty State Helper */}
      {!reportData && !loading && (
        <div className="p-8 text-center rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
          <TrendingUp className="w-8 h-8 text-[#4F46E5] mx-auto" />
          <h3 className="text-[15px] font-semibold text-[#0B132B]">
            Calibrate Offers with Live Market Grounding
          </h3>
          <p className="text-[13px] text-[#64748B] max-w-lg mx-auto">
            Click &quot;Run Grounded Intelligence&quot; or pick a quick query to fetch real-time 2026 talent market metrics, salary percentiles, and verified skill scarcity directly from Google Search.
          </p>
        </div>
      )}
    </div>
  );
};
