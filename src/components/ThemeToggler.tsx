'use client';
import { useTheme } from 'next-themes';
import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ThemeTogglerProps {
  className?: string;
}

const ThemeToggler = ({ className = '' }: ThemeTogglerProps) => {
  const { setTheme, theme } = useTheme();
  const buttonRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={buttonRef}>
      <motion.button
        layout
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className={cn(
          'group relative inline-block cursor-pointer rounded-full bg-amber-300/20 p-px text-xs leading-6 font-semibold text-amber-800 no-underline shadow-2xl shadow-zinc-900 dark:bg-indigo-900/20 dark:text-indigo-200',
          className,
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(251,191,36,0.6)_0%,rgba(251,191,36,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(99,102,241,0.6)_0%,rgba(99,102,241,0)_75%)]" />
        </span>
        <div className="relative z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-fuchsia-200 px-1 py-1 text-inherit ring-1 ring-fuchsia-300/10 dark:from-indigo-950/10 dark:to-blue-950/10">
          {theme === 'light' ? (
            <svg
              fill="none"
              height="14"
              width="14"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="text-amber-800"
            >
              <path
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          ) : (
            <svg
              fill="none"
              height="14"
              width="14"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="text-indigo-200"
            >
              <path
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </div>
        <span className="absolute -bottom-0 left-[0.5rem] h-px w-[calc(100%-1rem)] bg-gradient-to-r from-amber-700/0 via-amber-500/90 to-amber-700/0 transition-opacity duration-500 group-hover:opacity-40 dark:from-indigo-700/0 dark:via-indigo-500/90 dark:to-indigo-700/0" />
      </motion.button>
    </div>
  );
};

export default ThemeToggler;
