import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'MODERATOR'].includes(session.user.userType)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    // We'll run all our data queries in parallel for maximum efficiency
    const [
      totalViews,
      totalLikes,
      totalPosts,
      totalComments,
      postsByViews,
      latestPosts,
      pendingPosts,
    ] = await Promise.all([
      // Aggregate Stats
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.aggregate({ _sum: { likes: true } }),
      prisma.post.count(),
      prisma.comment.count(),
      // Chart Data: Top 7 posts by views
      prisma.post.findMany({
        where: { status: 'APPROVED' },
        orderBy: { views: 'desc' },
        take: 7,
        select: { title: true, views: true },
      }),
      // List Data: 5 most recent posts
      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, createdAt: true },
      }),
      // Actionable Items: 5 oldest pending posts
      prisma.post.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'asc' },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
    ]);

    // Format the data for the Tremor BarChart
    const chartData = postsByViews.map(post => ({
      name: post.title,
      'Page Views': post.views,
    }));

    const responseData = {
      stats: {
        views: totalViews._sum.views || 0,
        likes: totalLikes._sum.likes || 0,
        posts: totalPosts || 0,
        comments: totalComments || 0,
      },
      chartData,
      latestPosts,
      pendingPosts,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch dashboard stats' }), {
      status: 500,
    });
  }
}