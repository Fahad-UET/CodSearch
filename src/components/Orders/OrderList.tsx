import React from 'react';
// import { Order } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { format } from 'date-fns';

interface OrderListProps {
  orders: any[];
  // to resolve build issue please check this
  // orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <>
      {orders.map((order) => (
        <tr key={order.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            #{order.id}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {order.customerName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <OrderStatusBadge status={order.status} />
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${order.total.toFixed(2)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {format(new Date(order.createdAt), 'MMM d, yyyy HH:mm')}
          </td>
        </tr>
      ))}
    </>
  );
}