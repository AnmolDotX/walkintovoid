import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch categories' }), { status: 500 });
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
      return new NextResponse(JSON.stringify({ error: 'Category name is required' }), { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    // Handle unique constraint violation (category already exists)
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      return new NextResponse(JSON.stringify({ error: 'A category with this name already exists.' }), {
        status: 409,
      });
    }
    console.error('Category creation error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create category' }), { status: 500 });
  }
}