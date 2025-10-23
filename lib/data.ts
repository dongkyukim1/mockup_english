// ============================================
// 에이듀 영어 프로그램 - 목업 데이터
// ============================================

import type {
  Grade,
  TextbookUnit,
  Word,
  Phrase,
  VocabProblem,
  GrammarSection,
  GrammarProblem,
  ReadingProblem,
} from '@/types';

// ============================================
// 학년 데이터
// ============================================

export const GRADES: Grade[] = [
  {
    id: 'middle-1',
    name: '중학교 1학년',
    level: 'middle',
    order: 1,
    totalUnits: 10,
    isMock: false,
  },
  {
    id: 'middle-2',
    name: '중학교 2학년',
    level: 'middle',
    order: 2,
    totalUnits: 10,
    isMock: false,
  },
  {
    id: 'middle-3',
    name: '중학교 3학년',
    level: 'middle',
    order: 3,
    totalUnits: 10,
    isMock: true,
  },
  {
    id: 'high-1',
    name: '고등학교 1학년',
    level: 'high',
    order: 4,
    totalUnits: 12,
    isMock: true,
  },
  {
    id: 'high-2',
    name: '고등학교 2학년',
    level: 'high',
    order: 5,
    totalUnits: 12,
    isMock: true,
  },
  {
    id: 'high-3',
    name: '고등학교 3학년',
    level: 'high',
    order: 6,
    totalUnits: 12,
    isMock: true,
  },
];

// ============================================
// 중1 단원 데이터
// ============================================

const MIDDLE_1_LESSON_1_WORDS: Word[] = [
  {
    id: 'm1-l1-w1',
    english: 'wake up',
    korean: '일어나다',
    exampleSentence: 'I wake up at 7 every morning.',
    exampleTranslation: '나는 매일 아침 7시에 일어난다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w2',
    english: 'brush',
    korean: '(양치/빗질을) 하다',
    exampleSentence: 'I brush my teeth twice a day.',
    exampleTranslation: '나는 하루에 두 번 양치를 한다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w3',
    english: 'breakfast',
    korean: '아침식사',
    exampleSentence: 'I eat breakfast with my family.',
    exampleTranslation: '나는 가족과 함께 아침을 먹는다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w4',
    english: 'school',
    korean: '학교',
    exampleSentence: 'I go to school by bus.',
    exampleTranslation: '나는 버스로 학교에 간다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w5',
    english: 'lunch',
    korean: '점심식사',
    exampleSentence: 'We have lunch at 12:30.',
    exampleTranslation: '우리는 12시 30분에 점심을 먹는다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w6',
    english: 'study',
    korean: '공부하다',
    exampleSentence: 'I study English every day.',
    exampleTranslation: '나는 매일 영어를 공부한다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w7',
    english: 'homework',
    korean: '숙제',
    exampleSentence: 'I do my homework after school.',
    exampleTranslation: '나는 방과 후에 숙제를 한다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w8',
    english: 'dinner',
    korean: '저녁식사',
    exampleSentence: 'We have dinner at 7 PM.',
    exampleTranslation: '우리는 저녁 7시에 저녁식사를 한다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w9',
    english: 'watch',
    korean: '보다',
    exampleSentence: 'I watch TV in the evening.',
    exampleTranslation: '나는 저녁에 TV를 본다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w10',
    english: 'sleep',
    korean: '자다',
    exampleSentence: 'I go to sleep at 10 PM.',
    exampleTranslation: '나는 저녁 10시에 잔다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w11',
    english: 'shower',
    korean: '샤워',
    exampleSentence: 'I take a shower before bed.',
    exampleTranslation: '나는 자기 전에 샤워를 한다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w12',
    english: 'friend',
    korean: '친구',
    exampleSentence: 'I play with my friends.',
    exampleTranslation: '나는 친구들과 논다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w13',
    english: 'usually',
    korean: '보통',
    exampleSentence: 'I usually walk to school.',
    exampleTranslation: '나는 보통 학교에 걸어간다.',
    difficulty: 'basic',
    partOfSpeech: 'adverb',
  },
  {
    id: 'm1-l1-w14',
    english: 'sometimes',
    korean: '때때로',
    exampleSentence: 'I sometimes play soccer.',
    exampleTranslation: '나는 때때로 축구를 한다.',
    difficulty: 'basic',
    partOfSpeech: 'adverb',
  },
  {
    id: 'm1-l1-w15',
    english: 'always',
    korean: '항상',
    exampleSentence: 'I always do my best.',
    exampleTranslation: '나는 항상 최선을 다한다.',
    difficulty: 'basic',
    partOfSpeech: 'adverb',
  },
  {
    id: 'm1-l1-w16',
    english: 'weekend',
    korean: '주말',
    exampleSentence: 'I rest on the weekend.',
    exampleTranslation: '나는 주말에 쉰다.',
    difficulty: 'basic',
    partOfSpeech: 'noun',
  },
  {
    id: 'm1-l1-w17',
    english: 'exercise',
    korean: '운동하다',
    exampleSentence: 'I exercise every morning.',
    exampleTranslation: '나는 매일 아침 운동한다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w18',
    english: 'read',
    korean: '읽다',
    exampleSentence: 'I read books before bed.',
    exampleTranslation: '나는 자기 전에 책을 읽는다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w19',
    english: 'help',
    korean: '돕다',
    exampleSentence: 'I help my mom with cooking.',
    exampleTranslation: '나는 엄마의 요리를 돕는다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
  {
    id: 'm1-l1-w20',
    english: 'play',
    korean: '놀다, 경기하다',
    exampleSentence: 'I play basketball after school.',
    exampleTranslation: '나는 방과 후에 농구를 한다.',
    difficulty: 'basic',
    partOfSpeech: 'verb',
  },
];

const MIDDLE_1_LESSON_1_PHRASES: Phrase[] = [
  {
    id: 'm1-l1-p1',
    english: 'get ready for',
    korean: '~을 준비하다',
    exampleSentence: 'I get ready for school.',
    exampleTranslation: '나는 학교 갈 준비를 한다.',
  },
  {
    id: 'm1-l1-p2',
    english: 'go to bed',
    korean: '잠자리에 들다',
    exampleSentence: 'I go to bed early.',
    exampleTranslation: '나는 일찍 잠자리에 든다.',
  },
  {
    id: 'm1-l1-p3',
    english: 'have breakfast/lunch/dinner',
    korean: '아침/점심/저녁을 먹다',
    exampleSentence: 'We have breakfast together.',
    exampleTranslation: '우리는 함께 아침을 먹는다.',
  },
  {
    id: 'm1-l1-p4',
    english: 'after school',
    korean: '방과 후에',
    exampleSentence: 'I play soccer after school.',
    exampleTranslation: '나는 방과 후에 축구를 한다.',
  },
  {
    id: 'm1-l1-p5',
    english: 'on weekends',
    korean: '주말에',
    exampleSentence: 'I meet my friends on weekends.',
    exampleTranslation: '나는 주말에 친구들을 만난다.',
  },
  {
    id: 'm1-l1-p6',
    english: 'take a shower',
    korean: '샤워하다',
    exampleSentence: 'I take a shower every morning.',
    exampleTranslation: '나는 매일 아침 샤워한다.',
  },
  {
    id: 'm1-l1-p7',
    english: 'do homework',
    korean: '숙제하다',
    exampleSentence: 'I do homework in my room.',
    exampleTranslation: '나는 내 방에서 숙제한다.',
  },
  {
    id: 'm1-l1-p8',
    english: 'watch TV',
    korean: 'TV를 보다',
    exampleSentence: 'I watch TV after dinner.',
    exampleTranslation: '나는 저녁 식사 후에 TV를 본다.',
  },
  {
    id: 'm1-l1-p9',
    english: 'listen to music',
    korean: '음악을 듣다',
    exampleSentence: 'I listen to music while studying.',
    exampleTranslation: '나는 공부하면서 음악을 듣는다.',
  },
  {
    id: 'm1-l1-p10',
    english: 'play with friends',
    korean: '친구들과 놀다',
    exampleSentence: 'I play with friends in the park.',
    exampleTranslation: '나는 공원에서 친구들과 논다.',
  },
];

const MIDDLE_1_LESSON_1_GRAMMAR: GrammarSection[] = [
  {
    id: 'm1-l1-g1',
    grammarPoint: 'Present Simple Tense',
    koreanName: '현재 시제 (단순현재)',
    explanation: '습관적인 행동이나 일반적인 사실을 나타낼 때 사용합니다. 주어가 3인칭 단수(he, she, it)일 때는 동사에 -s 또는 -es를 붙입니다.',
    examples: [
      {
        sentence: 'I go to school every day.',
        translation: '나는 매일 학교에 간다.',
        highlight: 'go',
      },
      {
        sentence: 'She likes pizza.',
        translation: '그녀는 피자를 좋아한다.',
        highlight: 'likes',
      },
      {
        sentence: 'We study English on Mondays.',
        translation: '우리는 월요일에 영어를 공부한다.',
        highlight: 'study',
      },
    ],
    problemSets: [],
  },
  {
    id: 'm1-l1-g2',
    grammarPoint: 'Frequency Adverbs',
    koreanName: '빈도 부사',
    explanation: '행동의 빈도를 나타내는 부사입니다. 일반동사 앞, be동사 뒤에 위치합니다. always(항상) > usually(보통) > often(자주) > sometimes(때때로) > never(절대~않다)',
    examples: [
      {
        sentence: 'I always wake up early.',
        translation: '나는 항상 일찍 일어난다.',
        highlight: 'always',
      },
      {
        sentence: 'She is usually happy.',
        translation: '그녀는 보통 행복하다.',
        highlight: 'usually',
      },
      {
        sentence: 'We sometimes play soccer.',
        translation: '우리는 때때로 축구를 한다.',
        highlight: 'sometimes',
      },
    ],
    problemSets: [],
  },
];

const MIDDLE_1_LESSON_1_READING_PASSAGE = `My Daily Life

My name is Tom. I am 13 years old, and I am a middle school student. Let me tell you about my daily life.

Every morning, I wake up at 7 AM. First, I brush my teeth and wash my face. Then, I have breakfast with my family. We usually eat rice, soup, and side dishes together. After breakfast, I get ready for school.

I go to school by bus. School starts at 8:30 AM. I have six classes every day. My favorite subject is English because I like learning new words and talking with my friends in English. I also enjoy PE class because I love playing sports.

At 12:30 PM, we have lunch in the cafeteria. I usually eat with my best friend, Minji. After lunch, we sometimes play basketball in the playground.

School finishes at 3:30 PM. I go home and do my homework. I always do my homework before dinner. Then, I help my mom with cooking or cleaning.

We have dinner at 7 PM. After dinner, I watch TV or read books. Sometimes I play computer games, but my mom says I should not play too much. I usually go to bed at 10 PM.

On weekends, I exercise in the morning and meet my friends in the afternoon. I sometimes go to the movies with them. I enjoy my daily life!`;

export const MIDDLE_1_UNITS: TextbookUnit[] = [
  {
    id: 'middle-1-lesson-1',
    gradeId: 'middle-1',
    order: 1,
    title: 'Lesson 1. My Daily Life',
    topic: '일상생활',
    isMock: false,
    vocabulary: {
      coreWords: MIDDLE_1_LESSON_1_WORDS,
      phrases: MIDDLE_1_LESSON_1_PHRASES,
      problemSets: [],
    },
    grammar: MIDDLE_1_LESSON_1_GRAMMAR,
    reading: {
      passage: MIDDLE_1_LESSON_1_READING_PASSAGE,
      title: 'My Daily Life',
      wordCount: 280,
      estimatedMinutes: 3,
      problemSets: [],
    },
  },
  // Lesson 2-10은 목업 데이터
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `middle-1-lesson-${i + 2}`,
    gradeId: 'middle-1',
    order: i + 2,
    title: `Lesson ${i + 2}. (준비중)`,
    topic: '준비중',
    isMock: true,
    vocabulary: {
      coreWords: [],
      phrases: [],
      problemSets: [],
    },
    grammar: [],
    reading: {
      passage: '',
      wordCount: 0,
      estimatedMinutes: 0,
      problemSets: [],
    },
  })),
];

// ============================================
// 중2~고3 목업 데이터
// ============================================

export const MIDDLE_2_UNITS: TextbookUnit[] = Array.from({ length: 10 }, (_, i) => ({
  id: `middle-2-lesson-${i + 1}`,
  gradeId: 'middle-2',
  order: i + 1,
  title: `Lesson ${i + 1}. (준비중)`,
  topic: '준비중',
  isMock: true,
  vocabulary: {
    coreWords: [],
    phrases: [],
    problemSets: [],
  },
  grammar: [],
  reading: {
    passage: '',
    wordCount: 0,
    estimatedMinutes: 0,
    problemSets: [],
  },
}));

export const MIDDLE_3_UNITS: TextbookUnit[] = Array.from({ length: 10 }, (_, i) => ({
  id: `middle-3-lesson-${i + 1}`,
  gradeId: 'middle-3',
  order: i + 1,
  title: `Lesson ${i + 1}. (준비중)`,
  topic: '준비중',
  isMock: true,
  vocabulary: {
    coreWords: [],
    phrases: [],
    problemSets: [],
  },
  grammar: [],
  reading: {
    passage: '',
    wordCount: 0,
    estimatedMinutes: 0,
    problemSets: [],
  },
}));

export const HIGH_1_UNITS: TextbookUnit[] = Array.from({ length: 12 }, (_, i) => ({
  id: `high-1-lesson-${i + 1}`,
  gradeId: 'high-1',
  order: i + 1,
  title: `Lesson ${i + 1}. (준비중)`,
  topic: '준비중',
  isMock: true,
  vocabulary: {
    coreWords: [],
    phrases: [],
    problemSets: [],
  },
  grammar: [],
  reading: {
    passage: '',
    wordCount: 0,
    estimatedMinutes: 0,
    problemSets: [],
  },
}));

export const HIGH_2_UNITS: TextbookUnit[] = Array.from({ length: 12 }, (_, i) => ({
  id: `high-2-lesson-${i + 1}`,
  gradeId: 'high-2',
  order: i + 1,
  title: `Lesson ${i + 1}. (준비중)`,
  topic: '준비중',
  isMock: true,
  vocabulary: {
    coreWords: [],
    phrases: [],
    problemSets: [],
  },
  grammar: [],
  reading: {
    passage: '',
    wordCount: 0,
    estimatedMinutes: 0,
    problemSets: [],
  },
}));

export const HIGH_3_UNITS: TextbookUnit[] = Array.from({ length: 12 }, (_, i) => ({
  id: `high-3-lesson-${i + 1}`,
  gradeId: 'high-3',
  order: i + 1,
  title: `Lesson ${i + 1}. (준비중)`,
  topic: '준비중',
  isMock: true,
  vocabulary: {
    coreWords: [],
    phrases: [],
    problemSets: [],
  },
  grammar: [],
  reading: {
    passage: '',
    wordCount: 0,
    estimatedMinutes: 0,
    problemSets: [],
  },
}));

// ============================================
// 전체 단원 맵핑
// ============================================

export const ALL_UNITS: { [gradeId: string]: TextbookUnit[] } = {
  'middle-1': MIDDLE_1_UNITS,
  'middle-2': MIDDLE_2_UNITS,
  'middle-3': MIDDLE_3_UNITS,
  'high-1': HIGH_1_UNITS,
  'high-2': HIGH_2_UNITS,
  'high-3': HIGH_3_UNITS,
};

// ============================================
// 헬퍼 함수들
// ============================================

export const getGradeById = (id: string): Grade | undefined => {
  return GRADES.find((grade) => grade.id === id);
};

export const getUnitsByGrade = (gradeId: string): TextbookUnit[] => {
  return ALL_UNITS[gradeId] || [];
};

export const getUnitById = (unitId: string): TextbookUnit | undefined => {
  for (const gradeUnits of Object.values(ALL_UNITS)) {
    const unit = gradeUnits.find((u) => u.id === unitId);
    if (unit) return unit;
  }
  return undefined;
};

