import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const Notification: React.FC<NotificationProps> = ({ message, type = 'info' }) => (
  <div
    style={{
      background: type === 'error' ? '#ffdddd' : type === 'success' ? '#ddffdd' : '#ddeeff',
      color: type === 'error' ? '#a00' : type === 'success' ? '#080' : '#005',
      border: '1px solid #ccc',
      borderRadius: 4,
      padding: '0.75rem 1.5rem',
      margin: '1rem 0',
      textAlign: 'center',
    }}
  >
    {message}
  </div>
);
