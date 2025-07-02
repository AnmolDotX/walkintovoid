'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MdxEditor from '@/components/editor/MdxEditor';
import { mdxComponents } from '@/components/mdx/mdx-components';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { slugify } from '@/lib/utils';
import { CreateCategoryPopover } from '@/components/blog/CreateCategoryPopover';
import { MultiSelectTagCombobox, TagType } from '@/components/blog/MultiSelectTagCombobox';

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!;

const CreatePostPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAdvertisement, setIsAdvertisement] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([fetch('/api/categories'), fetch('/api/tags')]);
        setAllCategories(await catRes.json());
        setAllTags(await tagRes.json());
      } catch (error) {
        toast.error('Failed to load categories or tags.');
      }
    };
    fetchData();
  }, []);

  // Handle title change and auto-slugify
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle)); // Assumes you have a slugify function
  };

  const handleCategoryCreated = (newCategory: Category) => {
    setAllCategories((prev) => [...prev, newCategory]);
    setCategoryId(newCategory.id);
  };

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !categoryId) {
      toast.error('Please fill in all required fields: Title, Content, and Category.');
      return;
    }
    setIsSubmitting(true);

    try {
      let bannerImageUrl;
      if (bannerImageFile) {
        toast.info('Uploading banner image...');
        bannerImageUrl = await uploadFile(bannerImageFile);
        toast.success('Banner image uploaded!');
      }

      const postData = {
        title,
        slug,
        content,
        categoryId,
        tagIds: tags,
        isFeatured,
        isAdvertisement,
        bannerImage: bannerImageUrl,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create the post');
      }

      toast.success('Post created successfully!');
      router.push('/admin-posts');
      router.refresh(); // Important to reflect changes
    } catch (error) {
      if (error instanceof Error) {
        console.error('Creation failed:', error);
        toast.error(`Creation failed: ${error.message}`);
      } else {
        toast.error('An unknown error occurred while creating the post.');
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

  return (
    <form onSubmit={handleCreate} className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Publish Post'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <Label htmlFor="title" className="mb-2 block text-lg font-medium">
              Title
            </Label>
            <Input id="title" value={title} onChange={handleTitleChange} placeholder="Post Title" />
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <Label htmlFor="slug" className="mb-2 block text-lg font-medium">
              Slug
            </Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" />
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900">
            <MdxEditor
              height={600}
              value={content}
              onChange={(value) => setContent(value || '')}
              onImageUpload={handleImageUploadInEditor}
              previewComponents={mdxComponents}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-4 text-lg font-medium">Post Settings</h3>
              <div className="space-y-4">
                {/* isFeatured Switch */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Feature this post?</Label>
                  <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
                {/* isAdvertisement Switch */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="isAdvertisement">Mark as Advertisement?</Label>
                  <Switch id="isAdvertisement" checked={isAdvertisement} onCheckedChange={setIsAdvertisement} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <Label htmlFor="banner" className="mb-2 block text-lg font-medium">
                Cover Image
              </Label>
              <Input id="banner" type="file" onChange={(e) => setBannerImageFile(e.target.files?.[0] || null)} />
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <Label htmlFor="category" className="mb-2 block text-lg font-medium">
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
                <span>OR</span>
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
      </div>
    </form>
  );
};

export default CreatePostPage;
