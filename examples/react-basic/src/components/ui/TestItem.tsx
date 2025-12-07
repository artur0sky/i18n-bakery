import React from 'react';

interface TestItemProps {
  label: string;
  value: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  note?: string;
}

export const TestItem: React.FC<TestItemProps> = ({ label, value, status = 'neutral', note }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      case 'success': return 'text-emerald-500';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="mb-3 last:mb-0">
      <div className="text-sm text-gray-400 mb-1 font-medium">{label}</div>
      <div className={`text-base font-medium ${getStatusColor()}`}>
        {value}
        {note && (
          <span className="text-xs text-gray-400 ml-2 font-normal italic">
            {note}
          </span>
        )}
      </div>
    </div>
  );
};
