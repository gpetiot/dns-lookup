import React from 'react';

interface GenerateAIButtonProps {
  isGenerating: boolean;
  onClick: () => void;
}

const GenerateAIButton: React.FC<GenerateAIButtonProps> = ({ isGenerating, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isGenerating}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
    >
      <span className="transition-opacity duration-200">
        {isGenerating ? 'Generating...' : 'Generate'}
      </span>
      <span
        className={`text-yellow-500 transition-all duration-200 ${isGenerating ? 'animate-pulse' : ''}`}
      >
        ✨
      </span>
    </button>
  );
};

export default GenerateAIButton;
