// src/components/blog/CommentSection.tsx

'use client';

import { useSession } from 'next-auth/react';
import { createComment } from '@/actions/comment';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

// Define a type for the comments passed as props
type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
};

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export const CommentSection = ({ postId, initialComments }: CommentSectionProps) => {
  const { data: session, status } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCommentSubmit = async (formData: FormData) => {
    const result = await createComment(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setError(null);
      formRef.current?.reset();
    }
  };

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-white">Comments ({initialComments.length})</h2>

      {/* Comment Form */}
      {status === 'authenticated' ? (
        <form action={handleCommentSubmit} ref={formRef} className="mb-8">
          <input type="hidden" name="postId" value={postId} />
          <textarea
            name="content"
            rows={4}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
            placeholder="Join the discussion..."
            required
          />
          <div className="mt-4 flex items-center justify-end">
            {error && <p className="mr-4 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="rounded-full bg-purple-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-500"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-700 p-6 text-center">
          <p className="text-gray-400">
            <Link href="/api/auth/signin" className="font-semibold text-purple-400 hover:underline">
              Sign in
            </Link>{' '}
            to post a comment.
          </p>
        </div>
      )}

      {/* Display Comments */}
      <div className="space-y-6">
        {initialComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.author.image ?? undefined} alt={comment.author.name ?? 'User'} />
              <AvatarFallback>{comment.author.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 rounded-lg bg-gray-800 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold text-white">{comment.author.name}</p>
                {/* --- THIS IS THE FIX --- */}
                {/* We provide specific options to ensure the format is always the same. */}
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <p className="text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
