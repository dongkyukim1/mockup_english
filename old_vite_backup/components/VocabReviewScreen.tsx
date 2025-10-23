import React, { useState, useEffect } from 'react';
import type { VocabularyItem } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon, ShuffleIcon, ChevronDownIcon } from './icons';
import Chatbot from './Chatbot';

interface VocabReviewScreenProps {
  words: VocabularyItem[];
  onBack: () => void;
}

type CardFormat = 'ENG_TO_KOR' | 'KOR_TO_ENG' | 'RANDOM';

const VocabReviewScreen: React.FC<VocabReviewScreenProps> = ({ words, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([...words]);
  const [cardFormat, setCardFormat] = useState<CardFormat>('ENG_TO_KOR');
  const [randomFormats, setRandomFormats] = useState<('ENG_TO_KOR' | 'KOR_TO_ENG')[]>([]);
  
  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    // Reset flip state when changing cards
    setIsFlipped(false);
  }, [currentIndex, cardFormat]);
  
  const shuffle = () => {
    setShuffledWords(currentWords => {
        const newWords = [...currentWords];
        for (let i = newWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newWords[i], newWords[j]] = [newWords[j], newWords[i]];
        }
        setRandomFormats(newWords.map(() => Math.random() < 0.5 ? 'ENG_TO_KOR' : 'KOR_TO_ENG'));
        return newWords;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  
  useEffect(() => {
    shuffle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]); // Shuffle on initial load

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCardFormat(e.target.value as CardFormat);
    setCurrentIndex(0); // Reset to first card on format change
  };

  const goToNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentWord) {
    return (
      <div className="text-center">
        <p>복습할 단어가 선택되지 않았습니다.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          뒤로
        </button>
      </div>
    );
  }
  
  // Determine the format for the *current* card
  let formatForThisCard: 'ENG_TO_KOR' | 'KOR_TO_ENG' = cardFormat as 'ENG_TO_KOR' | 'KOR_TO_ENG';
  if (cardFormat === 'RANDOM') {
      formatForThisCard = randomFormats[currentIndex] || 'ENG_TO_KOR';
  }

  const frontContent = formatForThisCard === 'ENG_TO_KOR'
    ? { text: currentWord['English Word'], className: 'text-5xl font-bold text-center text-blue-600 dark:text-blue-400' }
    : { text: currentWord['Korean Translation'], className: 'text-4xl font-semibold text-center text-gray-800 dark:text-gray-100' };

  const backContent = formatForThisCard === 'ENG_TO_KOR'
    ? { main: currentWord['Korean Translation'], className: 'text-4xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-4' }
    : { main: currentWord['English Word'], className: 'text-5xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4' };

  const chatbotContext = `The student is currently reviewing the vocabulary word '${currentWord['English Word']}'. Its Korean meaning is '${currentWord['Korean Translation']}' and it's used in the sentence: '${currentWord['Example Sentence']}'. Please answer the student's questions related to this specific word.`;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-4">
      <div className="w-full flex justify-between items-center">
        <div>
          <label htmlFor="card-format-select" className="sr-only">카드 형식 선택</label>
          <div className="relative">
            <select
              id="card-format-select"
              value={cardFormat}
              onChange={handleFormatChange}
              className="w-36 appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-blue-500"
            >
              <option value="ENG_TO_KOR">영어 → 한국어</option>
              <option value="KOR_TO_ENG">한국어 → 영어</option>
              <option value="RANDOM">랜덤</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">어휘 복습</h2>
        <div className="w-36" /> {/* Invisible spacer to keep title centered */}
      </div>
      
      <div className="w-full h-80 perspective-1000">
        <div 
          className="relative w-full h-full transform-style-3d transition-transform duration-700"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setIsFlipped(!isFlipped)}
          role="button"
          tabIndex={0}
          aria-label="플래시카드, 클릭하여 뒤집기"
        >
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center p-6">
            <h3 className={frontContent.className}>{frontContent.text}</h3>
          </div>
          
          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center p-6" style={{ transform: 'rotateY(180deg)' }}>
            <h4 className={backContent.className}>{backContent.main}</h4>
            <p className="text-lg text-center text-gray-500 dark:text-gray-400 italic">"{currentWord['Example Sentence']}"</p>
          </div>
        </div>
      </div>
      
      <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
        단어 {currentIndex + 1} / {shuffledWords.length}
      </p>

      <div className="flex w-full justify-between items-center">
        <button onClick={goToPrevious} disabled={currentIndex === 0} className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <ChevronLeftIcon className="w-5 h-5 mr-1"/>이전
        </button>
        <button onClick={shuffle} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" aria-label="단어 섞기">
            <ShuffleIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        </button>
        <button onClick={goToNext} disabled={currentIndex === shuffledWords.length - 1} className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            다음<ChevronRightIcon className="w-5 h-5 ml-1"/>
        </button>
      </div>
      
      <button onClick={onBack} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center text-lg shadow-lg">
        <RefreshCwIcon className="w-5 h-5 mr-2"/>
        복습 종료
      </button>

      <Chatbot key={currentWord['English Word']} context={chatbotContext} />

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default VocabReviewScreen;