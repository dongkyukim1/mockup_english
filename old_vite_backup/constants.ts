import { VocabQuestionTypes, GrammarQuestionTypes, QuestionType } from './types';

export const ALL_VOCAB_QUESTION_TYPES = Object.values(VocabQuestionTypes);
export const ALL_GRAMMAR_QUESTION_TYPES = Object.values(GrammarQuestionTypes);

export const QUESTION_TYPE_DETAILS: Record<QuestionType, { title: string; description: string }> = {
  [VocabQuestionTypes.FILL_IN_BLANK_MC]: {
    title: '빈칸 채우기 (객관식)',
    description: '문장의 빈칸에 알맞은 단어를 선택하세요.',
  },
  [VocabQuestionTypes.EN_TO_KO_WRITE]: {
    title: '영어 → 한국어 (주관식)',
    description: '영어 단어의 한국어 뜻을 쓰세요.',
  },
  [VocabQuestionTypes.KO_TO_EN_WRITE]: {
    title: '한국어 → 영어 (주관식)',
    description: '한국어 뜻의 영어 단어를 쓰세요.',
  },
  [VocabQuestionTypes.MEANING_FROM_CONTEXT_MC]: {
    title: '문맥 속 의미 파악 (객관식)',
    description: '문장에서 밑줄 친 단어의 올바른 의미를 선택하세요.',
  },
  [VocabQuestionTypes.FILL_IN_BLANK_WRITE]: {
    title: '빈칸 채우기 (주관식)',
    description: '한국어 문장과 일치하도록 빈칸을 채우세요.',
  },
  [GrammarQuestionTypes.FILL_IN_BLANKS_GRAMMAR]: {
    title: '빈칸 채우기 (주관식)',
    description: '빠진 단어를 채워 문장을 완성하세요.',
  },
  [GrammarQuestionTypes.CORRECT_WORD_FORM]: {
    title: '올바른 단어 형태 (객관식)',
    description: '문법에 맞는 올바른 단어 형태를 선택하세요.',
  },
  [GrammarQuestionTypes.ERROR_IDENTIFICATION]: {
    title: '오류 찾기 및 수정',
    description: '문장에서 문법적 오류를 찾아 수정하세요.',
  },
  [GrammarQuestionTypes.SENTENCE_SCRAMBLE]: {
    title: '문장 재배열',
    description: '단어들을 재배열하여 문법적으로 올바른 문장을 만드세요.',
  },
  [GrammarQuestionTypes.FILL_IN_BLANKS_ADVANCED]: {
    title: '빈칸 채우기 (심화)',
    description: '여러 개의 빠진 단어를 채워 문단을 완성하세요.',
  },
};
