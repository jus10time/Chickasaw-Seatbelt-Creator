import React from 'react';
import { Lightbulb } from 'lucide-react';

interface ContextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ContextInput: React.FC<ContextInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
      <div className="border-b border-slate-800 bg-amber-900/20 p-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-200">Additional Information (Optional)</h3>
      </div>
      <div className="p-4">
        <label htmlFor="context" className="block text-xs text-slate-400 mb-2">
          Add missing details not in the transcript (e.g., Speaker names, Dates, Locations) to prevent hallucinations.
        </label>
        <textarea
          id="context"
          className="w-full h-32 p-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-200 placeholder-slate-600"
          placeholder="e.g. The doctor's name is Dr. Sarah Smith. This event took place in Ada, Oklahoma."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};