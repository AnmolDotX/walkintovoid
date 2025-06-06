// src/app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET a single post
export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } } // <-- Destructure 'id' here
) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const post = await prisma.post.findUniqueOrThrow({ where: { id } }); // <-- Use 'id' directly
    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Post not found' }), { status: 404 });
  }
}

// UPDATE a post
export async function PUT(
  req: Request,
  { params: { id } }: { params: { id: string } } // <-- Destructure 'id' here
) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const post = await prisma.post.findUniqueOrThrow({ where: { id } });

    if (session.user.userType === 'MODERATOR' && post.authorId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    const body = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id }, // <-- Use 'id' directly
      data: body,
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to update post' }), { status: 500 });
  }
}

// DELETE a post
export async function DELETE(
  req: Request,
  { params: { id } }: { params: { id: string } } // <-- Destructure 'id' here
) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const post = await prisma.post.findUniqueOrThrow({ where: { id } });

    if (session.user.userType === 'MODERATOR' && post.authorId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    await prisma.post.delete({ where: { id } }); // <-- Use 'id' directly
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to delete post' }), { status: 500 });
  }
}