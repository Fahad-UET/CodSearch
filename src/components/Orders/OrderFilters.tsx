import React from 'react';
import { OrderStatus } from '../../types';

interface OrderFiltersProps {
  statusFilter: OrderStatus | 'all';
  onStatusChange: (status: OrderStatus | 'all') => void;
}

const STATUSES: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
  { value: 'failed', label: 'Failed' }
];

export function OrderFilters({ statusFilter, onStatusChange }: OrderFiltersProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {STATUSES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onStatusChange(value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === value
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}