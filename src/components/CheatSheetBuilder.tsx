import React from 'react';
import { useStore } from '../store';
import { CheckSquare, Info } from 'lucide-react';

export default function CheatSheetBuilder() {
  const { savedPropositions, saveProposition } = useStore();

  const mockPropositions = [
    { id: 'prop1', title: 'Proposition 1', description: 'Bonds for Water Infrastructure' },
    { id: 'prop2', title: 'Proposition 2', description: 'Funding for Public Education' },
    { id: 'prop3', title: 'Measure A', description: 'Local Sales Tax Increase' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section aria-label="Cheat Sheet Builder" className="col-span-1 lg:col-span-8 lg:row-span-2 bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-6 overflow-hidden">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center space-x-2 mb-3">
          <CheckSquare size={16} className="text-slate-400" />
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-500 tracking-widest">My Ballot Cheat Sheet</h2>
            <p className="text-[10px] text-slate-400 leading-tight">Save your choices and print them.</p>
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
                  YES
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
                  NO
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
                  Undecided
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
          Export PDF
        </button>
        <p className="text-[10px] text-slate-400 text-center leading-tight">Save & print to take with you to the booth.</p>
      </div>
    </section>
  );
}
