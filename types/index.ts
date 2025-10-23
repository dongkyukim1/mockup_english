// ============================================
// 에이듀 영어 프로그램 - 타입 정의
// ============================================

// ============================================
// 1. 기본 타입
// ============================================

export type Grade = {
  id: string; // "middle-1", "middle-2", "high-1", etc.
  name: string; // "중학교 1학년"
  level: 'middle' | 'high';
  order: number;
  totalUnits: number;
  isMock?: boolean; // 목업 데이터 여부
};

export type TextbookUnit = {
  id: string;
  gradeId: string;
  order: number;
  title: string; // "Lesson 1. My Daily Life"
  topic: string; // "일상생활"
  isMock?: boolean;
  
  // 3가지 학습 영역
  vocabulary: VocabularySection;
  grammar: GrammarSection[];
  reading: ReadingSection;
};

// ============================================
// 2. Vocabulary (단어) 타입
// ============================================

export type Word = {
  id: string;
  english: string;
  korean: string;
  pronunciation?: string;
  exampleSentence: string;
  exampleTranslation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  partOfSpeech?: string; // "noun", "verb", "adjective", etc.
};

export type Phrase = {
  id: string;
  english: string;
  korean: string;
  exampleSentence: string;
  exampleTranslation: string;
};

export type VocabularySection = {
  coreWords: Word[];
  phrases: Phrase[];
  problemSets: VocabProblemSet[];
};

export type VocabProblemSet = {
  id: string;
  unitId: string;
  setType: 'flashcard' | 'A' | 'B' | 'incorrect-1' | 'incorrect-2';
  name: string;
  problems: VocabProblem[];
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  requiredScore?: number;
};

export type VocabQuestionType =
  | 'EN_TO_KO' // 영 → 한
  | 'KO_TO_EN' // 한 → 영
  | 'FILL_IN_BLANK' // 빈칸 채우기
  | 'SENTENCE_COMPLETION' // 예문 완성
  | 'MEANING_FROM_CONTEXT'; // 문맥으로 의미 추론

export type VocabProblem = {
  id: string;
  type: VocabQuestionType;
  wordId: string;
  question: string;
  answer: string;
  options?: string[]; // 객관식 선택지
  example?: string;
  translation?: string;
};

// ============================================
// 3. Grammar (문법) 타입
// ============================================

export type GrammarSection = {
  id: string;
  grammarPoint: string; // "Present Simple Tense"
  koreanName: string; // "현재 시제"
  explanation: string; // 개념 설명
  examples: GrammarExample[];
  problemSets: GrammarProblemSet[];
};

export type GrammarExample = {
  sentence: string;
  translation: string;
  highlight?: string; // 강조할 부분
};

export type GrammarProblemSet = {
  id: string;
  grammarId: string;
  setType: 'A' | 'B' | 'incorrect-1' | 'incorrect-2';
  name: string;
  problems: GrammarProblem[];
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  requiredScore?: number;
};

export type GrammarQuestionType =
  | 'FILL_IN_BLANK' // 빈칸 채우기
  | 'ERROR_CORRECTION' // 틀린 문장 고치기
  | 'SENTENCE_TRANSFORMATION' // 문장 변형
  | 'CHOOSE_CORRECT' // 올바른 문장 고르기
  | 'WORD_FORM'; // 단어 형태 변환

export type GrammarProblem = {
  id: string;
  type: GrammarQuestionType;
  grammarId: string;
  question: string;
  answer: string | string[]; // 복수 정답 가능
  options?: string[] | string[][]; // 객관식 선택지
  originalSentence?: string;
  explanation?: string;
};

// ============================================
// 4. Reading (독해) 타입
// ============================================

export type ReadingSection = {
  passage: string;
  title?: string;
  wordCount: number;
  estimatedMinutes: number;
  problemSets: ReadingProblemSet[];
};

export type ReadingProblemSet = {
  id: string;
  unitId: string;
  setType: 'A' | 'B' | 'incorrect-1';
  name: string;
  problems: ReadingProblem[];
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  requiredScore?: number;
};

export type ReadingQuestionType =
  | 'MAIN_IDEA' // 주제/제목
  | 'DETAIL' // 세부사항
  | 'INFERENCE' // 추론
  | 'VOCABULARY' // 어휘
  | 'PURPOSE'; // 목적

export type ReadingProblem = {
  id: string;
  type: ReadingQuestionType;
  question: string;
  answer: string;
  options: string[];
  paragraph?: number; // 관련 단락 번호
  lineReference?: string; // 줄 참조
  explanation?: string;
};

// ============================================
// 5. 진행상황 및 성적 타입
// ============================================

export type ProgressData = {
  userId: string;
  grades: {
    [gradeId: string]: GradeProgress;
  };
  totalWordsLearned: number;
  streakDays: number;
  lastStudyDate: string;
};

export type GradeProgress = {
  units: {
    [unitId: string]: UnitProgress;
  };
};

export type UnitProgress = {
  vocabulary: {
    flashcardProgress: FlashcardProgress;
    completedSets: string[]; // 완료한 세트 ID
    scores: { [setId: string]: number };
    wrongProblems: string[]; // 틀린 문제 ID
  };
  grammar: {
    [grammarId: string]: {
      completedSets: string[];
      scores: { [setId: string]: number };
      wrongProblems: string[];
    };
  };
  reading: {
    readingTime?: number; // 초 단위
    completedSets: string[];
    scores: { [setId: string]: number };
    wrongProblems: string[];
  };
};

export type FlashcardProgress = {
  masteredWords: string[]; // 외운 단어 ID
  reviewWords: string[]; // 복습할 단어 ID
  lastReview: string;
};

// ============================================
// 6. 통계 및 대시보드 타입
// ============================================

export type TodayStats = {
  learnedWords: number;
  completedSets: number;
  studyTime: number; // 분
  averageScore: number;
  currentUnit?: string;
};

export type NextRecommendation = {
  type: 'vocabulary' | 'grammar' | 'reading';
  gradeId: string;
  unitId: string;
  setId: string;
  message: string;
};

export type WeakArea = {
  type: 'vocabulary' | 'grammar' | 'reading';
  name: string;
  errorRate: number;
  problems: string[]; // 틀린 문제 ID들
};

// ============================================
// 7. UI 상태 타입
// ============================================

export type SetStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export type LearningArea = 'vocabulary' | 'grammar' | 'reading';

export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';

// ============================================
// 8. 문제 풀이 세션 타입
// ============================================

export type ProblemSession = {
  id: string;
  userId: string;
  setId: string;
  setType: LearningArea;
  startTime: string;
  endTime?: string;
  totalProblems: number;
  answers: Answer[];
  score?: number;
  timeSpent?: number; // 초
};

export type Answer = {
  problemId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  timeSpent?: number; // 초
};

// ============================================
// 9. 결과 페이지 타입
// ============================================

export type ResultData = {
  sessionId: string;
  setName: string;
  unitTitle: string;
  learningArea: LearningArea;
  score: number;
  totalProblems: number;
  correctAnswers: number;
  timeSpent: number; // 초
  weakTypes: string[];
  answers: AnswerDetail[];
  nextRecommendation?: NextRecommendation;
};

export type AnswerDetail = {
  problemId: string;
  question: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  explanation?: string;
  type: string;
};

