'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SliderItem {
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
  isAdvertisement: boolean;
  slug?: string | null;
}

interface HeroSliderProps {
  items: SliderItem[];
}

const HeroSlider = ({ items }: HeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!items.length) return null;
  const currentItem = items[currentIndex];

  return (
    <div className="relative h-[70vh] overflow-hidden rounded-2xl bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentItem.bannerImage && (
          <Image
          height={720}
            width={1020}
            src={currentItem?.bannerImage}
            alt={currentItem.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Advertisement Badge */}
            {currentItem.isAdvertisement && (
              <div className="mb-4 inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300">
                <Tag className="mr-1 h-3 w-3" />
                Sponsored
              </div>
            )}

            {/* Category */}
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
              {currentItem.category.name}
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
              {currentItem.title}
            </h1>

            {/* Excerpt */}
            <p className="mb-8 line-clamp-3 text-xl leading-relaxed text-gray-300">{currentItem.excerpt}</p>

            {/* Meta Info */}
            <div className="mb-8 flex items-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{currentItem.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(currentItem.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* CTA Button */}

            <Link
              prefetch
              href={`/posts/${currentItem.slug}`}
              className="inline-flex transform items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25"
            >
              Read Full Story
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 transform rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 transform rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/50"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 transform space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 ease-linear"
          style={{
            width: isAutoPlaying ? '100%' : '0%',
            animation: isAutoPlaying ? 'progress 5s linear infinite' : 'none',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
