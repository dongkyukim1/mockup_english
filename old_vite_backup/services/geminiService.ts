import { GoogleGenAI, Type } from "@google/genai";
import type { Question, VocabQuestionType, GrammarQuestionType, VocabularyItem, GrammarPoint, ChatMessage } from '../types';
import { VocabQuestionTypes } from '../types';

// Gemini API Key 확인 및 초기화
const apiKey = import.meta.env.VITE_API_KEY as string;

if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    throw new Error(
        '❌ Gemini API Key가 설정되지 않았습니다!\n\n' +
        '해결 방법:\n' +
        '1. .env 파일을 열어주세요\n' +
        '2. VITE_API_KEY=your-gemini-api-key-here 부분에 실제 API Key를 입력하세요\n' +
        '3. API Key는 https://makersuite.google.com/app/apikey 에서 발급받을 수 있습니다\n' +
        '4. 개발 서버를 재시작하세요 (npm run dev)'
    );
}

const ai = new GoogleGenAI({ apiKey });

const GEMINI_MODEL = "gemini-2.5-flash";

const vocabResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: {
                type: Type.STRING,
                enum: Object.values(VocabQuestionTypes),
                description: 'The type of the question.',
            },
            word: {
                type: Type.STRING,
                description: 'The target English vocabulary word for this question.',
            },
            question: {
                type: Type.STRING,
                description: 'The main text of the question. For fill-in-the-blank, use "___". For meaning-in-context, use *word* to mark the target word.',
            },
            options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'An array of options for multiple-choice questions. Null for written questions.',
            },
            answer: {
                type: Type.STRING,
                description: 'The correct answer for the question.',
            },
            koreanSentence: {
                type: Type.STRING,
                description: 'The Korean translation of the sentence, only for question type FILL_IN_BLANK_WRITE. Null otherwise.',
            },
        },
        required: ['type', 'word', 'question', 'answer'],
    }
};

export const generateVocabTest = async (
    vocabList: VocabularyItem[],
    questionTypes: VocabQuestionType[]
): Promise<Question[]> => {
    const prompt = `
    You are an expert English teacher creating a vocabulary test for Korean students.
    Based on the following vocabulary list and requested question types, generate a comprehensive test.
    
    **General Rules:**
    1. Use each word from the vocabulary list exactly once. The total number of questions must equal the number of words in the list.
    2. Follow the provided JSON schema precisely.
    3. For multiple-choice questions, ensure the distractor options are plausible but incorrect.

    **Instructions for Specific Question Types:**
    *   **MEANING_FROM_CONTEXT_MC**: The goal is to choose the correct meaning of the underlined word. For this question type, you **must** alternate the language of the multiple-choice options. Approximately 50% of the 'MEANING_FROM_CONTEXT_MC' questions should have English definitions as options, and the other 50% should have Korean translations as options. The correct answer and the distractors must all be in the same language for a given question.
    
    **Vocabulary List:** ${JSON.stringify(vocabList, null, 2)}
    **Requested Question Types:** ${JSON.stringify(questionTypes, null, 2)}
    **Total number of questions to generate:** ${vocabList.length}`;

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: vocabResponseSchema,
        },
    });

    const questions = JSON.parse(response.text) as Question[];
    return questions.map(q => {
        if (q.type === 'FILL_IN_BLANK_MC' || q.type === 'MEANING_FROM_CONTEXT_MC') {
            return { ...q, options: q.options || [] };
        }
        return { ...q, options: null };
    });
};

const grammarResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING },
            originalSentence: { type: Type.STRING },
            question: { type: Type.STRING },
            answer: { 
                type: Type.STRING,
                description: "JSON string array for FILL_IN_BLANKS_GRAMMAR, FILL_IN_BLANKS_ADVANCED, and CORRECT_WORD_FORM. A single string otherwise."
            },
            options: {
                type: Type.STRING,
                description: 'For CORRECT_WORD_FORM, a JSON string of a 2D array of options. Null for other questions.',
            }
        },
        required: ['type', 'originalSentence', 'question', 'answer'],
    }
};

export const generateGrammarReview = async (text: string): Promise<GrammarPoint[]> => {
    const grammarReviewSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                grammarRule: {
                    type: Type.STRING,
                    description: 'The name of the grammar rule identified in English (e.g., "Present Perfect Tense", "Use of Gerunds").'
                },
                koreanGrammarRule: {
                    type: Type.STRING,
                    description: 'The Korean translation for the grammar rule (e.g., "현재완료 시제", "동명사의 사용").'
                },
                explanation: {
                    type: Type.STRING,
                    description: 'A concise explanation of the grammar rule, suitable for a Korean student learning English.'
                },
                exampleSentence: {
                    type: Type.STRING,
                    description: 'The original sentence from the text that demonstrates this grammar rule.'
                }
            },
            required: ['grammarRule', 'koreanGrammarRule', 'explanation', 'exampleSentence']
        }
    };

    const prompt = `
    You are an expert English grammar teacher helping a Korean student.
    Analyze the provided English text and identify 5-7 key grammar points that are important for an intermediate learner.
    For each grammar point, provide the rule name in both English and Korean, a simple explanation, and the sentence from the text that best illustrates it.
    
    **Text to Analyze:**
    """
    ${text}
    """

    Generate the output strictly following the provided JSON schema.
    `;
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: grammarReviewSchema,
        },
    });

    return JSON.parse(response.text) as GrammarPoint[];
};


export const generateGrammarTest = async (
    text: string,
    questionTypes: GrammarQuestionType[]
): Promise<Question[]> => {
    const prompt = `
    You are an expert English grammar teacher. Analyze the provided text and generate a series of grammar questions based on the requested types. Make about 10 questions in total, balanced among the requested types.

    **Text to Analyze:**
    """
    ${text}
    """

    **Requested Question Types:**
    ${JSON.stringify(questionTypes)}

    **Instructions for Each Question Type:**

    1.  **FILL_IN_BLANKS_GRAMMAR**:
        *   Take a sentence from the text.
        *   The number of words to remove should be proportional to the sentence length, roughly 1 blank for every 6 words, with a minimum of 2 and a maximum of 5 blanks.
        *   When choosing words to remove, you **MUST NOT** remove articles (a, an, the), proper nouns, or prepositions. Focus on removing significant verbs, adjectives, adverbs, and common nouns.
        *   'question': The sentence with removed words replaced by "___".
        *   'answer': A JSON string array of the removed words in the correct order. Example: '["word1", "word2"]'.
        *   'originalSentence': The original, unmodified sentence.
        
    2.  **CORRECT_WORD_FORM**:
        *   Identify 2 or 3 grammatically significant words in a sentence where the word form could be incorrect (e.g., verb tense, noun plurality, adjective/adverb form).
        *   'question': The sentence with the target words replaced by "___".
        *   'options': A JSON string representing a 2D array. Each inner array contains two strings: the correct form of the word for a blank, and a grammatically incorrect but plausible alternative. The order of inner arrays must match the order of the blanks in the question. Example: '[["painted", "painting"], ["running", "ran"]]'.
        *   'answer': A JSON string array of the correct word forms in the correct order. Example: '["painted", "running"]'.
        *   'originalSentence': The original, unmodified sentence.

    3.  **ERROR_IDENTIFICATION**:
        *   Take a sentence and introduce a subtle but clear grammatical error (e.g., preposition, tense, subject-verb agreement).
        *   'question': The full, grammatically incorrect sentence.
        *   'answer': The fully corrected sentence as a string.
        *   'originalSentence': The original, unmodified sentence from the text.

    4.  **SENTENCE_SCRAMBLE**:
        *   Take a sentence from the text.
        *   If the sentence contains one or more commas, you must split the sentence into clauses based on the commas.
        *   For each clause, scramble the words within it.
        *   'question': A string formatted as follows: Each scrambled clause's words are separated by " / " and the entire clause is enclosed in parentheses. The parenthesized clauses are then joined by a comma and a space. For example, if the original sentence is "I love him, but he doesn't.", the question should be something like "(love / him / I), (doesn't / he / but)".
        *   If the sentence does NOT contain any commas, scramble all the words together and separate them with " / ". Do not use parentheses. For example: "over / the / brown / lazy / fox / dog / jumps / quick / The".
        *   'answer': The original, correctly ordered sentence.
        *   'originalSentence': The original, correctly ordered sentence.

    5.  **FILL_IN_BLANKS_ADVANCED**:
        *   Take a longer passage from the text (2-3 connected sentences).
        *   Turn most of the words into blanks. The only words you should **LEAVE** in the sentence are articles (a, an, the), proper nouns, and prepositions. All other words (verbs, common nouns, adjectives, adverbs, etc.) must be replaced with "___".
        *   The number of blanks will naturally be proportional to the length and complexity of the passage.
        *   'question': The passage with the words replaced by "___" according to the rule above.
        *   'answer': A JSON string array of all the removed words in the correct order.
        *   'originalSentence': The original, unmodified passage.

    Generate the output strictly following the JSON schema.
    `;
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: grammarResponseSchema,
        },
    });

    const rawQuestions = JSON.parse(response.text) as any[];
    return rawQuestions.map(q => {
        const newQ = { ...q };

        // Process answer for multi-blank types
        if (
            newQ.type === 'FILL_IN_BLANKS_GRAMMAR' ||
            newQ.type === 'FILL_IN_BLANKS_ADVANCED' ||
            newQ.type === 'CORRECT_WORD_FORM'
        ) {
            try {
                // The API is instructed to return a JSON string array
                newQ.answer = JSON.parse(newQ.answer);
            } catch (e) {
                // If parsing fails, it's safer to default to an empty array
                newQ.answer = [];
            }
        }
        
        // Process options for CORRECT_WORD_FORM, and ensure it's null for other types
        if (newQ.type === 'CORRECT_WORD_FORM') {
            try {
                // The API should return a JSON string of a 2D array. It might also return null.
                if (typeof newQ.options === 'string') {
                    newQ.options = JSON.parse(newQ.options);
                } else if (!Array.isArray(newQ.options)) {
                    // If it's something else like null, default to an empty array.
                    newQ.options = [];
                }
            } catch (e) {
                // If JSON parsing fails.
                newQ.options = [];
            }
        } else {
            // For ALL other grammar question types, options must be null.
            // This prevents a "null" string from being passed to the component.
            newQ.options = null;
        }

        return newQ;
    });
};

export const getChatbotResponse = async (
    question: string,
    context: string,
    chatHistory: ChatMessage[]
): Promise<string> => {
    const history = chatHistory
        .map(msg => `${msg.role === 'user' ? '학생' : '튜터'}: ${msg.text}`)
        .join('\n');

    const prompt = `
        You are a friendly and helpful English tutor AI for Korean students.
        Your name is 'Aidu Bot'.
        You MUST respond in Korean. Keep your answers concise and easy for students to understand.
        Use the context of the student's review session to provide accurate and relevant help about English vocabulary and grammar.

        **학생의 현재 복습 세션 컨텍스트:**
        ${context}

        **대화 기록:**
        ${history}

        **학생의 새 질문:**
        ${question}

        **튜터 답변 (한국어로):**
    `;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "죄송합니다. 답변을 생성하는 동안 오류가 발생했습니다. 나중에 다시 시도해 주세요.";
    }
};