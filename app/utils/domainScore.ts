interface DomainCriterion {
  id: string;
  name: string;
  evaluate: (domain: string) => {
    passed: boolean;
    message: string;
  };
}

const domainCriteria: DomainCriterion[] = [
  {
    id: 'length',
    name: '< 10 characters',
    evaluate: (domain: string) => {
      const nameOnly = domain.split('.')[0];
      const passed = nameOnly.length <= 10;
      return {
        passed,
        message: passed ? 'Good length' : 'Too long',
      };
    },
  },
  {
    id: 'noHyphens',
    name: 'no hyphens',
    evaluate: (domain: string) => {
      const nameOnly = domain.split('.')[0];
      const passed = !(nameOnly.match(/-/g) || []).length;
      return {
        passed,
        message: passed ? 'No hyphens' : 'Contains hyphens',
      };
    },
  },
  {
    id: 'noNumbers',
    name: 'no numbers',
    evaluate: (domain: string) => {
      const nameOnly = domain.split('.')[0];
      const passed = !(nameOnly.match(/\d/g) || []).length;
      return {
        passed,
        message: passed ? 'No numbers' : 'Contains numbers',
      };
    },
  },
];

export interface DomainCheckResult {
  details: Record<
    string,
    {
      passed: boolean;
      message: string;
    }
  >;
}

export const checkDomainCriteria = (domain: string): DomainCheckResult => {
  const details: Record<string, { passed: boolean; message: string }> = {};

  domainCriteria.forEach(criterion => {
    details[criterion.id] = criterion.evaluate(domain);
  });

  return { details };
};

// Export criteria for use in components
export const criteria = domainCriteria;
