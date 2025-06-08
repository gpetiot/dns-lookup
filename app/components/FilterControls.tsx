import React, { useState } from 'react';

interface FilterControlsProps {
  availableOnly: boolean;
  dotComOnly: boolean;
  onAvailableOnlyChange: (value: boolean) => void;
  onDotComOnlyChange: (value: boolean) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  availableOnly,
  dotComOnly,
  onAvailableOnlyChange,
  onDotComOnlyChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters
  const activeFilters = [availableOnly, dotComOnly].filter(Boolean).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        title="Filter results"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
        {activeFilters > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
            {activeFilters}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-30 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                checked={availableOnly}
                onChange={e => onAvailableOnlyChange(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Available only</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-50">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                checked={dotComOnly}
                onChange={e => onDotComOnlyChange(e.target.checked)}
              />
              <span className="text-sm text-gray-700">.com only</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterControls;
