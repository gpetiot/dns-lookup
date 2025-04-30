import React from 'react';

interface NoAISuggestionPlaceholderProps {
  isGenerating: boolean;
}

const NoAISuggestionPlaceholder: React.FC<NoAISuggestionPlaceholderProps> = ({ isGenerating }) => {
  return (
    <div className="relative flex items-center justify-between rounded-lg border border-background-lighter bg-background px-4 py-3 opacity-80 shadow-sm">
      <div className="flex flex-grow items-center">
        <div className="mr-3 w-8 flex-shrink-0">
          <div className="h-6 w-6 animate-pulse rounded-full bg-background-lighter" />
        </div>
        <div className="text-md font-medium text-text-muted">
          Click "Generate AI Suggestions" to get creative domain ideas
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-sm text-text-muted">
          {isGenerating ? 'Generating suggestions...' : 'Powered by AI'}
        </div>
      </div>
    </div>
  );
};

export default NoAISuggestionPlaceholder;
