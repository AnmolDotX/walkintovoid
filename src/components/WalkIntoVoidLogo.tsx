import { useRouter } from 'next/navigation';
import React from 'react';

interface WalkIntoVoidLogoProps {
  className?: string;
}

const WalkIntoVoidLogo = ({ className = '' }: WalkIntoVoidLogoProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.replace('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative flex items-center rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus:outline-none ${className}`}
      aria-label="WalkIntoVoid - Return to home"
    >
      {/* Logo Symbol */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-transparent blur-sm transition-all duration-300 group-hover:blur-md" />

        {/* Main logo container */}
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-purple-500/30 bg-gradient-to-br from-gray-800 via-purple-900/50 to-black transition-all duration-300 group-hover:border-purple-400/50">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10" />

          {/* WIV Text */}
          <div className="relative z-10 text-xs font-bold tracking-wider">
            <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-gray-200 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-200 group-hover:via-indigo-200 group-hover:to-white">
              WIV
            </span>
          </div>

          {/* Void center dot */}
          <div className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/60 transition-all duration-300 group-hover:h-1.5 group-hover:w-1.5 group-hover:bg-white/80" />

          {/* Subtle inner glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/5 to-indigo-500/5 transition-all duration-300 group-hover:from-purple-500/10 group-hover:to-indigo-500/10" />
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/5 via-indigo-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
};

export default WalkIntoVoidLogo;
