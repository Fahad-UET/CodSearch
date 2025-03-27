import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { OrderStatus, SortDirection } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { format } from 'date-fns';

interface OrderTableProps {
  orders: any[];
  sortField: string;
  sortDirection: SortDirection;
  onSort: (field: string) => void;
  isLoading: boolean;
}

export function OrderTable({ orders, sortField, sortDirection, onSort, isLoading }: OrderTableProps) {
  const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;

  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      return <SortIcon size={16} className="text-purple-600" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('reference')}
            >
              <div className="flex items-center gap-1">
                Reference
                {renderSortIcon('reference')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('customer_name')}
            >
              <div className="flex items-center gap-1">
                Customer
                {renderSortIcon('customer_name')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center gap-1">
                Status
                {renderSortIcon('status')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('total')}
            >
              <div className="flex items-center gap-1">
                Total
                {renderSortIcon('total')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => onSort('created_at')}
            >
              <div className="flex items-center gap-1">
                Created At
                {renderSortIcon('created_at')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order.reference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.customer_name}</div>
                <div className="text-sm text-gray-500">{order.customer_phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.status as OrderStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.currency} {order.total}</div>
                <div className="text-sm text-gray-500">USD {order.total_usd}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}