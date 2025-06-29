import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SelfProfileProps {
  showName?: boolean;
  className?: string;
}

const SelfProfile = ({ showName = true, className = '' }: SelfProfileProps) => {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Guest';
  const userImage = session?.user?.image || '/default-avatar.png';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  if (!showName) {
    return (
      <Avatar className={`border-[1.5px] border-fuchsia-500 dark:border-fuchsia-700 ${className}`}>
        <AvatarImage src={userImage} alt={userName} />
        <AvatarFallback className="bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="border-[1.5px] border-fuchsia-500 dark:border-fuchsia-700">
        <AvatarImage src={userImage} alt={userName} />
        <AvatarFallback className="bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200">
          {initials}
        </AvatarFallback>
      </Avatar>
      <p className="text-sm font-medium text-fuchsia-900 dark:text-fuchsia-200">{userName}</p>
    </div>
  );
};

export default SelfProfile;
