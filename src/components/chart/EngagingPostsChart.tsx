'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ChartData = {
  name: string;
  'Page Views': number;
};

interface EngagingPostsChartProps {
  data: ChartData[];
}

// Custom Tooltip with improved styling for dark mode
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-3 shadow-lg backdrop-blur-sm">
        <p className="font-bold text-slate-100">{label}</p>
        <p className="text-sm text-indigo-300">{`Page Views: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

// Formatter for Y-axis to handle large numbers (e.g., 1000 -> 1k)
const yAxisFormatter = (value: number) => {
  if (value >= 1000) {
    return `${value / 1000}k`;
  }
  return value.toString();
};

export const EngagingPostsChart = ({ data }: EngagingPostsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10, // Pull chart closer to the left edge
          bottom: 5,
        }}
        barSize={25} // Give the bars a modern, slightly wider look
      >
        {/* --- FIX: Define a new, much brighter gradient --- */}
        <defs>
          <linearGradient id="brightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} /> {/* Vibrant Indigo */}
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8} /> {/* Bright Purple */}
          </linearGradient>
        </defs>

        {/* Brighter grid lines for better visibility */}
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.15)" />

        {/* Brighter axis labels */}
        <XAxis
          dataKey="name"
          stroke="#a1a1aa" // Lighter gray (Tailwind's zinc-400)
          fontSize={12}
          tickLine={false}
          axisLine={false}
          // Truncate long post titles to prevent them from overlapping
          tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
        />
        <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }} // A subtle purple tint on hover
        />

        {/* Use the new bright gradient for the bars */}
        <Bar dataKey="Page Views" fill="url(#brightGradient)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
