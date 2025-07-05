import React from 'react';

interface ErrorProps {
  error: Error | string | null;
}

export const Error: React.FC<ErrorProps> = ({ error }) =>
  error ? (
    <div style={{ color: 'red', textAlign: 'center', padding: '1rem' }}>
      {typeof error === 'string' ? error : error.message}
    </div>
  ) : null;
