import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RxHamburgerMenu } from 'react-icons/rx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SelfProfile from '@/components/SelfProfile';
import WalkIntoVoidLogo from '@/components/WalkIntoVoidLogo';
import { useSession } from 'next-auth/react';
import { AUTH_STATUS } from '@/constants/auth';
import ThemeToggler from '@/components/ThemeToggler';
import LogoutCTA from '@/components/buttons/LogoutCTA';

const SideBar = () => {
  const pathname = usePathname();
  const session = useSession();
  const isUserAuthenticated = session.status === AUTH_STATUS.AUTHENTICATED;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Explore', path: '/explore' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Open menu">
          <RxHamburgerMenu className="h-6 w-6 cursor-pointer text-fuchsia-800 transition-colors duration-200 active:text-fuchsia-600 dark:text-fuchsia-200 dark:active:text-fuchsia-400" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-fuchsia-200 bg-white/95 backdrop-blur-md dark:border-fuchsia-900 dark:bg-slate-950/95"
      >
        <SheetHeader className="border-b border-fuchsia-100 pb-4 dark:border-fuchsia-900/50">
          <SheetTitle className="text-fuchsia-900 dark:text-fuchsia-200">
            <WalkIntoVoidLogo className="mx-auto" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col items-start gap-1 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <SheetClose asChild key={item.path}>
                <Link
                  href={item.path}
                  className={`w-full rounded-lg p-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-fuchsia-100 font-semibold text-fuchsia-900 dark:bg-fuchsia-900/30 dark:text-fuchsia-300'
                      : 'text-fuchsia-800 hover:bg-fuchsia-50 dark:text-fuchsia-200 dark:hover:bg-fuchsia-900/20'
                  }`}
                >
                  {item.name}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
        <SheetFooter className="mt-auto flex-col items-stretch gap-4 border-t border-fuchsia-100 pt-4 dark:border-fuchsia-900/50">
          <div className="flex items-center justify-between">
            <SelfProfile showName={true} />
            <ThemeToggler />
          </div>
          {isUserAuthenticated && (
            <SheetClose asChild>
              <LogoutCTA text="Logout" className="w-full justify-center" />
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SideBar;
