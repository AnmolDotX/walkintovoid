import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import Cookie from 'js-cookie';

interface LogoutCTAProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

// Helper function to clean up auth cookies
const cleanAuthCookies = () => {
  // Remove next-auth session cookie
  Cookie.remove('next-auth.session-token');
  Cookie.remove('__Secure-next-auth.session-token'); // For production

  // Remove any custom auth cookies
  Cookie.remove('accessToken');

  // Clear any auth-related localStorage items if needed
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    // Add any other auth-related items you need to clear
  }
};

const LogoutCTA: React.FC<LogoutCTAProps> = ({ text = 'Logout', onClick, className }) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    // Clean up cookies
    cleanAuthCookies();

    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Call next-auth signOut
    await signOut({ callbackUrl: '/signin' });
  };

  return (
    <div className="relative" ref={buttonRef}>
      {/* Button */}
      <motion.button
        layout
        onClick={handleLogout}
        className={cn(
          `group relative inline-block cursor-pointer rounded-full bg-rose-300/20 p-px text-xs leading-6 font-semibold text-rose-800 no-underline shadow-2xl shadow-zinc-900 dark:bg-rose-900/20 dark:text-rose-200`,
          className,
        )}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(225,29,72,0.6)_0%,rgba(225,29,72,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div className="relative z-10 flex items-center space-x-2 rounded-full bg-gradient-to-br from-rose-200 to-red-200 px-4 py-0.5 text-inherit ring-1 ring-white/10 dark:from-rose-950/10 dark:to-red-950/10">
          <span className="whitespace-nowrap">{text}</span>
          <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 17L21 12L16 7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path d="M21 12H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-rose-700/0 via-rose-500/90 to-rose-700/0 transition-opacity duration-500 group-hover:opacity-40" />
      </motion.button>
    </div>
  );
};

export default LogoutCTA;
