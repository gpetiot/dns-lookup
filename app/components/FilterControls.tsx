import React from 'react';
import FilterChoice from './FilterChoice';
import type { AvailabilityFilter, TldFilter } from '@/types/domain';

interface FilterControlsProps {
  availabilityFilter: AvailabilityFilter;
  tldFilter: TldFilter;
  onAvailabilityFilterChange: (filter: AvailabilityFilter) => void;
  onTldFilterChange: (filter: TldFilter) => void;
}

const availabilityChoices: { value: AvailabilityFilter; text: string }[] = [
  { value: 'all', text: 'All' },
  { value: 'available', text: 'Available' },
];

const tldChoices: { value: TldFilter; text: string }[] = [
  { value: 'all', text: 'All' },
  { value: 'com', text: '.com Only' },
];

const FilterControls: React.FC<FilterControlsProps> = ({
  availabilityFilter,
  tldFilter,
  onAvailabilityFilterChange,
  onTldFilterChange,
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-start gap-x-4 gap-y-2 border-b pb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Availability:</span>
        <div className="flex gap-1">
          {availabilityChoices.map(choice => (
            <FilterChoice
              key={choice.value}
              value={choice.value}
              text={choice.text}
              isSelected={availabilityFilter === choice.value}
              onClick={() => onAvailabilityFilterChange(choice.value)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">TLD:</span>
        <div className="flex gap-1">
          {tldChoices.map(choice => (
            <FilterChoice
              key={choice.value}
              value={choice.value}
              text={choice.text}
              isSelected={tldFilter === choice.value}
              onClick={() => onTldFilterChange(choice.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
