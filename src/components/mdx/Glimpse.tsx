// src/components/mdx/Glimpse.tsx
export default function Glimpse({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-6 rounded border-l-4 border-blue-300 bg-blue-50 px-4 py-3 shadow-sm">
      <h3 className="font-semibold text-blue-700">{title}</h3>
      <div className="mt-1 text-sm text-blue-800">{children}</div>
    </div>
  );
}
