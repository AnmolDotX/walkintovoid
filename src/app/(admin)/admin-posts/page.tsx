// src/app/(admin)/admin-posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PostStatus } from '@prisma/client';
import { Eye, Trash2, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  bannerImage: string | null;
  authorId: string;
  categoryId: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'; // Based on the example
  deleteRequest: boolean;
  isAdvertisement: boolean;
  isFeatured: boolean;
  likes: number;
  views: number;
  createdAt: string; // or `Date` if parsed
  updatedAt: string; // or `Date` if parsed
  author: {
    name: string;
  };
  category: {
    name: string;
  };
  tags: string[]; // or more complex if you plan to include tag metadata later
}

const AdminPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePublish = async (postId: string) => {
    await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    fetchPosts(); // Refresh list
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    await fetch(`/api/posts/${postToDelete.id}`, {
      method: 'DELETE',
    });
    setPostToDelete(null); // Close the dialog
    fetchPosts(); // Refresh list
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        {/* --- NEW: Create Post Button --- */}
        <Button asChild>
          <Link href="/admin-posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900">
        <table className="w-full text-left">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Advertisement</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              posts?.map((post) => (
                <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4 font-medium">{post.title}</td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-sm ${post.isAdvertisement ? 'border border-green-400 bg-green-500/20 text-green-300' : 'border border-red-300 bg-red-500/20 text-red-400'}`}
                    >
                      {JSON.stringify(post.isAdvertisement)}
                    </span>
                  </td>
                  <td className={`p-4`}>
                    <span
                      className={`rounded-full px-2 py-0.5 text-sm ${post.isFeatured ? 'border border-green-400 bg-green-500/20 text-green-300' : 'border border-red-300 bg-red-500/20 text-red-400'}`}
                    >
                      {JSON.stringify(post.isFeatured)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon" title="View as user">
                        <Link href={`/posts/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin-posts/${post.id}`}>Edit</Link>
                      </Button>
                      {post.status === 'PENDING' && (
                        <Button onClick={() => handlePublish(post.id)} size="sm">
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Delete post"
                        onClick={() => setPostToDelete(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!postToDelete} onOpenChange={(isOpen) => !isOpen && setPostToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the post titled
              <span className="font-bold"> &quot;{postToDelete?.title}&quot;</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPosts;
