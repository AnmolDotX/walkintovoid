'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MdxEditor from '@/components/editor/MdxEditor';
import { mdxComponents } from '@/components/mdx/mdx-components';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelectTagCombobox } from '@/components/blog/MultiSelectTagCombobox';
import { CreateCategoryPopover } from '@/components/blog/CreateCategoryPopover';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

type PostData = {
  title: string;
  slug: string;
  content: string;
  bannerImage?: string;
  categoryId: string;
  isFeatured: boolean;
  isAdvertisement: boolean;
  tags: { id: string; name: string }[];
};

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const [postRes, catRes, tagRes] = await Promise.all([
            fetch(`/api/posts/${id}`),
            fetch('/api/categories'),
            fetch('/api/tags'),
          ]);
          const postData = await postRes.json();
          setPost(postData);
          setAllCategories(await catRes.json());
          setAllTags(await tagRes.json());
          setCategoryId(postData.categoryId);
          setTags(postData?.tags?.map((t: Tag) => t.id));
        } catch (error) {
          toast.error('Failed to load post data.');
          console.error(error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleCategoryCreated = (newCategory: Category) => {
    setAllCategories((prev) => [...prev, newCategory]);
    setCategoryId(newCategory.id);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
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

      const updatedPostData = {
        ...post,
        bannerImage: bannerImageUrl,
        tagIds: tags,
        categoryId,
      };

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
        toast.error('Unknown error while updating post!');
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
        throw new Error(`Unknown error: ${JSON.stringify(error)}`);
      }
    }
  };

  if (!post) return <div className="p-10 text-center">Loading...</div>;

  return (
    <form onSubmit={handleUpdate} className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Update Post'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <Label htmlFor="title" className="mb-2 block text-lg font-medium">
              Title
            </Label>
            <Input id="title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <Label htmlFor="slug" className="mb-2 block text-lg font-medium">
              Slug
            </Label>
            <Input id="slug" value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900">
            <MdxEditor
              height={600}
              value={post.content}
              onChange={(value) => setPost({ ...post, content: value || '' })}
              onImageUpload={handleImageUploadInEditor}
              previewComponents={mdxComponents}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h3 className="text-lg font-medium">Post Settings</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured">Feature this post?</Label>
              <Switch
                id="isFeatured"
                checked={post.isFeatured}
                onCheckedChange={(checked) => setPost({ ...post, isFeatured: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isAdvertisement">Mark as Advertisement?</Label>
              <Switch
                id="isAdvertisement"
                checked={post.isAdvertisement}
                onCheckedChange={(checked) => setPost({ ...post, isAdvertisement: checked })}
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <Label htmlFor="banner" className="mb-2 block text-lg font-medium">
              Cover Image
            </Label>
            <Input id="banner" type="file" onChange={(e) => setBannerImageFile(e.target.files?.[0] || null)} />
            {post.bannerImage && !bannerImageFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Current image:</p>
                <Image
                  src={post.bannerImage}
                  width={1020}
                  height={720}
                  alt="Current banner"
                  className="mt-2 h-auto w-full rounded-md"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-900 p-6">
            <Label htmlFor="category" className="block text-lg font-medium">
              Category
            </Label>
            <div className="flex items-center space-x-2">
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-400">or</span>
              <CreateCategoryPopover onCategoryCreated={handleCategoryCreated} />
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <Label className="mb-2 block text-lg font-medium">Tags</Label>
            <MultiSelectTagCombobox
              allTags={allTags}
              selectedTags={tags}
              onChange={setTags}
              onTagsUpdate={setAllTags}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditPostPage;
