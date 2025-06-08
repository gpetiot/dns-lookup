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
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      {text}
    </button>
  );
};

export default FilterChoice;
