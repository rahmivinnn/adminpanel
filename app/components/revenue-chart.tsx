'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RevenueChartProps {
  timeframe: string;
  dataType: string;
}

const generateData = (timeframe: string) => {
  const data = [];
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let count = 6; // Default to 6 months
  if (timeframe === 'last7Days') count = 7;
  if (timeframe === 'last30Days') count = 30;
  if (timeframe === 'last3Months') count = 3;
  if (timeframe === 'lastYear') count = 12;

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    if (timeframe === 'last7Days' || timeframe === 'last30Days') {
      date.setDate(date.getDate() - i);
      data.unshift({
        name: `${date.getDate()}/${date.getMonth() + 1}`,
        revenue: Math.floor(Math.random() * 10000) + 5000,
      });
    } else {
      date.setMonth(date.getMonth() - i);
      data.unshift({
        name: months[date.getMonth()],
        revenue: Math.floor(Math.random() * 10000) + 5000,
      });
    }
  }

  return data;
};

export function RevenueChart({ timeframe, dataType }: RevenueChartProps) {
  const data = generateData(timeframe);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 