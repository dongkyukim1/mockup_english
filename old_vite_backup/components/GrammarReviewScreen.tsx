import React, { useState } from 'react';
import type { GrammarPoint } from '../types';
import { ChevronDownIcon, RefreshCwIcon } from './icons';
import Chatbot from './Chatbot';

interface GrammarReviewScreenProps {
  points: GrammarPoint[];
  onBack: () => void;
}

const GrammarReviewItem: React.FC<{point: GrammarPoint}> = ({ point }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                aria-expanded={isOpen}
            >
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {point.koreanGrammarRule} <span className="text-gray-500 dark:text-gray-400 font-normal">({point.grammarRule})</span>
                </h4>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{point.explanation}</p>
                    <p className="text-gray-800 dark:text-gray-100 italic border-l-4 border-blue-500 pl-3">
                       {point.exampleSentence}
                    </p>
                </div>
            </div>
        </div>
    );
};


const GrammarReviewScreen: React.FC<GrammarReviewScreenProps> = ({ points, onBack }) => {
  const chatbotContext = `The student is reviewing the following grammar points that were identified from a text they provided: ${JSON.stringify(points.map(p => ({ rule: p.grammarRule, explanation: p.explanation, example: p.exampleSentence })), null, 2)}. Please answer the student's questions related to these grammar rules.`;
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">문법 복습</h2>
      <p className="text-center text-gray-500 dark:text-gray-400">텍스트에서 발견된 주요 문법 사항입니다. 각 항목을 클릭하여 자세히 알아보세요.</p>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {points.length > 0 ? points.map((point, index) => (
            <GrammarReviewItem key={index} point={point} />
        )) : (
            <p className="p-4 text-center text-gray-500">검토할 특정 문법 사항이 발견되지 않았습니다.</p>
        )}
      </div>

      <button onClick={onBack} className="w-full mt-4 bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-fuchsia-700 transition-colors duration-300 flex items-center justify-center text-lg shadow-lg">
        <RefreshCwIcon className="w-5 h-5 mr-2"/>
        복습 종료
      </button>

      <Chatbot context={chatbotContext} />
    </div>
  );
};

export default GrammarReviewScreen;