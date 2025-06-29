import HeroSlider from '@/components/blog/HeroSlider';
import FeaturedSection from '@/components/blog/FeaturedSection';
import BentoGrid from '@/components/blog/BentoGrid';
import Newsletter from '@/components/blog/NewsLetter';
import Advertisement from '@/components/blog/Advertisement';
import InfoCard from '@/components/blog/InfoCard';
import { getSliderPosts, getFeaturedPosts, getBentoGridPosts } from '@/lib/data';
import { BookOpen, Github } from 'lucide-react';

// Revalidate the page every hour
export const revalidate = 3600;

const BlogPage = async () => {
  // Fetch all data in parallel
  const [sliderPosts, featuredPosts, bentoGridPosts] = await Promise.all([
    getSliderPosts(),
    getFeaturedPosts(),
    getBentoGridPosts(),
  ]);

  return (
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Slider */}
          {sliderPosts.length > 0 && (
            <div className="mb-16">
              <HeroSlider items={sliderPosts} />
            </div>
          )}

          {/* Featured Section */}
          {featuredPosts.length > 0 && <FeaturedSection posts={featuredPosts} />}

          {/* Bento Grid */}
          {bentoGridPosts.length > 0 && <BentoGrid posts={bentoGridPosts} />}

          {/* Newsletter */}
          <Newsletter />
        </main>

        {/* Sidebar */}
        <aside className="w-full space-y-8 lg:w-72">
          <div className="sticky top-24 space-y-8">
            {/* Info Card 1 */}
            <InfoCard
              title="About The Void"
              description="A philosophical journey through the realms of code, consciousness, and digital existence."
              link="/about"
              icon={<BookOpen className="h-6 w-6 text-purple-400" />}
            />

            {/* Advertisement */}
            <Advertisement type="custom" />

            {/* Info Card 2 */}
            <InfoCard
              title="My Projects"
              description="Explore the open-source projects I've built on my creative journey."
              link="/projects"
              icon={<Github className="h-6 w-6 text-purple-400" />}
            />

            {/* Google Ads Placeholder */}
            <Advertisement type="google" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;
