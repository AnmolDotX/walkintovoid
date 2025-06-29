import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';

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
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Featured{' '}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Dive deep into the void of knowledge with our most compelling narratives
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:transform hover:border-purple-500/50 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* Image Container */}
              <div className={`relative overflow-hidden ${index === 0 ? 'h-80' : 'h-48'}`}>
                {post.bannerImage && (
                  <Image
                    height={720}
                    width={1020}
                    src={post.bannerImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-sm">
                    {post.category.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3
                  className={`mb-3 line-clamp-2 font-bold text-white transition-colors duration-300 group-hover:text-purple-300 ${
                    index === 0 ? 'text-2xl' : 'text-xl'
                  }`}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className={`mb-4 line-clamp-3 text-gray-400 ${index === 0 ? 'text-base' : 'text-sm'}`}>
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Read More Arrow */}
                  <div className="flex items-center text-purple-400 transition-colors duration-300 group-hover:text-purple-300">
                    <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-600/5 via-indigo-600/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
