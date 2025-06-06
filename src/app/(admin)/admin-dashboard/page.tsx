// src/app/(admin)/admin-dashboard/page.tsx
'use client';

import { BarChart, Card, Title } from '@tremor/react';

const chartdata = [
  { name: 'Amelia', 'Page Views': 2488 },
  { name: 'Orla', 'Page Views': 1445 },
  { name: 'Marco', 'Page Views': 743 },
  { name: 'Lisa', 'Page Views': 281 },
  { name: 'Ville', 'Page Views': 251 },
  { name: 'Stacey', 'Page Views': 232 },
  { name: 'Jane', 'Page Views': 98 },
];

const dataFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <Card>
        <Title>Most Engaging Posts (by Page Views)</Title>
        <BarChart
          className="mt-6"
          data={chartdata}
          index="name"
          categories={['Page Views']}
          colors={['blue']}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
