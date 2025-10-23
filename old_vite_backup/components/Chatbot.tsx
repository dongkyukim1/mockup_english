import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { MessageSquareIcon, SendIcon, XIcon, LoaderCircleIcon } from './icons';

interface ChatbotProps {
  context: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen) {
        // Focus input when chat opens
        setTimeout(() => inputRef.current?.focus(), 100); 
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '' || isLoading) return;

    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const responseText = await getChatbotResponse(userInput, context, messages);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { role: 'model', text: "죄송합니다, 답변을 받지 못했습니다. 다시 시도해 주세요." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-5 right-5 z-20 transition-transform duration-300 ease-out ${isOpen ? 'scale-0' : 'scale-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open chatbot"
        >
          <MessageSquareIcon className="w-8 h-8" />
        </button>
      </div>

      <div className={`fixed bottom-5 right-5 z-20 w-[calc(100%-2.5rem)] max-w-sm h-[70vh] max-h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Aidu 봇에게 질문하기</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close chatbot"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[85%]">
                <p className="text-sm text-gray-800 dark:text-gray-200">안녕하세요! 저는 Aidu 봇입니다. 현재 복습 중인 내용에 대해 궁금한 점이 있으면 무엇이든 물어보세요!</p>
            </div>
          </div>
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-[85%] ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[85%]">
                    <LoaderCircleIcon className="w-5 h-5 text-gray-500 animate-spin" />
                 </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-3 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white rounded-lg p-2 disabled:bg-blue-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              aria-label="Send message"
            >
                <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </>
  );
};

export default Chatbot;