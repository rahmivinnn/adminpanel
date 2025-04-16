'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityTableProps {
  currentTime: Date;
}

const activities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'Completed meditation',
    time: new Date(),
    status: 'completed',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'Started sleep story',
    time: new Date(),
    status: 'in-progress',
  },
  {
    id: 3,
    user: 'Bob Johnson',
    action: 'Created account',
    time: new Date(),
    status: 'completed',
  },
  {
    id: 4,
    user: 'Alice Brown',
    action: 'Upgraded to premium',
    time: new Date(),
    status: 'completed',
  },
];

export function RecentActivityTable({ currentTime }: RecentActivityTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell className="font-medium">{activity.user}</TableCell>
            <TableCell>{activity.action}</TableCell>
            <TableCell>{formatDistanceToNow(activity.time, { addSuffix: true })}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  activity.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {activity.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 