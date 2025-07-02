import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

// Updated BentoGrid component
export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={cn('grid grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3', className)}>{children}</div>;
};

// Updated BentoGridItem component
export const BentoGridItem = ({
  className,
  title,
  description,
  icon,
  imgSrc,
  imgAlt = '',
  link = '/',
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  imgSrc?: string | null;
  imgAlt?: string;
  link?: string;
}) => {
  return (
    <Link className={className} href={link} prefetch>
      <div
        className={cn(
          'group relative h-full overflow-hidden rounded-xl border border-neutral-200 transition duration-200 dark:border-white/[0.2] dark:bg-black',
        )}
      >
        {/* Background Image */}
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={imgAlt}
            height={720}
            width={1020}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col justify-end p-4 transition-colors group-hover:text-fuchsia-100">
          {icon && <div className="mb-2">{icon}</div>}
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="text-sm text-fuchsia-200">{description}</p>
        </div>
      </div>
    </Link>
  );
};
