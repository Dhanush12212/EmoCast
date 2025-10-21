import React from 'react';

const LoaderOrError = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] px-4 sm:px-6">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-400 text-center">
          Loading Videos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-8 sm:mt-12 px-4 sm:px-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-red-600">
          Failed to load videos
        </h2>
        <p className="text-xs sm:text-sm md:text-base mb-4 text-red-400 break-words max-w-[90vw] sm:max-w-[400px]">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 sm:px-5 py-2 sm:py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
};

export default LoaderOrError;
