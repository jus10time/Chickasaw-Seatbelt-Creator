import React, { useState, useRef } from 'react';
import { Upload, Type, X, File as FileIcon } from 'lucide-react';
import { TabType } from '../types.ts';

interface TranscriptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TranscriptInput: React.FC<TranscriptInputProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('paste');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onChange(text);
      };
      reader.readAsText(file);
    }
  };

  const clearFile = () => {
    setFileName(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
      <div className="border-b border-slate-800 flex">
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'paste'
              ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Type className="w-4 h-4" />
          Paste Text
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'upload'
              ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'paste' ? (
          <div>
             <label htmlFor="transcript" className="block text-sm font-medium text-slate-300 mb-2">
              Transcript Content
            </label>
            <textarea
              id="transcript"
              className="w-full h-64 p-4 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-slate-200 resize-y placeholder-slate-600"
              placeholder="Paste your raw transcript here..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <p className="mt-2 text-xs text-slate-500 text-right">
              {value.length} characters
            </p>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg bg-slate-950 hover:bg-slate-900 transition-colors relative">
            {fileName ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileIcon className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-medium text-slate-200">{fileName}</h3>
                <p className="text-xs text-slate-500 mt-1">Ready to process</p>
                <button
                  onClick={clearFile}
                  className="mt-4 inline-flex items-center px-3 py-1.5 border border-red-900/50 text-xs font-medium rounded-full text-red-400 bg-red-900/20 hover:bg-red-900/40 focus:outline-none transition-colors"
                >
                  <X className="w-3 h-3 mr-1" /> Remove
                </button>
              </div>
            ) : (
              <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  .txt, .md, .csv, .json, .vtt, .srt (Max 10MB)
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.md,.csv,.json,.log,.vtt,.srt"
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};