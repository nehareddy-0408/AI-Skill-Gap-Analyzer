# Syntropic Precision

> **High-Performance Talent Intelligence & Technical Skill Evaluation Platform**  
> Powered by Google Gemini AI (`@google/genai` SDK) with Multimodal Image Understanding and Real-Time Search Grounding.

---

## 🚀 Overview

**Syntropic Precision** is a next-generation technical talent intelligence environment inspired by high-density developer tooling (Linear, Stripe). It empowers engineering leaders, technical recruiters, and candidates to evaluate technical competency, identify skill deltas against calibrated role benchmarks, generate live technical interview probing loops, and ground compensation packages in real-time market data.

---

## ✨ Key Features

### 1. 📊 Interactive Talent Matrix & Readiness Gauges
- **Dual-Track Circular SVG Gauges**: High-contrast, tabular progress rings tracking overall benchmark match percentage.
- **Horizontal Segmented Status Bar**: 8px segmented readiness bar with pill rounding showing **Ready (Day 1)**, **Can Learn (Developing)**, and **Needs Interview Test (Critical Gap)** distributions.
- **Diagnostic Inspection Drawer**: Deep-dive into individual technical competencies with 1-click AI-generated interview probing questions, "Distinguished vs Mediocre" response rubrics, and 30-60-90 day ramp-up roadmaps.

### 2. 👁️ Visual Evidence & Resume Scanner (Multimodal AI)
- Powered server-side by **Gemini 3.1 Pro Preview** (`gemini-3.1-pro-preview`).
- Upload any technical resume screenshot, system architecture diagram, or benchmark chart.
- Features a **1-Click Instant Demo Scan** for testing without needing to upload files.
- Extracts verified technical accomplishments and allows **1-Click Ingestion** directly into candidate profiles.

### 3. 🌐 Real-Time Market Search Grounding
- Powered server-side by **Gemini 3.5 Flash** (`gemini-3.5-flash`) with the built-in **`googleSearch`** tool.
- Retrieves up-to-date market compensation bands:
  - **p25**: Entry of band
  - **p50**: Market median
  - **p75**: Competitive standard
  - **p90**: Top tier / Counter-offer retention
- Displays live Google Search source links and web citations for full verification.
- Includes a 1-click **Copy Market Report** button for easy sharing.

### 4. 🤖 Syntropic Talent Copilot (Multi-Turn Chatbot)
- Multi-turn conversational interface with scrollable message history.
- Contextually aware of the active candidate and role benchmark.
- **Multi-Model Selector**:
  - `gemini-3.1-pro-preview`: Deep technical reasoning and custom interview loops.
  - `gemini-3.5-flash`: General candidate synthesis, executive summaries, and emails.
  - `gemini-3.1-flash-lite`: Instant answers and quick checks.
- **1-Click Productivity Templates**:
  - 🎯 **Interview Kit**: 45-minute technical script with expected answers and red flags.
  - 📋 **Hiring Memo**: 1-page executive hiring recommendation with pros and cons.
  - ✉️ **Candidate Email**: Warm, personalized outreach or constructive interview feedback.
  - 📈 **30-Day Onboarding Plan**: Milestone roadmap to close target skill gaps.
  - ⚖️ **Compare Candidates**: Side-by-side trade-off analysis.

### 5. 👥 Multi-Perspective Persona Views
- Switch views with a single click:
  - 🛠️ **Engineering Lead**: Technical consensus algorithms, low-level I/O, and architecture probing.
  - 👥 **Recruiter / HR**: Plain-English verdicts, candidate strengths, market salary ranges, and shareable summaries.
  - 🎯 **Candidate Self-Review**: Personal growth roadmaps, verified credentials, and interview preparation.

### 6. 📐 Role Archetype Calibrator
- Multi-step configurator with a continuous 2px baseline track to calibrate new benchmark levels (Staff, Principal, Senior), competency weights, minimum match thresholds, and headcount.

---

## 🔒 Security & Privacy

This repository is sanitized and safe for public GitHub hosting:
- **Zero Exposed Keys**: All Gemini API calls run securely server-side through Express proxy routes (`/api/gemini/*`). No API keys are bundled or exposed to the client browser.
- **Environment Variables**: Sensitive variables are kept out of source control. The `.gitignore` excludes `.env` and all local environment variants (`.env*` except `.env.example`).
- **No Private Data**: Sample candidate profiles use fictitious names, illustrative achievements, and royalty-free placeholder photography.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express, tsx
- **AI SDK**: `@google/genai` (Google GenAI TypeScript SDK)
- **Bundler & Tooling**: Vite, esbuild

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- A [Google AI Studio Gemini API Key](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/syntropic-precision.git
   cd syntropic-precision
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Express + Vite full-stack server on port 3000.
- `npm run build`: Builds the client-side production bundle via Vite.
- `npm run start`: Runs the production server with `tsx server.ts`.
- `npm run lint`: Checks TypeScript compilation without emitting files (`tsc --noEmit`).

---

## 📄 License

This project is licensed under the [Apache-2.0 License](LICENSE).
