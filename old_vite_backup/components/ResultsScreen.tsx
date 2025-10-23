import React from 'react';
import type { Question } from '../types';
import { CheckIcon, XIcon, RefreshCwIcon } from './icons';
// Fix: "GrammarQuestionTypes" is not exported from '../constants'. It is exported from '../types'.
import { GrammarQuestionTypes } from '../types';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: (string | string[])[];
  onRestart: () => void;
}

const normalize = (val: string) => val.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");

const checkAnswerCorrect = (question: Question, userAnswer: string | string[]): boolean => {
    if (question.type === GrammarQuestionTypes.FILL_IN_BLANKS_GRAMMAR || question.type === GrammarQuestionTypes.FILL_IN_BLANKS_ADVANCED || question.type === GrammarQuestionTypes.CORRECT_WORD_FORM) {
        if (!Array.isArray(userAnswer) || !Array.isArray(question.answer)) return false;
        if (userAnswer.length !== question.answer.length) return false;
        return userAnswer.every((ans, i) => normalize(ans) === normalize(question.answer[i]));
    }
    
    if (Array.isArray(userAnswer)) return false; // Should be a string for other types
    if (Array.isArray(question.answer)) return false; // Should be a string for other types

    return normalize(userAnswer) === normalize(question.answer);
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onRestart }) => {
  const correctAnswersCount = questions.reduce((count, question, index) => {
    return checkAnswerCorrect(question, userAnswers[index]) ? count + 1 : count;
  }, 0);
  
  const score = questions.length > 0 ? (correctAnswersCount / questions.length) * 100 : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  const formatReviewedQuestion = (question: Question) => {
    if (question.word) { // Vocab question
      return question.question
        .replace(/___/g, `"${question.word}"`)
        .replace(/\*(.*?)\*/g, '$1');
    }
    // Grammar question - show original sentence for context
    return question.originalSentence || question.question;
  };
  
  const renderUserAnswer = (answer: string | string[]) => {
      if(Array.isArray(answer)) {
          return `[${answer.map(a => `"${a || '...'}"`).join(', ')}]`;
      }
      return `"${answer || '답변 없음'}"`;
  }
  
  const renderCorrectAnswer = (answer: string | string[]) => {
      if(Array.isArray(answer)) {
          return `[${answer.map(a => `"${a}"`).join(', ')}]`;
      }
      return `"${answer}"`;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">테스트 완료!</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">결과는 다음과 같습니다:</p>
        <div className="my-6">
            <p className={`text-7xl font-extrabold ${getScoreColor(score)}`}>{score.toFixed(0)}%</p>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-2">
                {correctAnswersCount} / {questions.length}개 정답
            </p>
        </div>
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center text-lg shadow-lg mx-auto"
        >
          <RefreshCwIcon className="w-5 h-5 mr-2"/>
          다른 테스트 보기
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">답안 검토</h3>
        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = checkAnswerCorrect(question, userAnswer);
            return (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-red-500'}`}>
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">문{index + 1}: {formatReviewedQuestion(question)}</p>
                {question.type !== question.originalSentence && <p className="text-md italic text-gray-500 dark:text-gray-400 mb-2">문제: {question.question}</p>}
                <div className="flex items-center text-md">
                    <span className="font-bold mr-2 text-gray-600 dark:text-gray-300">나의 답:</span>
                    <span className={`flex items-center ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {isCorrect ? <CheckIcon className="w-5 h-5 mr-1"/> : <XIcon className="w-5 h-5 mr-1"/>}
                        {renderUserAnswer(userAnswer)}
                    </span>
                </div>
                {!isCorrect && (
                  <div className="mt-2 flex items-center text-md">
                    <span className="font-bold mr-2 text-gray-600 dark:text-gray-300">정답:</span>
                    <span className="text-green-700 dark:text-green-300 font-semibold">{renderCorrectAnswer(question.answer)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;