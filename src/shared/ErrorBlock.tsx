import React from 'react';

interface ErrorBlockProps {
  error: Error | string;
}

export const ErrorBlock: React.FC<ErrorBlockProps> = ({ error }) => (
  <div className="flex items-center gap-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-4 my-2">
    <span className="text-2xl text-red-500">⚠️</span>
    <span className="text-red-800 dark:text-red-200 font-semibold text-sm break-all">
      {typeof error === 'string' ? error : error.message}
    </span>
  </div>
);
