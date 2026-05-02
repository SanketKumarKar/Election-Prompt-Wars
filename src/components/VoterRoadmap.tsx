import React, { useMemo } from 'react';
import { differenceInDays, parseISO, isAfter } from 'date-fns';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { useTranslation, useTranslations } from '../hooks/useTranslation';

interface Stage {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function VoterRoadmap() {
  const electionDate = '2026-11-03'; // mock date

  // Hardcoded stages for the example
  const rawTitles = ['Register to Vote', 'Early Voting Begins', 'Vote by Mail Deadline', 'Election Day'];
  const rawDescs = [
    'Last day to register to vote online or by mail.',
    'Early voting centers open in your county.',
    'Last day to request a mail-in ballot.',
    'Polls are open from 7:00 AM to 8:00 PM.'
  ];

  const titles = useTranslations(rawTitles);
  const descriptions = useTranslations(rawDescs);

  const stages: Stage[] = [
    { id: '1', title: titles[0] || rawTitles[0], date: '2026-10-19', description: descriptions[0] || rawDescs[0] },
    { id: '2', title: titles[1] || rawTitles[1], date: '2026-10-24', description: descriptions[1] || rawDescs[1] },
    { id: '3', title: titles[2] || rawTitles[2], date: '2026-10-27', description: descriptions[2] || rawDescs[2] },
    { id: '4', title: titles[3] || rawTitles[3], date: electionDate, description: descriptions[3] || rawDescs[3] }
  ];

  const currentDate = new Date().toISOString().split('T')[0];

  const daysToElection = useMemo(() => {
    return differenceInDays(parseISO(electionDate), parseISO(currentDate));
  }, [electionDate, currentDate]);

  const roadmapTitle = useTranslation('Voter Journey Roadmap');
  const roadmapDesc = useTranslation('Track your progress and key deadlines.');
  const daysText = useTranslation('Days to Election');
  const needReminderText = useTranslation('Need a reminder?');
  const syncToCalendarText = useTranslation('Sync to Google Calendar');

  const handleSyncToCalendar = () => {
    const title = encodeURIComponent("Election Day");
    const details = encodeURIComponent("Don't forget to vote! Check your ballot and polling location on CivicSync.");
    const startDate = electionDate.replace(/-/g, '') + 'T120000Z';
    const endDate = electionDate.replace(/-/g, '') + 'T130000Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startDate}/${endDate}`;
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section aria-label="Voter Roadmap" className="col-span-1 lg:col-span-12 row-span-1 bg-white rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col justify-center overflow-hidden">
      <div className="bg-blue-50 border-b border-blue-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{roadmapTitle}</h2>
            <p className="text-sm text-slate-500">{roadmapDesc}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{Math.max(0, daysToElection)}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{daysText}</div>
        </div>
      </div>
      
      <div className="p-6 overflow-x-auto">
        <div className="flex items-center min-w-[700px]">
          {stages.map((stage, idx) => {
            const isPast = isAfter(parseISO(currentDate), parseISO(stage.date));
            const isToday = stage.date === currentDate;
            const isNext = !isPast && !isToday && (idx === 0 || isAfter(parseISO(currentDate), parseISO(stages[idx - 1].date)));

            return (
              <React.Fragment key={stage.id}>
                {/* Stage node */}
                <div className="relative flex flex-col items-center group w-48 shrink-0">
                  <div className="h-20 mb-2 p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity absolute -top-24 bg-slate-800 text-white text-xs rounded shadow-lg z-10 w-44 pointer-events-none">
                    <span className="font-bold block mb-1">{stage.date}</span>
                    {stage.description}
                  </div>
                  
                  <button 
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    aria-label={`Stage: ${stage.title}, Date: ${stage.date}, ${isPast ? 'Completed' : 'Upcoming'}`}
                  >
                    {isPast ? (
                      <CheckCircle size={32} className="text-blue-500 bg-white" />
                    ) : isNext || isToday ? (
                      <div className="w-8 h-8 rounded-full border-4 border-blue-500 bg-white flex items-center justify-center shadow-[0_0_0_4px_rgba(59,130,246,0.2)]">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    ) : (
                      <Circle size={32} className="text-slate-300" />
                    )}
                  </button>
                  
                  <div className="mt-3 text-center">
                    <h3 className={`text-sm font-semibold ${isPast || isNext ? 'text-slate-900' : 'text-slate-500'}`}>
                      {stage.title}
                    </h3>
                    <span className="text-xs text-slate-500 block">{stage.date}</span>
                  </div>
                </div>

                {/* Connecting Line */}
                {idx < stages.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-slate-200 mt-[-50px]">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: isPast ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-600 flex justify-between items-center">
        <span>{needReminderText}</span>
        <button 
          onClick={handleSyncToCalendar}
          className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded text-xs"
        >
          {syncToCalendarText}
        </button>
      </div>
    </section>
  );
}
