import React from 'react';

export const Skeleton: React.FC<{ width?: string; height?: string }> = ({
  width = '100%',
  height = '1.5rem',
}) => (
  <div
    style={{
      background: '#eee',
      borderRadius: 4,
      width,
      height,
      margin: '0.5rem 0',
      animation: 'pulse 1.5s infinite',
    }}
  />
);
