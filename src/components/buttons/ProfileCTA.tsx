'use client';
import { useSession } from 'next-auth/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LogoutCTA from './LogoutCTA';
import { AUTH_STATUS } from '@/constants/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileCTA = () => {
  const { data: session, status } = useSession();

  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center">
        <Avatar className="group relative inline-block h-6 w-6 cursor-pointer rounded-full border border-fuchsia-500 bg-fuchsia-300/20 text-xs leading-6 font-semibold text-fuchsia-800 no-underline shadow-2xl shadow-zinc-900 dark:bg-fuchsia-900/20 dark:text-fuchsia-200">
          <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? 'avatar'} />
          <AvatarFallback>{session?.user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-purple-700/0 via-fuchsia-500/90 to-purple-700/0 transition-opacity duration-500 group-hover:opacity-40" />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>{status === AUTH_STATUS.AUTHENTICATED && <LogoutCTA text="Logout" />}</PopoverContent>
    </Popover>
  );
};

export default ProfileCTA;
