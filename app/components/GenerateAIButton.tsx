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
      className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-[length:200%_auto] px-4 py-1.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[position:right_center] hover:shadow-purple-200/50 focus:outline-none disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
    >
      <span className="relative z-10">{isGenerating ? 'Generating...' : 'Generate'}</span>
      <span className="relative z-10 animate-pulse">✨</span>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 via-pink-500/20 to-purple-400/20 blur-sm transition-all duration-300 group-hover:blur-md" />
    </button>
  );
};

export default GenerateAIButton;
