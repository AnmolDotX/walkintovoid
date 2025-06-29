'use client';
import React from 'react';
import AppBar from '@/components/layout/AppBar';
import SideBar from '@/components/layout/SideBar';
import WalkIntoVoidLogo from '@/components/WalkIntoVoidLogo';
import { usePathname } from 'next/navigation';
import ParallaxParticles from '@/components/particles/ParallaxParticle';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isMainPath = pathname === '/';

  return (
    <div className="relative w-full">
      {/* Parallax Particles Background - only on main landing page */}
      {isMainPath && <ParallaxParticles />}
      {/* AppBar for desktop - now fixed position with animation */}
      <div className="hidden h-20 sm:block">
        <AppBar />
      </div>

      {/* Mobile header with sidebar */}
      <div className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between border-b-[0.2px] border-b-fuchsia-500 bg-gradient-to-r from-fuchsia-100/90 via-purple-50/90 to-fuchsia-100/90 px-5 py-4 shadow-md shadow-fuchsia-200/70 backdrop-blur-lg backdrop-filter sm:hidden dark:border-fuchsia-950/70 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-900/90 dark:shadow-black/70 dark:backdrop-filter-none">
        <WalkIntoVoidLogo />
        <SideBar />
      </div>

      {/* Main content with top padding to account for fixed navbar */}
      <main className="mx-auto h-auto min-h-[100vh-80px] w-full px-5 pt-16 sm:pt-4 xl:max-w-screen-2xl">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
