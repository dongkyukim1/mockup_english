// ============================================
// Gemini AI 서비스 - Next.js 버전
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai';

// API 키 체크
const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.warn('⚠️ Gemini API Key가 설정되지 않았습니다. AI 기능이 비활성화됩니다.');
    return null;
  }
  
  return apiKey;
};

let ai: GoogleGenerativeAI | null = null;

const initializeAI = () => {
  const apiKey = getApiKey();
  if (apiKey && !ai) {
    ai = new GoogleGenerativeAI(apiKey);
  }
  return ai;
};

// ============================================
// 1. 단어 테스트 생성
// ============================================

export interface VocabTestQuestion {
  id: string;
  type: 'eng-to-kor' | 'kor-to-eng' | 'fill-blank';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export const generateVocabTest = async (
  words: { english: string; korean: string; exampleSentence: string }[],
  count: number = 10,
  testType: 'eng-to-kor' | 'kor-to-eng' | 'fill-blank' | 'mixed' = 'mixed'
): Promise<VocabTestQuestion[]> => {
  const aiInstance = initializeAI();
  
  if (!aiInstance) {
    // API 키가 없으면 간단한 목업 문제 반환
    return generateMockVocabTest(words, count, testType);
  }

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
다음 단어 목록을 사용하여 ${count}개의 영어 단어 테스트 문제를 생성해주세요.

단어 목록:
${words.map((w, i) => `${i + 1}. ${w.english} - ${w.korean} (예문: ${w.exampleSentence})`).join('\n')}

문제 유형: ${testType === 'mixed' ? '영→한, 한→영, 빈칸 채우기 혼합' : testType}

요구사항:
1. 각 문제는 4개의 선택지를 가져야 합니다
2. 선택지는 제시된 단어 목록에서만 선택
3. JSON 배열 형식으로 반환
4. 각 문제 구조:
{
  "id": "q1",
  "type": "eng-to-kor" | "kor-to-eng" | "fill-blank",
  "question": "문제 텍스트",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "correctAnswer": "정답",
  "explanation": "간단한 설명"
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // JSON 추출
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API 오류:', error);
    return generateMockVocabTest(words, count, testType);
  }
};

// 목업 테스트 생성 (API 키 없을 때)
const generateMockVocabTest = (
  words: { english: string; korean: string; exampleSentence: string }[],
  count: number,
  testType: string
): VocabTestQuestion[] => {
  const questions: VocabTestQuestion[] = [];
  const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, count);
  
  shuffledWords.forEach((word, index) => {
    const otherWords = words.filter(w => w.english !== word.english);
    const randomOptions = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.korean);
    
    const options = [...randomOptions, word.korean].sort(() => Math.random() - 0.5);
    
    questions.push({
      id: `q${index + 1}`,
      type: 'eng-to-kor',
      question: `"${word.english}"의 뜻으로 알맞은 것은?`,
      options,
      correctAnswer: word.korean,
      explanation: `정답: ${word.korean}`,
    });
  });
  
  return questions;
};

// ============================================
// 2. 문법 테스트 생성
// ============================================

export interface GrammarTestQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'error-correction';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export const generateGrammarTest = async (
  grammarPoint: string,
  explanation: string,
  examples: string[],
  count: number = 8
): Promise<GrammarTestQuestion[]> => {
  const aiInstance = initializeAI();
  
  if (!aiInstance) {
    return generateMockGrammarTest(grammarPoint, count);
  }

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
다음 문법 포인트에 대한 ${count}개의 테스트 문제를 생성해주세요.

문법 포인트: ${grammarPoint}
설명: ${explanation}
예문:
${examples.join('\n')}

문제 유형:
- 객관식 (multiple-choice): 4개 선택지
- 빈칸 채우기 (fill-blank)
- 오류 찾기 (error-correction)

JSON 배열 형식으로 반환:
[
  {
    "id": "q1",
    "type": "multiple-choice",
    "question": "다음 중 올바른 문장은?",
    "options": ["옵션1", "옵션2", "옵션3", "옵션4"],
    "correctAnswer": "옵션1",
    "explanation": "설명"
  }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API 오류:', error);
    return generateMockGrammarTest(grammarPoint, count);
  }
};

const generateMockGrammarTest = (grammarPoint: string, count: number): GrammarTestQuestion[] => {
  const questions: GrammarTestQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `q${i + 1}`,
      type: 'multiple-choice',
      question: `${grammarPoint}에 관한 문제 ${i + 1}`,
      options: ['선택지 1', '선택지 2', '선택지 3', '선택지 4'],
      correctAnswer: '선택지 1',
      explanation: `${grammarPoint}을 사용합니다.`,
    });
  }
  
  return questions;
};

// ============================================
// 3. AI 챗봇 (영어 튜터)
// ============================================

export const getChatbotResponse = async (
  userMessage: string,
  context?: string
): Promise<string> => {
  const aiInstance = initializeAI();
  
  if (!aiInstance) {
    return '죄송합니다. AI 서비스가 현재 사용 불가능합니다. API 키를 설정해주세요.';
  }

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = `
당신은 친절한 영어 학습 튜터입니다.
학생의 질문에 대해 명확하고 이해하기 쉽게 답변해주세요.

- 문법 질문: 개념 설명 + 예문 제공
- 단어 질문: 뜻 + 예문 + 유의어
- 작문 첨삭: 교정 + 이유 설명
- 항상 한국어로 답변

${context ? `\n현재 학습 맥락: ${context}` : ''}
`;

    const result = await model.generateContent(`${systemPrompt}\n\n학생 질문: ${userMessage}`);
    return result.response.text();
  } catch (error) {
    console.error('Chatbot 오류:', error);
    return '죄송합니다. 답변 생성 중 오류가 발생했습니다.';
  }
};

// ============================================
// 4. 맞춤형 예문 생성
// ============================================

export const generateExampleSentence = async (
  word: string,
  difficulty: 'basic' | 'intermediate' | 'advanced' = 'basic'
): Promise<{ sentence: string; translation: string }> => {
  const aiInstance = initializeAI();
  
  if (!aiInstance) {
    return {
      sentence: `I use "${word}" every day.`,
      translation: `나는 매일 "${word}"를 사용합니다.`,
    };
  }

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const difficultyGuide = {
      basic: '중학생 수준의 간단한',
      intermediate: '고등학생 수준의 적절한',
      advanced: '대학생 수준의 복잡한',
    };
    
    const prompt = `
"${word}" 단어를 사용한 ${difficultyGuide[difficulty]} 영어 예문 1개를 만들고 한국어 번역을 제공해주세요.

JSON 형식으로 반환:
{
  "sentence": "영어 예문",
  "translation": "한국어 번역"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response');
  } catch (error) {
    console.error('예문 생성 오류:', error);
    return {
      sentence: `I use "${word}" every day.`,
      translation: `나는 매일 "${word}"를 사용합니다.`,
    };
  }
};

// ============================================
// 5. 문법 설명 생성
// ============================================

export const generateGrammarExplanation = async (
  grammarPoint: string
): Promise<{
  explanation: string;
  examples: string[];
  tips: string[];
}> => {
  const aiInstance = initializeAI();
  
  if (!aiInstance) {
    return {
      explanation: `${grammarPoint}에 대한 설명입니다.`,
      examples: ['예문 1', '예문 2'],
      tips: ['팁 1', '팁 2'],
    };
  }

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
"${grammarPoint}" 문법에 대해 학생이 쉽게 이해할 수 있도록 설명해주세요.

JSON 형식으로 반환:
{
  "explanation": "개념 설명 (3-4문장)",
  "examples": ["예문1", "예문2", "예문3"],
  "tips": ["학습 팁1", "학습 팁2"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response');
  } catch (error) {
    console.error('문법 설명 생성 오류:', error);
    return {
      explanation: `${grammarPoint}에 대한 설명입니다.`,
      examples: ['예문 1', '예문 2'],
      tips: ['팁 1', '팁 2'],
    };
  }
};

