import React from 'react';

interface NoAISuggestionPlaceholderProps {
  isGenerating: boolean;
}

const NoAISuggestionPlaceholder: React.FC<NoAISuggestionPlaceholderProps> = ({ isGenerating }) => {
  return (
    <div className="relative flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 opacity-70">
      <div className="flex flex-grow items-center">
        <div className="mr-2 w-8 flex-shrink-0">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="text-md font-medium text-gray-400">
          Click "Generate AI Suggestions" to get creative domain ideas
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-sm text-gray-400">
          {isGenerating ? 'Generating suggestions...' : 'Powered by AI'}
        </div>
      </div>
    </div>
  );
};

export default NoAISuggestionPlaceholder;
