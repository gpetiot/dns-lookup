import React from 'react';
import { checkDomainCriteria, criteria } from '@/utils/domainScore';

interface DomainScoreProps {
  domain: string;
}

const DomainScore: React.FC<DomainScoreProps> = ({ domain }) => {
  const { details } = checkDomainCriteria(domain);

  // Only show if there's a domain
  if (!domain) return null;

  const getStatusIcon = (passed: boolean) => {
    if (passed) {
      return (
        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg
        className="h-3 w-3 text-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  };

  const getTextColor = (passed: boolean) => {
    return passed ? 'text-primary' : 'text-text-muted';
  };

  return (
    <div className="mt-2 pl-2 text-xs">
      <div className="space-y-1.5">
        {criteria.map(criterion => (
          <div key={criterion.id} className="flex items-center space-x-2">
            {getStatusIcon(details[criterion.id].passed)}
            <span className={`${getTextColor(details[criterion.id].passed)} font-medium`}>
              {criterion.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainScore;
