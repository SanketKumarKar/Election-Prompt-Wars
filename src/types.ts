export interface VoterState {
  hasRegistered: boolean;
  selectedLanguage: 'en' | 'es' | 'zh' | 'hi';
  savedPropositions: Record<string, 'yes' | 'no' | 'undecided'>;
}

export interface BallotMeasure {
  id: string;
  title: string;
  description: string;
  summary?: string;
  pros?: string[];
  cons?: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}
