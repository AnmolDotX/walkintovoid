import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  bannerImage: true,
  isAdvertisement: true,
  isFeatured: true,
  createdAt: true,
  views: true,
  likes: true,
  author: {
    select: { name: true, image: true },
  },
  category: {
    select: { name: true },
  },
} satisfies Prisma.PostSelect;


export type TPostItem = Prisma.PostGetPayload<{
  select: typeof postSelect;
}>;

export async function getSliderPosts(): Promise<TPostItem[]> {
  return prisma.post.findMany({
    where: {
      status: 'APPROVED',
      isFeatured: false,
    },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}


export async function getFeaturedPosts(): Promise<TPostItem[]> {
  return prisma.post.findMany({
    where: {
      status: 'APPROVED',
      isFeatured: true,
    },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
    take: 4,
  });
}


export async function getBentoGridPosts(): Promise<TPostItem[]> {
  return prisma.post.findMany({
    where: {
      status: 'APPROVED',
      isAdvertisement: false,
    },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
}

// No changes needed for the comments function
export async function getCommentsForPost(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}