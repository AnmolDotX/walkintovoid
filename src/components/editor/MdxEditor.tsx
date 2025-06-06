// src/components/editor/MdxEditor.tsx
'use client';

import MDEditor, { commands, ICommand, MDEditorProps } from '@uiw/react-md-editor';
import { Upload } from 'lucide-react';

interface CustomMdxEditorProps extends MDEditorProps {
  onImageUpload?: (file: File) => Promise<string>;
  previewComponents?: { [key: string]: React.ComponentType<any> };
}

const MdxEditor = ({ onImageUpload, previewComponents, ...rest }: CustomMdxEditorProps) => {
  // Custom command to handle image uploads
  const imageUploadCommand: ICommand = {
    name: 'image-upload',
    keyCommand: 'image-upload',
    buttonProps: { 'aria-label': 'Upload image' },
    icon: <Upload className="h-4 w-4" />,
    execute: async (state, api) => {
      if (!onImageUpload) return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          try {
            const imageUrl = await onImageUpload(file);
            api.replaceSelection(`![${file.name}](${imageUrl})\n`);
          } catch (error) {
            console.error('Failed to upload image:', error);
          }
        }
      };
      input.click();
    },
  };

  return (
    <div data-color-mode="dark">
      <MDEditor
        height={500}
        preview="live"
        {...rest}
        commands={[...commands.getCommands(), commands.divider, imageUploadCommand]}
        previewOptions={{
          components: previewComponents,
        }}
      />
    </div>
  );
};

export default MdxEditor;
