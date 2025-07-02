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

export async function getAllPosts(params: {
  search?: string;
  tag?: string;
  category?: string;
}): Promise<TPostItem[]> {
  const { search, tag, category } = params;

  const where: Prisma.PostWhereInput = {
    // Only show approved posts to the public
    status: 'APPROVED',
    AND: [], // We will push filters into this array
  };

  // Dynamically build the where clause
  if (search) {
    (where.AND as Prisma.PostWhereInput[]).push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (category) {
    (where.AND as Prisma.PostWhereInput[]).push({
      category: { name: { equals: category, mode: 'insensitive' } },
    });
  }

  if (tag) {
    (where.AND as Prisma.PostWhereInput[]).push({
      tags: { some: { name: { equals: tag, mode: 'insensitive' } } },
    });
  }

  return prisma.post.findMany({
    where,
    select: postSelect,
    orderBy: { createdAt: 'desc' },
  });
}

// --- NEW: Functions to populate filter dropdowns ---
export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: 'asc' } });
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