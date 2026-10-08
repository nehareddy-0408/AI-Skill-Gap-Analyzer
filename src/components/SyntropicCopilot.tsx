import React, { useState, useRef, useEffect } from 'react';
import { Candidate, ChatMessage } from '../types/talent';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Zap,
  Cpu,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  FileCheck,
  Mail,
  Scale,
  Calendar,
} from 'lucide-react';

interface SyntropicCopilotProps {
  currentCandidate: Candidate;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const SyntropicCopilot: React.FC<SyntropicCopilotProps> = ({
  currentCandidate,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I am your **Syntropic Talent Copilot**.\n\nI have loaded **${currentCandidate.name}**'s talent matrix (${currentCandidate.targetRole}, ${currentCandidate.overallMatchScore}% match score).\n\n💡 **What would you like to do?** You can click any of the 1-click templates below or type a question. I can:\n• Generate tailored interview questions with what to look for\n• Draft an executive hiring memo for leadership\n• Write a personalized candidate outreach or feedback email\n• Design a 30-day onboarding plan to close their target skill gaps`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite'
  >('gemini-3.5-flash');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Grouped friendly prompt templates
  const promptCategories = [
    {
      label: '🎯 Interview Kit',
      prompt: `Generate a 45-minute technical interview script for ${currentCandidate.name} focusing on their key gaps in ${currentCandidate.targetRole}. Include 3 probing questions, expected strong answers, and red flags.`,
    },
    {
      label: '📋 Hiring Memo',
      prompt: `Write a concise 1-page executive hiring recommendation memo for ${currentCandidate.name} for the ${currentCandidate.targetRole} role. Include Decision (Hire/No Hire), Top 3 Strengths, 2 Risks, and Compensation justification.`,
    },
    {
      label: '✉️ Candidate Email',
      prompt: `Draft a warm, professional email to ${currentCandidate.name} acknowledging their impressive experience with Raft and distributed systems, inviting them to the final onsite loop with clear expectations.`,
    },
    {
      label: '📈 30-Day Onboarding Plan',
      prompt: `Create a personalized 30-day onboarding roadmap for ${currentCandidate.name} to close their developing skill areas and achieve full deployment velocity.`,
    },
    {
      label: '⚖️ Compare Candidates',
      prompt: `Provide a quick comparison between ${currentCandidate.name} and other candidates for ${currentCandidate.targetRole}. Who has more architectural depth vs immediate velocity?`,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemInstruction = `You are the Syntropic Precision Talent Intelligence Copilot.
Current candidate under evaluation: ${currentCandidate.name}
Role Target: ${currentCandidate.targetRole}
Current Company: ${currentCandidate.currentCompany} (${currentCandidate.experienceYears} years exp)
Overall Match: ${currentCandidate.overallMatchScore}%
Skills profile: ${currentCandidate.skills
        .map((s) => `${s.name}: ${s.status} (${s.proficiencyScore}% vs target ${s.targetBenchmark}%)`)
        .join('; ')}

Your answers should be crystal clear, actionable, structured, and easy to read for any hiring manager, recruiter, or engineer. Format with clear headings, bullet points, and bold text.`;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          systemInstruction,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'No response returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the Gemini engine. Please verify the server connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `Conversation reset. Context is set to **${currentCandidate.name}** (${currentCandidate.targetRole}). Choose a template or ask a question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col h-[760px] overflow-hidden">
      {/* Copilot Header */}
      <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#FAFAFC] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white shadow-sm">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-[#0B132B]">
                Syntropic Talent Copilot
              </h2>
              <span className="text-[10px] font-medium text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Candidate: {currentCandidate.name}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Ask anything, generate interview guides, or draft hiring recommendations
            </p>
          </div>
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center gap-2">
          {/* Model Switcher with friendly labels */}
          <div className="flex items-center bg-[#F1F3F9] p-0.5 rounded-lg border border-[#E2E8F0] text-[11px] font-medium">
            <button
              onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                selectedModel === 'gemini-3.1-pro-preview'
                  ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B132B]'
              }`}
              title="Best for complex technical reasoning and deep interview loops"
            >
              <Cpu className="w-3 h-3" />
              <span>3.1 Pro (Deep)</span>
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.5-flash')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                selectedModel === 'gemini-3.5-flash'
                  ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B132B]'
              }`}
              title="Fast & balanced for summaries, emails, and ratings"
            >
              <Sparkles className="w-3 h-3" />
              <span>3.5 Flash (General)</span>
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-white text-[#4F46E5] font-semibold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B132B]'
              }`}
              title="Instant answers for quick checks"
            >
              <Zap className="w-3 h-3" />
              <span>3.1 Lite (Fast)</span>
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-[#64748B] hover:text-[#EF4444] rounded-lg hover:bg-[#F1F3F9] transition"
            title="Reset Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1-Click Productivity Prompt Strip */}
      <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#FAFAFC] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#4F46E5]" />
          1-Click Actions:
        </span>
        {promptCategories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(cat.prompt)}
            className="text-[11px] font-semibold text-[#4F46E5] bg-white hover:bg-[#EEF2FF] border border-[#CBD5E1] hover:border-[#4F46E5] px-2.5 py-1 rounded-lg whitespace-nowrap transition shadow-2xs"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Message History Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser
                    ? 'bg-[#0B132B] text-white'
                    : 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative rounded-2xl px-4 py-3 text-[13px] leading-relaxed transition ${
                  isUser
                    ? 'bg-[#4F46E5] text-white rounded-tr-none'
                    : 'bg-[#FAFAFC] border border-[#E2E8F0] text-[#1E293B] rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-normal">{m.content}</div>

                {/* Footnote Metadata & Copy */}
                <div
                  className={`flex items-center justify-between gap-4 mt-2 pt-1 border-t text-[10px] ${
                    isUser
                      ? 'border-white/20 text-white/70'
                      : 'border-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{m.timestamp}</span>
                    {m.modelUsed && (
                      <span className="font-semibold uppercase tracking-wider">
                        • {m.modelUsed}
                      </span>
                    )}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-[#0B132B] flex items-center gap-1 text-[11px] font-medium"
                      title="Copy response to clipboard"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#10B981]" />
                          <span className="text-[#10B981]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto max-w-xl">
            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#FAFAFC] border border-[#E2E8F0] rounded-2xl rounded-tl-none px-4 py-3 text-[13px] text-[#64748B] flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
              <span>
                {selectedModel} is thinking and formatting your answer for {currentCandidate.name}...
              </span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3.5 border-t border-[#E2E8F0] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about ${currentCandidate.name} (e.g. "What interview questions should I ask?")`}
            className="flex-1 h-10 px-3.5 text-[13px] bg-[#FAFAFC] border border-[#E2E8F0] rounded-lg text-[#0B132B] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-10 px-4 rounded-lg font-semibold text-[13px] text-white flex items-center gap-1.5 transition disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            }}
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
