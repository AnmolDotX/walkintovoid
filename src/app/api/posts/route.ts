// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { PostStatus } from '@prisma/client';

// GET all posts (for Admin/Moderator)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        tags: { select: { name: true } },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: `failed to fetch posts : ${error}` }), { status: 404 });
  }
}

// POST a new post
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, content, slug, categoryId, tagIds } = body;

    if (!title || !content || !slug || !categoryId) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        authorId: session.user.id,
        categoryId,
        status: PostStatus.PENDING,
        tags: {
          connect: tagIds ? tagIds.map((id: string) => ({ id })) : [],
        },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Post creation error:', error);
    if (error instanceof Error && 'code' in error && (error).code === 'P2002') {
         return new NextResponse(JSON.stringify({ error: 'A post with this slug already exists.' }), { status: 409 });
    }
    return new NextResponse(JSON.stringify({ error: 'Failed to create post' }), { status: 500 });
  }
}