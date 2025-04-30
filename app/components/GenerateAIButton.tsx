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
      className="group relative inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:hover:shadow-none"
    >
      <span className="relative z-10 transition-all duration-300 group-hover:opacity-80">
        {isGenerating ? 'Generating...' : 'Brainstorm with AI'}
      </span>
      <span className="relative z-10 inline-flex animate-pulse items-center text-accent transition-all duration-300 group-hover:scale-110">
        <span>✨</span>
      </span>
      <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 opacity-0 blur-md transition-all duration-300 group-hover:opacity-100" />
    </button>
  );
};

export default GenerateAIButton;
