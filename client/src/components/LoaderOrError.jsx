import React from 'react';

const LoaderOrError = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-xl font-semibold text-gray-600">Loading Videos...</p>
      </div>
    );  
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-red-700">
        <h2 className="text-xl font-bold mb-2">Failed to load videos</h2>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
};

export default LoaderOrError;
