import React from 'react';
import LoadingIcon from '@/components/icons/LoadingIcon';
import SearchIcon from '@/components/icons/SearchIcon';

interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-full items-center rounded-full border border-blue-500 bg-blue-500 px-6 font-medium text-white transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:border-gray-300 disabled:bg-gray-300"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingIcon className="h-5 w-5 text-white" />
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5 text-white" />
        </span>
      )}
    </button>
  );
};

export default SubmitButton;
