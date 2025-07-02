import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET a single post (no changes needed here, but included for completeness)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const post = await prisma.post.findUniqueOrThrow({
      where: { id },
      include: {
        tags: true,
        category: true,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: `Post not found : ${error}` }), { status: 404 });
  }
}

// UPDATE a post
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const postFromDb = await prisma.post.findUniqueOrThrow({ where: { id } });

    if (session.user.userType === 'MODERATOR' && postFromDb.authorId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    // --- THIS IS THE FIX ---
    const body = await req.json();

    // 1. Destructure the body to separate the fields we need from the ones we don't.
    // The `...postData` will contain fields like title, slug, content, categoryId, etc.
    const { tagIds, tags, category, ...postData } = body;

    // 2. Build the final data object in the format Prisma expects.
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData, // Spread the clean post fields (title, slug, etc.)
        tags: {
          // Use the `set` operator to sync the tags. This is the correct syntax.
          // It will disconnect old tags and connect new ones.
          set: tagIds ? tagIds.map((tagId: string) => ({ id: tagId })) : [],
        },
      },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Update Error:", error);
    return new NextResponse(JSON.stringify({ error: `Failed to update post : ${error}` }), { status: 500 });
  }
}

// DELETE a post (no changes needed here)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const post = await prisma.post.findUniqueOrThrow({ where: { id } });

    if (session.user.userType === 'MODERATOR' && post.authorId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    await prisma.post.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: `Failed to delete post : ${error}` }), { status: 500 });
  }
}