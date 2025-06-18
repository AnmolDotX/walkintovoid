import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import Callout from './Callout';
import Divider from './Divider';
import Quote from './Quote';
import Glimpse from './Glimpse';
import { AnchorHTMLAttributes, ComponentType } from 'react';

//@ts-nocheck
export function withUnknownProps<T extends Record<string, ComponentType<any>>>(
  components: T,
): { [K in keyof T]: ComponentType<unknown> } {
  return components;
}

export const mdxComponents = withUnknownProps({
  img: (props: ImageProps) => {
    const { alt, className, ...rest } = props;
    return (
      <Image
        width={800}
        height={450}
        className={className || 'my-6 overflow-hidden rounded-lg object-cover'}
        alt={alt || ''}
        {...rest}
      />
    );
  },
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = props.href || '';
    if (href.startsWith('http')) {
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
    }
    return <Link href={href} {...props} />;
  },

  // --- Add your custom MDX components here ---

  // For next-mdx-remote (final render), which respects casing.
  Callout,
  callout: Callout,
  Divider,
  divider: Divider,
  Quote,
  quote: Quote,
  Glimpse,
  glimpse: Glimpse,

  // If you added a <YouTubeEmbed> component, you would also add:
  // youtubeembed: YouTubeEmbed,
});
