import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VoterState } from './types';

interface AppState extends VoterState {
  setLanguage: (lang: VoterState['selectedLanguage']) => void;
  saveProposition: (propId: string, choice: 'yes' | 'no' | 'undecided') => void;
  registerVoter: () => void;
  updateFromSync: (data: Partial<VoterState>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasRegistered: false,
      selectedLanguage: 'en',
      savedPropositions: {},
      setLanguage: (lang) => set({ selectedLanguage: lang }),
      saveProposition: (propId, choice) => 
        set((state) => ({ 
          savedPropositions: { ...state.savedPropositions, [propId]: choice } 
        })),
      registerVoter: () => set({ hasRegistered: true }),
      updateFromSync: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'civicsync-storage', // name of the item in the storage (must be unique)
    }
  )
);
