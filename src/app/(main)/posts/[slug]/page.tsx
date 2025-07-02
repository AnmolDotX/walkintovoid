import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx/mdx-components';
import Image from 'next/image';
import { getCommentsForPost } from '@/lib/data';
import { CommentSection } from '@/components/blog/CommentSection';

type Params = Promise<{ slug: string }>;
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

  if (!post) {
    return notFound();
  }

  prisma.post
    .update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
    .catch((err) => {
      console.error(`Failed to increment view count for post ${post.id}:`, err);
    });

  return post;
}

const PostDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const post = await getPost((await params).slug);
  if (!post) {
    return <div>...loading</div>;
  }

  const comments = await getCommentsForPost(post.id);

  return (
    <div className="prose prose-invert mx-auto max-w-3xl px-4 py-12">
      <article className="prose prose-invert mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          {post && post?.bannerImage && (
            <Image
              src={post?.bannerImage}
              alt={post?.title}
              width={1020}
              height={720}
              className="h-full w-full rounded-lg border border-white object-cover shadow-2xl shadow-black"
            />
          )}
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{post.title}</h1>
          <p className="mt-2 text-lg text-gray-400">
            {/* --- THIS IS THE FIX --- */}
            Published on{' '}
            {new Date(post?.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            by {post?.author?.name}
          </p>
          <span className="mt-2 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-400">
            {post?.category?.name}
          </span>
        </div>

        <MDXRemote source={post?.content} components={mdxComponents} />
      </article>
      <CommentSection postId={post?.id} initialComments={comments} />
    </div>
  );
};

export default PostDetailPage;
