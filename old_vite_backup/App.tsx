import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import QuestionTypeSelector from './components/QuestionTypeSelector';
import TestScreen from './components/TestScreen';
import ResultsScreen from './components/ResultsScreen';
import VocabReviewScreen from './components/VocabReviewScreen';
import GrammarReviewScreen from './components/GrammarReviewScreen';
import { generateVocabTest, generateGrammarTest, generateGrammarReview } from './services/geminiService';
import type { AppState, Question, VocabularyItem, TestMode, GrammarPoint } from './types';
import { ALL_VOCAB_QUESTION_TYPES, ALL_GRAMMAR_QUESTION_TYPES } from './constants';
import { BrainCircuitIcon, LoaderCircleIcon, BookTextIcon, FileTextIcon, BookOpenCheckIcon } from './components/icons';
import VocabSelector from './components/VocabSelector';
import Header from './components/Header';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('MODE_SELECTION');
  const [testMode, setTestMode] = useState<TestMode | null>(null);
  
  // Vocab state
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [selectedVocab, setSelectedVocab] = useState<VocabularyItem[]>([]);
  const [selectedVocabQTypes, setSelectedVocabQTypes] = useState(ALL_VOCAB_QUESTION_TYPES);
  
  // Grammar state
  const [grammarText, setGrammarText] = useState('');
  const [selectedGrammarQTypes, setSelectedGrammarQTypes] = useState(ALL_GRAMMAR_QUESTION_TYPES);
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);

  // General state
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | string[])[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(10);

  const handleFileParsed = useCallback((data: VocabularyItem[]) => {
    if (data.length === 0) {
      setError("업로드된 파일이 비어 있거나 형식이 잘못되었습니다. 'English', 'Korean', 'Sentence' 열이 있는지 확인하세요.");
      setVocabList([]);
      setSelectedVocab([]);
    } else {
      setVocabList(data);
      setSelectedVocab(data);
      setError(null);
    }
  }, []);
  
  const handleModeSelect = (mode: TestMode) => {
    setTestMode(mode);
    setAppState('SETUP');
  };

  const handleBackToSetup = () => {
      setAppState('SETUP');
  };

  const handleStartVocabTest = async () => {
    if (selectedVocab.length === 0) {
      setError('테스트를 위해 최소 하나 이상의 단어를 선택하세요.');
      return;
    }
    if (selectedVocabQTypes.length === 0) {
      setError('최소 하나 이상의 문제 유형을 선택하세요.');
      return;
    }
    
    setAppState('GENERATING');
    setError(null);
    try {
      const questions = await generateVocabTest(selectedVocab, selectedVocabQTypes);
      setTestQuestions(questions);
      setUserAnswers(new Array(questions.length).fill(''));
      setAppState('TESTING');
    } catch (err) {
      console.error(err);
      setError('테스트 생성에 실패했습니다. API 키를 확인하고 다시 시도하세요.');
      setAppState('SETUP');
    }
  };
  
  const handleStartGrammarReview = async () => {
    if (grammarText.trim().length < 50) {
        setError('문법 분석을 위해 더 긴 텍스트를 제공해주세요.');
        return;
    }
    setAppState('GENERATING_GRAMMAR_REVIEW');
    setError(null);
    try {
        const points = await generateGrammarReview(grammarText);
        setGrammarPoints(points);
        setAppState('REVISING_GRAMMAR');
    } catch (err) {
        console.error(err);
        setError('문법 복습 포인트 생성에 실패했습니다. AI가 제공된 텍스트를 처리하는 데 문제가 있을 수 있습니다.');
        setAppState('SETUP');
    }
  };

  const handleStartGrammarTest = async () => {
    if (grammarText.trim().length < 50) {
      setError('더 나은 문제 생성을 위해 더 긴 텍스트를 제공해주세요.');
      return;
    }
    if (selectedGrammarQTypes.length === 0) {
      setError('최소 하나 이상의 문제 유형을 선택하세요.');
      return;
    }

    setAppState('GENERATING');
    setError(null);
    try {
      const questions = await generateGrammarTest(grammarText, selectedGrammarQTypes);
      setTestQuestions(questions);
      setUserAnswers(questions.map(q => (Array.isArray(q.answer) ? new Array(q.answer.length).fill('') : '')));
      setAppState('TESTING');
    } catch (err) {
      console.error(err);
      setError('문법 테스트 생성에 실패했습니다. AI가 제공된 텍스트를 처리하는 데 문제가 있을 수 있습니다.');
      setAppState('SETUP');
    }
  };

  const handleTestFinished = (finalAnswers: (string|string[])[]) => {
    setUserAnswers(finalAnswers);
    setAppState('RESULTS');
  };
  
  const handleRestart = () => {
    setAppState('MODE_SELECTION');
    setTestMode(null);
    setVocabList([]);
    setSelectedVocab([]);
    setGrammarText('');
    setTestQuestions([]);
    setUserAnswers([]);
    setError(null);
    setSelectedVocabQTypes(ALL_VOCAB_QUESTION_TYPES);
    setSelectedGrammarQTypes(ALL_GRAMMAR_QUESTION_TYPES);
    setIsTimerEnabled(false);
    setTimerMinutes(10);
    setGrammarPoints([]);
  };

  const handleNavigateToVocab = () => {
    handleRestart();
    setTestMode('VOCAB');
    setAppState('SETUP');
  };

  const handleNavigateToGrammar = () => {
    handleRestart();
    setTestMode('GRAMMAR');
    setAppState('SETUP');
  };


  const renderContent = () => {
    switch (appState) {
      case 'MODE_SELECTION':
        return (
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
              환영합니다!
            </h1>
            <p className="mt-2 mb-10 text-lg text-gray-500 dark:text-gray-400">
              시작할 테스트 모드를 선택하세요.
            </p>
            <div className="w-full max-w-2xl mx-auto grid md:grid-cols-2 gap-8">
              <button onClick={() => handleModeSelect('VOCAB')} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 text-center group">
                <FileTextIcon className="w-16 h-16 mx-auto text-gray-400 group-hover:text-blue-500 transition-colors" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">어휘 테스트</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">엑셀 단어 목록으로 퀴즈 만들기.</p>
              </button>
              <button onClick={() => handleModeSelect('GRAMMAR')} className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-fuchsia-500 dark:hover:border-fuchsia-500 transition-all duration-300 text-center group">
                <BookTextIcon className="w-16 h-16 mx-auto text-gray-400 group-hover:text-fuchsia-500 transition-colors" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">문법 테스트</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">텍스트에서 문법 문제 생성하기.</p>
              </button>
            </div>
          </div>
        );

      case 'SETUP':
        if (testMode === 'VOCAB') {
          return (
            <div className="w-full max-w-2xl mx-auto space-y-8">
              <FileUpload onFileParsed={handleFileParsed} vocabCount={vocabList.length} />
              {vocabList.length > 0 && (
                <>
                  <VocabSelector
                    vocabList={vocabList}
                    selectedVocab={selectedVocab}
                    onSelectionChange={setSelectedVocab}
                  />
                  <QuestionTypeSelector
                    mode="VOCAB"
                    selectedTypes={selectedVocabQTypes}
                    onChange={(types) => setSelectedVocabQTypes(types)}
                  />
                  <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">테스트 설정</h3>
                    <div className="flex items-center justify-between">
                        <label htmlFor="timer-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input id="timer-toggle" type="checkbox" className="sr-only peer" checked={isTimerEnabled} onChange={e => setIsTimerEnabled(e.target.checked)} />
                                <div className="w-14 h-8 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                                <div className="absolute left-1 top-1 bg-white dark:bg-gray-900 w-6 h-6 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
                            </div>
                            <span className="ml-3 font-medium text-gray-900 dark:text-gray-300">타이머 활성화</span>
                        </label>
                        {isTimerEnabled && (
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="number" 
                                    value={timerMinutes} 
                                    onChange={(e) => setTimerMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                    min="1"
                                    className="w-24 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-center"
                                    aria-label="Timer duration in minutes"
                                />
                                <span className="text-gray-600 dark:text-gray-400">분</span>
                            </div>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <button
                        onClick={() => setAppState('REVISING_VOCAB')}
                        disabled={selectedVocab.length === 0}
                        className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <BookOpenCheckIcon className="w-6 h-6 mr-2" />
                        단어 복습
                     </button>
                     <button
                        onClick={handleStartVocabTest}
                        disabled={selectedVocab.length === 0}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <BrainCircuitIcon className="w-6 h-6 mr-2" />
                        어휘 테스트 생성
                     </button>
                  </div>
                </>
              )}
            </div>
          );
        }
        if (testMode === 'GRAMMAR') {
           return (
            <div className="w-full max-w-2xl mx-auto space-y-8">
              <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">텍스트 입력</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">문법 문제를 생성할 영어 텍스트를 붙여넣으세요. AI가 분석하여 테스트를 만듭니다.</p>
                <textarea 
                  value={grammarText}
                  onChange={(e) => setGrammarText(e.target.value)}
                  placeholder="여기에 영어 문단을 붙여넣으세요..."
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              {grammarText.trim().length > 0 && (
                <>
                  <QuestionTypeSelector 
                    mode="GRAMMAR"
                    selectedTypes={selectedGrammarQTypes}
                    onChange={(types) => setSelectedGrammarQTypes(types)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={handleStartGrammarReview}
                        disabled={grammarText.trim().length === 0}
                        className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <BookOpenCheckIcon className="w-6 h-6 mr-2" />
                        문법 복습
                      </button>
                      <button
                        onClick={handleStartGrammarTest}
                        disabled={grammarText.trim().length === 0}
                        className="w-full bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-fuchsia-700 transition-colors duration-300 flex items-center justify-center text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <BrainCircuitIcon className="w-6 h-6 mr-2" />
                        문법 테스트 생성
                      </button>
                  </div>
                </>
              )}
            </div>
          )
        }
        return null;

      case 'GENERATING':
        return (
          <div className="text-center space-y-4">
            <LoaderCircleIcon className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">테스트를 생성하는 중...</h2>
            <p className="text-gray-500 dark:text-gray-400">AI가 완벽한 문제를 만들고 있습니다. 잠시만 기다려 주세요.</p>
          </div>
        );
      case 'GENERATING_GRAMMAR_REVIEW':
        return (
            <div className="text-center space-y-4">
                <LoaderCircleIcon className="w-16 h-16 text-fuchsia-500 animate-spin mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">문법 분석 중...</h2>
                <p className="text-gray-500 dark:text-gray-400">AI가 텍스트에서 핵심 문법 포인트를 찾고 있습니다. 잠시만 기다려 주세요.</p>
            </div>
        );
      case 'REVISING_VOCAB':
        return <VocabReviewScreen words={selectedVocab} onBack={handleBackToSetup} />;
      case 'REVISING_GRAMMAR':
        return <GrammarReviewScreen points={grammarPoints} onBack={handleBackToSetup} />;
      case 'TESTING':
        return (
          <TestScreen
            questions={testQuestions}
            onFinish={handleTestFinished}
            timerDuration={isTimerEnabled ? timerMinutes * 60 : undefined}
          />
        );
      case 'RESULTS':
        return (
          <ResultsScreen
            questions={testQuestions}
            userAnswers={userAnswers}
            onRestart={handleRestart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header
        onNavigateHome={handleRestart}
        onNavigateToVocab={handleNavigateToVocab}
        onNavigateToGrammar={handleNavigateToGrammar}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">오류</p>
            <p>{error}</p>
          </div>
        )}
        <div className="flex justify-center items-start">
            {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-400 dark:text-gray-500">
        <p>Powered by Aidu</p>
      </footer>
    </div>
  );
};

export default App;