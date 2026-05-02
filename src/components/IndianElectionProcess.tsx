import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Users, Megaphone, CheckCircle, BarChart3, Building, ChevronRight } from 'lucide-react';
import { useTranslation, useTranslations } from '../hooks/useTranslation';

const stepIcons = [
  <Landmark className="w-12 h-12 text-orange-500" key="1" />,
  <Users className="w-12 h-12 text-blue-500" key="2" />,
  <Megaphone className="w-12 h-12 text-pink-500" key="3" />,
  <CheckCircle className="w-12 h-12 text-emerald-500" key="4" />,
  <BarChart3 className="w-12 h-12 text-purple-500" key="5" />,
  <Building className="w-12 h-12 text-teal-500" key="6" />
];

const stepColors = [
  { color: 'bg-orange-100', borderColor: 'border-orange-300' },
  { color: 'bg-blue-100', borderColor: 'border-blue-300' },
  { color: 'bg-pink-100', borderColor: 'border-pink-300' },
  { color: 'bg-emerald-100', borderColor: 'border-emerald-300' },
  { color: 'bg-purple-100', borderColor: 'border-purple-300' },
  { color: 'bg-teal-100', borderColor: 'border-teal-300' }
];

export default function IndianElectionProcess() {
  const [activeStep, setActiveStep] = useState(0);

  const rawTitles = ['Announcement', 'Nominations', 'Campaigning', 'Voting Day', 'Counting', 'Govt Formation'];
  const rawDescs = [
    'The Election Commission of India (ECI) announces the election schedule, activating the Model Code of Conduct to ensure fair play.',
    'Candidates from various political parties (and independents) file their nomination papers, declaring their assets and criminal records.',
    'Parties release manifestos and campaign vigorously through rallies, media, and door-to-door visits. Campaigning stops 48 hours before voting.',
    'Citizens cast their votes using Electronic Voting Machines (EVMs) equipped with VVPAT for verification at secure polling booths.',
    'EVMs are kept in strong rooms until counting day. Votes are tallied under strict surveillance, and results are declared.',
    'The party or coalition securing a majority (e.g., 272+ seats in Lok Sabha) is invited by the President to form the government.'
  ];

  const titles = useTranslations(rawTitles);
  const descriptions = useTranslations(rawDescs);

  const steps = useMemo(() => {
    return rawTitles.map((_, i) => ({
      id: i + 1,
      title: titles[i] || rawTitles[i],
      description: descriptions[i] || rawDescs[i],
      icon: stepIcons[i],
      ...stepColors[i]
    }));
  }, [titles, descriptions]);

  const guideText = useTranslation('Interactive Guide');
  const howIndiaVotesText = useTranslation('How India Votes');
  const subtitleText = useTranslation("The 6-step journey of the world's largest democracy.");
  const backText = useTranslation('Back');
  const startOverText = useTranslation('Start Over');
  const nextText = useTranslation('Next');

  return (
    <section aria-label="Election Process in India" className="col-span-1 lg:col-span-12 row-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl border-2 border-slate-800 shadow-xl flex flex-col p-4 sm:p-6 overflow-hidden text-white relative">
      {/* Background Graphic */}
      <div className="absolute -top-10 -right-10 p-8 opacity-5 pointer-events-none">
        <Landmark size={300} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 uppercase tracking-widest border border-indigo-500/30">{guideText}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{howIndiaVotesText}</h2>
            <p className="text-sm text-indigo-200 mt-1">{subtitleText}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-300 text-sm font-medium hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {backText}
            </button>
            <button 
              onClick={() => setActiveStep(activeStep === steps.length - 1 ? 0 : activeStep + 1)}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors shadow-md flex items-center gap-1"
            >
              {activeStep === steps.length - 1 ? startOverText : nextText}
              <ChevronRight size={16} className={activeStep === steps.length - 1 ? "hidden" : "block"} />
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mt-2">
          
          {/* Progress Sidebar */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left shrink-0 lg:shrink w-48 lg:w-full ${
                  activeStep === index 
                    ? 'bg-white/10 shadow-sm border border-white/20' 
                    : 'hover:bg-white/5 border border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${activeStep === index ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {index + 1}
                </div>
                <span className={`text-sm font-bold ${activeStep === index ? 'text-white' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Animated Main Content */}
          <div className="lg:col-span-8 relative min-h-[220px] flex items-center justify-center bg-slate-800/50 rounded-2xl border border-white/10 p-6 sm:p-10 overflow-hidden shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left"
              >
                <motion.div 
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className={`w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl flex items-center justify-center shadow-2xl ${steps[activeStep].color} ${steps[activeStep].borderColor} border-4`}
                >
                  {steps[activeStep].icon}
                </motion.div>
                
                <div className="flex-1 flex flex-col justify-center mt-2 sm:mt-0">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-sm sm:text-base text-indigo-100 leading-relaxed font-medium">
                    {steps[activeStep].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
