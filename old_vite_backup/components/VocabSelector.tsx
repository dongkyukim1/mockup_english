import React from 'react';
import type { VocabularyItem } from '../types';
import { CheckIcon } from './icons';

interface VocabSelectorProps {
  vocabList: VocabularyItem[];
  selectedVocab: VocabularyItem[];
  onSelectionChange: (newSelection: VocabularyItem[]) => void;
}

const VocabSelector: React.FC<VocabSelectorProps> = ({ vocabList, selectedVocab, onSelectionChange }) => {
  const selectedWordsSet = new Set(selectedVocab.map(v => v['English Word']));

  const handleToggleWord = (word: VocabularyItem) => {
    const newSelected = new Map(selectedVocab.map(v => [v['English Word'], v]));
    if (selectedWordsSet.has(word['English Word'])) {
      newSelected.delete(word['English Word']);
    } else {
      newSelected.set(word['English Word'], word);
    }
    onSelectionChange(Array.from(newSelected.values()));
  };

  const handleSelectAll = () => {
    if (selectedVocab.length === vocabList.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...vocabList]);
    }
  };

  const isAllSelected = vocabList.length > 0 && selectedVocab.length === vocabList.length;

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">테스트할 단어 선택</h3>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {selectedVocab.length} / {vocabList.length}개 선택됨
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 font-semibold text-gray-600 dark:text-gray-300 text-left">
            <div className="flex items-center justify-center w-8">
                <label htmlFor="select-all" className="cursor-pointer flex items-center">
                    <input 
                        id="select-all"
                        type="checkbox"
                        className="sr-only"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isAllSelected ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-600 border-gray-400'}`}>
                        {isAllSelected && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                </label>
            </div>
          <div>영어 단어</div>
          <div>한국어 뜻</div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {vocabList.map((item, index) => {
            const isSelected = selectedWordsSet.has(item['English Word']);
            return (
              <div
                key={index}
                onClick={() => handleToggleWord(item)}
                className="grid grid-cols-[auto_1fr_1fr] items-center gap-4 p-3 border-t dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center justify-center w-8">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-600 border-gray-400'}`}>
                        {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{item['English Word']}</div>
                <div className="text-gray-600 dark:text-gray-300">{item['Korean Translation']}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VocabSelector;