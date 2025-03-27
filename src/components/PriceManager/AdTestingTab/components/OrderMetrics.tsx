import React, { useState } from 'react';
import { Package, CheckCircle2, Truck, DollarSign, Edit2, Save } from 'lucide-react';

interface OrderMetricsProps {
  totalLeads: number;
  confirmedOrders: number;
  deliveredOrders: number;
  totalBudget: number;
}

export function OrderMetrics({ totalLeads, confirmedOrders, deliveredOrders, totalBudget }: OrderMetricsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    totalLeads,
    confirmedOrders,
    deliveredOrders
  });

  // Calculate rates
  const confirmationRate = editedValues.totalLeads > 0 
    ? (editedValues.confirmedOrders / editedValues.totalLeads) * 100 
    : 0;
  const deliveryRate = editedValues.confirmedOrders > 0 
    ? (editedValues.deliveredOrders / editedValues.confirmedOrders) * 100 
    : 0;
  const storeCpl = editedValues.totalLeads > 0 
    ? totalBudget / editedValues.totalLeads 
    : 0;

  const handleSave = () => {
    // Here you would typically update these values in your store
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border-2 border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-700">Order Metrics</h4>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
        >
          {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Leads & Orders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Total Leads</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={editedValues.totalLeads}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  totalLeads: parseInt(e.target.value) || 0
                }))}
                className="w-20 text-right rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            ) : (
              <span className="font-semibold text-gray-900">{editedValues.totalLeads}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-medium text-gray-600">Confirmed Orders</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={editedValues.confirmedOrders}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  confirmedOrders: parseInt(e.target.value) || 0
                }))}
                className="w-20 text-right rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            ) : (
              <span className="font-semibold text-gray-900">{editedValues.confirmedOrders}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Delivered Orders</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={editedValues.deliveredOrders}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  deliveredOrders: parseInt(e.target.value) || 0
                }))}
                className="w-20 text-right rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            ) : (
              <span className="font-semibold text-gray-900">{editedValues.deliveredOrders}</span>
            )}
          </div>
        </div>

        {/* Rates & CPL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-amber-500" />
              <span className="text-sm font-medium text-gray-600">Confirmation Rate</span>
            </div>
            <span className="font-semibold text-gray-900">{confirmationRate.toFixed(1)}%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-600">Delivery Rate</span>
            </div>
            <span className="font-semibold text-gray-900">{deliveryRate.toFixed(1)}%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-rose-500" />
              <span className="text-sm font-medium text-gray-600">Store CPL</span>
            </div>
            <span className="font-semibold text-gray-900">${storeCpl.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}