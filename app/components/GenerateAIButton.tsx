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
      className="group relative inline-flex items-center gap-1.5 rounded-full border-2 border-primary bg-primary px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:border-primary/80 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:border-primary/50 disabled:bg-primary/50 disabled:hover:shadow-none"
    >
      <span className="relative z-10 transition-all duration-300 group-hover:opacity-90">
        {isGenerating ? 'Generating...' : 'Generate'}
      </span>
      <span className="relative z-10 inline-flex animate-pulse items-center text-yellow-200 transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-300">
        <span>✨</span>
      </span>
      <div className="absolute inset-0 -z-10 rounded-full bg-primary opacity-0 blur-lg transition-all duration-300 group-hover:opacity-100" />
    </button>
  );
};

export default GenerateAIButton;
