import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { TranscriptInput } from './components/TranscriptInput.tsx';
import { PromptConfig } from './components/PromptConfig.tsx';
import { ContextInput } from './components/ContextInput.tsx';
import { ResultDisplay } from './components/ResultDisplay.tsx';
import { generateDocumentStream } from './services/geminiService.ts';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_USER_PROMPT } from './types.ts';
import { Play } from 'lucide-react';

const App: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [contextInfo, setContextInfo] = useState('');
  
  // Load prompts from localStorage or use defaults
  const [systemPrompt, setSystemPrompt] = useState(() => 
    localStorage.getItem('systemPrompt') || DEFAULT_SYSTEM_PROMPT
  );
  const [userPrompt, setUserPrompt] = useState(() => 
    localStorage.getItem('userPrompt') || DEFAULT_USER_PROMPT
  );
  
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('systemPrompt', systemPrompt);
  }, [systemPrompt]);

  useEffect(() => {
    localStorage.setItem('userPrompt', userPrompt);
  }, [userPrompt]);

  const handleProcess = useCallback(async () => {
    if (!transcript.trim()) {
      setError("Please provide a transcript before processing.");
      return;
    }

    setIsProcessing(true);
    setResult('');
    setError(null);

    try {
      await generateDocumentStream(
        transcript,
        contextInfo,
        systemPrompt,
        userPrompt,
        (chunk) => {
          setResult((prev) => prev + chunk);
        }
      );
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  }, [transcript, contextInfo, systemPrompt, userPrompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleDownload = () => {
    // Changed to application/json and .json extension
    const blob = new Blob([result], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="space-y-6 flex flex-col h-full">
            <section>
              <h2 className="text-lg font-semibold text-slate-200 mb-4">1. Input Transcript</h2>
              <TranscriptInput value={transcript} onChange={setTranscript} />
            </section>

            <section>
              <ContextInput value={contextInfo} onChange={setContextInfo} />
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-200 mb-4">3. Configuration</h2>
              <PromptConfig
                systemPrompt={systemPrompt}
                userPrompt={userPrompt}
                onSystemPromptChange={setSystemPrompt}
                onUserPromptChange={setUserPrompt}
              />
            </section>

            <button
              onClick={handleProcess}
              disabled={isProcessing || !transcript.trim()}
              className={`w-full py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold text-lg text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] border border-indigo-500/50 ${
                isProcessing || !transcript.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/20'
              }`}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Process Transcript
                </>
              )}
            </button>
            
            {/* Error Message specific to empty input if user tries to click */}
            {!transcript.trim() && !isProcessing && (
              <p className="text-center text-sm text-slate-500 italic">
                Please enter text or upload a file to enable processing.
              </p>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24">
            <ResultDisplay
              content={result}
              isProcessing={isProcessing}
              onCopy={handleCopy}
              onDownload={handleDownload}
              error={error}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;