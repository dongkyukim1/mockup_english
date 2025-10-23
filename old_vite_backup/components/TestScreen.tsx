import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, TimerIcon } from './icons';
// Fix: "GrammarQuestionTypes" is not exported from '../constants'. It is exported from '../types'.
import { QUESTION_TYPE_DETAILS } from '../constants';
import { GrammarQuestionTypes } from '../types';

interface TestScreenProps {
  questions: Question[];
  onFinish: (answers: (string | string[])[]) => void;
  timerDuration?: number; // in seconds
}

const formatTime = (seconds: number) => {
  if (seconds < 0) seconds = 0;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const TestScreen: React.FC<TestScreenProps> = ({ questions, onFinish, timerDuration }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | string[])[]>(() => 
    questions.map(q => Array.isArray(q.answer) ? new Array(q.answer.length).fill('') : '')
  );
  const [remainingTime, setRemainingTime] = useState<number | undefined>(timerDuration);

  const latestAnswersRef = useRef(answers);
  latestAnswersRef.current = answers;

  useEffect(() => {
    if (timerDuration === undefined) return;
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime !== undefined && prevTime > 1) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          onFinish(latestAnswersRef.current);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerDuration, onFinish]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const instruction = QUESTION_TYPE_DETAILS[currentQuestion.type]?.description || '';

  const handleSingleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };
  
  const handleMultiAnswerChange = (value: string, blankIndex: number) => {
    const newAnswers = [...answers];
    const currentAnswerArray = Array.isArray(newAnswers[currentQuestionIndex]) 
      ? [...(newAnswers[currentQuestionIndex] as string[])] 
      : [];
    currentAnswerArray[blankIndex] = value;
    newAnswers[currentQuestionIndex] = currentAnswerArray;
    setAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  useEffect(() => {
     const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && !(event.target as HTMLElement).closest('input, textarea, select')) {
        goToNext();
      } else if (event.key === 'ArrowLeft' && !(event.target as HTMLElement).closest('input, textarea, select')) {
        goToPrevious();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, questions.length]);

  const renderAnswerInput = () => {
    // Multiple Choice (Vocab)
    if (currentQuestion.options && currentQuestion.options.length > 0 && currentQuestion.type !== GrammarQuestionTypes.CORRECT_WORD_FORM) {
      return (
        <div className="space-y-3">
          {(currentQuestion.options as string[]).map((option, index) => (
            <label key={index} className={`block w-full p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${answers[currentQuestionIndex] === option ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50'}`}>
              <input type="radio" name={`question-${currentQuestionIndex}`} value={option} checked={answers[currentQuestionIndex] === option} onChange={() => handleSingleAnswerChange(option)} className="sr-only" />
              <span className="text-lg text-gray-800 dark:text-gray-200">{option}</span>
            </label>
          ))}
        </div>
      );
    }
    
    // Grammar: Correct Word Form (multi-blank dropdown)
    if (currentQuestion.type === GrammarQuestionTypes.CORRECT_WORD_FORM) {
        const parts = currentQuestion.question.split('___');
        const currentAnswer = (answers[currentQuestionIndex] as string[]) || [];
        const optionsForBlanks = currentQuestion.options as string[][];

        if (!optionsForBlanks) return <div>Error: Options not available for this question.</div>;

        return (
            <div className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 flex flex-wrap items-center gap-x-2 gap-y-4">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <span>{part}</span>
                        {index < parts.length - 1 && (
                            <select
                                value={currentAnswer[index] || ''}
                                onChange={(e) => handleMultiAnswerChange(e.target.value, index)}
                                className="inline-block p-2 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-xl md:text-2xl"
                                aria-label={`Select word for blank ${index + 1}`}
                            >
                                <option value="" disabled>선택...</option>
                                {optionsForBlanks[index] && optionsForBlanks[index].map((option, optIndex) => (
                                    <option key={optIndex} value={option}>{option}</option>
                                ))}
                            </select>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    }
    
    // Grammar: Fill in multiple blanks (written)
    if (currentQuestion.type === GrammarQuestionTypes.FILL_IN_BLANKS_GRAMMAR || currentQuestion.type === GrammarQuestionTypes.FILL_IN_BLANKS_ADVANCED) {
        const parts = currentQuestion.question.split('___');
        const currentAnswer = (answers[currentQuestionIndex] as string[]) || [];
        return (
            <div className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 flex flex-wrap items-center gap-x-2 gap-y-4">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <span>{part}</span>
                        {index < parts.length - 1 && (
                            <input
                                type="text"
                                value={currentAnswer[index] || ''}
                                onChange={(e) => handleMultiAnswerChange(e.target.value, index)}
                                className="inline-block w-32 p-1 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500 transition duration-200 text-center"
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    // Default to Written (single input)
    return (
       <textarea
        value={answers[currentQuestionIndex] as string}
        onChange={(e) => handleSingleAnswerChange(e.target.value)}
        placeholder={currentQuestion.type === GrammarQuestionTypes.SENTENCE_SCRAMBLE ? "단어를 여기에 재배열하세요..." : "답을 여기에 입력하세요..."}
        rows={currentQuestion.type === GrammarQuestionTypes.SENTENCE_SCRAMBLE || currentQuestion.type === GrammarQuestionTypes.ERROR_IDENTIFICATION ? 4 : 3}
        className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white dark:bg-gray-700 text-lg"
      />
    );
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timeColor = remainingTime !== undefined && remainingTime < 60 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300';
  
  const formatQuestionText = (text: string) => {
    if (!text) return '';
    return text.replace(/___/g, '<span class="font-bold text-blue-500">___</span>').replace(/\*(.*?)\*/g, '<span class="font-bold text-blue-500 underline">$1</span>');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">문제 {currentQuestionIndex + 1} / {questions.length}</span>
            {remainingTime !== undefined && <div className={`flex items-center text-lg font-bold transition-colors duration-300 ${timeColor}`}><TimerIcon className="w-5 h-5 mr-2" /><span>{formatTime(remainingTime)}</span></div>}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
          </div>
        </div>
        <div className="mb-6 min-h-[120px]">
          <p className="text-md text-gray-500 dark:text-gray-400 mb-2">{instruction}</p>
          {currentQuestion.type !== GrammarQuestionTypes.FILL_IN_BLANKS_GRAMMAR && currentQuestion.type !== GrammarQuestionTypes.FILL_IN_BLANKS_ADVANCED && currentQuestion.type !== GrammarQuestionTypes.CORRECT_WORD_FORM && <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatQuestionText(currentQuestion.question) }}></p>}
          {currentQuestion.koreanSentence && <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md">{currentQuestion.koreanSentence}</p>}
        </div>
        <div className="mb-8">
          {renderAnswerInput()}
        </div>
        <div className="flex justify-between items-center">
          <button onClick={goToPrevious} disabled={currentQuestionIndex === 0} className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><ChevronLeftIcon className="w-5 h-5 mr-1"/>이전</button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={() => onFinish(answers)} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md">테스트 종료</button>
          ) : (
            <button onClick={goToNext} className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">다음<ChevronRightIcon className="w-5 h-5 ml-1"/></button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScreen;