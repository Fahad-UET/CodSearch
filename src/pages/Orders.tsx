import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, ArrowDown, ArrowUp, X, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { useOrders, useWebhookStatus } from '../services/codNetwork/hooks';
import { OrderStatus, SortDirection } from '@/types';
import { OrderTable } from '../components/Orders/OrderTable';
import { OrderPagination } from '../components/Orders/OrderPagination';
import { OrderFilters } from '../components/Orders/OrderFilters';
import { ApiTokenModal } from '../components/ApiTokenModal';
import { WebhookLeadStatus } from '../components/Orders/WebhookLeadStatus';

interface OrdersProps {
  onClose: () => void;
}

export function Orders({ onClose }: OrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check for API token on mount
  useEffect(() => {
    const token = localStorage.getItem('codNetworkToken');
    if (!token) {
      setShowTokenModal(true);
    }
  }, []);

  const { orders, isLoading, error, mutate } = useOrders({
    page,
    limit: 20,
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sort: sortField,
    direction: sortDirection
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-purple-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="text-purple-600" />
                    Orders
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage and track your orders from COD Network
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                    className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
                      (isRefreshing || isLoading) ? 'animate-spin' : ''
                    }`}
                    title="Refresh Orders"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button
                    onClick={() => setShowTokenModal(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="API Token Settings"
                  >
                    <Key size={20} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <WebhookLeadStatus />

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>

            {showFilters && (
              <OrderFilters
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-6 bg-red-50 border-b border-red-100">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <OrderTable
            orders={orders}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            isLoading={isLoading || isRefreshing}
          />

          {/* Pagination */}
          {/* {meta && (
            <OrderPagination
              currentPage={page}
              totalPages={meta.total_pages}
              onPageChange={setPage}
            />
          )} */}
        </div>
      </div>

      {showTokenModal && (
        <ApiTokenModal onClose={() => setShowTokenModal(false)} />
      )}
    </div>
  );
}