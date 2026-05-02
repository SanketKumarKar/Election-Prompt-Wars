import React, { useState } from 'react';
import { useStore } from '../store';
import { MessageSquare, Send, Loader2, Bot } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function MultilingualAssistant() {
  const { selectedLanguage } = useStore();
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, html?: string}[]>([
    { role: 'bot', text: 'Hello! I am your non-partisan civic assistant. Ask me anything about the election process.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const systemInstruction = `You are a non-partisan, highly knowledgeable civic educator and voter assistant. Provide factual, unbiased answers about the election process, timelines, and voter rights. You must answer in ${selectedLanguage || 'English'} language.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: { systemInstruction }
      });

      if (!response.text) throw new Error('API Error');
      
      const rawHTML = await marked.parse(response.text);
      const safeHTML = DOMPurify.sanitize(rawHTML);

      setMessages(prev => [...prev, { role: 'bot', text: response.text, html: safeHTML }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-label="AI Procedural Assistant" className="col-span-1 lg:col-span-4 lg:row-span-5 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm flex flex-col h-full min-h-[400px]">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center space-x-3 shrink-0">
        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">AI Procedural Assistant</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs">AI</div>
            )}
            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-900 rounded-tl-none'
            }`}>
              {msg.html ? (
                <div 
                  className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1" 
                  dangerouslySetInnerHTML={{ __html: msg.html }} 
                />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs">AI</div>
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-3 flex items-center">
              <Loader2 className="animate-spin mr-2" size={16} />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="flex items-center bg-white border border-slate-300 rounded-lg p-2 gap-2">
          <label htmlFor="chat-input" className="sr-only">Type your question</label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a question..."
            className="flex-grow bg-transparent outline-none text-sm px-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
