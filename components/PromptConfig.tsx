import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Info, RotateCcw } from 'lucide-react';

interface PromptConfigProps {
  systemPrompt: string;
  userPrompt: string;
  onSystemPromptChange: (val: string) => void;
  onUserPromptChange: (val: string) => void;
  onResetDefaults: () => void;
}

export const PromptConfig: React.FC<PromptConfigProps> = ({
  systemPrompt,
  userPrompt,
  onSystemPromptChange,
  onUserPromptChange,
  onResetDefaults
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 transition-colors border-b border-slate-800"
      >
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>AI Configuration</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>

      {isOpen && (
        <div className="p-6 space-y-6">
          <div className="flex justify-end">
             <button 
               onClick={onResetDefaults}
               className="text-xs flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
               title="Reset to default Chickasaw Nation prompts"
             >
               <RotateCcw className="w-3 h-3" />
               Reset to Defaults
             </button>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
               <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-300">
                System Message (The Format Definition)
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-500 cursor-help" />
                <div className="absolute right-0 w-64 p-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none mb-2 bottom-full">
                  Define the personality, role, and strictly output format here.
                </div>
              </div>
            </div>
            <textarea
              id="systemPrompt"
              className="w-full h-96 p-4 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed text-slate-300 placeholder-slate-600"
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder="Enter your giant system instructions here..."
            />
          </div>

          <div>
             <div className="flex items-center justify-between mb-2">
               <label htmlFor="userPrompt" className="block text-sm font-medium text-slate-300">
                User Message (The Task)
              </label>
              <span className="text-xs text-slate-400 font-mono bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                Use {'{{TRANSCRIPT}}'} as placeholder
              </span>
             </div>
            <textarea
              id="userPrompt"
              className="w-full h-64 p-4 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-slate-300 placeholder-slate-600"
              value={userPrompt}
              onChange={(e) => onUserPromptChange(e.target.value)}
              placeholder="Instructions including {{TRANSCRIPT}}..."
            />
          </div>
        </div>
      )}
    </div>
  );
};