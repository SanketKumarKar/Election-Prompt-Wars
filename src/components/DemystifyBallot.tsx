import React, { useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import { Loader2, FileText, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function DemystifyBallot() {
  const [legalText, setLegalText] = useState('');
  const [resultHTML, setResultHTML] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemystify = async () => {
    if (!legalText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResultHTML('');

    try {
      const systemInstruction = "You are a non-partisan civic educator. Translate this legal text into a 5th-grade reading level summary. List 3 Pros and 3 Cons. Do not hallucinate. Do not express political bias. Output the response in Markdown format, with headers for the Summary, Pros, and Cons.";
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: legalText,
        config: { systemInstruction }
      });

      if (!response.text) {
        throw new Error('Failed to process the text');
      }

      // Parse markdown to HTML
      const rawHTML = await marked.parse(response.text);
      
      // Sanitize the HTML before injecting it into the DOM
      const safeHTML = DOMPurify.sanitize(rawHTML);
      setResultHTML(safeHTML);
    } catch (err) {
      console.error(err);
      setError('An error occurred while attempting to demystify the text. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-label="Demystify Ballot" className="col-span-1 lg:col-span-4 lg:row-span-3 bg-emerald-50 rounded-2xl border-2 border-emerald-100 shadow-sm flex flex-col overflow-hidden">
      <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex items-center space-x-2 shrink-0">
        <div className="p-1 px-1.5 bg-emerald-600 rounded-lg">
          <FileText size={14} className="text-white" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Demystify Ballot</h2>
          <p className="text-[10px] text-emerald-800 font-medium">Paste complex legal text for a summary.</p>
        </div>
      </div>
      
      <div className="p-4 space-y-3 flex-grow overflow-y-auto">
        <div>
          <label htmlFor="legal-text" className="block text-sm font-medium text-slate-700 mb-1">
            Legal Proposition Text
          </label>
          <textarea
            id="legal-text"
            rows={4}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white outline-none resize-none text-sm shadow-sm"
            placeholder="Paste the confusing legalese here..."
            value={legalText}
            onChange={(e) => setLegalText(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleDemystify}
          disabled={isLoading || !legalText.trim()}
          className="w-full flex justify-center items-center px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-all text-sm"
          aria-label="Demystify Text"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Analyzing Text...
            </>
          ) : (
            <>
              <Send className="mr-2" size={20} />
              Demystify
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <div aria-live="polite" className="mt-4">
          {resultHTML && (
            <div className="bg-white p-4 rounded-lg border border-emerald-200 prose prose-sm prose-emerald max-w-none shadow-sm">
              <div dangerouslySetInnerHTML={{ __html: resultHTML }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
