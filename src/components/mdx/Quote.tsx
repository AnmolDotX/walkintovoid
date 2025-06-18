// src/components/mdx/Quote.tsx
export default function Quote({ children }: { children: React.ReactNode }) {
  return <blockquote className="my-6 border-l-4 border-blue-500 pl-4 text-gray-600 italic">{children}</blockquote>;
}
