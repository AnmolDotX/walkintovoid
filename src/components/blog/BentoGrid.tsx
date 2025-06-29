import React from 'react';
import { Clock, User, Eye, Heart, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface BentoPost {
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
  views: number;
  likes: number;
  slug: string;
}

interface BentoGridProps {
  posts: BentoPost[];
}

const BentoGrid = ({ posts }: BentoGridProps) => {
  const getGridClass = (index: number) => {
    const patterns = [
      'md:col-span-2 md:row-span-2', // Large
      'md:col-span-1 md:row-span-1', // Small
      'md:col-span-1 md:row-span-2', // Tall
      'md:col-span-2 md:row-span-1', // Wide
      'md:col-span-1 md:row-span-1', // Small
      'md:col-span-1 md:row-span-1', // Small
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section className="my-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Explore the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Void</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            A curated collection of thoughts, insights, and journeys into the unknown
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-4">
          {posts.map((post, index) => {
            const isLarge = index % 6 === 0;
            const isTall = index % 6 === 2;
            const isWide = index % 6 === 3;

            return (
              <article
                key={post.id}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900 to-gray-800 transition-all duration-500 hover:scale-[1.02] hover:transform hover:border-purple-500/50 ${getGridClass(index)}`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  {post.bannerImage && (
                    <Image
                      height={720}
                      width={1020}
                      src={post.bannerImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-6">
                  {/* Top Section */}
                  <div>
                    {/* Category */}
                    <span className="mb-3 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300 backdrop-blur-sm">
                      {post.category.name}
                    </span>

                    {/* Title */}
                    <h3
                      className={`mb-2 line-clamp-2 font-bold text-white transition-colors duration-300 group-hover:text-purple-300 ${
                        isLarge ? 'text-2xl' : isTall || isWide ? 'text-xl' : 'text-lg'
                      }`}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt - Only show on larger cards */}
                    {(isLarge || isTall) && <p className="mb-4 line-clamp-3 text-sm text-gray-400">{post.excerpt}</p>}
                  </div>

                  {/* Bottom Section */}
                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Read More Icon */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 transition-colors duration-300 group-hover:bg-purple-500/30">
                        <ArrowUpRight className="h-4 w-4 transform text-purple-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-purple-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </article>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex transform items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25">
            Load More Stories
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
