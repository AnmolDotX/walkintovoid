// src/app/(admin)/admin-dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  Title,
  Grid,
  Text,
  Metric,
  Flex,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
} from '@tremor/react';
import { Eye, Heart, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { EngagingPostsChart } from '@/components/chart/EngagingPostsChart';

// Define types for our fetched data for type safety
type StatCards = {
  views: number;
  likes: number;
  posts: number;
  comments: number;
};

type ChartData = {
  name: string;
  'Page Views': number;
};

type PostListItem = {
  id: string;
  title: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

type DashboardData = {
  stats: StatCards;
  chartData: ChartData[];
  latestPosts: PostListItem[];
  pendingPosts: PostListItem[];
};

const dataFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // --- Corrected API endpoint from your previous code ---
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data.');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading Dashboard...</div>;
  }

  if (!data) {
    return <div className="container mx-auto p-4 text-center">Could not load dashboard data.</div>;
  }

  const { stats, chartData, latestPosts, pendingPosts } = data;

  const statItems = [
    { title: 'Total Views', metric: stats.views, icon: Eye },
    { title: 'Total Likes', metric: stats.likes, icon: Heart },
    { title: 'Total Posts', metric: stats.posts, icon: FileText },
    { title: 'Total Comments', metric: stats.comments, icon: MessageSquare },
  ];

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Title className="text-3xl font-bold">Admin Dashboard</Title>

      {/* Stat Cards */}
      <Grid numItemsMd={2} numItemsLg={4} className="gap-6">
        {statItems.map((item) => (
          <Card key={item.title}>
            <Flex alignItems="start">
              <div className="truncate">
                <Text>{item.title}</Text>
                <Metric className="truncate">{dataFormatter(item.metric)}</Metric>
              </div>
              <item.icon className="h-8 w-8 text-gray-500" />
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Main Grid for Charts and Lists */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        {/* --- USE YOUR NEW RECHARTS COMPONENT --- */}
        <Card className="lg:col-span-2">
          <Title>Most Engaging Posts (by Page Views)</Title>
          <div className="mt-6">
            <EngagingPostsChart data={chartData} />
          </div>
        </Card>

        {/* Actionable Items Card */}
        <Card>
          <Title>Actionable Items</Title>
          {pendingPosts.length > 0 ? (
            <>
              <Text className="mt-2">Posts pending your approval</Text>
              <Table className="mt-4">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Title</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <Link href={`/admin-posts/${post.id}`} className="text-tremor-content-strong hover:underline">
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <Flex justifyContent="center" alignItems="center" className="h-full">
              <Text className="italic">No pending posts. Great job!</Text>
            </Flex>
          )}
        </Card>
      </Grid>

      {/* Recent Posts List */}
      <Card>
        <Title>Recent Posts</Title>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Date Created</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Link href={`/admin-posts/${post.id}`} className="text-tremor-content-strong hover:underline">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      post.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : post.status === 'APPROVED'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {post.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminDashboard;
