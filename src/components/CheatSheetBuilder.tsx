import React, { useRef, useMemo } from 'react';
import { useStore } from '../store';
import { CheckSquare, Info } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation, useTranslations } from '../hooks/useTranslation';

export default function CheatSheetBuilder() {
  const { savedPropositions, saveProposition } = useStore();
  const printRef = useRef<HTMLDivElement>(null);

  const rawTitles = ['Proposition 1', 'Proposition 2', 'Measure A'];
  const rawDescs = [
    'Bonds for Water Infrastructure',
    'Funding for Public Education',
    'Local Sales Tax Increase'
  ];

  const titles = useTranslations(rawTitles);
  const descriptions = useTranslations(rawDescs);

  const mockPropositions = useMemo(() => [
    { id: 'prop1', title: titles[0] || rawTitles[0], description: descriptions[0] || rawDescs[0] },
    { id: 'prop2', title: titles[1] || rawTitles[1], description: descriptions[1] || rawDescs[1] },
    { id: 'prop3', title: titles[2] || rawTitles[2], description: descriptions[2] || rawDescs[2] },
  ], [titles, descriptions]);

  const titleText = useTranslation('My Ballot Cheat Sheet');
  const subtitleText = useTranslation('Save your choices and print them.');
  const exportBtn = useTranslation('Export PDF');
  const helperText = useTranslation('Save & print to take with you to the booth.');
  const yesText = useTranslation('YES');
  const noText = useTranslation('NO');
  const undecidedText = useTranslation('Undecided');

  const handlePrint = async () => {
    if (!printRef.current) return;
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ballot-cheat-sheet.pdf');
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  return (
    <section aria-label="Cheat Sheet Builder" className="col-span-1 lg:col-span-8 lg:row-span-2 bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-6 overflow-hidden">
      <div className="flex-1 flex flex-col h-full" ref={printRef}>
        <div className="flex items-center space-x-2 mb-3">
          <CheckSquare size={16} className="text-slate-400" />
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-500 tracking-widest">{titleText}</h2>
            <p className="text-[10px] text-slate-400 leading-tight">{subtitleText}</p>
          </div>
        </div>
        
        <div className="overflow-y-auto space-y-2 flex-grow pr-2">
          {mockPropositions.map((prop) => (
            <div key={prop.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 gap-2">
              <span className="text-xs font-medium text-slate-700 truncate min-w-0 flex-1" title={prop.description}>
                {prop.title}: {prop.description}
              </span>
              
              <fieldset aria-label={`Vote choice for ${prop.title}`} className="flex gap-1 shrink-0">
                <label className={`w-10 h-6 flex items-center justify-center rounded text-[10px] font-bold cursor-pointer transition-colors ${savedPropositions[prop.id] === 'yes' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                  <input 
                    type="radio" 
                    name={prop.id} 
                    value="yes"
                    className="sr-only" 
                    checked={savedPropositions[prop.id] === 'yes'}
                    onChange={() => saveProposition(prop.id, 'yes')}
                  />
                  {yesText.toUpperCase()}
                </label>
                <label className={`w-10 h-6 flex items-center justify-center rounded text-[10px] font-bold cursor-pointer transition-colors ${savedPropositions[prop.id] === 'no' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                  <input 
                    type="radio" 
                    name={prop.id} 
                    value="no"
                    className="sr-only" 
                    checked={savedPropositions[prop.id] === 'no'}
                    onChange={() => saveProposition(prop.id, 'no')}
                  />
                  {noText.toUpperCase()}
                </label>
                <label className={`w-14 h-6 flex items-center justify-center rounded text-[10px] italic font-medium cursor-pointer transition-colors ${savedPropositions[prop.id] === 'undecided' ? 'bg-amber-500 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}>
                  <input 
                    type="radio" 
                    name={prop.id} 
                    value="undecided"
                    className="sr-only" 
                    checked={savedPropositions[prop.id] === 'undecided'}
                    onChange={() => saveProposition(prop.id, 'undecided')}
                  />
                  {undecidedText}
                </label>
              </fieldset>
            </div>
          ))}
        </div>
      </div>

      <div className="sm:w-40 flex flex-col justify-center sm:border-l sm:border-slate-100 sm:pl-6 shrink-0 pt-4 sm:pt-0 border-t border-slate-100">
        <button 
          onClick={handlePrint}
          className="mb-2 w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:ring-slate-900 focus:outline-none hover:bg-slate-800 transition-colors"
        >
          {exportBtn}
        </button>
        <p className="text-[10px] text-slate-400 text-center leading-tight">{helperText}</p>
      </div>
    </section>
  );
}
