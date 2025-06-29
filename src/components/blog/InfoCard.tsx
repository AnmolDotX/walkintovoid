import { Rss } from 'lucide-react';
import Link from 'next/link';

interface InfoCardProps {
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
}

const InfoCard = ({ title, description, link, icon = <Rss className="h-6 w-6 text-purple-400" /> }: InfoCardProps) => {
  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700/50">{icon}</div>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <p className="mb-4 text-sm text-gray-400">{description}</p>
      <Link href={link}>
        <span className="text-sm font-semibold text-purple-400 hover:text-purple-300">Learn More →</span>
      </Link>
    </div>
  );
};

export default InfoCard;
