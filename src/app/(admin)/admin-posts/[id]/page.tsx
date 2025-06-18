// src/app/(admin)/admin-posts/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MdxEditor from '@/components/editor/MdxEditor';
import { mdxComponents } from '@/components/mdx/mdx-components';
import Image from 'next/image';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!;

type PostData = {
  title: string;
  slug: string;
  content: string;
  bannerImage?: string;
};

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data));
    }
  }, [id]);

  // This function now uploads directly to Cloudinary
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
    return data.secure_url;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    setIsSubmitting(true);

    try {
      let bannerImageUrl = post.bannerImage;
      if (bannerImageFile) {
        bannerImageUrl = await uploadFile(bannerImageFile);
      }

      const updatedPostData = { ...post, bannerImage: bannerImageUrl };
      const updateResponse = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPostData),
      });

      if (!updateResponse.ok) throw new Error('Failed to update the post');

      toast.success('Post updated successfully!');
      router.push('/admin-posts');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update failed:', error);
        toast.error(`Update failed: ${error.message}`);
      } else {
        toast.error('Unknow error while updating post!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploadInEditor = async (file: File): Promise<string> => {
    try {
      const url = await uploadFile(file);
      toast.success('Image uploaded to editor!');
      return url;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Editor upload failed: ${error.message}`);
        throw error;
      } else {
        toast.error('Error uploading image');
        throw new Error(`Unknow error : ${JSON.stringify(error)}`);
      }
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* ... other inputs ... */}
        <div>
          <label htmlFor="title">Title</label>
          <Input id="title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <Input id="slug" value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
        </div>
        <div>
          <label htmlFor="banner">Cover Image</label>
          <Input id="banner" type="file" onChange={(e) => setBannerImageFile(e.target.files?.[0] || null)} />
          {post.bannerImage && !bannerImageFile && (
            <div className="mt-2">
              <p className="text-sm">Current image:</p>
              <Image
                src={post.bannerImage}
                width={1020}
                height={720}
                alt="Current banner"
                className="mt-1 h-32 w-auto rounded-md"
              />
            </div>
          )}
        </div>
        <div>
          <label>Content</label>
          <MdxEditor
            height={600}
            value={post.content}
            onChange={(value) => setPost({ ...post, content: value || '' })}
            onImageUpload={handleImageUploadInEditor}
            previewComponents={mdxComponents}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Update Post'}
        </Button>
      </form>
    </div>
  );
};

export default EditPostPage;
