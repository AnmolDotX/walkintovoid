import { useEffect, useRef, useState } from 'react';
// import ThemeToggler from '@/components/ThemeToggler';
import WalkIntoVoidLogo from '@/components/WalkIntoVoidLogo';
import { useSession } from 'next-auth/react';
import { AUTH_STATUS } from '@/constants/auth';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import appBarConfig from '@/configs/appBarConfig';
import ProfileCTA from '@/components/buttons/ProfileCTA';

const AppBar = () => {
  const session = useSession();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY <= 10) {
          setVisible(true);
        } else if (currentScrollY > lastScrollY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }

        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);

  return (
    <motion.nav
      layout
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : -100,
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-0 left-0 z-50 mx-auto flex w-[95vw] max-w-5xl items-center justify-between gap-2 rounded-xl border-[0.3px] border-fuchsia-600 bg-gradient-to-r from-fuchsia-100/90 via-purple-50/90 to-fuchsia-100/90 px-10 py-2 shadow-md shadow-purple-200/70 backdrop-blur-lg backdrop-filter sm:w-[90vw] md:min-h-[47px] md:w-[70vw] dark:border-purple-600/40 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-900/90 dark:shadow-black/70 dark:backdrop-filter-none"
    >
      <WalkIntoVoidLogo />
      <ul className="mr-8 flex flex-1 items-center justify-end gap-4 text-sm text-fuchsia-800 dark:text-fuchsia-200">
        {appBarConfig.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer transition-all duration-300 hover:text-fuchsia-950 dark:hover:text-fuchsia-400"
          >
            <Link href={item.href} className="block" prefetch>
              {item.label}
            </Link>
          </li>
        ))}
        <AnimatePresence mode="wait">
          {session.status === AUTH_STATUS.AUTHENTICATED && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -20 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              key="profileButton"
              className="origin-left"
            >
              <ProfileCTA />
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
    </motion.nav>
  );
};

export default AppBar;
