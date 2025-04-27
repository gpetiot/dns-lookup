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
      className={`rounded-md px-2.5 py-1 text-sm transition-colors duration-150 ${
        isSelected
          ? 'bg-blue-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {text}
    </button>
  );
};

export default FilterChoice;
