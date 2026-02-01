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

  // RTF Generator
  const handleDownloadRTF = () => {
    if (!parsedData) return;

    const escapeRTF = (text: string) => {
        if (!text) return '';
        // Escape special chars
        let escaped = text.replace(/([{}\\])/g, '\\$1');
        // Handle newlines
        escaped = escaped.replace(/\n/g, '\\par ');
        // Handle unicode
        return escaped.replace(/[^\x00-\x7F]/g, c => `\\u${c.charCodeAt(0)}?`);
    };

    const htmlToRTF = (html: string) => {
        if (!html) return '';
        let rtf = html;
        // Basic HTML tag conversion
        rtf = rtf.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '\\b $1\\b0 ');
        rtf = rtf.replace(/<b[^>]*>(.*?)<\/b>/gi, '\\b $1\\b0 ');
        rtf = rtf.replace(/<em[^>]*>(.*?)<\/em>/gi, '\\i $1\\i0 ');
        rtf = rtf.replace(/<i[^>]*>(.*?)<\/i>/gi, '\\i $1\\i0 ');
        // Paragraphs: Remove opening p, add double par for closing p
        rtf = rtf.replace(/<p[^>]*>/gi, '');
        rtf = rtf.replace(/<\/p>/gi, '\\par\\par ');
        // Line breaks
        rtf = rtf.replace(/<br\s*\/?>/gi, '\\line ');
        // Strip any remaining tags
        rtf = rtf.replace(/<[^>]+>/g, '');
        // Decode common entities
        rtf = rtf.replace(/&nbsp;/g, ' ')
                 .replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"');
        
        return escapeRTF(rtf); 
    };

    // Construct RTF Document
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fswiss\\fcharset0 Helvetica;}{\\f1\\fswiss\\fcharset0 Courier New;}}
{\\colortbl;\\red0\\green0\\blue0;\\red100\\green100\\blue100;\\red79\\green70\\blue229;}
\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\f0\\fs36\\b ${escapeRTF(parsedData.title || 'Untitled')}\\b0\\par
\\fs24\\cf2 ${escapeRTF(parsedData.series || '')} - ${escapeRTF(parsedData.subhead || '')}\\cf0\\par
\\fs20\\i ${escapeRTF(Array.isArray(parsedData.tags) ? parsedData.tags.join(', ') : parsedData.tags || '')}\\i0\\par
\\par
\\fs24\\b\\cf3 SUMMARY\\cf0\\b0\\par
${escapeRTF(parsedData.summary || '')}\\par
\\par
\\b\\cf3 DESCRIPTION\\cf0\\b0\\par
${htmlToRTF(parsedData.description_html || '')}\\par
\\pard\\sa200\\sl276\\slmult1\\cf2\\fs20\\b METADATA\\b0\\par
\\b Slug:\\b0  \\f1 ${escapeRTF(parsedData.slug || '')}\\f0\\par
\\b Keywords:\\b0  ${escapeRTF(parsedData.keywords || '')}\\par
\\b Thumbnail:\\b0  ${escapeRTF(parsedData.thumbnail_concept || '')}\\par
}`;

    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedData.slug || 'content-profile'}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

          {/* New RTF Download Button */}
          {parsedData && (
             <button
              onClick={handleDownloadRTF}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              title="Download Formatted RTF Document"
            >
              <FileText className="w-4 h-4" />
              Download Doc
            </button>
          )}

          {/* Existing JSON Download */}
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