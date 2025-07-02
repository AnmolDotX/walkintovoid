import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(tags);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch tags' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const { name } = await req.json();
    if (!name) {
      return new NextResponse(JSON.stringify({ error: 'Tag name is required' }), { status: 400 });
    }

    const newTag = await prisma.tag.create({
      data: { name },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      return new NextResponse(JSON.stringify({ error: 'A tag with this name already exists.' }), { status: 409 });
    }
    console.error('Tag creation error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create tag' }), { status: 500 });
  }
}