import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import Image from 'next/image';

interface AdProps {
  type?: 'google' | 'carbon' | 'custom';
  className?: string;
}

const Advertisement = ({ type = 'custom', className = '' }: AdProps) => {
  // Mock ad data - replace with real ad content
  const mockAds = [
    {
      title: 'Master the Art of Code',
      description: 'Join thousands of developers learning advanced programming techniques',
      image:
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cta: 'Start Learning',
      sponsor: 'CodeMaster Pro',
    },
    {
      title: 'Cloud Infrastructure Made Simple',
      description: 'Deploy, scale, and manage your applications with ease',
      image:
        'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cta: 'Try Free',
      sponsor: 'CloudFlow',
    },
    {
      title: 'Design Tools for Developers',
      description: 'Create stunning interfaces without leaving your code editor',
      image:
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      cta: 'Get Started',
      sponsor: 'DevDesign',
    },
  ];

  const currentAd = mockAds[Math.floor(Math.random() * mockAds.length)];

  if (type === 'google') {
    return (
      <div className={`rounded-lg border border-gray-700/50 bg-gray-800/50 p-4 ${className}`}>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <Tag className="mr-1 h-3 w-3" />
          Advertisement
        </div>
        <div className="rounded-lg bg-gray-700/30 p-8 text-center">
          <p className="text-sm text-gray-400">Google Ads Placeholder</p>
          <p className="mt-2 text-xs text-gray-500">728x90 or 300x250</p>
        </div>
      </div>
    );
  }

  if (type === 'carbon') {
    return (
      <div className={`rounded-lg border border-gray-700/50 bg-gray-800/50 p-4 ${className}`}>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <Tag className="mr-1 h-3 w-3" />
          Carbon Ads
        </div>
        <div className="rounded-lg bg-gray-700/30 p-8 text-center">
          <p className="text-sm text-gray-400">Carbon Ads Placeholder</p>
          <p className="mt-2 text-xs text-gray-500">Developer-focused ads</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800/50 transition-all duration-300 hover:border-purple-500/50 ${className}`}
    >
      {/* Ad Badge */}
      <div className="border-b border-gray-600/50 bg-gray-700/50 px-4 py-2">
        <div className="flex items-center text-xs text-gray-400">
          <Tag className="mr-1 h-3 w-3" />
          Sponsored by {currentAd.sponsor}
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-4">
        {/* Image */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <Image
            height={720}
            width={1020}
            src={currentAd.image}
            alt={currentAd.title}
            className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Title */}
        <h3 className="mb-2 font-semibold text-white transition-colors duration-300 group-hover:text-purple-300">
          {currentAd.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-400">{currentAd.description}</p>

        {/* CTA Button */}
        <button className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-600/80 to-indigo-600/80 px-4 py-2 text-sm font-medium text-white transition-all duration-300 group-hover:scale-105 hover:from-purple-500 hover:to-indigo-500">
          {currentAd.cta}
          <ExternalLink className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Advertisement;
