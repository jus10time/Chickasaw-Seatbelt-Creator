import React, { useState, useEffect } from 'react';
import { Copy, Download, RefreshCw, FileCheck, FileJson, FileText, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResultDisplayProps {
  content: string;
  isProcessing: boolean;
  onCopy: () => void;
  onDownload: () => void;
  error?: string | null;
}

interface ParsedContent {
  title?: string;
  slug?: string;
  series?: string;
  tags?: string[] | string;
  subhead?: string;
  summary?: string;
  description_html?: string;
  keywords?: string;
  thumbnail_concept?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  content,
  isProcessing,
  onCopy,
  onDownload,
  error
}) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'json'>('formatted');
  const [parsedData, setParsedData] = useState<ParsedContent | null>(null);

  // Attempt to parse JSON whenever content changes
  useEffect(() => {
    try {
      if (content) {
        const parsed = JSON.parse(content);
        setParsedData(parsed);
      } else {
        setParsedData(null);
      }
    } catch (e) {
      if (!isProcessing) {
         setParsedData(null);
      }
    }
  }, [content, isProcessing]);

  if (!content && !isProcessing && !error) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
        <FileCheck className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium text-slate-400">Ready to Generate</p>
        <p className="text-sm">Import a transcript and click "Process Transcript" to see the result.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col h-full min-h-[600px]">
      
      {/* Header with Tabs and Actions */}
      <div className="border-b border-slate-800 p-2 bg-slate-950/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('formatted')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'formatted'
                ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Document View
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'json'
                ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-4 h-4" />
            Raw JSON
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isProcessing && (
            <span className="flex items-center gap-2 text-xs text-indigo-400 font-medium px-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Generating...
            </span>
          )}
          <div className="h-4 w-px bg-slate-800 mx-1"></div>
          <button
            onClick={onCopy}
            disabled={isProcessing || !content}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Copy to Clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDownload}
            disabled={isProcessing || !content}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-900 relative">
        {error ? (
          <div className="p-8">
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-300">
              <h3 className="font-bold mb-2">Processing Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {/* View: Formatted Document */}
            {activeTab === 'formatted' && (
              <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
                {!parsedData && isProcessing && (
                  <div className="space-y-6 opacity-30">
                    <div className="h-8 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/3 animate-pulse"></div>
                    <div className="space-y-2 mt-8">
                      <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
                    </div>
                  </div>
                )}
                
                {!parsedData && !isProcessing && content && (
                   <div className="text-center py-12 text-slate-500">
                     <FileJson className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                     <p>Invalid JSON format. Switch to "Raw JSON" to view the output.</p>
                   </div>
                )}

                {parsedData && (
                  <>
                    <header className="border-b border-slate-800 pb-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {parsedData.series && (
                          <span className="px-3 py-1 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wide">
                            {parsedData.series}
                          </span>
                        )}
                        {Array.isArray(parsedData.tags) && parsedData.tags.map((tag, i) => (
                           <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                             {tag}
                           </span>
                        ))}
                         {/* Handle string tags */}
                         {typeof parsedData.tags === 'string' && (
                           <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                             {parsedData.tags}
                           </span>
                         )}
                      </div>
                      <h1 className="text-3xl font-bold text-slate-100 mb-2">{parsedData.title}</h1>
                      <h2 className="text-xl text-slate-400 font-medium">{parsedData.subhead}</h2>
                    </header>

                    <section className="bg-amber-950/20 p-6 rounded-xl border border-amber-900/30">
                      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Summary</h3>
                      <p className="text-slate-200 italic leading-relaxed">{parsedData.summary}</p>
                    </section>

                    <section className="prose prose-invert prose-slate max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-indigo-400">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 not-prose">Content Description</h3>
                      {parsedData.description_html ? (
                         <div dangerouslySetInnerHTML={{ __html: parsedData.description_html }} />
                      ) : (
                         <p className="text-slate-500 italic">No description generated.</p>
                      )}
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Slug</h4>
                        <code className="text-sm text-indigo-400 block w-full overflow-hidden text-ellipsis font-mono">
                          {parsedData.slug || 'N/A'}
                        </code>
                      </div>
                       <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">SEO Keywords</h4>
                        <p className="text-sm text-slate-300">{parsedData.keywords || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg md:col-span-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Thumbnail Concept</h4>
                        <p className="text-sm text-slate-300">{parsedData.thumbnail_concept || 'N/A'}</p>
                      </div>
                    </section>
                  </>
                )}
              </div>
            )}

            {/* View: Raw JSON */}
            {activeTab === 'json' && (
              <div className="p-0 h-full bg-slate-950">
                <pre className="p-6 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed overflow-auto h-full">
                  {content || "Waiting for output..."}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};