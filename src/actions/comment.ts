'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const CommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
  postId: z.string().uuid(),
});

export async function createComment(formData: FormData) {
 const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: 'You must be logged in to comment.' };
  }

  const validatedFields = CommentSchema.safeParse({
    content: formData.get('content'),
    postId: formData.get('postId'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  const { content, postId } = validatedFields.data;

  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
    });

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true } });
    if (post) {
      revalidatePath(`/posts/${post.slug}`);
    }

    return { success: 'Comment posted!' };
  } catch (error) {
    return { error: 'Something went wrong.' };
  }
}