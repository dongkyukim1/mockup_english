import React from 'react';
import type { QuestionType, TestMode } from '../types';
import { ALL_VOCAB_QUESTION_TYPES, ALL_GRAMMAR_QUESTION_TYPES, QUESTION_TYPE_DETAILS } from '../constants';
import { CheckIcon } from './icons';

interface QuestionTypeSelectorProps {
  mode: TestMode;
  selectedTypes: QuestionType[];
  onChange: (selected: any[]) => void;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ mode, selectedTypes, onChange }) => {
  const handleToggle = (type: QuestionType) => {
    const currentIndex = selectedTypes.indexOf(type);
    const newSelected = [...selectedTypes];

    if (currentIndex === -1) {
      newSelected.push(type);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    onChange(newSelected);
  };
  
  const questionTypes = mode === 'VOCAB' ? ALL_VOCAB_QUESTION_TYPES : ALL_GRAMMAR_QUESTION_TYPES;
  const accentColors = mode === 'VOCAB'
    ? {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-500',
        checkBg: 'bg-blue-600',
        checkBorder: 'border-blue-600',
      }
    : {
        bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30',
        border: 'border-fuchsia-500',
        checkBg: 'bg-fuchsia-600',
        checkBorder: 'border-fuchsia-600',
      };


  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">문제 유형 선택</h3>
      <div className="space-y-4">
        {questionTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const details = QUESTION_TYPE_DETAILS[type];
          return (
            <div
              key={type}
              onClick={() => handleToggle(type)}
              className={`flex items-start p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                isSelected
                  ? `${accentColors.bg} ${accentColors.border} shadow-sm`
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-md flex-shrink-0 mr-4 mt-1 flex items-center justify-center border-2 ${isSelected ? `${accentColors.checkBg} ${accentColors.checkBorder}` : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500'}`}>
                {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{details.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{details.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTypeSelector;