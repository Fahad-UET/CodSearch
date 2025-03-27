import React from 'react';
import { OrderStatus } from '../../types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  Package,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    text: 'Pending',
    className: 'bg-yellow-100 text-yellow-800'
  },
  confirmed: {
    icon: CheckCircle,
    text: 'Confirmed',
    className: 'bg-green-100 text-green-800'
  },
  shipped: {
    icon: Truck,
    text: 'Shipped',
    className: 'bg-blue-100 text-blue-800'
  },
  delivered: {
    icon: Package,
    text: 'Delivered',
    className: 'bg-purple-100 text-purple-800'
  },
  cancelled: {
    icon: XCircle,
    text: 'Cancelled',
    className: 'bg-red-100 text-red-800'
  },
  returned: {
    icon: RefreshCcw,
    text: 'Returned',
    className: 'bg-gray-100 text-gray-800'
  },
  failed: {
    icon: AlertTriangle,
    text: 'Failed',
    className: 'bg-orange-100 text-orange-800'
  }
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <Icon size={14} />
      {config.text}
    </span>
  );
}