import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GlossaryHoverProps {
  term: string;
  children: React.ReactNode;
}

export default function GlossaryHover({ term, children }: GlossaryHoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [definition, setDefinition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const fetchDefinition = async () => {
    if (definition) return;
    setIsLoading(true);
    try {
      const systemInstruction = "Define this civic or electoral term in one short, clear, unbiased sentence for a general audience.";
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: term,
        config: { systemInstruction }
      });
      setDefinition(response.text || 'Could not parse definition.');
    } catch (error) {
      console.error(error);
      setDefinition('Could not load definition.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
    fetchDefinition();
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
      if (!isOpen) fetchDefinition();
    }
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        popoverRef.current && 
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        className="underline decoration-dotted decoration-indigo-400 font-medium text-indigo-700 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-0.5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {children}
      </button>

      {isOpen && (
        <div 
          ref={popoverRef}
          role="dialog"
          aria-label={`Definition of ${term}`}
          className="absolute z-50 w-64 p-4 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm rounded-lg shadow-xl"
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
          
          <h4 className="font-bold text-indigo-300 mb-1 capitalize border-b border-slate-700 pb-1">{term}</h4>
          <div aria-live="polite">
            {isLoading ? (
              <div className="flex items-center text-slate-300 mt-2">
                <Loader2 size={14} className="animate-spin mr-2" />
                <span>Loading definition...</span>
              </div>
            ) : (
              <p className="mt-1 leading-relaxed text-slate-200">{definition}</p>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
