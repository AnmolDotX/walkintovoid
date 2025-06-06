// src/components/layout/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText } from 'lucide-react'; // npm install lucide-react

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin-dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin-posts', label: 'Posts', icon: FileText },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-800 bg-gray-900 text-white">
      <div className="p-6 text-2xl font-bold">Admin Panel</div>
      <nav className="flex flex-col p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 flex items-center rounded-md px-4 py-3 text-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
