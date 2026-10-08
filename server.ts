import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for model fallback
async function generateWithFallback(preferredModel: string, options: any) {
  try {
    return await ai.models.generateContent({
      model: preferredModel,
      ...options,
    });
  } catch (err: any) {
    console.warn(`Model ${preferredModel} failed, trying gemini-3.5-flash fallback:`, err?.message || err);
    if (preferredModel !== 'gemini-3.5-flash') {
      return await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        ...options,
      });
    }
    throw err;
  }
}

// 1. Multi-turn Chat Endpoint (Syntropic Copilot)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, model = 'gemini-3.5-flash', systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Convert messages to GenAI format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const targetModel = ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'].includes(model)
      ? model
      : 'gemini-3.5-flash';

    const defaultSystem = `You are the Syntropic Precision Talent Intelligence & Technical Skill Evaluation Copilot. 
You specialize in deep analytical assessment of software engineering, distributed systems, machine learning infrastructure, and technical leadership candidates.
Your style is crystalline, authoritative, and data-backed (like Stripe and Linear engineering leads).
Provide actionable evaluations: cite specific technical trade-offs, identify skill target gaps, suggest diagnostic probing interview questions, and estimate skill ramp-up curves.`;

    const response = await generateWithFallback(targetModel, {
      contents,
      config: {
        systemInstruction: systemInstruction || defaultSystem,
      },
    });

    const reply = response.text || 'No response generated.';
    return res.json({ reply, modelUsed: targetModel });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate chat response' });
  }
});

// 2. Multimodal Image Analysis (Resume & Technical Artifact Scanner)
app.post('/api/gemini/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/png', prompt, targetRole } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const analysisPrompt = prompt || `You are an elite technical talent evaluator analyzing this candidate artifact (resume screenshot, architecture diagram, code review, or certification credential).
Target Role Benchmark: ${targetRole || 'Staff Technical Role'}.

Analyze the visual evidence thoroughly and return a structured JSON evaluation matching:
{
  "artifactType": "Resume / Architecture Diagram / GitHub Matrix / Certification / Portfolio",
  "candidateIdentified": "Name or handle if visible, or Anonymous Profile",
  "overallMatchScore": number between 50 and 99,
  "executiveSummary": "Concise 2-3 sentence executive assessment of technical depth and seniority.",
  "extractedSkills": [
    {
      "name": "Skill or technology name",
      "category": "Core Architecture" | "Applied AI" | "Cloud & Infrastructure" | "Leadership",
      "status": "matched" | "developing" | "missing",
      "proficiencyScore": number 1-100,
      "evidence": "Specific detail or metric visible in the image",
      "gapNotes": "What is missing or needs live interview verification"
    }
  ],
  "verifiedStrengths": ["List of 3 verified technical strengths"],
  "criticalGaps": ["List of 1-3 identified gaps or areas requiring live technical probing"],
  "recommendedInterviewQuestions": [
    "Technical question 1 testing architecture depth",
    "Technical question 2 testing operational rigor"
  ]
}
Return STRICT JSON ONLY. Do not wrap in markdown quotes if possible, or wrap cleanly in \`\`\`json.`;

    // As required by feature specification: Use gemini-3.1-pro-preview for image understanding
    const response = await generateWithFallback('gemini-3.1-pro-preview', {
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: analysisPrompt,
          },
        ],
      },
      config: {
        systemInstruction: 'You are an analytical talent intelligence scanner. Extract verified technical signal from images.',
      },
    });

    const rawText = response.text || '{}';
    let parsedData;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = { rawAnalysis: rawText };
      }
    } catch (e) {
      parsedData = { rawAnalysis: rawText };
    }

    return res.json({ analysis: parsedData, raw: rawText, modelUsed: 'gemini-3.1-pro-preview' });
  } catch (error: any) {
    console.error('Image analysis error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze artifact' });
  }
});

// 3. Search Grounding for Real-Time Market Benchmark & Compensation
app.post('/api/gemini/search-grounding', async (req: Request, res: Response) => {
  try {
    const { query, role = 'Staff Software Engineer', location = 'United States / Remote' } = req.body;

    const searchQuery = query || `What are current 2026 market salary benchmarks, equity ranges, and most in-demand skills for ${role} in ${location}?`;

    // Feature requirement: Use gemini-3.5-flash with googleSearch tool
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Provide an authoritative, high-density market talent intelligence report on the following query:
"${searchQuery}"

Target Role: ${role}
Location/Market: ${location}

Include:
1. Current 2026 Compensation Band (p25, p50, p75, p90 total compensation: base, equity, bonus).
2. Market Skill Scarcity Index & Trending Tech Stack (what top companies are prioritizing right now).
3. Talent Supply Dynamics & Hiring Velocity.
4. Competitive Counter-Offer Strategy.
Cite factual market sources found via Google Search. Structure with clear headers, bullet points, and high analytical density.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || 'No market report generated.';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;

    return res.json({
      report: text,
      grounding: groundingMetadata,
      modelUsed: 'gemini-3.5-flash',
    });
  } catch (error: any) {
    console.error('Search grounding error:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve market data' });
  }
});

// 4. In-depth Skill Gap Diagnostic & Interview Generator
app.post('/api/gemini/skill-evaluation', async (req: Request, res: Response) => {
  try {
    const { candidateName, roleTitle, skillName, currentStatus, currentProficiency } = req.body;

    const prompt = `Perform an intensive diagnostic evaluation for candidate "${candidateName}" for the role of "${roleTitle}".
Skill evaluated: "${skillName}"
Current Status: ${currentStatus} (Proficiency: ${currentProficiency}%).

Provide:
1. Executive Diagnosis: Why this skill creates a delta for this role benchmark.
2. 3 Rigorous Technical Probing Questions with what a "Distinguished" vs "Mediocre" response sounds like.
3. 30-60-90 Day Ramp-Up Plan with concrete milestones and open-source or production deliverables to close this gap.
4. Risk Rating if hired without closing the delta (Low / Moderate / Severe).`;

    const response = await generateWithFallback('gemini-3.5-flash', {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return res.json({ diagnostic: response.text });
  } catch (error: any) {
    console.error('Skill evaluation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate skill' });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Syntropic Precision Backend' });
});

// Serve frontend with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Syntropic Precision running at http://0.0.0.0:${port}`);
  });
}

startServer();
