'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Activity, Book } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  change: string;
  icon: string;
  color: string;
  chartData: number[];
}

const iconMap = {
  users: Users,
  activity: Activity,
  meditation: TrendingUp,
  book: Book,
};

export function StatsCard({ title, value, change, icon, color, chartData }: StatsCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || TrendingUp;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-500`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className={`text-xs text-${color}-500`}>{change}</p>
      </CardContent>
    </Card>
  );
} 