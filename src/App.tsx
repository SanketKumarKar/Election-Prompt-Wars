import React, { useEffect, useState } from 'react';
import DemystifyBallot from './components/DemystifyBallot';
import PollingLocator from './components/PollingLocator';
import VoterRoadmap from './components/VoterRoadmap';
import CheatSheetBuilder from './components/CheatSheetBuilder';
import MultilingualAssistant from './components/MultilingualAssistant';
import GlossaryHover from './components/GlossaryHover';
import IndianElectionProcess from './components/IndianElectionProcess';
import { useStore } from './store';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from './lib/firebase';
import type { User } from 'firebase/auth';

import { T, useTranslation } from './hooks/useTranslation';

export default function App() {
  const { selectedLanguage, setLanguage } = useStore();
  const languageLabel = useTranslation('Language:');
  const syncAccountBtn = useTranslation('Sync Account');
  const signOutBtn = useTranslation('Sign Out');
  const privacyPolicy = useTranslation('Privacy Policy');
  const nonPartisan = useTranslation('Non-Partisan Commitment');
  const wcag = useTranslation('WCAG 2.1 AAA Compliant');

  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState<'none' | 'privacy' | 'nonpartisan'>('none');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleAuth = async () => {
    if (user) {
      await signOut(auth);
    } else {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err) {
        console.error("Auth failed:", err);
      }
    }
  };

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
              onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'zh' | 'hi')}
              className="bg-transparent outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 rounded"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <button 
            onClick={handleAuth}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors focus:ring-4 focus:ring-blue-200 text-sm md:text-base whitespace-nowrap" 
            aria-label="Sign In to Sync"
          >
            {user ? signOutBtn : syncAccountBtn}
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
          <button onClick={(e) => { e.preventDefault(); setModalOpen('privacy'); }} className="hover:text-white underline">{privacyPolicy}</button>
          <button onClick={(e) => { e.preventDefault(); setModalOpen('nonpartisan'); }} className="hover:text-white underline">{nonPartisan}</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span>{wcag}</span>
          </div>
        </div>
      </footer>

      {/* Pages Modal */}
      {modalOpen !== 'none' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {modalOpen === 'privacy' ? privacyPolicy : nonPartisan}
              </h2>
              <button 
                onClick={() => setModalOpen('none')}
                className="text-slate-400 hover:text-slate-800 transition-colors py-1 px-2 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="prose prose-sm md:prose-base text-slate-600">
              {modalOpen === 'privacy' && (
                <>
                  <p><strong>Effective Date:</strong> January 1, 2024</p>
                  <p>Welcome to CivicSync. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our services.</p>
                  
                  <h3>1. Information We Collect</h3>
                  <p>We may collect information you provide directly, such as your authentication details (via Google or other OAuth providers), language preferences, and your custom ballot data saved to your profile. If you use the Polling Locator, your location is requested solely for calculating your nearest polling stations.</p>
                  
                  <h3>2. How We Use Your Information</h3>
                  <p>Your information is used strictly to provide the tools inside CivicSync (like translations, saving propositions, or finding polling places). We do not sell or share your data with political advertising agencies.</p>
                  
                  <h3>3. Data Storage & Security</h3>
                  <p>Your authentication limits and customized ballot configurations are stored securely within Firebase. Only authorized users with your login credentials can access your saved data.</p>
                  
                  <h3>4. Contact Us</h3>
                  <p>If you have questions about this privacy policy, please reach out to our privacy team.</p>
                </>
              )}
              {modalOpen === 'nonpartisan' && (
                <>
                  <p>CivicSync is resolutely committed to maintaining a strict non-partisan stance. Our platform does not support, endorse, or oppose any political party, candidate, or legislative proposition.</p>

                  <h3>Our Mission</h3>
                  <p>Our core mission is to provide civic education, clear formatting, and neutral analysis. The AI generated "Pros and Cons" uses language models instructed explicitly to remain neutral and strictly factual.</p>

                  <h3>Platform Neutrality</h3>
                  <p>We do not collect money, sell data to campaigns, or engage in political lobbying. We use reliable, government-provided open data sources via the Google Civic Information API or official databases.</p>

                  <h3>Commitment to Facts</h3>
                  <p>We continuously audit the outputs of the "Demystify Ballot" and "Civic Assistant" tools to ensure that bias or hallucinations are minimized, offering voters a clean, jargon-free way to make up their own minds independently.</p>
                </>
              )}
            </div>
            
            <div className="mt-8 text-right">
              <button 
                onClick={() => setModalOpen('none')}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
