import React from 'react';

interface FilterChoiceProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
  text: string;
}

const FilterChoice: React.FC<FilterChoiceProps> = ({ value, isSelected, onClick, text }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-primary text-white shadow-sm'
          : 'bg-background-lighter text-text-muted hover:bg-background-lighter/80 hover:text-text'
      }`}
    >
      {text}
    </button>
  );
};

export default FilterChoice;
