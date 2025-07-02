'use-client';
import { Check, Loader2, PlusCircle, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useState } from 'react';

export type TagType = { id: string; name: string };

interface MultiSelectTagComboboxProps {
  allTags: TagType[];
  selectedTags: string[];
  onChange: (selected: string[]) => void;
  onTagsUpdate: (tags: TagType[]) => void;
}

export function MultiSelectTagCombobox({ allTags, selectedTags, onChange, onTagsUpdate }: MultiSelectTagComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSelect = (tagId: string) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    onChange(newSelection);
  };

  const handleCreateTag = async () => {
    const newTagName = inputValue.trim();
    if (!newTagName) return;

    try {
      setIsCreating(true);
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName }),
      });
      const newTag = await response.json();
      if (!response.ok) throw new Error(newTag.error);

      toast.success(`Tag "${newTag.name}" created!`);
      onTagsUpdate([...allTags, newTag]);
      onChange([...selectedTags, newTag.id]);
      setInputValue('');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTags = allTags.filter((tag) => tag.name.toLowerCase().includes(inputValue.toLowerCase()));
  const showCreateOption =
    inputValue && !filteredTags.some((tag) => tag.name.toLowerCase() === inputValue.toLowerCase());

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto w-full justify-between">
            <div className="flex flex-wrap gap-1">
              {selectedTags?.length === 0 && 'Select tags...'}
              {allTags
                ?.filter((tag) => selectedTags?.includes(tag.id))
                ?.map((tag) => (
                  <span key={tag.id} className="flex items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs">
                    {tag.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(tag.id);
                      }}
                    />
                  </span>
                ))}
            </div>
            <Tag className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search or create tag..." value={inputValue} onValueChange={setInputValue} />
            <CommandEmpty>No tags found.</CommandEmpty>

            <CommandGroup>
              {filteredTags?.map((tag) => (
                <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect(tag.id)}>
                  <Check className={cn('mr-2 h-4 w-4', selectedTags?.includes(tag.id) ? 'opacity-100' : 'opacity-0')} />
                  {tag.name}
                </CommandItem>
              ))}

              {/* Always show Create option if needed */}
              {showCreateOption && (
                <CommandItem
                  disabled={isCreating}
                  onSelect={handleCreateTag}
                  className="flex cursor-pointer items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Create &quot;{inputValue}&quot;
                    </>
                  )}
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
