import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-inner shadow-indigo-400/30">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Chickasaw Seatbelt Generator <Sparkles className="w-4 h-4 text-indigo-400" />
            </h1>
            <p className="text-xs text-slate-400 font-medium">AI-Powered Document Generation</p>
          </div>
        </div>
      </div>
    </header>
  );
};