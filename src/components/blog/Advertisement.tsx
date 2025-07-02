import React from 'react';
import { Tag } from 'lucide-react';

interface AdProps {
  type?: 'google' | 'carbon';
  className?: string;
}

const Advertisement = ({ type = 'google', className = '' }: AdProps) => {
  if (type === 'google') {
    return (
      <div className={`rounded-lg border border-gray-700/50 bg-gray-800/50 p-4 ${className}`}>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <Tag className="mr-1 h-3 w-3" />
          Advertisement
        </div>
        <div className="rounded-lg bg-gray-700/30 p-8 text-center">
          <p className="text-sm text-gray-400">Google Ads Placeholder</p>
          <p className="mt-2 text-xs text-gray-500">728x90 or 300x250</p>
        </div>
      </div>
    );
  }

  if (type === 'carbon') {
    return (
      <div className={`rounded-lg border border-gray-700/50 bg-gray-800/50 p-4 ${className}`}>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <Tag className="mr-1 h-3 w-3" />
          Carbon Ads
        </div>
        <div className="rounded-lg bg-gray-700/30 p-8 text-center">
          <p className="text-sm text-gray-400">Carbon Ads Placeholder</p>
          <p className="mt-2 text-xs text-gray-500">Developer-focused ads</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800/50 transition-all duration-300 hover:border-purple-500/50 ${className}`}
    >
      No ads
    </div>
  );
};

export default Advertisement;
