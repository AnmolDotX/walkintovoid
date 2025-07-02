// src/components/blog/BlogList.tsx
import React from 'react';
import { Clock, User, Eye, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/data';
import { BlogFilters } from '@/components/blog/BlogFilter';

// Helper functions for formatting
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatNumber = (num: number) => (num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString());

// This is now a Server Component that accepts searchParams
const BlogList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  // Fetch posts and filter data in parallel
  const [posts, categories, tags] = await Promise.all([
    getAllPosts({
      search: searchParams.search,
      category: searchParams.category,
      tag: searchParams.tag,
    }),
    getAllCategories(),
    getAllTags(),
  ]);

  return (
    <section className="my-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            From the
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> Void</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            A collection of thoughts, insights, and journeys into the unknown.
          </p>
        </div>

        {/* --- Render the Filter UI --- */}
        <BlogFilters categories={categories} tags={tags} />

        {/* --- NEW: List View --- */}
        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group block">
              <article className="flex flex-col gap-6 rounded-2xl border border-gray-800/50 bg-gray-900/30 p-4 transition-all duration-300 hover:border-purple-600/50 hover:bg-gray-800/50 md:flex-row">
                {/* Image on the left */}
                <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg md:h-auto md:w-1/3">
                  {post.bannerImage ? (
                    <Image
                      src={post.bannerImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
                      <div className="text-6xl text-purple-400/30">📝</div>
                    </div>
                  )}
                  {post.isFeatured && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-fuchsia-600/80 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      <Star size={12} /> Featured
                    </div>
                  )}
                </div>

                {/* Content on the right */}
                <div className="flex w-full flex-col">
                  <span className="mb-2 inline-block self-start rounded-full bg-purple-600/20 px-3 py-1 text-xs font-medium text-purple-300">
                    {post.category.name}
                  </span>
                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-purple-300">{post.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-400">{post.excerpt}</p>
                  <div className="mt-auto flex w-full items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {post.author.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name || ''}
                          width={18}
                          height={18}
                          className="rounded-full"
                        />
                      ) : (
                        <User size={16} />
                      )}
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {formatNumber(post.views)}
                      </span>
                      <span className="flex items-center gap-1 text-red-400/80">
                        <Heart size={12} /> {formatNumber(post.likes)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl text-gray-600">💨</div>
            <h3 className="mb-2 text-xl font-medium text-gray-400">No posts match your filters</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;
