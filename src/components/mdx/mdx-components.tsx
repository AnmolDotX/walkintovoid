// src/components/mdx/mdx-components.tsx
import Image from 'next/image';
import Link from 'next/link';
import Callout from './Callout';

/**
 * This is the central "casting list" for all MDX content.
 * It maps HTML tags or custom component names to your React components.
 */
export const mdxComponents = {
  // --- Re-map standard HTML tags ---
  img: (props: any) => (
    <span className="my-6 block overflow-hidden rounded-lg shadow-lg">
      <Image width={800} height={450} alt={props.alt || ''} {...props} />
    </span>
  ),
  a: (props: any) => {
    const href = props.href || '';
    if (href.startsWith('http')) {
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
    }
    return <Link href={href} {...props} />;
  },

  // --- Add your custom MDX components here ---

  // For next-mdx-remote (final render), which respects casing.
  Callout,

  // --- ADD THIS SECTION FOR EDITOR PREVIEW COMPATIBILITY ---

  // For react-md-editor's preview, which lowercases custom tags.
  // We map the lowercase name to the same uppercase component.
  callout: Callout,

  // If you added a <YouTubeEmbed> component, you would also add:
  // youtubeembed: YouTubeEmbed,
};
