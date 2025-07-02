import HeroSlider from '@/components/blog/HeroSlider';
import FeaturedSection from '@/components/blog/FeaturedSection';
import BlogList from '@/components/blog/BlogList';
import Newsletter from '@/components/blog/NewsLetter';
import Advertisement from '@/components/blog/Advertisement';
import InfoCard from '@/components/blog/InfoCard';
import { getSliderPosts, getFeaturedPosts } from '@/lib/data';
import { Github } from 'lucide-react';

export const revalidate = 3600;
type ResolvedSearchParams = {
  [key: string]: string | undefined;
};

const PostsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string | undefined>>;
  searchParams: Promise<ResolvedSearchParams>;
}) => {
  const searchString = await searchParams;
  const [sliderPosts, featuredPosts] = await Promise.all([getSliderPosts(), getFeaturedPosts()]);

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
        <main className="flex-1">
          {sliderPosts.length > 0 && (
            <div className="mb-16">
              <HeroSlider items={sliderPosts} />
            </div>
          )}
          {featuredPosts?.length > 0 && <FeaturedSection posts={featuredPosts} />}

          {/* --- Render BlogList and pass down the searchParams --- */}
          <BlogList searchParams={searchString} />

          <Newsletter />
        </main>
        <aside className="w-full space-y-8 lg:w-72">
          <div className="sticky top-24 space-y-8">
            <Advertisement type="carbon" />
            <InfoCard
              title="My Projects"
              description="Explore the open-source projects I've built on my creative journey."
              link="/projects"
              icon={<Github className="h-6 w-6 text-purple-400" />}
            />
            <Advertisement type="google" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostsPage;
