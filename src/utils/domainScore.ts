interface ScoreCriterion {
  id: string;
  name: string;
  weight: number;
  evaluate: (domain: string) => {
    score: number;
    message: string;
  };
}

const scoringCriteria: ScoreCriterion[] = [
  {
    id: 'length',
    name: 'Length',
    weight: 0.5, // 50% of total score
    evaluate: (domain: string) => {
      const nameOnly = domain.split('.')[0];
      if (nameOnly.length <= 5) {
        return { score: 100, message: 'Perfect length' };
      } else if (nameOnly.length <= 8) {
        return { score: 70, message: 'Good length' };
      } else if (nameOnly.length <= 10) {
        return { score: 40, message: 'Acceptable length' };
      }
      return { score: 10, message: 'Too long' };
    },
  },
  {
    id: 'characters',
    name: 'Characters',
    weight: 0.5, // 50% of total score
    evaluate: (domain: string) => {
      const nameOnly = domain.split('.')[0];
      let score = 100;
      let messages: string[] = [];

      // Check for hyphens
      const hyphenCount = (nameOnly.match(/-/g) || []).length;
      if (hyphenCount > 0) {
        score -= 50;
        messages.push('Avoid hyphens');
      }

      // Check for numbers
      const numberCount = (nameOnly.match(/\d/g) || []).length;
      if (numberCount > 0) {
        score -= 50;
        messages.push('Avoid numbers');
      }

      return {
        score,
        message: messages.length ? messages.join(' • ') : 'Clean name',
      };
    },
  },
];

export interface DomainScoreResult {
  score: number;
  details: Record<
    string,
    {
      score: number;
      message: string;
    }
  >;
}

export const calculateDomainScore = (domain: string): DomainScoreResult => {
  const details: Record<string, { score: number; message: string }> = {};
  let totalScore = 0;

  scoringCriteria.forEach(criterion => {
    const result = criterion.evaluate(domain);
    details[criterion.id] = result;
    totalScore += result.score * criterion.weight;
  });

  return {
    score: Math.round(totalScore),
    details,
  };
};

// Helper to get all criteria messages
export const getCriteriaMessages = (details: DomainScoreResult['details']): string[] => {
  return Object.entries(details)
    .map(([_, detail]) => detail.message)
    .filter(msg => msg !== 'Clean name');
};
