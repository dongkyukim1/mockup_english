import React from 'react';
import { BrainCircuitIcon, FileTextIcon, BookTextIcon } from './icons';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateToVocab: () => void;
  onNavigateToGrammar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateToVocab, onNavigateToGrammar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={onNavigateHome} className="flex items-center space-x-2 text-xl font-bold text-gray-800 dark:text-white group">
          <BrainCircuitIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
          <span>Aidu</span>
        </button>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={onNavigateToVocab} className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <FileTextIcon className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">어휘</span>
          </button>
          <button onClick={onNavigateToGrammar} className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <BookTextIcon className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">문법</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;