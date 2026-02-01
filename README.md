# Chickasaw Seatbelt Creator

**Live App**: https://chickasaw-seatbelt-generator-978789278254.us-west1.run.app/

An AI-powered content profile generator for Chickasaw Nation video content. Transforms video transcripts into structured metadata (titles, descriptions, tags, slugs) following specific series guidelines.

## Features

- **Transcript Processing**: Paste or upload video transcripts
- **AI-Powered Generation**: Uses Google Gemini to create content profiles
- **Series-Aware**: Automatically applies correct formatting for different video series
- **Customizable Prompts**: Configurable system and user prompts with localStorage persistence
- **Streaming Output**: Real-time results as the AI generates content
- **Export Options**: Copy to clipboard or download as JSON

## Supported Series

| Series | Tone | Focus |
|--------|------|-------|
| **CNTV News** | Informative | Weekly news with Brad Clonch & Quin Tran |
| **Winter Fire** | Solemn, historical | Chickasaw storytelling and history |
| **Thrive** | Positive, uplifting | Citizen services and wellness |
| **Thrive: Traditions** | Cultural | Traditional practices and culture keepers |
| **Thrive: In the Kitchen** | Warm, food-focused | Healthy Chickasaw recipes |
| **Thrive: Unconquered Spirit** | Empowering | Portraits in resilience |
| **Profiles of a Nation** | Inspirational | Biographical features |
| **Rosetta Stone Chickasaw** | Educational | Language learning |
| **Our History Is World History** | Historical | Global context |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 3
- **AI**: Google Generative AI (Gemini)
- **Icons**: Lucide React
- **Markdown**: react-markdown for result rendering

## Prerequisites

- Node.js 18+
- Google AI API key (Gemini)

## Installation

```bash
# Clone the repository
git clone https://github.com/jus10time/Chickasaw-Seatbelt-Creator.git
cd Chickasaw-Seatbelt-Creator

# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

The app requires a Google AI API key. Set it via environment variable:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Or configure in the Vite config for deployment.

## Usage

1. **Input Transcript**: Paste video transcript text or upload a file
2. **Add Context** (optional): Provide additional context about the content
3. **Configure AI** (optional): Customize system/user prompts or use defaults
4. **Process**: Click "Process Transcript" to generate the content profile
5. **Export**: Copy the JSON result or download as a file

## Output Format

The generated content profile includes:

```json
{
  "series": "CNTV News",
  "title": "January 15, 2024",
  "slug": "cntv-news-january-15-2024",
  "subhead": "Chickasaw Nation News",
  "summary": "Brief one-sentence summary...",
  "description": "Multi-paragraph description...",
  "tags": ["CNTV News", "News", "Chickasaw Nation"],
  "quotes": ["Notable quote from the content..."]
}
```

## Project Structure

```
Chickasaw-Seatbelt-Creator/
├── App.tsx                    # Main application component
├── index.html                 # HTML entry point
├── index.tsx                  # React entry point
├── types.ts                   # TypeScript types and default prompts
├── components/
│   ├── Header.tsx            # App header
│   ├── TranscriptInput.tsx   # Transcript text/file input
│   ├── ContextInput.tsx      # Additional context input
│   ├── PromptConfig.tsx      # AI prompt configuration
│   └── ResultDisplay.tsx     # Generated content display
├── services/
│   └── geminiService.ts      # Google Gemini API integration
├── package.json
├── vite.config.ts
└── vercel.json               # Vercel deployment config
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Deployment

The app includes a `vercel.json` for easy Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Content Guidelines

The AI follows specific rules to ensure quality output:

- **Evergreen Content**: No relative timeframes ("recently", "this year")
- **Third Person**: Rewrites "I/We" to "He/She/The Team"
- **Concrete Details**: Extracts specific names, numbers, proper nouns
- **Direct Quotes**: Includes 1-2 brief emotional quotes when available

## License

All rights reserved.
