import React from 'react';
import DemystifyBallot from './components/DemystifyBallot';
import PollingLocator from './components/PollingLocator';
import VoterRoadmap from './components/VoterRoadmap';
import CheatSheetBuilder from './components/CheatSheetBuilder';
import MultilingualAssistant from './components/MultilingualAssistant';
import GlossaryHover from './components/GlossaryHover';
import IndianElectionProcess from './components/IndianElectionProcess';
import { useStore } from './store';

import { T, useTranslation } from './hooks/useTranslation';

export default function App() {
  const { selectedLanguage, setLanguage } = useStore();
  const languageLabel = useTranslation('Language:');
  const syncAccountBtn = useTranslation('Sync Account');
  const privacyPolicy = useTranslation('Privacy Policy');
  const nonPartisan = useTranslation('Non-Partisan Commitment');
  const wcag = useTranslation('WCAG 2.1 AAA Compliant');

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto bg-slate-50 text-slate-900 font-sans flex flex-col shadow-2xl relative">
      {/* Header */}
      <header className="h-16 px-4 md:px-8 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shrink-0">
            C
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-900 hidden sm:block">
            CivicSync
          </h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-xs md:text-sm font-medium">
            <span className="text-slate-500 hidden sm:inline">{languageLabel}</span>
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 rounded"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <button className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors focus:ring-4 focus:ring-blue-200 text-sm md:text-base whitespace-nowrap" aria-label="Sign In to Sync">
            {syncAccountBtn}
          </button>
        </div>
      </header>

      {/* Main Bento Grid Layout */}
      <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 flex-grow">
        
        {/* Section 1: Voter Roadmap (Top Wide) */}
        <VoterRoadmap />

        {/* Section: Indian Election Process (Full Wide) */}
        <IndianElectionProcess />

        {/* Section 4: Polling Locator (Middle Left) */}
        <PollingLocator />

        {/* Section 5: Demystify My Ballot (Middle Center) */}
        <DemystifyBallot />
        
        {/* Section 3: AI Chat Assistant (Right Tall) */}
        <MultilingualAssistant />
        
        {/* Section 6: Cheat Sheet Builder (Bottom Left) */}
        <CheatSheetBuilder />
        
      </main>
      
      {/* Footer */}
      <footer className="py-3 px-4 md:px-8 bg-slate-900 text-slate-400 text-[10px] md:text-xs flex flex-col md:flex-row items-center justify-between shrink-0 gap-2 md:gap-0">
        <div className="flex items-center gap-4 md:gap-6">
          <span>&copy; 2024 CivicSync Project</span>
          <a href="#" className="hover:text-white underline">{privacyPolicy}</a>
          <a href="#" className="hover:text-white underline">{nonPartisan}</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span>{wcag}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
