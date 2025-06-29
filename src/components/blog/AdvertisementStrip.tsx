import { Megaphone } from 'lucide-react';
import Link from 'next/link';

const AdvertisementStrip = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-3">
        <Megaphone className="h-6 w-6" />
        <p className="text-sm font-semibold">
          <span className="hidden sm:inline">Special Offer: </span>
          <Link href="/courses/react" className="underline hover:text-purple-200">
            Master React with our new Premium Course!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdvertisementStrip;
