// src/app/(main)/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx/mdx-components';
import Image from 'next/image';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: 'APPROVED' },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, status: 'APPROVED' },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });
  return post;
}

const PostDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const paramsData = await params;
  const post = await getPost(paramsData.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-invert mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        {post.bannerImage && (
          <Image
            src={post.bannerImage}
            alt={post.title}
            className="h-full w-full rounded-lg border border-white object-cover shadow-2xl shadow-black"
          />
        )}
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{post.title}</h1>
        <p className="mt-2 text-lg text-gray-400">
          Published on{' '}
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          by {post.author.name}
        </p>
        <span className="mt-2 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-400">
          {post.category.name}
        </span>
      </div>

      {/* Render the MDX content using the common components */}
      <MDXRemote source={post.content} components={mdxComponents} />
    </article>
  );
};

export default PostDetailPage;
