import React from 'react';
import { calculateDomainScore, getCriteriaMessages } from '../utils/domainScore';

interface DomainScoreProps {
  domain: string;
}

const DomainScore: React.FC<DomainScoreProps> = ({ domain }) => {
  const score = calculateDomainScore(domain);
  
  // Determine color based on score
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get background color variant
  const getBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Only show if there's a domain
  if (!domain) return null;

  // Get all non-clean messages
  const messages = getCriteriaMessages(score.details);

  return (
    <div className="mt-2 text-sm flex justify-center">
      <div className="max-w-[50%] bg-white shadow-sm rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`font-semibold ${getScoreColor(score.score)}`}>
            Score: {score.score}/100
          </div>
          {messages.length > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300" />
              <div className="text-gray-600 truncate">
                {messages.join(' • ')}
              </div>
            </>
          )}
        </div>
        
        {/* Score progress bar */}
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBgColor(score.score)} transition-all duration-300`}
            style={{ width: `${score.score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DomainScore;
