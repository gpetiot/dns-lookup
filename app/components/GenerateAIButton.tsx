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
      className="group relative inline-flex items-center gap-1.5 rounded-full border-2 border-violet-500 bg-violet-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:border-violet-600 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:border-violet-400 disabled:bg-violet-400 disabled:hover:shadow-none"
    >
      <span className="relative z-10 transition-all duration-300 group-hover:opacity-90">
        {isGenerating ? 'Generating...' : 'Generate'}
      </span>
      <span className="relative z-10 inline-flex animate-pulse items-center text-yellow-200 transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-300">
        <span>✨</span>
      </span>
      <div className="absolute inset-0 -z-10 rounded-full bg-violet-500 opacity-0 blur-md transition-all duration-300 group-hover:opacity-30" />
    </button>
  );
};

export default GenerateAIButton;
