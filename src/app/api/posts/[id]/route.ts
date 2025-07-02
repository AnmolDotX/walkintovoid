import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';



// GET a single post
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Destructure params from the context object inside the function
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
  // Destructure params from the context object inside the function
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

    const body = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: `Failed to update post : ${error}` }), { status: 404 });
  }
}

// DELETE a post
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Destructure params from the context object inside the function
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
    return new NextResponse(JSON.stringify({ error: `Failed to delete po : ${error}` }), { status: 404 });
  }
}