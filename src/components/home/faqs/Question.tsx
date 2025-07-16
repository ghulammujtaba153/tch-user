import React from 'react';

interface QuestionProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const Question: React.FC<QuestionProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-[20px] overflow-hidden bg-white">
      <button
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <h3 className="text-lg font-medium text-gray-900 font-onest">{question}</h3>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      <div className={`w-[95%] h-[1px] bg-gray-200 mx-auto ${isOpen ? 'block' : 'hidden'}`}></div>

      <div
        className={`
          overflow-hidden transition-all duration-200 ease-in-out
          ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <p className="px-6 py-4 text-gray-600 font-sans">{answer}</p>
      </div>
    </div>
  );
};

export default Question;
