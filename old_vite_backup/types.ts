export type AppState = 'MODE_SELECTION' | 'SETUP' | 'GENERATING' | 'TESTING' | 'RESULTS' | 'REVISING_VOCAB' | 'GENERATING_GRAMMAR_REVIEW' | 'REVISING_GRAMMAR';
export type TestMode = 'VOCAB' | 'GRAMMAR';

export interface VocabularyItem {
  "English Word": string;
  "Korean Translation": string;
  "Example Sentence": string;
}

export interface GrammarPoint {
  grammarRule: string;
  koreanGrammarRule: string;
  explanation: string;
  exampleSentence: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const VocabQuestionTypes = {
  FILL_IN_BLANK_MC: 'FILL_IN_BLANK_MC',
  EN_TO_KO_WRITE: 'EN_TO_KO_WRITE',
  KO_TO_EN_WRITE: 'KO_TO_EN_WRITE',
  MEANING_FROM_CONTEXT_MC: 'MEANING_FROM_CONTEXT_MC',
  FILL_IN_BLANK_WRITE: 'FILL_IN_BLANK_WRITE',
} as const;

export const GrammarQuestionTypes = {
    FILL_IN_BLANKS_GRAMMAR: 'FILL_IN_BLANKS_GRAMMAR',
    CORRECT_WORD_FORM: 'CORRECT_WORD_FORM',
    ERROR_IDENTIFICATION: 'ERROR_IDENTIFICATION',
    SENTENCE_SCRAMBLE: 'SENTENCE_SCRAMBLE',
    FILL_IN_BLANKS_ADVANCED: 'FILL_IN_BLANKS_ADVANCED',
} as const;

export type VocabQuestionType = (typeof VocabQuestionTypes)[keyof typeof VocabQuestionTypes];
export type GrammarQuestionType = (typeof GrammarQuestionTypes)[keyof typeof GrammarQuestionTypes];
export type QuestionType = VocabQuestionType | GrammarQuestionType;


export interface Question {
  type: QuestionType;
  question: string;
  // `answer` can be a single string for most types, 
  // or an array of strings for multi-blank questions.
  answer: string | string[]; 
  
  // --- Vocab-specific fields ---
  word?: string; 
  // For single-choice MC (vocab), it's string[].
  // For CORRECT_WORD_FORM (grammar), it's string[][].
  options?: string[] | string[][] | null;
  koreanSentence?: string | null;

  // --- Grammar-specific fields ---
  originalSentence?: string; 
}