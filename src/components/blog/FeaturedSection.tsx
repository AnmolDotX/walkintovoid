import React from 'react';
import { BentoGridItem, BentoGrid } from '../ui/bento-grid';
import { cn } from '@/lib/utils';

interface FeaturedPost {
  id: string;
  title: string;
  excerpt: string | null;
  bannerImage: string | null;
  author: {
    name: string | null;
    image?: string | null;
  };
  category: {
    name: string;
  };
  createdAt: string | Date;
  slug: string;
}

interface FeaturedSectionProps {
  posts: FeaturedPost[];
}

const FeaturedSection = ({ posts }: FeaturedSectionProps) => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white sm:text-4xl">
            Featured{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">Experiences you may like to read about</p>
        </div>

        {/* Featured Posts Grid */}
        <BentoGrid className="mx-auto w-full max-w-7xl">
          {posts
            ?.slice(0, 6)
            .map((item, i) => (
              <BentoGridItem
                key={item.id}
                description={item.excerpt}
                imgSrc={item?.bannerImage}
                title={item?.title}
                link={`/posts/${item.slug}`}
                className={cn(i === 0 && 'md:col-span-2', i === 3 && 'md:col-span-2')}
              />
            ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default FeaturedSection;
