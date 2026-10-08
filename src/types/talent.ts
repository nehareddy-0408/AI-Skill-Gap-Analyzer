export type SkillStatus = 'matched' | 'developing' | 'missing';

export interface SkillItem {
  id: string;
  name: string;
  category: 'Core Architecture' | 'Applied AI & ML' | 'Cloud & Systems' | 'Leadership & Velocity';
  status: SkillStatus;
  proficiencyScore: number; // 0 - 100
  targetBenchmark: number;  // 0 - 100
  roleWeight: 'Critical' | 'High' | 'Medium';
  verifiedEvidence: string;
  identifiedGap?: string;
}

export interface Candidate {
  id: string;
  name: string;
  currentTitle: string;
  currentCompany: string;
  targetRole: string;
  location: string;
  experienceYears: number;
  avatarUrl: string;
  overallMatchScore: number; // 0 - 100
  matchedCount: number;
  developingCount: number;
  missingCount: number;
  summary: string;
  education: string;
  keyStrengths: string[];
  primaryArtifactUrl?: string;
  skills: SkillItem[];
}

export interface RoleBenchmark {
  id: string;
  title: string;
  level: string; // e.g. L6 / Staff, L7 / Principal
  department: string;
  targetScore: number;
  openPositions: number;
  description: string;
  requiredSkillsCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export interface MarketReport {
  role: string;
  location: string;
  report: string;
  grounding?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: {
        uri?: string;
        title?: string;
      };
    }>;
  };
  modelUsed: string;
  timestamp: string;
}
