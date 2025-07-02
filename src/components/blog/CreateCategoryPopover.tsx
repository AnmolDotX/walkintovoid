// src/components/forms/CreateCategoryPopover.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

type Category = { id: string; name: string };

interface CreateCategoryPopoverProps {
  onCategoryCreated: (newCategory: Category) => void;
}

export const CreateCategoryPopover = ({ onCategoryCreated }: CreateCategoryPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const newCategory = await response.json();

      if (!response.ok) {
        throw new Error(newCategory.error || 'Failed to create category');
      }

      toast.success(`Category "${newCategory.name}" created!`);
      onCategoryCreated(newCategory); // Pass the new category back to the parent
      setNewCategoryName('');
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Category
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">New Category</h4>
            <p className="text-muted-foreground text-sm">Create a new category for your posts.</p>
          </div>
          <div className="grid gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., 'Technology'"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
            />
            <Button onClick={handleSaveCategory} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Category'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
